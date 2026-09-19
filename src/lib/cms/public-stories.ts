import "server-only";

import type { Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import type { BlockType } from "@/lib/supabase/database.types";
import type { BlockSettings } from "./blocks/schema";

export interface StoryImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  focalX: number | null;
  focalY: number | null;
}

export interface PublicStorySummary {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  authorName: string | null;
  publishedAt: string;
  coverImage: StoryImage | null;
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
  settings: BlockSettings & Record<string, unknown>;
  visible?: boolean;
}

export interface PublicStoryDetail extends PublicStorySummary {
  seoTitle: string | null;
  seoDescription: string | null;
  blocks: PublicStoryBlock[];
  readingMinutes: number;
}

interface RawTranslation {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  locale: Locale;
  publication_status: string;
  seo_title?: string | null;
  seo_description?: string | null;
  story_blocks?: RawBlock[];
}

interface RawBlock {
  id: string;
  block_type: BlockType;
  sort_order: number;
  data: Record<string, unknown> | null;
  settings: (BlockSettings & Record<string, unknown>) | null;
  visible: boolean;
}

interface RawMedia {
  url: string;
  width: number | null;
  height: number | null;
  focal_x: number | null;
  focal_y: number | null;
}

interface RawTaxonomyTranslation {
  name: string;
  slug: string;
  locale: Locale;
}

interface RawTaxonomyRelation {
  translations?: RawTaxonomyTranslation[];
}

interface RawTaxonomyJoin {
  category?: RawTaxonomyRelation | RawTaxonomyRelation[] | null;
  tag?: RawTaxonomyRelation | RawTaxonomyRelation[] | null;
}

interface RawStoryRecord {
  id: string;
  published_at: string;
  author_name: string | null;
  featured_home: boolean;
  featured_stories: boolean;
  cover_media: RawMedia | RawMedia[] | null;
  translations: RawTranslation | RawTranslation[] | null;
  story_categories: RawTaxonomyJoin[] | null;
  story_tags: RawTaxonomyJoin[] | null;
}

const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const selection = `id,published_at,author_name,featured_home,featured_stories,cover_media:media_assets!cover_media_id(url,width,height,focal_x,focal_y),translations:story_translations!inner(slug,title,excerpt,locale,publication_status),story_categories(category:categories(translations:category_translations(name,slug,locale))),story_tags(tag:tags(translations:tag_translations(name,slug,locale)))`;
const detailSelection = `id,published_at,author_name,featured_home,featured_stories,cover_media:media_assets!cover_media_id(url,width,height,focal_x,focal_y),translations:story_translations!inner(id,slug,title,excerpt,seo_title,seo_description,locale,publication_status,story_blocks(id,block_type,sort_order,data,settings,visible)),story_categories(category:categories(translations:category_translations(name,slug,locale))),story_tags(tag:tags(translations:tag_translations(name,slug,locale)))`;

function first<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function taxonomyForLocale(rows: RawTaxonomyJoin[] | null, key: "category" | "tag", locale: Locale) {
  return (rows ?? []).flatMap((row) => {
    const relation = first(row[key]);
    const translation = relation?.translations?.find((item) => item.locale === locale);
    return translation ? [{ name: translation.name, slug: translation.slug }] : [];
  });
}

function mapStories(records: RawStoryRecord[], locale: Locale): PublicStorySummary[] {
  return records.flatMap((record) => {
    const translation = first(record.translations);
    if (!translation) return [];
    const cover = first(record.cover_media);
    return [{
      id: record.id,
      slug: translation.slug,
      locale,
      title: translation.title,
      excerpt: translation.excerpt ?? "",
      authorName: record.author_name ?? null,
      publishedAt: record.published_at,
      coverImage: cover ? {
        url: cover.url,
        alt: translation.title,
        width: cover.width ?? null,
        height: cover.height ?? null,
        focalX: cover.focal_x ?? null,
        focalY: cover.focal_y ?? null,
      } : null,
      categories: taxonomyForLocale(record.story_categories, "category", locale),
      tags: taxonomyForLocale(record.story_tags, "tag", locale),
      featuredHome: record.featured_home === true,
      featuredStories: record.featured_stories === true,
      href: `/${locale}/stories/${translation.slug}`,
    }];
  });
}

