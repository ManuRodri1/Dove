import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getStaffSession } from "./admin-stories";
import { validateBlockData, validateBlockSettings, type StoryBlockInput } from "./blocks/schema";

export type CampaignRelationship = "announcement" | "update" | "result" | "related";
export type AdminCampaignTranslation = { id: string; locale: "en" | "es"; slug: string; title: string; eyebrow: string | null; headline: string | null; excerpt: string; seo_title: string | null; seo_description: string | null; publication_status: "draft" | "published" | "archived"; campaign_blocks: Array<{ id: string; block_type: string; sort_order: number; data: Record<string, unknown>; settings: Record<string, unknown>; visible: boolean }> };
export type AdminCampaign = { id: string; status: "draft" | "published" | "archived"; hero_media_id: string | null; start_date: string | null; end_date: string | null; lifecycle_override: "upcoming" | "active" | "ended" | null; location: string | null; goal_amount: number | null; currency: string; raised_amount: number | null; raised_amount_is_final: boolean; progress_source: "none" | "manual" | "external" | "embed" | "api"; progress_updated_at: string | null; external_provider: "network_for_good" | "bonterra" | "other" | null; external_campaign_id: string | null; donation_url: string | null; featured_home: boolean; featured_campaigns: boolean; published_at: string | null; scheduled_at: string | null; archived_at: string | null; created_at: string; updated_at: string; hero_media: any; translations: AdminCampaignTranslation[]; campaign_story_links: Array<{ story_id: string; relationship_type: CampaignRelationship; sort_order: number }>; campaign_sources: Array<{ id: string; source_type: string; source_url: string | null; source_title: string | null; imported_at: string; metadata: Record<string, unknown> }> };
export type CampaignInput = Omit<AdminCampaign, "id" | "created_at" | "updated_at" | "hero_media" | "translations" | "campaign_story_links" | "campaign_sources" | "archived_at">;
export type CampaignTranslationInput = Omit<AdminCampaignTranslation, "id" | "campaign_blocks">;

async function staff() { return getStaffSession(); }
async function audit(userId: string, action: string, entityId: string, metadata: Record<string, unknown> = {}) { const db = (await createClient()) as any; await db.from("audit_log").insert({ user_id: userId, action, entity_type: "campaign", entity_id: entityId, metadata }); }
function refresh(locale?: string, slug?: string) { revalidatePath("/admin"); revalidatePath("/admin/campaigns"); revalidatePath("/[locale]/campaigns", "page"); if (locale && slug) revalidatePath(`/${locale}/campaigns/${slug}`); }

