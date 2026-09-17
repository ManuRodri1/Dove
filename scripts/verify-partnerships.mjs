import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || process.argv[2] || "http://127.0.0.1:3014";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const email = "mailto:executivedirector@doveyouthdevelopment.org";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], form: [], migration: [], performance: [], errors: [] };
await mkdir("artifacts/partnerships", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", (error) => results.errors.push(error.message));

async function clickedHref(locator) {
  await locator.scrollIntoViewIfNeeded();
  return locator.evaluate((element) => new Promise((resolve) => {
    const stop = (event) => { event.preventDefault(); resolve(element.href); };
    element.addEventListener("click", stop, { once: true });
    element.click();
  }));
}

try {
  for (const locale of ["en", "es"]) {
    const route = `/${locale}/partnerships`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".partner-way-lead").count() + await page.locator(".partner-way-ledger > li").count(), 6);
    assert.equal(await page.locator(".partner-history li").count(), 2);
    assert.equal(await page.locator(".partner-journey li").count(), 4);
    assert.equal(await page.locator(".partner-faq details").count(), 8);
    assert.equal(await page.locator(".partner-inquiry-form").count(), 1);
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').count(), 1);
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').getAttribute("href"), route);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/partnerships`));
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("f01b04e0f24e47b09cfaedcc44f31160"));

    const text = await page.locator("main").innerText();
    for (const withheld of ["Lifestyle Holidays Hotels and Resorts", "Amber Cove", "O’Hair Salon", "Gold Sponsor", "$5,000 Partner"])
      assert.ok(!text.includes(withheld), `Withheld or unapproved content rendered: ${withheld}`);
    assert.ok(text.includes(locale === "es" ? "ejemplos son históricos" : "examples are historical"));

    const hero = page.locator(".partner-hero img");
    assert.ok((await hero.getAttribute("src")).includes("f01b04e0f24e47b09cfaedcc44f31160"));
    assert.notEqual(await hero.getAttribute("loading"), "lazy");
    assert.equal(await page.locator("main video, main iframe").count(), 0);
    assert.equal(await page.locator(".partner-workforce img").getAttribute("loading"), "lazy");
    results.performance.push({ locale, hero: "priority image", belowFoldMedia: "lazy", video: "none", logoWall: "none" });

    const links = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Programs", "Explore our programs", page.locator('.partner-ways a[href$="/what-we-do"]'), `${base}/${locale}/what-we-do`, "links.whatWeDo(locale)"],
      ["Workforce", "Vocational training", page.locator(".partner-workforce .button"), `${base}/${locale}/vocational-training-center`, "links.vocationalTraining(locale)"],
      ["Giving", "Giving options", page.locator('.partner-ways a[href$="/donate"]'), `${base}/${locale}/donate`, "links.donate(locale)"],
      ["Team", "Travel With Purpose", page.locator('.partner-ways a[href$="/travel-with-purpose"]'), `${base}/${locale}/travel-with-purpose`, "links.travel.page(locale)"],
      ["Community", "Travel With Purpose", page.locator(".partner-team-bridge .button"), `${base}/${locale}/travel-with-purpose`, "links.travel.page(locale)"],
      ["Inquiry", "Fallback email", page.locator(".partner-submit-row .text-link"), email, "links.email.partnerships"],
      ["Matching", "Donate", page.locator(".partner-matching .button"), `${base}/${locale}/donate`, "links.donate(locale)"],
      ["Header", "Logo", page.locator(".site-header .brand"), `${base}/${locale}`, "links.home(locale)"],
    ];
    for (const [section, label, locator, expected, key] of links) {
      assert.equal(await locator.count(), 1, `${section} ${label} must be unique`);
      const raw = await locator.getAttribute("href");
      const resolved = raw.startsWith("/") ? base + raw : raw;
      assert.equal(resolved, expected);
      assert.equal(await clickedHref(locator), expected);
      results.links.push({ page: route, section, label, type: expected.startsWith("mailto:") ? "mailto" : expected.startsWith(base) ? "internal" : "external", destinationKey: key, destination: raw, status: "clicked; exact configured href" });
    }
    for (const [section, selector, target] of [
      ["Hero primary", ".partner-hero .button", "#partner-inquiry"],
      ["Hero secondary", ".partner-hero .text-link", "#ways-to-partner"],
    ]) {
      const locator = page.locator(selector);
      assert.equal(await locator.getAttribute("href"), target);
      await locator.click();
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).count(), 1);
      results.links.push({ page: route, section, type: "in-page", destinationKey: target, destination: target, status: "clicked; target exists" });
    }
    assert.ok((await page.locator("header a, main a, footer a").evaluateAll((items) => items.map((item) => item.getAttribute("href")))).every((href) => href && href !== "#"));

    const form = page.locator(".partner-inquiry-form");
    await form.locator('button[type="submit"]').click();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 5);
    await form.locator('[name="fullName"]').fill("Partnership Coordinator");
    await form.locator('[name="workEmail"]').fill("partner@example.com");
    await form.locator('[name="phone"]').fill("+1 809 555 0123");
    await form.locator('[name="organizationName"]').fill("Example Community Organization");
    await form.locator('[name="website"]').fill("https://example.com");
    await form.locator('[name="role"]').fill("Community Director");
    await form.locator('[name="interest"]').selectOption({ index: 1 });
    await form.locator('[name="message"]').fill("We would like to explore a useful program partnership with Dove.");
    await form.locator('[name="referral"]').fill("Dove website");
    await form.locator('button[type="submit"]').click();
    await page.locator("#partner-inquiry-status.is-unavailable").waitFor();
    assert.ok((await page.locator("#partner-inquiry-status").innerText()).includes(locale === "es" ? "No hemos guardado" : "has not been saved"));
    assert.equal(await form.locator('[name="fullName"]').inputValue(), "Partnership Coordinator");
    results.form.push({ locale, requiredValidation: "pass", provider: "not configured", response: "503 unavailable", falseSuccess: false, dataPreserved: true });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of await page.locator("main > section, footer").all()) await section.scrollIntoViewIfNeeded();
      await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); scrollTo(0, 0); });
      const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        overflow: [...document.querySelectorAll("header *, main *, footer *")].filter((element) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return box.width > 0 && style.position !== "absolute" && style.position !== "fixed" && (box.left < -1 || box.right > innerWidth + 1);
        }).map((element) => ({ className: element.className || element.tagName, text: element.textContent.trim().slice(0, 80), left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })),
        brokenImages: [...document.images].filter((image) => image.checkVisibility() && !image.naturalWidth).map((image) => image.currentSrc || image.src),
      }));
      assert.ok(layout.pageWidth <= layout.viewportWidth, `Page overflow at ${width}`);
      assert.deepEqual(layout.overflow, [], `Element overflow at ${width}: ${JSON.stringify(layout.overflow)}`);
      assert.deepEqual(layout.brokenImages, [], `Broken image at ${width}: ${layout.brokenImages}`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(axe.violations, [], `Axe violations at ${width}: ${axe.violations.map((item) => item.id).join(", ")}`);
      results.pages.push({ locale, route, width, ...layout, axeViolations: 0 });
      await page.screenshot({ path: `artifacts/partnerships/${locale}-${width}.png`, fullPage: true });
    }
  }

  const invalidApi = await context.request.post(`${base}/api/partnership-inquiry`, { data: { locale: "en" } });
  assert.equal(invalidApi.status(), 400);
  const unavailableApi = await context.request.post(`${base}/api/partnership-inquiry`, { data: {
    fullName: "Partnership Coordinator", workEmail: "partner@example.com", phone: "", organizationName: "Example Organization",
    website: "", role: "", interest: "Program Support", message: "We would like to explore a useful partnership.", referral: "", locale: "en",
  } });
  assert.equal(unavailableApi.status(), 503);

  for (const locale of ["en", "es"]) {
    for (const path of ["", "/donate", "/vocational-training-center", "/what-we-do", "/travel-with-purpose"]) {
      await page.goto(`${base}/${locale}${path}`, { waitUntil: "networkidle" });
      const generalPartnerLinks = await page.locator("a").evaluateAll((anchors) => anchors
        .filter((a) => /partner|partnership|alianza|aliado/i.test(a.textContent || ""))
        .map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href") })));
      for (const link of generalPartnerLinks) assert.equal(link.href, `/${locale}/partnerships`, `General partnership link not migrated: ${JSON.stringify(link)}`);
      results.migration.push({ page: `/${locale}${path}`, links: generalPartnerLinks, status: "general partnership discovery uses localized route" });
    }
  }

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/partnerships", "/es/partnerships"]) assert.ok(sitemap.includes(route));
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/partnerships/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Verified ${results.pages.length} responsive states, ${results.links.length} page actions, ${results.form.length} form states and ${results.migration.length} migration states.`);
