import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBlockData,
  validateBlockSettings,
  sanitizeHtml,
  isValidUrl,
  type BlockWidth,
  type BlockTheme,
} from "../src/lib/cms/blocks/schema";

test("Block Schema - Heading Block", () => {
  const valid = validateBlockData("heading", { text: "Our Story", level: 2 });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.sanitizedData, { text: "Our Story", level: 2 });

  const invalidLevel = validateBlockData("heading", { text: "Invalid", level: 1 });
  assert.equal(invalidLevel.valid, false);

  const missingText = validateBlockData("heading", { text: "", level: 2 });
  assert.equal(missingText.valid, false);
});

test("Block Schema - Rich Text Block & XSS Sanitization", () => {
  const dirty = '<p>Safe paragraph</p><script>alert("hack")</script><iframe src="evil.com"></iframe>';
  const clean = sanitizeHtml(dirty);
  assert.equal(clean.includes("<script>"), false);
  assert.equal(clean.includes("<iframe>"), false);
  assert.equal(clean.includes("Safe paragraph"), true);

  const result = validateBlockData("rich_text", { html: dirty });
  assert.equal(result.valid, true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((result.sanitizedData as any).html.includes("<script>"), false);
});

test("Block Schema - Image Block", () => {
  const valid = validateBlockData("image", {
    url: "https://static.wixstatic.com/media/sample.jpg",
    alt: "Children in Puerto Plata",
    focalX: 0.5,
    focalY: 0.3,
  });
  assert.equal(valid.valid, true);

  const invalidUrl = validateBlockData("image", {
    url: "javascript:alert(1)",
    alt: "Dangerous",
  });
  assert.equal(invalidUrl.valid, false);
});

test("Block Schema - YouTube Block", () => {
  const valid = validateBlockData("youtube", {
    videoId: "rjFUSW-1xmA",
    title: "Dove Overview",
  });
  assert.equal(valid.valid, true);

  const invalidId = validateBlockData("youtube", {
    videoId: "bad id with spaces!",
    title: "Bad",
  });
  assert.equal(invalidId.valid, false);
});

test("Block Schema - Button Group & Safe URLs", () => {
  const valid = validateBlockData("button_group", {
    buttons: [
      { label: "Sponsor", href: "/en/child-sponsorship", variant: "primary" },
      { label: "Donate", href: "https://dovemissions.networkforgood.com", variant: "secondary" },
    ],
  });
  assert.equal(valid.valid, true);

  const unsafeButton = validateBlockData("button_group", {
    buttons: [{ label: "Click", href: "javascript:void(0)" }],
  });
  assert.equal(unsafeButton.valid, false);
});

test("Block Settings - Controlled Enums", () => {
  const validSettings = validateBlockSettings({
    width: "content",
    theme: "teal",
    alignment: "center",
    spacing: "generous",
  });
  assert.equal(validSettings.valid, true);

  const invalidWidth = validateBlockSettings({ width: "random_css_width" as unknown as BlockWidth });
  assert.equal(invalidWidth.valid, false);

  const invalidTheme = validateBlockSettings({ theme: "neon_pink" as unknown as BlockTheme });
  assert.equal(invalidTheme.valid, false);
});

test("URL Validation Helper", () => {
  assert.equal(isValidUrl("https://www.doveyouthdevelopment.org"), true);
  assert.equal(isValidUrl("/en/stories"), true);
  assert.equal(isValidUrl("javascript:alert(1)"), false);
  assert.equal(isValidUrl("data:text/html,<script>"), false);
  assert.equal(isValidUrl("//protocol-relative.com"), false);
});