function validCampaign(input: CampaignInput) {
  if (input.start_date && input.end_date && input.end_date < input.start_date) return "End date cannot be before start date.";
  if (input.goal_amount !== null && input.goal_amount <= 0) return "Goal amount must be greater than zero.";
  if (input.raised_amount !== null && input.progress_source === "none") return "Choose a trustworthy progress source before entering an amount raised.";
  if (input.donation_url && !/^https:\/\//.test(input.donation_url)) return "Donation URL must use HTTPS.";
  return null;
}

export async function listAdminCampaigns(): Promise<AdminCampaign[]> {
  if (!(await staff())) return [];
  const db = (await createClient()) as any;
  const { data, error } = await db.from("campaigns").select("*,hero_media:media_assets!hero_media_id(id,url,width,height,provider),translations:campaign_translations(id,locale,slug,title,eyebrow,headline,excerpt,seo_title,seo_description,publication_status,campaign_blocks(id,block_type,sort_order,data,settings,visible)),campaign_story_links(story_id,relationship_type,sort_order),campaign_sources(id,source_type,source_url,source_title,imported_at,metadata)").order("updated_at", { ascending: false });
  return error ? [] : data ?? [];
}
export async function getAdminCampaign(id: string) { return (await listAdminCampaigns()).find((item) => item.id === id) ?? null; }

export async function saveCampaign(id: string | undefined, input: CampaignInput) {
  const session = await staff(); if (!session) return { success: false, error: "Unauthorized" };
  const invalid = validCampaign(input); if (invalid) return { success: false, error: invalid };
  const db = (await createClient()) as any;
  const values = { ...input, hero_media_id: input.hero_media_id || null, location: input.location || null, donation_url: input.donation_url || null, external_campaign_id: input.external_campaign_id || null, created_by: session.userId, updated_by: session.userId };
  const request = id ? db.from("campaigns").update(values).eq("id", id).select("id").single() : db.from("campaigns").insert(values).select("id").single();
  const { data, error } = await request; if (error || !data) return { success: false, error: error?.message ?? "Unable to save campaign" };
  await audit(session.userId, id ? "update" : "create", data.id, { status: input.status }); refresh();
  return { success: true, data: { id: data.id as string } };
}

export async function saveCampaignTranslation(campaignId: string, input: CampaignTranslationInput) {
  const session = await staff(); if (!session) return { success: false, error: "Unauthorized" };
  if (!input.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) return { success: false, error: "Title and a valid lowercase slug are required." };
  const db = (await createClient()) as any;
  const { data, error } = await db.from("campaign_translations").upsert({ campaign_id: campaignId, ...input }, { onConflict: "campaign_id,locale" }).select("id").single();
  if (error || !data) return { success: false, error: error?.message ?? "Unable to save translation" };
  await audit(session.userId, "upsert_translation", campaignId, { locale: input.locale }); refresh(input.locale, input.slug);
  return { success: true, data: { id: data.id as string } };
}

export async function saveCampaignBlocks(translationId: string, blocks: StoryBlockInput[]) {
  const session = await staff(); if (!session) return { success: false, error: "Unauthorized" };
  const rows = [] as any[];
  for (const [index, block] of blocks.entries()) {
    const data = validateBlockData(block.block_type, block.data); const settings = validateBlockSettings(block.settings);
    if (!data.valid || !settings.valid) return { success: false, error: data.error ?? settings.error ?? `Invalid block ${index + 1}` };
    rows.push({ campaign_translation_id: translationId, block_type: block.block_type, sort_order: index, data: data.sanitizedData ?? {}, settings: block.settings ?? {}, visible: block.visible !== false });
  }
  const db = (await createClient()) as any;
  const { error: removeError } = await db.from("campaign_blocks").delete().eq("campaign_translation_id", translationId); if (removeError) return { success: false, error: removeError.message };
  if (rows.length) { const { error } = await db.from("campaign_blocks").insert(rows); if (error) return { success: false, error: error.message }; }
  await audit(session.userId, "save_blocks", translationId, { blockCount: rows.length }); return { success: true };
}

export async function saveCampaignStoryLinks(campaignId: string, links: Array<{ story_id: string; relationship_type: CampaignRelationship; sort_order: number }>) {
  const session = await staff(); if (!session) return { success: false, error: "Unauthorized" };
  const db = (await createClient()) as any; const { error: removeError } = await db.from("campaign_story_links").delete().eq("campaign_id", campaignId); if (removeError) return { success: false, error: removeError.message };
  if (links.length) { const { error } = await db.from("campaign_story_links").insert(links.map((link, index) => ({ campaign_id: campaignId, ...link, sort_order: index }))); if (error) return { success: false, error: error.message }; }
  await audit(session.userId, "save_story_links", campaignId, { count: links.length }); refresh(); return { success: true };
}

export async function setCampaignStatus(id: string, status: "draft" | "published" | "archived") {
  const session = await staff(); if (!session) return { success: false, error: "Unauthorized" };
  const db = (await createClient()) as any; const now = new Date().toISOString();
  const { error } = await db.from("campaigns").update({ status, updated_by: session.userId, published_at: status === "published" ? now : undefined, archived_at: status === "archived" ? now : null }).eq("id", id);
  if (error) return { success: false, error: error.message };
  await audit(session.userId, status, id); refresh(); return { success: true };
}
