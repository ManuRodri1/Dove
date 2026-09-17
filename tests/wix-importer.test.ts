import test from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { transformWixNode, runWixMigrationDryRun } from "../scripts/migrate-wix-blog";

test("Wix Transformer - Heading Node", () => {
  const result = transformWixNode(
    {
      type: "HEADING",
      headingData: { level: 3 },
      nodes: [{ type: "TEXT", textData: { text: "Community News" } }],
    },
    0,
    "test-post"
  );
  assert.equal(result.block?.block_type, "heading");
  assert.deepEqual(result.block?.data, { text: "Community News", level: 3 });
});

test("Wix Transformer - Paragraph with Decorations", () => {
  const result = transformWixNode(
    {
      type: "PARAGRAPH",
      nodes: [
        { type: "TEXT", textData: { text: "Hello " } },
        { type: "TEXT", textData: { text: "World", decorations: [{ type: "BOLD" }] } },
      ],
    },
    1,
    "test-post"
  );
  assert.equal(result.block?.block_type, "rich_text");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((result.block?.data as any).html, "<p>Hello <strong>World</strong></p>");
});

test("Wix Transformer - YouTube Video Embed", () => {
  const result = transformWixNode(
    {
      type: "VIDEO",
      videoData: {
        video: {
          src: { url: "https://www.youtube.com/watch?v=rjFUSW-1xmA" },
          title: "Video Title",
        },
        caption: "A caption",
      },
    },
    2,
    "test-post"
  );
  assert.equal(result.block?.block_type, "youtube");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((result.block?.data as any).videoId, "rjFUSW-1xmA");
});

test("Wix Transformer - Non-YouTube Fallback to Callout", () => {
  const result = transformWixNode(
    {
      type: "VIDEO",
      videoData: {
        video: {
          src: { url: "https://vimeo.com/123456" },
          title: "Vimeo Video",
        },
      },
    },
    3,
    "test-post"
  );
  assert.equal(result.block?.block_type, "callout");
  assert.equal(Boolean(result.unsupported), true);
});

test("Wix Migration Dry Run - Fixture Processing", async () => {
  const fixturePath = path.resolve(__dirname, "../scripts/fixtures/wix-blog-fixture.json");
  const report = await runWixMigrationDryRun({ fixturePath });

  assert.equal(report.isDryRun, true);
  assert.equal(report.postsDiscovered, 2);
  assert.equal(report.categoriesFound.length, 3);
  assert.equal(report.tagsFound.length, 6);
  assert.equal(report.authorsFound.length, 2);
  assert.equal(report.mediaReferencesFound.length >= 5, true);
  assert.equal(report.redirectMappingsProposed.length, 2);
  assert.equal(report.slugCollisions.length, 0);
  assert.equal(report.errors.length, 0);
});
