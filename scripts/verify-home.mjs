import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

// Run against an already-running server: BASE_URL=http://127.0.0.1:3001 npm run verify
// EXPECT_PRODUCTION=true additionally asserts that pending editorial content is absent.
const base = process.env.BASE_URL || "http://127.0.0.1:3001";
const production = process.env.EXPECT_PRODUCTION === "true";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = { base, production, widths: [], failures: [] };
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (error) => results.failures.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(
    await page.locator("video").getAttribute("src"),
    null,
    "Reduced-motion must not fetch video",
  );
  assert.ok(
    await page.locator('meta[name="description"]').getAttribute("content"),
  );
  assert.ok(
    await page.locator('meta[property="og:title"]').getAttribute("content"),
  );
  if (production) {
    assert.equal(await page.locator("[data-development]").count(), 0);
    assert.equal(
      await page.getByRole("heading", { name: "Stories From Dove" }).count(),
      0,
    );
    assert.equal(await page.locator("progress").count(), 0);
    assert.equal(
      await page.getByText("Development placeholder", { exact: false }).count(),
      0,
    );
  }
  for (const width of [320, 375, 414, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    // Scroll each real section into view to exercise lazy images before capture.
    for (const section of await page.locator("main > section, footer").all())
      await section.scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
      window.scrollTo(0, 0);
    });
    const layout = await page.evaluate(() => {
      const overflow = [
        ...document.querySelectorAll("main *, header *, footer *"),
      ]
        .filter((e) => {
          const b = e.getBoundingClientRect();
          const s = getComputedStyle(e);
          return (
            b.width > 0 &&
            s.position !== "absolute" &&
            (b.right > innerWidth + 1 || b.left < -1)
          );
        })
        .map((e) => ({
          tag: e.tagName,
          class: e.className,
          text: e.textContent?.slice(0, 60),
        }));
      return {
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow,
        brokenImages: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.alt),
      };
    });
    await page.screenshot({
      path: "artifacts/viewport-" + width + ".png",
      fullPage: false,
    });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const violations = axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({ html: n.html, summary: n.failureSummary })),
    }));
    results.widths.push({ ...layout, violations });
    await page.screenshot({
      path: `artifacts/home-${production ? "production-" : ""}${width}.png`,
      fullPage: true,
    });
    if ([320, 768, 1024, 1440].includes(width)) {
      for (const section of ["#pathway", "#experience", ".origin", ".featured-story", "#support"]) {
        await page.locator(section).screenshot({ path: `artifacts/section-${width}-${section.replace(/[.#]/g, "")}.png` });
      }
    }
    if (
      layout.scrollWidth > width ||
      layout.overflow.length ||
      layout.brokenImages.length ||
      violations.length
    )
      results.failures.push(
        `Viewport ${width} failed; inspect detailed results`,
      );
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const menu = page.locator(".menu-toggle");
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  assert.equal(await menu.evaluate((e) => e === document.activeElement), true);
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: /Español/ })
    .click();
  assert.equal(
    await page
      .getByRole("status")
      .filter({ hasText: "Spanish translation is being prepared." })
      .count(),
    1,
  );
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const heroCta = await page.locator(".hero .button").boundingBox();
  assert.ok(heroCta.y + heroCta.height < 800, "Hero CTA must fit laptop fold");
  const motionPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await motionPage.goto(base, { waitUntil: "load" });
  await motionPage.waitForFunction(
    () => {
      const v = document.querySelector("video");
      return v && !v.paused && v.readyState >= 2;
    },
    { timeout: 45000 },
  );
  await motionPage
    .getByRole("button", { name: "Pause background video" })
    .click();
  assert.equal(
    await motionPage.locator("video").evaluate((v) => v.paused),
    true,
  );
  await motionPage
    .getByRole("button", { name: "Play background video" })
    .click();
  await motionPage.waitForFunction(
    () => !document.querySelector("video").paused,
  );
  results.video = await motionPage
    .locator("video")
    .evaluate((v) => ({
      muted: v.muted,
      loop: v.loop,
      playsInline: v.playsInline,
      controls: v.controls,
      source: v.currentSrc,
      width: v.videoWidth,
      height: v.videoHeight,
    }));
  await motionPage.close();
  const fallback = await browser.newPage();
  await fallback.route("**/*.mp4", route => route.abort());
  await fallback.goto(base, { waitUntil: "networkidle" });
  await fallback.getByRole("status").filter({ hasText: "Background video unavailable" }).waitFor();
  assert.equal(await fallback.locator(".hero-media img").evaluate(i => i.complete && i.naturalWidth > 0), true);
  results.videoFailurePoster = "passed";
  await fallback.close();
  results.status = results.failures.length ? "failed" : "passed";
} catch (error) {
  results.status = "failed";
  results.failures.push(error.stack);
} finally {
  await writeFile(
    `artifacts/verification${production ? "-production" : ""}.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}
if (results.status !== "passed") process.exitCode = 1;
