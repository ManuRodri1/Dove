import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  validateSlug,
  validateStoryInput,
  validateTranslationInput,
  validateRedirectInput,
} from "../src/lib/cms/validation";
import type { StoryStatus } from "../src/lib/supabase/database.types";
import type { Locale } from "../src/i18n/config";

test("Validation - Slug Generation & Rules", () => {
  assert.equal(slugify("Meet Leonela: Student to Entrepreneur!"), "meet-leonela-student-to-entrepreneur");
  assert.equal(slugify("¿Cómo apoyar a Dove en Puerto Plata?"), "como-apoyar-a-dove-en-puerto-plata");

  const validSlug = validateSlug("leonela-pena");
  assert.equal(validSlug.valid, true);

  const invalidSlugSpaces = validateSlug("leonela pena");
  assert.equal(invalidSlugSpaces.valid, false);

  const invalidSlugSymbols = validateSlug("leonela@dove");
  assert.equal(invalidSlugSymbols.valid, false);
});

test("Validation - Story Input Validation", () => {
  const valid = validateStoryInput({
    status: "published",
    author_name: "Liz Rodriguez",
    featured_home: true,
    published_at: "2024-04-15T12:00:00.000Z",
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.data?.status, "published");
  assert.equal(valid.data?.featured_home, true);

  const invalidStatus = validateStoryInput({
    status: "unknown_status" as unknown as StoryStatus,
  });
  assert.equal(invalidStatus.valid, false);

  const invalidDate = validateStoryInput({
    published_at: "not-a-date",
  });
  assert.equal(invalidDate.valid, false);
});

test("Validation - Translation Input Validation", () => {
  const validEn = validateTranslationInput({
    locale: "en",
    slug: "spring-update-2024",
    title: "Spring Update 2024",
    excerpt: "News from Puerto Plata",
    publication_status: "published",
  });
  assert.equal(validEn.valid, true);
  assert.equal(validEn.data?.locale, "en");

  const invalidLocale = validateTranslationInput({
    locale: "fr" as unknown as Locale,
    title: "Titre",
  });
  assert.equal(invalidLocale.valid, false);

  const missingTitle = validateTranslationInput({
    locale: "es",
    title: "   ",
  });
  assert.equal(missingTitle.valid, false);
});

test("Validation - Redirect Input Validation", () => {
  const validRedirect = validateRedirectInput({
    source_path: "/post/april-2024",
    destination_path: "/en/stories/april-2024",
    status_code: 301,
  });
  assert.equal(validRedirect.valid, true);
  assert.equal(validRedirect.data?.status_code, 301);

  const invalidSource = validateRedirectInput({
    source_path: "missing-slash",
    destination_path: "/en/stories/test",
  });
  assert.equal(invalidSource.valid, false);

  const invalidCode = validateRedirectInput({
    source_path: "/old",
    destination_path: "/new",
    status_code: 500 as unknown as 301,
  });
  assert.equal(invalidCode.valid, false);
});

test("Public Story Filtering Logic - Gating", () => {
  // Simulating query filtering rules
  const now = new Date("2024-06-01T00:00:00.000Z");

  const stories = [
    { id: "1", status: "published", published_at: "2024-04-01T00:00:00.000Z" },
    { id: "2", status: "draft", published_at: "2024-04-01T00:00:00.000Z" },
    { id: "3", status: "published", published_at: "2024-07-01T00:00:00.000Z" }, // Future post
    { id: "4", status: "archived", published_at: "2024-01-01T00:00:00.000Z" },
  ];

  const publicStories = stories.filter(
    (s) => s.status === "published" && s.published_at && new Date(s.published_at) <= now
  );

  assert.equal(publicStories.length, 1);
  assert.equal(publicStories[0].id, "1");
});