export function calculateReadingMinutes(blocks: PublicStoryBlock[]) {
  const words = blocks.map((block) => JSON.stringify(block.data).replace(/<[^>]*>/g, " ")).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function getRenderableBlocks(blocks: PublicStoryBlock[]) {
  return blocks.filter((block) => block.visible !== false).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getStories(params: { locale: Locale; limit?: number; offset?: number; query?: string; categorySlug?: string; featuredHome?: boolean; featuredStories?: boolean; excludeId?: string }) {
  if (!configured()) return { items: [], total: 0 };
  try {
    const db = await createClient();
    const now = new Date().toISOString();
    let query = db.from("stories").select(selection, { count: "exact" })
      .eq("status", "published")
      .lte("published_at", now)
      .eq("translations.locale", params.locale)
      .eq("translations.publication_status", "published");
    if (params.featuredHome !== undefined) query = query.eq("featured_home", params.featuredHome);
    if (params.featuredStories !== undefined) query = query.eq("featured_stories", params.featuredStories);
    if (params.excludeId) query = query.neq("id", params.excludeId);
    if (params.query?.trim()) {
      query = query.or(`title.ilike.%${params.query.trim()}%,excerpt.ilike.%${params.query.trim()}%`, { foreignTable: "story_translations" });
    }
    const { data, count, error } = await query
      .order("published_at", { ascending: false })
      .range(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 9) - 1);
    if (error || !data) return { items: [], total: 0 };
    return { items: mapStories(data as unknown as RawStoryRecord[], params.locale), total: count ?? data.length };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getFeaturedStories(locale: Locale, target: "home" | "stories" = "home", limit = 3) {
  const result = target === "home"
    ? await getStories({ locale, limit, featuredHome: true })
    : await getStories({ locale, limit, featuredStories: true });
  return result.items;
}

export async function getStoryBySlug(params: { locale: Locale; slug: string }): Promise<PublicStoryDetail | null> {
  if (!configured()) return null;
  try {
    const db = await createClient();
    const { data, error } = await db.from("stories").select(detailSelection)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .eq("translations.locale", params.locale)
      .eq("translations.slug", params.slug)
      .eq("translations.publication_status", "published")
      .single();
    if (error || !data) return null;
    const record = data as unknown as RawStoryRecord;
    const summary = mapStories([record], params.locale)[0];
    const translation = first(record.translations);
    if (!summary || !translation) return null;
    const blocks = getRenderableBlocks((translation.story_blocks ?? []).map((block) => ({
      id: block.id,
      blockType: block.block_type,
      sortOrder: block.sort_order,
      data: block.data ?? {},
      settings: block.settings ?? {},
      visible: block.visible,
    })));
    return {
      ...summary,
      seoTitle: translation.seo_title ?? null,
      seoDescription: translation.seo_description ?? null,
      blocks,
      readingMinutes: calculateReadingMinutes(blocks),
    };
  } catch {
    return null;
  }
}

export async function searchStories(params: { locale: Locale; query: string; limit?: number }) {
  return (await getStories({ ...params, offset: 0 })).items;
}

export async function getStoryCategories(locale: Locale) {
  if (!configured()) return [];
  try {
    const db = await createClient();
    const { data } = await db.from("category_translations").select("name,slug,locale").eq("locale", locale).order("name");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicStorySlugs() {
  if (!configured()) return [];
  try {
    const db = await createClient();
    const { data } = await db.from("story_translations").select("slug,locale,publication_status,story:stories!inner(status,published_at)")
      .eq("publication_status", "published")
      .eq("story.status", "published")
      .lte("story.published_at", new Date().toISOString());
    return (data ?? []).map((item) => ({ slug: item.slug, locale: item.locale as Locale }));
  } catch {
    return [];
  }
}

export async function getRedirectBySourcePath(source: string) {
  if (!configured()) return null;
  try {
    const db = await createClient();
    const { data } = await db.from("redirects").select("destination_path,status_code").eq("source_path", source.toLowerCase()).eq("active", true).maybeSingle();
    return data;
  } catch {
    return null;
  }
}
