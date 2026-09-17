import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://127.0.0.1:3010";
const sponsorship = "https://dovemissions.networkforgood.com/projects/30480-dove-missions-child-sponsorship";
const general = "https://dovemissions.networkforgood.com/projects/29949-dove-youth-development-giving-page";
const email = "mailto:childsponsorship@doveyouthdevelopment.org";
const widths = [320, 375, 414, 768, 1024, 1440];
const results = { base, pages: [], links: [], behaviors: [], errors: [] };
await mkdir("artifacts/child-sponsorship", { recursive: true });
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
    const route = `/${locale}/child-sponsorship`;
    await context.clearCookies();
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("main form").count(), 1, "Shared newsletter renders exactly once");
    assert.equal(await page.locator(".sponsorship-voice").count(), 4);
    assert.equal(await page.locator(".faq-list details").count(), 6);
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
    for (const alternate of ["en", "es"]) {
      assert.ok((await page.locator(`link[hreflang="${alternate}"]`).getAttribute("href")).endsWith(`/${alternate}/child-sponsorship`));
    }
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute("content")).includes("44242d83e5054c4b8c70b72f04061da1"));

    const requiredLinks = [
      ["Header", "Donate", page.locator(".site-header .header-donate"), general, "links.giving.general"],
      ["Hero", "Sponsor", page.locator(".sponsorship-hero .button"), sponsorship, "links.giving.childSponsorship"],
      ["$50 anchor", "Begin", page.locator(".sponsorship-anchor .button"), sponsorship, "links.giving.childSponsorship"],
      ["How it works", "Sponsor", page.locator(".sponsorship-process .button"), sponsorship, "links.giving.childSponsorship"],
      ["Final CTA", "Sponsor", page.locator(".sponsorship-final .button--primary"), sponsorship, "links.giving.childSponsorship"],
      ["Final CTA", "Questions", page.locator(".sponsorship-final .button--secondary"), email, "links.email.childSponsorship"],
      ["Header", "Logo", page.locator(".site-header .brand"), `${base}/${locale}`, "links.home(locale)"],
    ];
    for (const [section, label, locator, expected, key] of requiredLinks) {
      assert.equal(await locator.count(), 1, `${section} ${label} must be unique`);
      const raw = await locator.getAttribute("href");
      const resolved = raw.startsWith("/") ? base + raw : raw;
      assert.equal(resolved, expected);
      assert.equal(await clickedHref(locator), expected);
      results.links.push({ locale, section, label, destinationKey: key, type: expected.startsWith("mailto:") ? "mailto" : expected.startsWith(base) ? "internal" : "external", destination: raw, status: "clicked; dispatched to exact configured href" });
    }
    const supportAnchor = page.locator(".sponsorship-hero .text-link");
    assert.equal(await supportAnchor.getAttribute("href"), "#sponsorship-support");
    await supportAnchor.click();
    assert.equal(new URL(page.url()).hash, "#sponsorship-support");
    assert.equal(await page.locator("#sponsorship-support").count(), 1);
    results.links.push({ locale, section: "Hero", label: "Support section", destinationKey: "#sponsorship-support", type: "in-page", destination: "#sponsorship-support", status: "clicked; target exists" });

    const navHrefs = await page.locator(".desktop-nav a").evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    assert.ok(navHrefs.every((href) => href && href.startsWith(`/${locale}`)));
    results.behaviors.push(`${locale}: all header navigation remains locale-aware`);

    await page.locator("#newsletter-email").fill("qa@example.com");
    await page.locator(".newsletter button").click();
    await page.locator("#newsletter-status").filter({ hasText: locale === "es" ? "No hemos guardado" : "has not been saved" }).waitFor();
    results.links.push({ locale, section: "Newsletter", label: "Newsletter submit", destinationKey: "submitNewsletter", type: "adapter", destination: "No provider configured", status: "clicked; unavailable response; no fake success" });

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
          return bounds.width > 0 && getComputedStyle(element).position !== "absolute" && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map((element) => element.className || element.tagName),
        brokenImages: [...document.images].filter((image) => image.checkVisibility() && !image.naturalWidth).map((image) => image.currentSrc || image.src),
        wrappedActions: [...document.querySelectorAll(".button, .text-link")].filter((element) => {
          if (!element.checkVisibility()) return false;
          if (getComputedStyle(element).whiteSpace === "nowrap") return false;
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
      await page.screenshot({ path: `artifacts/child-sponsorship/${locale}-${width}.png`, fullPage: true });
    }
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const route of ["/en/child-sponsorship", "/es/child-sponsorship"]) assert.ok(sitemap.includes(route));
  results.behaviors.push("Sitemap includes both localized routes");
} catch (error) {
  results.errors.push(error.stack || String(error));
} finally {
  await writeFile("artifacts/child-sponsorship/qa.json", JSON.stringify(results, null, 2));
  await browser.close();
}

if (results.errors.length) {
  console.error(results.errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${results.pages.length} responsive page states, ${results.links.length} required actions, and ${results.behaviors.length} behaviors.`);
}
