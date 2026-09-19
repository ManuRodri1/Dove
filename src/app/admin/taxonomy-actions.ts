"use server";

import { revalidatePath } from "next/cache";
import { getStaffSession } from "@/lib/cms/admin-stories";
import { slugify } from "@/lib/cms/validation";
import { createClient } from "@/lib/supabase/server";

export type TaxonomyPayload = { id?: string; internalKey: string; enName: string; enSlug: string; esName: string; esSlug: string };

export async function saveTaxonomyAction(kind: "category" | "tag", input: TaxonomyPayload) {
  if (!(await getStaffSession())) return { success: false, error: "Unauthorized" };
  const enName = input.enName.trim();
  if (!enName) return { success: false, error: "An English name is required." };
  const internalKey = slugify(input.internalKey || enName);
  const enSlug = slugify(input.enSlug || enName);
  const esName = input.esName.trim();
  const esSlug = esName ? slugify(input.esSlug || esName) : "";
  if (!internalKey || !enSlug) return { success: false, error: "A valid internal key and English slug are required." };
  const db = await createClient();
  let id = input.id;
  if (kind === "category") {
    if (id) { const { error } = await db.from("categories").update({ internal_key: internalKey }).eq("id", id); if (error) return { success: false, error: error.message }; }
    else { const { data, error } = await db.from("categories").insert({ internal_key: internalKey }).select("id").single(); if (error || !data) return { success: false, error: error?.message ?? "Could not create category." }; id = data.id; }
    const { error: enError } = await db.from("category_translations").upsert({ category_id: id, locale: "en", name: enName, slug: enSlug }, { onConflict: "category_id,locale" });
    if (enError) return { success: false, error: enError.message };
    if (esName) { const { error } = await db.from("category_translations").upsert({ category_id: id, locale: "es", name: esName, slug: esSlug }, { onConflict: "category_id,locale" }); if (error) return { success: false, error: error.message }; }
  } else {
    if (id) { const { error } = await db.from("tags").update({ internal_key: internalKey }).eq("id", id); if (error) return { success: false, error: error.message }; }
    else { const { data, error } = await db.from("tags").insert({ internal_key: internalKey }).select("id").single(); if (error || !data) return { success: false, error: error?.message ?? "Could not create tag." }; id = data.id; }
    const { error: enError } = await db.from("tag_translations").upsert({ tag_id: id, locale: "en", name: enName, slug: enSlug }, { onConflict: "tag_id,locale" });
    if (enError) return { success: false, error: enError.message };
    if (esName) { const { error } = await db.from("tag_translations").upsert({ tag_id: id, locale: "es", name: esName, slug: esSlug }, { onConflict: "tag_id,locale" }); if (error) return { success: false, error: error.message }; }
  }
  revalidatePath(`/admin/${kind === "category" ? "categories" : "tags"}`); revalidatePath("/admin/stories");
  return { success: true };
}

export async function deleteTaxonomyAction(kind: "category" | "tag", id: string) {
  if (!(await getStaffSession())) return { success: false, error: "Unauthorized" };
  const db = await createClient();
  const result = kind === "category" ? await db.from("categories").delete().eq("id", id) : await db.from("tags").delete().eq("id", id);
  if (result.error) return { success: false, error: result.error.message };
  revalidatePath(`/admin/${kind === "category" ? "categories" : "tags"}`); revalidatePath("/admin/stories");
  return { success: true };
}
