import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://127.0.0.1:3010";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const sponsorship = "https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship";
const vocational = "https://dovemissions.networkforgood.com/projects/138886-dove-vocational-training-center";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], video: [], behaviors: [], errors: [] };
await mkdir("artifacts/donate", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", (error) => results.errors.push(error.message));

async function clickedHref(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.focus();
  return locator.evaluate((element) => new Promise((resolve) => {
    const stop = (event) => { event.preventDefault(); resolve(element.href); };
    element.addEventListener("click", stop, { once: true });
    element.click();
  }));
}

try {
  for (const locale of ["en", "es"]) {
    const route = `/${locale}/donate`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main form").count(), 1, "Shared newsletter renders exactly once");
    assert.equal(await page.locator("[data-donation-id]").count(), 4, "Only verified giving pathways render");
    assert.equal(await page.locator('[data-donation-id="currentCampaign"]').count(), 0, "No unverified campaign renders");
    assert.equal(await page.locator(".donate-faq details").count(), 8);
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    assert.equal(await page.locator(".header-donate").getAttribute("data-active"), "true");
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) {
      assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/donate`));
    }
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("rjFUSW-1xmA"));

    const bodyText = await page.locator("main").innerText();
    for (const excluded of ["Private School Sponsors", "Supporter's Circle", "Sustainer's Circle", "$100-500", "$500-2000", "1400 Van Buren", "Vicky Mowl", "Our Wish List", "Candid", "470 supporters", "2,184 supporters", "tax deductible everywhere"]) {
      assert.ok(!bodyText.includes(excluded), `Client-confirm or unstable content rendered: ${excluded}`);
    }

    assert.equal(await page.locator(".donate-hero iframe").count(), 0, "Reduced motion starts with poster only");
    const poster = await page.locator(".donate-hero-media img").getAttribute("src");
    assert.ok(poster.includes("rjFUSW-1xmA"));
    await page.locator(".donate-video-toggle").click();
    await page.locator(".donate-hero iframe").waitFor();
    const iframeSrc = await page.locator(".donate-hero iframe").getAttribute("src");
    for (const parameter of ["youtube-nocookie.com/embed/rjFUSW-1xmA", "autoplay=1", "mute=1", "loop=1", "playlist=rjFUSW-1xmA", "controls=0", "playsinline=1"]) assert.ok(iframeSrc.includes(parameter));
    assert.ok(await page.locator(".donate-hero iframe").getAttribute("title"));
    results.video.push({ locale, youtubeId: "rjFUSW-1xmA", initialState: "poster only under reduced motion", privacyHost: "youtube-nocookie.com", userPlay: "pass", mutedLoopParameters: "pass" });
    await page.goto(base + route, { waitUntil: "networkidle" });

    const requiredLinks = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Hero", "Donate now", page.locator(".donate-hero .button"), general, "links.giving.general"],
      ["Giving hub", "General giving", page.locator('[data-donation-id="general"] .button'), general, "links.giving.general"],
      ["Giving hub", "Sponsor a child", page.locator('[data-donation-id="childSponsorship"] .text-link'), sponsorship, "links.giving.childSponsorship"],
      ["Giving hub", "Vocational training", page.locator('[data-donation-id="vocationalTraining"] .text-link'), vocational, "links.giving.vocationalTraining"],
      ["Giving hub", "Corporate partnership", page.locator('[data-donation-id="partnership"] .text-link'), `${base}/${locale}/partnerships`, "links.partnerships(locale)"],
      ["Recurring giving", "Start a recurring gift", page.locator(".donate-recurring .button"), general, "links.giving.general"],
      ["Tribute giving", "Make a tribute gift", page.locator(".donate-tribute .text-link"), general, "links.giving.general"],
      ["Partnership", "Start a conversation", page.locator(".donate-partnership .button"), `${base}/${locale}/partnerships`, "links.partnerships(locale)"],
      ["Final CTA", "General donation", page.locator(".donate-final .button--primary"), general, "links.giving.general"],
      ["Final CTA", "Sponsor a child", page.locator(".donate-final .button--secondary"), sponsorship, "links.giving.childSponsorship"],
      ["Header", "Logo", page.locator(".site-header .brand"), `${base}/${locale}`, "links.home(locale)"],
    ];
    for (const [section, label, locator, expected, key] of requiredLinks) {
      assert.equal(await locator.count(), 1, `${section} ${label} must be unique`);
      const raw = await locator.getAttribute("href");
      const resolved = raw.startsWith("/") ? base + raw : raw;
      assert.equal(resolved, expected);
      assert.equal(await clickedHref(locator), expected);
      results.links.push({ page: route, section, label, destinationKey: key, type: expected.startsWith("mailto:") ? "mailto" : expected.startsWith(base) ? "internal" : "external", destination: raw, status: "clicked; dispatched to exact configured href" });
    }

    const pathwaysAnchor = page.locator(".donate-hero .text-link");
    assert.equal(await pathwaysAnchor.getAttribute("href"), "#giving-pathways");
    await pathwaysAnchor.click();
    assert.equal(new URL(page.url()).hash, "#giving-pathways");
    assert.equal(await page.locator("#giving-pathways").count(), 1);
    results.links.push({ page: route, section: "Hero", label: "Explore ways to give", destinationKey: "#giving-pathways", type: "in-page", destination: "#giving-pathways", status: "clicked; target exists" });

    const navHrefs = await page.locator(".desktop-nav a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(navHrefs.every((href) => href && href.startsWith(`/${locale}`)));
    const allHrefs = await page.locator("header a, main a, footer a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(allHrefs.every((href) => href && href !== "#"), "No link may use an empty or bare # destination");
    results.behaviors.push(`${locale}: locale-aware navigation, active Donate treatment and no bare # link`);

    await page.locator("#newsletter-email").fill("qa@example.com");
    await page.locator(".newsletter button").click();
    await page.locator("#newsletter-status").filter({ hasText: locale === "es" ? "No hemos guardado" : "has not been saved" }).waitFor();
    results.links.push({ page: route, section: "Newsletter", label: "Newsletter submit", destinationKey: "submitNewsletter", type: "adapter", destination: "No provider configured", status: "clicked; unavailable response; no fake success" });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of await page.locator("main > section, footer").all()) await section.scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
        scrollTo(0, 0);
      });
      const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        overflow: [...document.querySelectorAll("header *, main *, footer *")].filter((element) => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return bounds.width > 0 && style.position !== "absolute" && style.position !== "fixed" && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map((element) => ({ className: element.className || element.tagName, text: element.textContent.trim(), rect: { left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.getBoundingClientRect().width } })),
        brokenImages: [...document.images].filter((image) => image.checkVisibility() && !image.naturalWidth).map((image) => image.currentSrc || image.src),
        wrappedActions: [...document.querySelectorAll(".button, .text-link")].filter((element) => {
          if (!element.checkVisibility() || getComputedStyle(element).whiteSpace === "nowrap") return false;
          const range = document.createRange(); range.selectNodeContents(element);
          const lines = new Set([...range.getClientRects()].filter((rect) => rect.width > 0).map((rect) => Math.round(rect.top / 4) * 4));
          return lines.size > 1;
        }).map((element) => element.textContent.trim()),
      }));
      assert.ok(layout.pageWidth <= layout.viewportWidth, `Page overflow at ${width}`);
      assert.deepEqual(layout.overflow, [], `Element overflow at ${width}`);
      assert.deepEqual(layout.brokenImages, [], `Broken image at ${width}`);
      assert.deepEqual(layout.wrappedActions, [], `Wrapped action at ${width}`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(axe.violations, [], `Axe violations at ${width}: ${axe.violations.map((item) => item.id).join(", ")}`);
      results.pages.push({ locale, route, width, ...layout, axeViolations: 0 });
      await page.screenshot({ path: `artifacts/donate/${locale}-${width}.png`, fullPage: true });
    }
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/donate", "/es/donate"]) assert.ok(sitemap.includes(route));
  results.behaviors.push("Sitemap includes both localized Donate routes");

  const motionContext = await browser.newContext({ reducedMotion: "no-preference" });
  const motionPage = await motionContext.newPage();
  await motionPage.setViewportSize({ width: 1280, height: 800 });
  await motionPage.goto(`${base}/en/donate`, { waitUntil: "networkidle" });
  await motionPage.locator(".donate-hero iframe").waitFor();
  const automaticSrc = await motionPage.locator(".donate-hero iframe").getAttribute("src");
  assert.ok(automaticSrc.includes("youtube-nocookie.com/embed/rjFUSW-1xmA"));
  assert.equal(await motionPage.locator(".donate-video-toggle").getAttribute("aria-label"), "Pause background video");
  await motionPage.locator(".donate-video-toggle").click();
  assert.equal(await motionPage.locator(".donate-video-toggle").getAttribute("aria-label"), "Play background video");
  const fold = await motionPage.evaluate(() => {
    const content = document.querySelector(".donate-hero-content").getBoundingClientRect();
    const primary = document.querySelector(".donate-hero .button").getBoundingClientRect();
    const hero = document.querySelector(".donate-hero").getBoundingClientRect();
    return { contentBottom: content.bottom, primaryBottom: primary.bottom, heroBottom: hero.bottom, viewportHeight: innerHeight };
  });
  assert.ok(fold.contentBottom <= fold.viewportHeight && fold.primaryBottom <= fold.viewportHeight && fold.heroBottom <= fold.viewportHeight + 1, "Hero essentials fit the 1280x800 fold");
  results.video.push({ locale: "en", youtubeId: "rjFUSW-1xmA", initialState: "poster first, iframe activated after window load", privacyHost: "youtube-nocookie.com", autoplayMutedLoop: "pass", control: "pause and resume state pass" });
  results.behaviors.push("Hero copy, primary CTA and media focal area fit the 1280x800 fold");
  await motionContext.close();
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/donate/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${results.pages.length} responsive page states, ${results.links.length} required actions, ${results.video.length} video states and ${results.behaviors.length} behaviors.`);
}
