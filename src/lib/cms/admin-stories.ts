import "server-only";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import {
  validateStoryInput,
  validateTranslationInput,
  type StoryInput,
  type TranslationInput,
} from "./validation";
import {
  validateBlockData,
  validateBlockSettings,
  type StoryBlockInput,
} from "./blocks/schema";
import type { UserRole } from "../supabase/database.types";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get the currently authenticated user and verify active staff profile
 */
export async function getStaffSession(): Promise<{
  userId: string;
  role: UserRole;
  displayName: string;
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, display_name, active")
      .eq("id", user.id)
      .eq("active", true)
      .single();

    if (profileError || !profile) return null;

    return {
      userId: profile.id,
      role: profile.role,
      displayName: profile.display_name,
    };
  } catch {
    return null;
  }
}

/**
 * Record an audit log entry
 */
async function recordAudit(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata: metadata as unknown as Record<string, string>,
    });
  } catch {
    // Non-blocking for audit logging failures
  }
}

/**
 * Create a new Story record
 */
export async function createStory(input: StoryInput): Promise<ActionResult<{ id: string }>> {
  const staff = await getStaffSession();
  if (!staff) return { success: false, error: "Unauthorized" };

  const validation = validateStoryInput(input);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error || "Invalid input" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .insert({
        status: validation.data.status,
        author_id: validation.data.author_id,
        author_name: validation.data.author_name,
        cover_media_id: validation.data.cover_media_id,
        featured_home: validation.data.featured_home,
        featured_stories: validation.data.featured_stories,
        published_at: validation.data.published_at,
        scheduled_at: validation.data.scheduled_at,
        created_by: staff.userId,
        updated_by: staff.userId,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "Failed to create story record" };
    }

    await recordAudit(staff.userId, "create", "story", data.id, {
      status: validation.data.status,
    });

    return { success: true, data: { id: data.id } };
  } catch {
    return { success: false, error: "Server error creating story" };
  }
}

/**
 * Update an existing story record
 */
export async function updateStory(
  id: string,
  input: Partial<StoryInput>
): Promise<ActionResult> {
  const staff = await getStaffSession();
  if (!staff) return { success: false, error: "Unauthorized" };

  const validation = validateStoryInput(input);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error || "Invalid input" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("stories")
      .update({
        status: validation.data.status,
        author_id: validation.data.author_id,
        author_name: validation.data.author_name,
        cover_media_id: validation.data.cover_media_id,
        featured_home: validation.data.featured_home,
        featured_stories: validation.data.featured_stories,
        published_at: validation.data.published_at,
        scheduled_at: validation.data.scheduled_at,
        updated_by: staff.userId,
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Failed to update story" };
    }

    await recordAudit(staff.userId, "update", "story", id, { updates: input });

    // Invalidate home and stories caches
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/stories", "page");

    return { success: true };
  } catch {
    return { success: false, error: "Server error updating story" };
  }
}

/**
 * Soft delete (archive) a story
 */
export async function archiveStory(id: string): Promise<ActionResult> {
  const staff = await getStaffSession();
  if (!staff) return { success: false, error: "Unauthorized" };

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("stories")
      .update({
        status: "archived",
        archived_at: now,
        updated_by: staff.userId,
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Failed to archive story" };
    }

    await recordAudit(staff.userId, "archive", "story", id);

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/stories", "page");

    return { success: true };
  } catch {
    return { success: false, error: "Server error archiving story" };
  }
}

/**
 * Upsert a localized translation for a story
 */
export async function upsertStoryTranslation(
  storyId: string,
  input: TranslationInput
): Promise<ActionResult<{ id: string }>> {
  const staff = await getStaffSession();
  if (!staff) return { success: false, error: "Unauthorized" };

  const validation = validateTranslationInput(input);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error || "Invalid translation input" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("story_translations")
      .upsert(
        {
          story_id: storyId,
          locale: validation.data.locale,
          slug: validation.data.slug,
          title: validation.data.title,
          excerpt: validation.data.excerpt || "",
          seo_title: validation.data.seo_title,
          seo_description: validation.data.seo_description,
          publication_status: validation.data.publication_status || "draft",
        },
        { onConflict: "story_id,locale" }
      )
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "Failed to save translation: " + error?.message };
    }

    await recordAudit(staff.userId, "upsert_translation", "story_translation", data.id, {
      locale: validation.data.locale,
      slug: validation.data.slug,
    });

    revalidatePath(`/${validation.data.locale}/stories/${validation.data.slug}`);

    return { success: true, data: { id: data.id } };
  } catch {
    return { success: false, error: "Server error saving translation" };
  }
}

/**
 * Replace / save ordered content blocks for a translation
 */
export async function saveStoryBlocks(
  translationId: string,
  blocks: StoryBlockInput[]
): Promise<ActionResult> {
  const staff = await getStaffSession();
  if (!staff) return { success: false, error: "Unauthorized" };

  // Validate all blocks before performing any write
  const validatedBlocks: Array<{
    story_translation_id: string;
    block_type: string;
    sort_order: number;
    data: Record<string, unknown>;
    settings: Record<string, unknown>;
    visible: boolean;
  }> = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const dataCheck = validateBlockData(b.block_type, b.data);
    if (!dataCheck.valid) {
      return {
        success: false,
        error: `Block #${i + 1} (${b.block_type}) error: ${dataCheck.error}`,
      };
    }

    const settingsCheck = validateBlockSettings(b.settings);
    if (!settingsCheck.valid) {
      return {
        success: false,
        error: `Block #${i + 1} settings error: ${settingsCheck.error}`,
      };
    }

    validatedBlocks.push({
      story_translation_id: translationId,
      block_type: b.block_type,
      sort_order: b.sort_order ?? i,
      data: (dataCheck.sanitizedData ?? {}) as Record<string, unknown>,
      settings: (b.settings ?? {}) as Record<string, unknown>,
      visible: b.visible !== false,
    });
  }

  try {
    const supabase = await createClient();

    // Transaction-like replacement: delete existing blocks and re-insert validated blocks
    const { error: deleteError } = await supabase
      .from("story_blocks")
      .delete()
      .eq("story_translation_id", translationId);

    if (deleteError) {
      return { success: false, error: "Failed to reset translation blocks" };
    }

    if (validatedBlocks.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await supabase.from("story_blocks").insert(validatedBlocks as any);

      if (insertError) {
        return { success: false, error: "Failed to save new blocks" };
      }
    }

    await recordAudit(staff.userId, "save_blocks", "story_translation", translationId, {
      blockCount: validatedBlocks.length,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Server error saving blocks" };
  }
}
