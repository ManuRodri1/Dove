"use server";

import { revalidatePath } from "next/cache";
import {
  archiveStory,
  createStory,
  saveStoryBlocks,
  updateStory,
  upsertStoryTranslation,
} from "@/lib/cms/admin-stories";
import { getAdminStory } from "@/lib/cms/admin-queries";
import type { StoryBlockInput } from "@/lib/cms/blocks/schema";

export type EditorPayload = {
  id?: string;
  story: {
    status: "draft" | "published" | "archived";
    author_name: string | null;
    cover_media_id: string | null;
    featured_home: boolean;
    featured_stories: boolean;
    published_at: string | null;
    scheduled_at: string | null;
  };
  translation: {
    id?: string;
    locale: "en" | "es";
    slug: string;
    title: string;
    excerpt: string;
    seo_title: string | null;
    seo_description: string | null;
    publication_status: "draft" | "published" | "archived";
  };
  blocks: StoryBlockInput[];
};

function refreshEditorialPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/stories");
  revalidatePath("/[locale]/stories", "page");
}

export async function saveEditorAction(payload: EditorPayload) {
  let storyId = payload.id;
  if (!storyId) {
    const created = await createStory(payload.story);
    if (!created.success || !created.data) return created;
    storyId = created.data.id;
  } else {
    const updated = await updateStory(storyId, payload.story);
    if (!updated.success) return updated;
  }

  const translation = await upsertStoryTranslation(storyId, payload.translation);
  if (!translation.success || !translation.data) return translation;
  const blocks = await saveStoryBlocks(translation.data.id, payload.blocks);
  if (!blocks.success) return blocks;

  refreshEditorialPaths();
  revalidatePath(`/${payload.translation.locale}/stories/${payload.translation.slug}`);
  return { success: true, data: { id: storyId } };
}

export async function setStoryStatusAction(id: string, status: "draft" | "published" | "archived") {
  if (status === "archived") {
    const result = await archiveStory(id);
    refreshEditorialPaths();
    return result;
  }
  const story = await getAdminStory(id);
  if (!story) return { success: false, error: "Story not found" };
  const result = await updateStory(id, {
    status,
    author_name: story.author_name,
    cover_media_id: story.cover_media_id,
    featured_home: story.featured_home,
    featured_stories: story.featured_stories,
    published_at: status === "published" ? story.published_at ?? new Date().toISOString() : story.published_at,
    scheduled_at: story.scheduled_at,
  });
  refreshEditorialPaths();
  return result;
}

export async function duplicateStoryAction(id: string) {
  const source = await getAdminStory(id);
  if (!source) return { success: false, error: "Story not found" };
  const created = await createStory({
    status: "draft",
    author_name: source.author_name,
    cover_media_id: source.cover_media_id,
    featured_home: false,
    featured_stories: false,
    published_at: null,
    scheduled_at: null,
  });
  if (!created.success || !created.data) return created;
  const suffix = created.data.id.slice(0, 6);
  for (const translation of source.translations) {
    const saved = await upsertStoryTranslation(created.data.id, {
      locale: translation.locale,
      slug: `${translation.slug}-copy-${suffix}`,
      title: `${translation.title} (Copy)`,
      excerpt: translation.excerpt,
      seo_title: translation.seo_title,
      seo_description: translation.seo_description,
      publication_status: "draft",
    });
    if (saved.success && saved.data) {
      await saveStoryBlocks(saved.data.id, translation.story_blocks.map((block, index) => ({
        block_type: block.block_type as StoryBlockInput["block_type"],
        sort_order: index,
        data: block.data as StoryBlockInput["data"],
        settings: block.settings,
        visible: block.visible,
      })));
    }
  }
  refreshEditorialPaths();
  return { success: true, data: { id: created.data.id } };
}
