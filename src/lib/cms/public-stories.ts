import "server-only";
import type { Locale } from "@/i18n/config";
import { createClient } from "../supabase/server";
import type { BlockType } from "../supabase/database.types";
import type { BlockSettings } from "./blocks/schema";

export interface PublicStorySummary {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  authorName: string | null;
  publishedAt: string;
  coverImage: {
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    focalX: number | null;
    focalY: number | null;
  } | null;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
  featuredHome: boolean;
  featuredStories: boolean;
  href: string;
}

export interface PublicStoryBlock {
  id: string;
  blockType: BlockType;
  sortOrder: number;
  data: Record<string, unknown>;
  settings: BlockSettings;
}

export interface PublicStoryDetail extends PublicStorySummary {
  seoTitle: string | null;
  seoDescription: string | null;
  blocks: PublicStoryBlock[];
}

/**
 * Helper to check if Supabase is configured in the current environment
 */
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Fetch featured stories for the Home page or Stories index
 */
export async function getFeaturedStories(
  locale: Locale,
  target: "home" | "stories" = "home",
  limit = 3
): Promise<PublicStorySummary[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    let query = supabase
      .from("stories")
      .select(`
        id,
        published_at,
        author_name,
        featured_home,
        featured_stories,
        cover_media:media_assets!cover_media_id (
          url,
          width,
          height,
          focal_x,
          focal_y
        ),
        translations:story_translations!inner (
          slug,
          title,
          excerpt,
          locale,
          publication_status
        ),
        story_categories (
          category:categories (
            translations:category_translations (
              name,
              slug,
              locale
            )
          )
        ),
        story_tags (
          tag:tags (
            translations:tag_translations (
              name,
              slug,
              locale
            )
          )
        )
      `)
      .eq("status", "published")
      .lte("published_at", now)
      .eq("translations.locale", locale)
      .eq("translations.publication_status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (target === "home") {
      query = query.eq("featured_home", true);
    } else {
      query = query.eq("featured_stories", true);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return mapStoriesSummary(data, locale);
  } catch {
    return [];
  }
}

/**
 * Query paginated stories for a given locale with optional category filtering
 */
export async function getStories(params: {
  locale: Locale;
  limit?: number;
  offset?: number;
  categorySlug?: string;
}): Promise<{ items: PublicStorySummary[]; total: number }> {
  if (!isSupabaseConfigured()) {
    return { items: [], total: 0 };
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    let query = supabase
      .from("stories")
      .select(`
        id,
        published_at,
        author_name,
        featured_home,
        featured_stories,
        cover_media:media_assets!cover_media_id (
          url,
          width,
          height,
          focal_x,
          focal_y
        ),
        translations:story_translations!inner (
          slug,
          title,
          excerpt,
          locale,
          publication_status
        ),
        story_categories (
          category:categories (
            translations:category_translations (
              name,
              slug,
              locale
            )
          )
        ),
        story_tags (
          tag:tags (
            translations:tag_translations (
              name,
              slug,
              locale
            )
          )
        )
      `, { count: "exact" })
      .eq("status", "published")
      .lte("published_at", now)
      .eq("translations.locale", params.locale)
      .eq("translations.publication_status", "published")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (params.categorySlug) {
      // Filter by category slug if provided
      query = query.eq("story_categories.category.translations.slug", params.categorySlug);
    }

    const { data, count, error } = await query;
    if (error || !data) {
      return { items: [], total: 0 };
    }

    return {
      items: mapStoriesSummary(data, params.locale),
      total: count ?? data.length,
    };
  } catch {
    return { items: [], total: 0 };
  }
}

/**
 * Fetch a single story with full ordered content blocks by slug
 */
