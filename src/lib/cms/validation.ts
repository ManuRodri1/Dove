import type { StoryStatus, TranslationPublicationStatus } from "../supabase/database.types";
import { isLocale, type Locale } from "@/i18n/config";
import { isValidUrl } from "./blocks/schema";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with single dash
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes
}

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (typeof slug !== "string" || !slug.trim()) {
    return { valid: false, error: "Slug cannot be empty" };
  }
  const normalized = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return {
      valid: false,
      error: "Slug must contain only lowercase alphanumeric characters and single hyphens",
    };
  }
  if (normalized.length > 200) {
    return { valid: false, error: "Slug exceeds maximum length of 200 characters" };
  }
  return { valid: true };
}

export interface StoryInput {
  status?: StoryStatus;
  author_id?: string | null;
  author_name?: string | null;
  cover_media_id?: string | null;
  featured_home?: boolean;
  featured_stories?: boolean;
  published_at?: string | null;
  scheduled_at?: string | null;
}

export function validateStoryInput(input: unknown): { valid: boolean; data?: StoryInput; error?: string } {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Story input must be an object" };
  }
  const i = input as Record<string, unknown>;

  const status = (i.status as StoryStatus) || "draft";
  if (!["draft", "published", "archived"].includes(status)) {
    return { valid: false, error: `Invalid story status: ${status}` };
  }

  const published_at = typeof i.published_at === "string" && i.published_at ? i.published_at : null;
  if (published_at && isNaN(Date.parse(published_at))) {
    return { valid: false, error: "Invalid published_at ISO timestamp" };
  }

  const scheduled_at = typeof i.scheduled_at === "string" && i.scheduled_at ? i.scheduled_at : null;
  if (scheduled_at && isNaN(Date.parse(scheduled_at))) {
    return { valid: false, error: "Invalid scheduled_at ISO timestamp" };
  }

  return {
    valid: true,
    data: {
      status,
      author_id: typeof i.author_id === "string" ? i.author_id : null,
      author_name: typeof i.author_name === "string" ? i.author_name.trim() : null,
      cover_media_id: typeof i.cover_media_id === "string" ? i.cover_media_id : null,
      featured_home: i.featured_home === true,
      featured_stories: i.featured_stories === true,
      published_at,
      scheduled_at,
    },
  };
}

export interface TranslationInput {
  locale: Locale;
  slug: string;
  title: string;
  excerpt?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  publication_status?: TranslationPublicationStatus;
}

export function validateTranslationInput(input: unknown): {
  valid: boolean;
  data?: TranslationInput;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Translation input must be an object" };
  }
  const t = input as Record<string, unknown>;

  if (!isLocale(t.locale)) {
    return { valid: false, error: "Invalid locale; must be 'en' or 'es'" };
  }

  if (typeof t.title !== "string" || !t.title.trim()) {
    return { valid: false, error: "Title is required" };
  }

  const slug = typeof t.slug === "string" && t.slug.trim() ? slugify(t.slug) : slugify(t.title);
  const slugCheck = validateSlug(slug);
  if (!slugCheck.valid) {
    return slugCheck;
  }

  const pubStatus = (t.publication_status as TranslationPublicationStatus) || "draft";
  if (!["draft", "published", "archived"].includes(pubStatus)) {
    return { valid: false, error: `Invalid publication_status: ${pubStatus}` };
  }

  return {
    valid: true,
    data: {
      locale: t.locale,
      slug,
      title: t.title.trim(),
      excerpt: typeof t.excerpt === "string" ? t.excerpt.trim() : "",
      seo_title: typeof t.seo_title === "string" ? t.seo_title.trim() : null,
      seo_description: typeof t.seo_description === "string" ? t.seo_description.trim() : null,
      publication_status: pubStatus,
    },
  };
}

export interface RedirectInput {
  source_path: string;
  destination_path: string;
  status_code?: 301 | 302 | 307 | 308;
  active?: boolean;
}

export function validateRedirectInput(input: unknown): {
  valid: boolean;
  data?: RedirectInput;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Redirect input must be an object" };
  }
  const r = input as Record<string, unknown>;

  if (typeof r.source_path !== "string" || !r.source_path.startsWith("/")) {
    return { valid: false, error: "source_path must start with '/'" };
  }

  if (typeof r.destination_path !== "string" || !isValidUrl(r.destination_path)) {
    return { valid: false, error: "destination_path must be a valid path or secure URL" };
  }

  const code = (r.status_code as number) || 301;
  if (![301, 302, 307, 308].includes(code)) {
    return { valid: false, error: "status_code must be 301, 302, 307, or 308" };
  }

  return {
    valid: true,
    data: {
      source_path: r.source_path.trim().toLowerCase(),
      destination_path: r.destination_path.trim(),
      status_code: code as 301 | 302 | 307 | 308,
      active: r.active !== false,
    },
  };
}
