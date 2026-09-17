import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || process.argv[2] || "http://127.0.0.1:3010";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const stories = "https://www.doveyouthdevelopment.org/blog";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], behaviors: [], errors: [] };
await mkdir("artifacts/what-we-do", { recursive: true });
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
    const route = `/${locale}/what-we-do`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".what-program").count(), 3);
    assert.equal(await page.locator(".what-readiness").count(), 1);
    assert.equal(await page.locator(".what-vocational").count(), 1);
    assert.equal(await page.locator(".what-pathway-flow li").count(), 5);
    assert.equal(await page.locator("main form").count(), 1, "Shared newsletter renders exactly once");
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').count(), 1);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) {
      assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/what-we-do`));
    }
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("44242d83e5054c4b8c70b72f04061da1"));

    const requiredLinks = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Child & Youth Development", "Explore Child Sponsorship", page.locator(".what-program--youth .text-link"), `${base}/${locale}/child-sponsorship`, "links.childSponsorship(locale)"],
      ["Education & English", "Support Educational Opportunities", page.locator(".what-program--education .text-link"), `${base}/${locale}/donate`, "links.donate(locale)"],
      ["Job Readiness", "Explore Job Readiness", page.locator(".what-readiness .text-link"), `${base}/${locale}/vocational-training-center`, "links.vocationalTraining(locale)"],
      ["Vocational Training", "Discover Vocational Training", page.locator(".what-vocational .button"), `${base}/${locale}/vocational-training-center`, "links.vocationalTraining(locale)"],
      ["Family & Community Support", "Support Dove's Work", page.locator(".what-program--community .text-link"), `${base}/${locale}/donate`, "links.donate(locale)"],
      ["Outcome", "Read Stories From Dove", page.locator(".what-outcome .text-link"), stories, "links.stories"],
      ["Final bridge", "Support Dove", page.locator(".what-final .button--primary"), `${base}/${locale}/donate`, "links.donate(locale)"],
      ["Final bridge", "Explore Volunteering", page.locator(".what-final .button--secondary"), `${base}/${locale}/volunteer`, "links.volunteer.page(locale)"],
      ["Header", "Logo", page.locator(".site-header .brand"), `${base}/${locale}`, "links.home(locale)"],
    ];
    for (const [section, label, locator, expected, key] of requiredLinks) {
      assert.equal(await locator.count(), 1, `${section} ${label} must be unique`);
      const raw = await locator.getAttribute("href");
      const resolved = raw.startsWith("/") ? base + raw : raw;
      assert.equal(resolved, expected);
      assert.equal(await clickedHref(locator), expected);
      results.links.push({ page: route, section, label, destinationKey: key, type: expected.startsWith(base) ? "internal" : "external", destination: raw, status: "clicked; dispatched to exact configured href" });
    }

    for (const [label, selector, target] of [
      ["Explore programs", ".what-hero .button", "#program-areas"],
      ["See the Dove pathway", ".what-hero .text-link", "#dove-pathway"],
    ]) {
      const locator = page.locator(selector);
      assert.equal(await locator.getAttribute("href"), target);
      await locator.click();
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).count(), 1);
      results.links.push({ page: route, section: "Hero", label, destinationKey: target, type: "in-page", destination: target, status: "clicked; target exists" });
    }

    const navHrefs = await page.locator(".desktop-nav a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(navHrefs.every((href) => href && href.startsWith(`/${locale}`)));
    assert.equal(navHrefs[1], `/${locale}/what-we-do`);
    const allHrefs = await page.locator("header a, main a, footer a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(allHrefs.every((href) => href && href !== "#"), "No link may use an empty or bare # destination");
    results.behaviors.push(`${locale}: localized navigation, active What We Do state and no bare # link`);

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
      assert.deepEqual(layout.overflow, [], `Element overflow at ${width}: ${JSON.stringify(layout.overflow)}`);
      assert.deepEqual(layout.brokenImages, [], `Broken image at ${width}`);
      assert.deepEqual(layout.wrappedActions, [], `Wrapped action at ${width}`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(axe.violations, [], `Axe violations at ${width}: ${axe.violations.map((item) => item.id).join(", ")}`);
      results.pages.push({ locale, route, width, ...layout, axeViolations: 0 });
      await page.screenshot({ path: `artifacts/what-we-do/${locale}-${width}.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/en/what-we-do`, { waitUntil: "networkidle" });
  const fold = await page.evaluate(() => {
    const hero = document.querySelector(".what-hero").getBoundingClientRect();
    const primary = document.querySelector(".what-hero .button").getBoundingClientRect();
    const image = document.querySelector(".what-hero .photo").getBoundingClientRect();
    return { heroBottom: hero.bottom, primaryBottom: primary.bottom, imageTop: image.top, imageBottom: image.bottom, viewportHeight: innerHeight };
  });
  assert.ok(fold.primaryBottom <= fold.viewportHeight && fold.imageTop < fold.viewportHeight && fold.imageBottom <= fold.viewportHeight, `Hero essentials do not fit 1280x800 fold: ${JSON.stringify(fold)}`);
  results.behaviors.push("Hero heading, lede, primary CTA and image focal area fit the 1280x800 fold");
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/what-we-do", "/es/what-we-do"]) assert.ok(sitemap.includes(route));
  results.behaviors.push("Sitemap includes both localized What We Do routes");
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/what-we-do/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${results.pages.length} responsive page states, ${results.links.length} required actions and ${results.behaviors.length} behaviors.`);
}
