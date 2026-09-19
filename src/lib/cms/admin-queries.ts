import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getStaffSession } from "./admin-stories";

export type AdminTranslation = {
  id: string;
  locale: "en" | "es";
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string | null;
  seo_description: string | null;
  publication_status: "draft" | "published" | "archived";
  story_blocks: Array<{
    id: string;
    block_type: string;
    sort_order: number;
    data: Record<string, unknown>;
    settings: Record<string, unknown>;
    visible: boolean;
  }>;
};

export type AdminStory = {
  id: string;
  status: "draft" | "published" | "archived";
  author_name: string | null;
  cover_media_id: string | null;
  featured_home: boolean;
  featured_stories: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  cover_media: AdminMediaAsset | AdminMediaAsset[] | null;
  translations: AdminTranslation[];
};

export type AdminStorySummary = Omit<AdminStory, "cover_media_id" | "translations"> & {
  translations: Array<Pick<AdminTranslation, "id" | "locale" | "slug" | "title" | "excerpt" | "publication_status">>;
};

export type AdminMediaAsset = {
  id: string;
  provider: "wix" | "cloudinary";
  url: string;
  public_id: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  original_filename: string | null;
  source: string | null;
  created_at: string;
};

export type AdminTaxonomyItem = {
  id: string;
  internal_key: string;
  created_at: string;
  updated_at: string;
  translations: Array<{ id: string; locale: "en" | "es"; name: string; slug: string }>;
};

async function hasStaffAccess() {
  return Boolean(await getStaffSession());
}

export async function listAdminStories(): Promise<AdminStorySummary[]> {
  if (!(await hasStaffAccess())) return [];
  const db = await createClient();
  const { data, error } = await db
    .from("stories")
    .select("id,status,author_name,featured_home,featured_stories,published_at,scheduled_at,created_at,updated_at,cover_media:media_assets!cover_media_id(id,url,width,height,provider,public_id,mime_type,bytes,original_filename,source,created_at),translations:story_translations(id,locale,slug,title,excerpt,publication_status)")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as unknown as AdminStorySummary[];
}

export async function getAdminStory(id: string): Promise<AdminStory | null> {
  if (!(await hasStaffAccess())) return null;
  const db = await createClient();
  const { data, error } = await db
    .from("stories")
    .select("id,status,author_name,cover_media_id,featured_home,featured_stories,published_at,scheduled_at,created_at,updated_at,cover_media:media_assets!cover_media_id(id,url,width,height,provider,public_id,mime_type,bytes,original_filename,source,created_at),translations:story_translations(id,locale,slug,title,excerpt,seo_title,seo_description,publication_status,story_blocks(id,block_type,sort_order,data,settings,visible))")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as AdminStory;
}

export async function listMediaAssets(query = ""): Promise<AdminMediaAsset[]> {
  if (!(await hasStaffAccess())) return [];
  const db = await createClient();
  let request = db
    .from("media_assets")
    .select("id,provider,url,public_id,mime_type,width,height,bytes,original_filename,source,created_at")
    .order("created_at", { ascending: false })
    .limit(250);
  const clean = query.trim().replaceAll(",", " ");
  if (clean) request = request.or(`original_filename.ilike.%${clean}%,source.ilike.%${clean}%,public_id.ilike.%${clean}%`);
  const { data, error } = await request;
  if (error) return [];
  return (data ?? []) as AdminMediaAsset[];
}

export async function listTaxonomy(kind: "category" | "tag"): Promise<AdminTaxonomyItem[]> {
  if (!(await hasStaffAccess())) return [];
  const db = await createClient();
  if (kind === "category") {
    const { data } = await db
      .from("categories")
      .select("id,internal_key,created_at,updated_at,translations:category_translations(id,locale,name,slug)")
      .order("internal_key");
    return (data ?? []) as unknown as AdminTaxonomyItem[];
  }
  const { data } = await db
    .from("tags")
    .select("id,internal_key,created_at,updated_at,translations:tag_translations(id,locale,name,slug)")
    .order("internal_key");
  return (data ?? []) as unknown as AdminTaxonomyItem[];
}

export function getAdminNow() {
  return Date.now();
}

export async function getAdminDashboard() {
  const stories = await listAdminStories();
  const db = await createClient();
  const { count: mediaCount } = await db.from("media_assets").select("id", { count: "exact", head: true });
  const now = Date.now();
  const isScheduled = (story: AdminStorySummary) =>
    story.status !== "archived" && Boolean(story.scheduled_at) && Date.parse(story.scheduled_at as string) > now;
  const titleFor = (story: AdminStorySummary) =>
    story.translations.find((translation) => translation.locale === "en")?.title ??
    story.translations[0]?.title ??
    "Untitled story";
  const toBrief = (story: AdminStorySummary) => ({
    id: story.id,
    title: titleFor(story),
    status: isScheduled(story) ? "scheduled" : story.status,
    updatedAt: story.updated_at,
    publishedAt: story.published_at,
  });

  return {
    counts: {
      total: stories.length,
      published: stories.filter((story) => story.status === "published").length,
      drafts: stories.filter((story) => story.status === "draft" && !isScheduled(story)).length,
      scheduled: stories.filter(isScheduled).length,
      media: mediaCount ?? 0,
    },
    recentStories: stories
      .filter((story) => story.status === "published")
      .sort((a, b) => Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? ""))
      .slice(0, 5)
      .map(toBrief),
    recentlyUpdated: [...stories]
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
      .slice(0, 5)
      .map(toBrief),
  };
}
