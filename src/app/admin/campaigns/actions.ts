"use server";

import { saveCampaign, saveCampaignBlocks, saveCampaignStoryLinks, saveCampaignTranslation, setCampaignStatus, type CampaignInput, type CampaignRelationship, type CampaignTranslationInput } from "@/lib/cms/admin-campaigns";
import type { StoryBlockInput } from "@/lib/cms/blocks/schema";

export type CampaignEditorPayload = { id?: string; campaign: CampaignInput; translation: CampaignTranslationInput; blocks: StoryBlockInput[]; storyLinks: Array<{ story_id: string; relationship_type: CampaignRelationship; sort_order: number }> };
export async function saveCampaignEditorAction(payload: CampaignEditorPayload) {
  const campaign = await saveCampaign(payload.id, payload.campaign); if (!campaign.success || !campaign.data) return campaign;
  const translation = await saveCampaignTranslation(campaign.data.id, payload.translation); if (!translation.success || !translation.data) return translation;
  const blocks = await saveCampaignBlocks(translation.data.id, payload.blocks); if (!blocks.success) return blocks;
  const links = await saveCampaignStoryLinks(campaign.data.id, payload.storyLinks); if (!links.success) return links;
  return { success: true, data: { id: campaign.data.id } };
}
export async function setCampaignStatusAction(id: string, status: "draft" | "published" | "archived") { return setCampaignStatus(id, status); }