export async function getStoryBySlug(params: {
  locale: Locale;
  slug: string;
}): Promise<PublicStoryDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("stories")
      .select(`
        id,
        published_at,
        author_name,
        featured_home,
        featured_stories,
        cover_media:media_assets!cover_media_id (
          url,
          width,
          height,
          focal_x,
          focal_y
        ),
        translations:story_translations!inner (
          id,
          slug,
          title,
          excerpt,
          seo_title,
          seo_description,
          locale,
          publication_status,
          story_blocks (
            id,
            block_type,
            sort_order,
            data,
            settings,
            visible
          )
        ),
        story_categories (
          category:categories (
            translations:category_translations (
              name,
              slug,
              locale
            )
          )
        ),
        story_tags (
          tag:tags (
            translations:tag_translations (
              name,
              slug,
              locale
            )
          )
        )
      `)
      .eq("status", "published")
      .lte("published_at", now)
      .eq("translations.locale", params.locale)
      .eq("translations.slug", params.slug)
      .eq("translations.publication_status", "published")
      .single();

    if (error || !data) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = data as any;
    const translation = Array.isArray(rawData.translations) ? rawData.translations[0] : rawData.translations;
    if (!translation) return null;

    const summary = mapStoriesSummary([data], params.locale)[0];
    if (!summary) return null;

    // Filter and sort visible blocks by sort_order
    const rawBlocks = (translation.story_blocks as Array<{
      id: string;
      block_type: BlockType;
      sort_order: number;
      data: Record<string, unknown>;
      settings: BlockSettings;
      visible: boolean;
    }>) || [];

    const blocks: PublicStoryBlock[] = rawBlocks
      .filter((b) => b.visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((b) => ({
        id: b.id,
        blockType: b.block_type,
        sortOrder: b.sort_order,
        data: b.data,
        settings: b.settings ?? {},
      }));

    return {
      ...summary,
      seoTitle: translation.seo_title,
      seoDescription: translation.seo_description,
      blocks,
    };
  } catch {
    return null;
  }
}

/**
 * Full text / keyword search across published stories
 */
export async function searchStories(params: {
  locale: Locale;
  query: string;
  limit?: number;
}): Promise<PublicStorySummary[]> {
  if (!isSupabaseConfigured() || !params.query.trim()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const limit = params.limit ?? 10;
    const cleanQuery = `%${params.query.trim()}%`;

    const { data, error } = await supabase
      .from("stories")
      .select(`
        id,
        published_at,
        author_name,
        featured_home,
        featured_stories,
        cover_media:media_assets!cover_media_id (
          url,
          width,
          height,
          focal_x,
          focal_y
        ),
        translations:story_translations!inner (
          slug,
          title,
          excerpt,
          locale,
          publication_status
        ),
        story_categories (
          category:categories (
            translations:category_translations (
              name,
              slug,
              locale
            )
          )
        ),
        story_tags (
          tag:tags (
            translations:tag_translations (
              name,
              slug,
              locale
            )
          )
        )
      `)
      .eq("status", "published")
      .lte("published_at", now)
      .eq("translations.locale", params.locale)
      .eq("translations.publication_status", "published")
      .or(`title.ilike.${cleanQuery},excerpt.ilike.${cleanQuery}`, {
        foreignTable: "story_translations",
      })
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return mapStoriesSummary(data, params.locale);
  } catch {
    return [];
  }
}

// ==============================================================================
// INTERNAL MAPPING HELPERS
// ==============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStoriesSummary(records: any[], locale: Locale): PublicStorySummary[] {
  return records
    .map((record) => {
      const translation = Array.isArray(record.translations)
        ? record.translations[0]
        : record.translations;

      if (!translation) return null;

      const cover = record.cover_media;
      const categories: Array<{ name: string; slug: string }> = [];
      const tags: Array<{ name: string; slug: string }> = [];

      // Extract translated categories
      if (Array.isArray(record.story_categories)) {
        for (const sc of record.story_categories) {
          const trans = sc.category?.translations;
          const match = Array.isArray(trans)
            ? trans.find((t: { locale: string }) => t.locale === locale)
            : trans?.locale === locale
            ? trans
            : null;
          if (match) {
            categories.push({ name: match.name, slug: match.slug });
          }
        }
      }

      // Extract translated tags
      if (Array.isArray(record.story_tags)) {
        for (const st of record.story_tags) {
          const trans = st.tag?.translations;
          const match = Array.isArray(trans)
            ? trans.find((t: { locale: string }) => t.locale === locale)
            : trans?.locale === locale
            ? trans
            : null;
          if (match) {
            tags.push({ name: match.name, slug: match.slug });
          }
        }
      }

      return {
        id: record.id,
        slug: translation.slug,
        locale,
        title: translation.title,
        excerpt: translation.excerpt || "",
        authorName: record.author_name || null,
        publishedAt: record.published_at,
        coverImage: cover
          ? {
              url: cover.url,
              alt: translation.title,
              width: (cover.width as number | null) ?? null,
              height: (cover.height as number | null) ?? null,
              focalX: (cover.focal_x as number | null) ?? null,
              focalY: (cover.focal_y as number | null) ?? null,
            }
          : null,
        categories,
        tags,
        featuredHome: record.featured_home === true,
        featuredStories: record.featured_stories === true,
        href: `/${locale}/stories/${translation.slug}`,
      };
    })
    .filter((item): item is PublicStorySummary => item !== null);
}
