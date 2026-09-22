import "server-only";

import type { Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import type { BlockSettings } from "./blocks/schema";
import type { PublicStorySummary } from "./public-stories";
import { canDisplayProgress, comparePastCampaigns, deriveCampaignLifecycle, type CampaignLifecycle } from "./campaign-state";

export { canDisplayProgress, comparePastCampaigns, deriveCampaignLifecycle } from "./campaign-state";
export type { CampaignLifecycle } from "./campaign-state";

export type CampaignStatus = "draft" | "published" | "archived";
export type CampaignBlockType =
  | "heading" | "rich_text" | "image" | "image_text_split" | "gallery" | "quote"
  | "youtube" | "callout" | "button_group" | "section_intro" | "divider" | "spacer"
  | "campaign_stats" | "participation_options";

export type PublicCampaignBlock = {
  id: string;
  blockType: CampaignBlockType;
  sortOrder: number;
  data: Record<string, unknown>;
  settings: BlockSettings & Record<string, unknown>;
  visible?: boolean;
};

export type PublicCampaign = {
  id: string;
  locale: Locale;
  slug: string;
  title: string;
  eyebrow: string | null;
  headline: string | null;
  excerpt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  status: CampaignStatus;
  lifecycle: CampaignLifecycle;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  goalAmount: number | null;
  currency: string;
  raisedAmount: number | null;
  raisedAmountIsFinal: boolean;
  progressSource: "none" | "manual" | "external" | "embed" | "api";
  progressUpdatedAt: string | null;
  donationUrl: string | null;
  featuredHome: boolean;
  featuredCampaigns: boolean;
  publishedAt: string;
  createdAt: string;
  heroImage: { url: string; width: number | null; height: number | null; focalX: number | null; focalY: number | null } | null;
  href: string;
};

export type PublicCampaignDetail = PublicCampaign & {
  blocks: PublicCampaignBlock[];
  relatedStories: Array<PublicStorySummary & { relationshipType: "announcement" | "update" | "result" | "related"; sortOrder: number }>;
};

type Raw = Record<string, any>;
const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const selection = "id,status,start_date,end_date,lifecycle_override,location,goal_amount,currency,raised_amount,raised_amount_is_final,progress_source,progress_updated_at,donation_url,featured_home,featured_campaigns,published_at,created_at,hero_media:media_assets!hero_media_id(url,width,height,focal_x,focal_y),translations:campaign_translations!inner(id,locale,slug,title,eyebrow,headline,excerpt,seo_title,seo_description,publication_status)";

function first<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function mapCampaign(row: Raw, locale: Locale): PublicCampaign | null {
  const translation = first<Raw>(row.translations);
  if (!translation) return null;
  const hero = first<Raw>(row.hero_media);
  const campaign: PublicCampaign = {
    id: row.id, locale, slug: translation.slug, title: translation.title,
    eyebrow: translation.eyebrow ?? null, headline: translation.headline ?? null,
    excerpt: translation.excerpt ?? "", seoTitle: translation.seo_title ?? null,
    seoDescription: translation.seo_description ?? null, status: row.status,
    lifecycle: "active", startDate: row.start_date ?? null, endDate: row.end_date ?? null,
    location: row.location ?? null, goalAmount: row.goal_amount === null ? null : Number(row.goal_amount),
    currency: row.currency ?? "USD", raisedAmount: row.raised_amount === null ? null : Number(row.raised_amount),
    raisedAmountIsFinal: row.raised_amount_is_final === true, progressSource: row.progress_source ?? "none",
    progressUpdatedAt: row.progress_updated_at ?? null, donationUrl: row.donation_url ?? null,
    featuredHome: row.featured_home === true, featuredCampaigns: row.featured_campaigns === true,
    publishedAt: row.published_at, createdAt: row.created_at,
    heroImage: hero ? { url: hero.url, width: hero.width ?? null, height: hero.height ?? null, focalX: hero.focal_x ?? null, focalY: hero.focal_y ?? null } : null,
    href: `/${locale}/campaigns/${translation.slug}`,
  };
  campaign.lifecycle = deriveCampaignLifecycle({ ...campaign, lifecycleOverride: row.lifecycle_override });
  return campaign;
}

export async function getCampaigns(locale: Locale): Promise<PublicCampaign[]> {
  if (!configured()) return [];
  try {
    const db = (await createClient()) as any;
    const now = new Date().toISOString();
    const { data, error } = await db.from("campaigns").select(selection)
      .eq("status", "published").lte("published_at", now)
      .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
      .eq("translations.locale", locale).eq("translations.publication_status", "published");
    if (error) return [];
    return (data ?? []).map((row: Raw) => mapCampaign(row, locale)).filter(Boolean) as PublicCampaign[];
  } catch { return []; }
}

export async function getCampaignsByLifecycle(locale: Locale, lifecycle: CampaignLifecycle) {
  const items = (await getCampaigns(locale)).filter((item) => item.lifecycle === lifecycle);
  return lifecycle === "ended" ? items.sort(comparePastCampaigns) : items.sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}
export const getActiveCampaigns = (locale: Locale) => getCampaignsByLifecycle(locale, "active");
export const getUpcomingCampaigns = (locale: Locale) => getCampaignsByLifecycle(locale, "upcoming");
export const getPastCampaigns = (locale: Locale) => getCampaignsByLifecycle(locale, "ended");
export async function getLatestPastCampaigns(locale: Locale, limit = 6) { return (await getPastCampaigns(locale)).slice(0, limit); }
export async function getFeaturedCampaign(locale: Locale) {
  const campaigns = await getCampaigns(locale);
  return campaigns.find((item) => item.featuredHome && item.lifecycle === "active") ?? campaigns.find((item) => item.featuredCampaigns) ?? null;
}

export async function getCampaignRelatedStories(campaignId: string, locale: Locale) {
  if (!configured()) return [];
  const db = (await createClient()) as any;
  const { data: links } = await db.from("campaign_story_links").select("story_id,relationship_type,sort_order").eq("campaign_id", campaignId).order("sort_order");
  if (!links?.length) return [];
  const ids = links.map((link: Raw) => link.story_id);
  const { data: stories } = await db.from("stories").select("id,published_at,author_name,featured_home,featured_stories,cover_media:media_assets!cover_media_id(url,width,height,focal_x,focal_y),translations:story_translations!inner(slug,title,excerpt,locale,publication_status)")
    .in("id", ids).eq("status", "published").lte("published_at", new Date().toISOString())
    .eq("translations.locale", locale).eq("translations.publication_status", "published");
  const byId = new Map((stories ?? []).map((story: Raw) => [story.id, story]));
  return links.flatMap((link: Raw) => {
    const story = byId.get(link.story_id) as Raw | undefined;
    const translation = story ? first<Raw>(story.translations) : null;
    if (!story || !translation) return [];
    const cover = first<Raw>(story.cover_media);
    return [{ id: story.id, slug: translation.slug, locale, title: translation.title, excerpt: translation.excerpt ?? "", authorName: story.author_name ?? null, publishedAt: story.published_at,
      coverImage: cover ? { url: cover.url, alt: translation.title, width: cover.width ?? null, height: cover.height ?? null, focalX: cover.focal_x ?? null, focalY: cover.focal_y ?? null } : null,
      categories: [], tags: [], featuredHome: story.featured_home === true, featuredStories: story.featured_stories === true,
      href: `/${locale}/stories/${translation.slug}`, relationshipType: link.relationship_type, sortOrder: link.sort_order }];
  });
}

export async function getCampaignBySlug(locale: Locale, slug: string): Promise<PublicCampaignDetail | null> {
  if (!configured()) return null;
  try {
    const db = (await createClient()) as any;
    const now = new Date().toISOString();
    const { data, error } = await db.from("campaigns").select(`${selection},campaign_translations!inner(campaign_blocks(id,block_type,sort_order,data,settings,visible))`)
      .eq("status", "published").lte("published_at", now).or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
      .eq("translations.locale", locale).eq("translations.slug", slug).eq("translations.publication_status", "published").maybeSingle();
    if (error || !data) return null;
    const campaign = mapCampaign(data, locale);
    if (!campaign) return null;
    const translation = first<Raw>(data.campaign_translations);
    const blocks = (translation?.campaign_blocks ?? []).filter((block: Raw) => block.visible !== false).sort((a: Raw, b: Raw) => a.sort_order - b.sort_order).map((block: Raw) => ({ id: block.id, blockType: block.block_type, sortOrder: block.sort_order, data: block.data ?? {}, settings: block.settings ?? {}, visible: block.visible }));
    return { ...campaign, blocks, relatedStories: await getCampaignRelatedStories(campaign.id, locale) };
  } catch { return null; }
}

export async function getCampaignTranslations(campaignId: string): Promise<Array<{ locale: Locale; slug: string }>> {
  if (!configured()) return [];
  try {
    const db = (await createClient()) as any;
    const { data } = await db.from("campaign_translations")
      .select("locale,slug")
      .eq("campaign_id", campaignId)
      .eq("publication_status", "published");
    return (data ?? []).map((t: Raw) => ({ locale: t.locale as Locale, slug: t.slug }));
  } catch {
    return [];
  }
}

export async function getPublicCampaignSlugs(): Promise<Array<{ locale: Locale; slug: string; lastModified?: string }>> {
  if (!configured()) return [] as Array<{ locale: Locale; slug: string; lastModified?: string }>;
  const db = (await createClient()) as any;
  const { data, error } = await db.from("campaign_translations")
    .select("locale,slug,updated_at,campaign:campaigns!inner(status,published_at,scheduled_at,updated_at)")
    .eq("publication_status", "published")
    .eq("campaign.status", "published")
    .lte("campaign.published_at", new Date().toISOString());
  return error ? [] : (data ?? []).map((item: Raw) => ({
    locale: item.locale as Locale,
    slug: item.slug as string,
    lastModified: item.updated_at || item.campaign?.updated_at || item.campaign?.published_at || undefined,
  }));
}
