import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || process.argv[2] || "http://127.0.0.1:3010";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const guidelines = "https://www.doveyouthdevelopment.org/_files/ugd/0d11bb_cc829a2cbd5d43d7aea82cf4ce1525f4.pdf";
const groupEmail = "mailto:executivedirector@doveyouthdevelopment.org";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], form: [], redirects: [], performance: [], behaviors: [], errors: [] };
await mkdir("artifacts/travel-with-purpose", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", (error) => results.errors.push(error.message));

async function clickedHref(locator) {
  return locator.evaluate((element) => new Promise((resolve) => {
    const stop = (event) => { event.preventDefault(); resolve(element.href); };
    element.addEventListener("click", stop, { once: true });
    element.click();
  }));
}

try {
  for (const locale of ["en", "es"]) {
    const route = `/${locale}/travel-with-purpose`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".travel-duration-ledger > li").count(), 4);
    assert.equal(await page.locator(".travel-moments article").count(), 2);
    assert.equal(await page.locator(".travel-principles li").count(), 5);
    assert.equal(await page.locator(".travel-faq details").count(), 8);
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    assert.equal(await page.locator(".group-inquiry-form").count(), 1);
    assert.equal(await page.locator(".newsletter form").count(), 1);
    assert.equal(await page.locator(".group-inquiry-form .volunteer-release").count(), 0, "Group planning must not duplicate the individual legal release");
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').count(), 1);
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').getAttribute("href"), `/${locale}/travel-with-purpose`, "Travel With Purpose navigation state is active");
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/travel-with-purpose`));
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("10b87cc651b8478b964bbb90adb56a63"));

    const mainText = await page.locator("main").innerText();
    for (const excluded of ["This changed me", "The most meaningful experience", "We came to serve", "Weekend With the Pros", "$25", "per person", "Book this service"])
      assert.ok(!mainText.includes(excluded), `Excluded or unverified claim rendered: ${excluded}`);
    assert.ok(mainText.includes(locale === "es" ? "no confirma una reserva" : "does not confirm a booking"));

    const heroImage = page.locator(".travel-hero img");
    assert.ok((await heroImage.getAttribute("src")).includes("10b87cc651b8478b964bbb90adb56a63"));
    assert.equal(await page.locator("main video, main iframe").count(), 0, "Travel page contains no heavy video hero");
    const belowImages = page.locator(".travel-moments img, .travel-connection img");
    for (let index = 0; index < await belowImages.count(); index++) assert.equal(await belowImages.nth(index).getAttribute("loading"), "lazy");
    results.performance.push({ locale, hero: "priority image", belowFoldMedia: "lazy", video: "none" });

    const requiredLinks = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Planning", "Volunteer Guidelines", page.locator(".travel-planning .button"), guidelines, "links.volunteer.guidelines"],
      ["Planning", "Participant Volunteer Application", page.locator(".travel-planning .text-link"), `${base}/${locale}/volunteer#application`, "links.volunteer.page(locale)#application"],
      ["Group inquiry", "Executive director", page.locator(".group-submit-row .text-link"), groupEmail, "links.email.groupTravel"],
      ["Individual bridge", "Explore Volunteering", page.locator(".travel-individual .button"), `${base}/${locale}/volunteer`, "links.volunteer.page(locale)"],
      ["Header navigation", "Travel With Purpose", page.locator(`.desktop-nav a[href="/${locale}/travel-with-purpose"]`), `${base}/${locale}/travel-with-purpose`, "home.navigation / links.travel.page(locale)"],
      ["Footer navigation", "Travel With Purpose", page.locator(`.site-footer a:not([hreflang])[href="/${locale}/travel-with-purpose"]`), `${base}/${locale}/travel-with-purpose`, "home.footer / links.travel.page(locale)"],
      ["Header", "Logo", page.locator(".site-header .brand"), `${base}/${locale}`, "links.home(locale)"],
    ];
    for (const [section, label, locator, expected, key] of requiredLinks) {
      assert.equal(await locator.count(), 1, `${section} ${label} must be unique`);
      const raw = await locator.getAttribute("href");
      const resolved = raw.startsWith("/") ? base + raw : raw;
      assert.equal(resolved, expected);
      assert.equal(await clickedHref(locator), expected);
      results.links.push({ page: route, section, label, type: expected.startsWith("mailto:") ? "mailto" : expected.startsWith(base) ? "internal" : "external", linkKey: key, destination: raw, status: "clicked; exact configured href" });
    }
    for (const [section, label, selector, target] of [
      ["Hero", "Plan Your Group Experience", ".travel-hero .button", "#group-inquiry"],
      ["Hero", "Explore the Experience", ".travel-hero .text-link", "#experience"],
    ]) {
      const locator = page.locator(selector);
      assert.equal(await locator.getAttribute("href"), target);
      await locator.click();
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).count(), 1);
      results.links.push({ page: route, section, label, type: "in-page", linkKey: target, destination: target, status: "clicked; target exists" });
    }
    const allHrefs = await page.locator("header a, main a, footer a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(allHrefs.every((href) => href && href !== "#"));

    const form = page.locator(".group-inquiry-form");
    await form.locator('button[type="submit"]').click();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    await form.locator('[name="fullName"]').fill("Group Coordinator");
    await form.locator('[name="email"]').fill("group@example.com");
    await form.locator('[name="phone"]').fill("+1 809 555 0123");
    await form.locator('[name="organizationName"]').fill("Example Education Group");
    await form.locator('[name="groupType"]').selectOption({ index: 1 });
    await form.locator('[name="estimatedGroupSize"]').fill("12");
    await form.locator('[name="preferredStartDate"]').fill("2026-12-10");
    await form.locator('[name="alternateDates"]').fill("Flexible during December");
    await form.locator('[name="approximateDuration"]').fill("Three days");
    await form.locator('[name="aboutGroup"]').fill("A group interested in learning alongside Dove.");
    await form.locator('[name="skillsInterests"]').fill("Creative and educational activities, if appropriate.");
    await form.locator('[name="discussLodging"]').check();
    await form.locator('[name="discussTransportation"]').check();
    await form.locator('button[type="submit"]').click();
    await page.locator("#group-inquiry-status.is-unavailable").waitFor();
    const status = await page.locator("#group-inquiry-status").innerText();
    assert.ok(status.includes(locale === "es" ? "no se enviaron ni se guardaron" : "has not been sent or stored"));
    assert.equal(await form.locator('[name="fullName"]').inputValue(), "Group Coordinator");
    assert.equal(await form.locator('[name="discussLodging"]').isChecked(), true);
    results.form.push({ locale, requiredValidation: "pass", logisticsAreInterestOnly: "pass", releaseAcceptance: "not present", provider: "not configured", response: "503 unavailable", falseSuccess: false, dataPreserved: true });

    await page.locator("#newsletter-email").fill("qa@example.com");
    await page.locator(".newsletter button").click();
    await page.locator("#newsletter-status").filter({ hasText: locale === "es" ? "No hemos guardado" : "has not been saved" }).waitFor();
    results.links.push({ page: route, section: "Newsletter", label: "Newsletter submit", type: "adapter", linkKey: "submitNewsletter", destination: "No provider configured", status: "unavailable; no fake success" });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of await page.locator("main > section, footer").all()) await section.scrollIntoViewIfNeeded();
      await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); scrollTo(0, 0); });
      const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        overflow: [...document.querySelectorAll("header *, main *, footer *")].filter((element) => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return bounds.width > 0 && style.position !== "absolute" && style.position !== "fixed" && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map((element) => ({ className: element.className || element.tagName, text: element.textContent.trim().slice(0, 80), left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })),
        brokenImages: [...document.images].filter((image) => image.checkVisibility() && !image.naturalWidth).map((image) => image.currentSrc || image.src),
      }));
      assert.ok(layout.pageWidth <= layout.viewportWidth, `Page overflow at ${width}`);
      assert.deepEqual(layout.overflow, [], `Element overflow at ${width}: ${JSON.stringify(layout.overflow)}`);
      assert.deepEqual(layout.brokenImages, [], `Broken image at ${width}: ${layout.brokenImages}`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(axe.violations, [], `Axe violations at ${width}: ${axe.violations.map((item) => item.id).join(", ")}`);
      results.pages.push({ locale, route, width, ...layout, axeViolations: 0 });
      await page.screenshot({ path: `artifacts/travel-with-purpose/${locale}-${width}.png`, fullPage: true });
    }
  }

  const invalidApi = await context.request.post(`${base}/api/group-experience-inquiry`, { data: { locale: "en" } });
  assert.equal(invalidApi.status(), 400);
  const unavailableApi = await context.request.post(`${base}/api/group-experience-inquiry`, { data: {
    fullName: "Group Coordinator", email: "group@example.com", phone: "", organizationName: "Example Group", groupType: "School / Education",
    estimatedGroupSize: "12", preferredStartDate: "2026-12-10", alternateDates: "", approximateDuration: "Three days", aboutGroup: "",
    skillsInterests: "", discussLodging: true, discussTransportation: false, discussExcursions: false, locale: "en",
  } });
  assert.equal(unavailableApi.status(), 503);
  results.behaviors.push("Group inquiry API rejects invalid payloads and returns 503 without storing or claiming delivery when no provider exists");

  const redirect = await context.request.get(`${base}/grouptravel`, { headers: { Cookie: "dove_locale=es" }, maxRedirects: 0 });
  assert.equal(redirect.status(), 308);
  assert.ok(redirect.headers().location.endsWith("/es/travel-with-purpose"));
  results.redirects.push({ source: "/grouptravel", localePreference: "es", destination: redirect.headers().location, status: 308 });

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/travel-with-purpose", "/es/travel-with-purpose"]) assert.ok(sitemap.includes(route));
  results.behaviors.push("Sitemap includes both localized Travel With Purpose routes");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${base}/en/travel-with-purpose`, { waitUntil: "networkidle" });
  const fold = await page.evaluate(() => {
    const hero = document.querySelector(".travel-hero").getBoundingClientRect();
    const primary = document.querySelector(".travel-hero .button").getBoundingClientRect();
    const image = document.querySelector(".travel-hero .photo").getBoundingClientRect();
    return { heroBottom: hero.bottom, primaryBottom: primary.bottom, imageTop: image.top, viewportHeight: innerHeight };
  });
  assert.ok(fold.primaryBottom <= fold.viewportHeight && fold.imageTop < fold.viewportHeight, `Hero essentials exceed laptop fold: ${JSON.stringify(fold)}`);
  results.behaviors.push("Hero heading, primary action and group image begin within the 1280 × 800 fold");
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/travel-with-purpose/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Verified ${results.pages.length} responsive states, ${results.links.length} actions, ${results.form.length} form states and ${results.redirects.length} redirect.`);
