import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || process.argv[2] || "http://127.0.0.1:3010";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const guidelines = "https://www.doveyouthdevelopment.org/_files/ugd/0d11bb_cc829a2cbd5d43d7aea82cf4ce1525f4.pdf";
const volunteerEmail = "mailto:operations@doveyouthdevelopment.org";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], video: [], form: [], redirects: [], behaviors: [], errors: [] };
await mkdir("artifacts/volunteer", { recursive: true });
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
    const route = `/${locale}/volunteer`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".volunteer-dayline > li").count(), 5);
    assert.equal(await page.locator(".volunteer-form").count(), 1);
    assert.equal(await page.locator(".newsletter form").count(), 1);
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').count(), 1);
    assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').getAttribute("href"), route);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/volunteer`));
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("aCY1225xEWc"));

    const release = page.locator(".volunteer-release-document");
    assert.equal(await release.getAttribute("lang"), "en");
    assert.equal(await release.locator("p").count(), 11);
    assert.ok((await release.innerText()).includes("You agree to volunteer your time and talents"));
    assert.ok((await page.locator(".volunteer-release-version").innerText()).includes("2026-migration-v1"));
    if (locale === "es") assert.ok((await page.locator(".volunteer-release-head > p").innerText()).includes("solo en inglés"));
    results.behaviors.push(`${locale}: official release remains English, versioned and fully rendered`);

    assert.equal(await page.locator(".volunteer-hero iframe").count(), 0, "Reduced motion starts with poster only");
    assert.ok((await page.locator(".volunteer-hero-media img").getAttribute("src")).includes("aCY1225xEWc"));
    await page.locator(".volunteer-video-toggle").click();
    await page.locator(".volunteer-hero iframe").waitFor();
    const iframeSrc = await page.locator(".volunteer-hero iframe").getAttribute("src");
    for (const parameter of ["youtube-nocookie.com/embed/aCY1225xEWc", "start=18", "autoplay=1", "mute=1", "loop=1", "playlist=aCY1225xEWc", "controls=0", "playsinline=1"]) assert.ok(iframeSrc.includes(parameter));
    assert.ok(await page.locator(".volunteer-hero iframe").getAttribute("title"));
    results.video.push({ locale, youtubeId: "aCY1225xEWc", initialState: "poster only under reduced motion", start: 18, privacyHost: "youtube-nocookie.com", manualPlay: "pass" });
    await page.goto(base + route, { waitUntil: "networkidle" });

    const requiredLinks = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Preparation", "Volunteer guidelines", page.locator(".volunteer-prepare .button"), guidelines, "links.volunteer.guidelines"],
      ["Preparation", "Operations email", page.locator(".volunteer-prepare .text-link"), volunteerEmail, "links.email.volunteer"],
      ["Application", "Operations email", page.locator(".volunteer-submit-row .text-link"), volunteerEmail, "links.email.volunteer"],
      ["Group bridge", "Explore Group Travel", page.locator(".volunteer-group .button"), `${base}/${locale}/travel-with-purpose`, "links.travel.page(locale)"],
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
    for (const [section, label, selector, target] of [
      ["Hero", "Apply to Volunteer", ".volunteer-hero .button", "#application"],
      ["Hero", "See a Day with Dove", ".volunteer-hero .text-link", "#day-with-dove"],
      ["How to Start", "Start the Application", ".volunteer-start .button", "#application"],
    ]) {
      const locator = page.locator(selector);
      assert.equal(await locator.getAttribute("href"), target);
      await locator.click();
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).count(), 1);
      results.links.push({ page: route, section, label, destinationKey: target, type: "in-page", destination: target, status: "clicked; target exists" });
    }
    const allHrefs = await page.locator("header a, main a, footer a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(allHrefs.every((href) => href && href !== "#"));

    const form = page.locator(".volunteer-form");
    await form.locator('button[type="submit"]').click();
    assert.ok(await form.locator('[aria-invalid="true"]').count() >= 6);
    assert.ok((await page.locator("#volunteer-form-status").innerText()).length > 0);
    await form.locator('[name="fullName"]').fill("Quality Assurance Volunteer");
    await form.locator('[name="email"]').fill("qa@example.com");
    await form.locator('[name="phone"]').fill("+1 809 555 0100");
    await form.locator('[name="requestedStartDate"]').fill("2026-11-15");
    await form.locator('[name="numberOfDays"]').fill("3");
    await form.locator('[name="acceptedRelease"]').check();
    await form.locator('button[type="submit"]').click();
    await page.locator("#volunteer-form-status.is-unavailable").waitFor();
    const status = await page.locator("#volunteer-form-status").innerText();
    assert.ok(status.includes(locale === "es" ? "no se enviaron ni se guardaron" : "has not been sent or stored"));
    assert.equal(await form.locator('[name="fullName"]').inputValue(), "Quality Assurance Volunteer", "Unavailable submission preserves data");
    assert.equal(await form.locator('[name="acceptedRelease"]').isChecked(), true, "Unavailable submission preserves acceptance state without recording it");
    results.form.push({ locale, clientValidation: "pass", releaseRequired: "pass", provider: "not configured", response: "503 unavailable", falseSuccess: false, dataPreserved: true });

    await page.locator("#newsletter-email").fill("qa@example.com");
    await page.locator(".newsletter button").click();
    await page.locator("#newsletter-status").filter({ hasText: locale === "es" ? "No hemos guardado" : "has not been saved" }).waitFor();
    results.links.push({ page: route, section: "Newsletter", label: "Newsletter submit", destinationKey: "submitNewsletter", type: "adapter", destination: "No provider configured", status: "clicked; unavailable response; no fake success" });

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
      await page.screenshot({ path: `artifacts/volunteer/${locale}-${width}.png`, fullPage: true });
    }
  }

  const apiInvalid = await context.request.post(`${base}/api/volunteer-application`, { data: { locale: "en" } });
  assert.equal(apiInvalid.status(), 400);
  const apiUnavailable = await context.request.post(`${base}/api/volunteer-application`, { data: { fullName: "QA Volunteer", email: "qa@example.com", phone: "+1 809 555 0100", requestedStartDate: "2026-11-15", numberOfDays: "2", acceptedRelease: true, locale: "en", releaseVersion: "2026-migration-v1" } });
  assert.equal(apiUnavailable.status(), 503);
  results.behaviors.push("API rejects invalid payloads and returns 503 without creating an acceptance record when no provider is configured");

  for (const [legacy, cookie, expected] of [
    ["/the-dove-experience", "dove_locale=es", "/es/volunteer"],
    ["/volunteer-release", "dove_locale=en", "/en/volunteer#application"],
  ]) {
    const response = await context.request.get(base + legacy, { headers: { Cookie: cookie }, maxRedirects: 0 });
    assert.equal(response.status(), 308);
    const location = response.headers().location;
    assert.ok(location.endsWith(expected), `${legacy} redirected to ${location}`);
    results.redirects.push({ source: legacy, cookie, destination: location, status: 308 });
  }

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/volunteer", "/es/volunteer"]) assert.ok(sitemap.includes(route));
  results.behaviors.push("Sitemap includes both localized Volunteer routes");

  const motionContext = await browser.newContext({ reducedMotion: "no-preference" });
  const motionPage = await motionContext.newPage();
  await motionPage.setViewportSize({ width: 1280, height: 800 });
  await motionPage.goto(`${base}/en/volunteer`, { waitUntil: "networkidle" });
  await motionPage.locator(".volunteer-hero iframe").waitFor();
  assert.equal(await motionPage.locator(".volunteer-video-toggle").getAttribute("aria-label"), "Pause background video");
  await motionPage.locator(".volunteer-video-toggle").click();
  assert.equal(await motionPage.locator(".volunteer-video-toggle").getAttribute("aria-label"), "Play background video");
  const fold = await motionPage.evaluate(() => {
    const content = document.querySelector(".volunteer-hero-content").getBoundingClientRect();
    const primary = document.querySelector(".volunteer-hero .button").getBoundingClientRect();
    return { contentBottom: content.bottom, primaryBottom: primary.bottom, viewportHeight: innerHeight };
  });
  assert.ok(fold.contentBottom <= fold.viewportHeight && fold.primaryBottom <= fold.viewportHeight, `Hero essentials exceed laptop fold: ${JSON.stringify(fold)}`);
  results.video.push({ locale: "en", initialState: "poster first then automatic muted loop", pauseResumeControl: "pass", laptopFold: "pass" });
  await motionContext.close();
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/volunteer/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${results.pages.length} responsive states, ${results.links.length} actions, ${results.form.length} form states, ${results.video.length} video states and ${results.redirects.length} redirects.`);
}
