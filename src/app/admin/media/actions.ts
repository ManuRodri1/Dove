"use server";

import { revalidatePath } from "next/cache";
import { registerMediaAsset, type DoveMediaFolder } from "@/lib/cms/media";
import { createClient } from "@/lib/supabase/server";

export async function getMediaUploadSignatureAction(folder: DoveMediaFolder) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { success: false, error: "Unauthorized" };

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (sessionError || !accessToken || !supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/dove-cloudinary-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, apikey: supabaseAnonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = payload && typeof payload.error === "string" ? payload.error : `Upload signature failed (${response.status}).`;
      return { success: false, error };
    }
    return { success: true, data: payload };
  } catch {
    return { success: false, error: "Could not reach the upload service." };
  }
}

export async function registerMediaUploadAction(input: {
  url: string; publicId: string; mimeType: string | null; width: number | null; height: number | null;
  bytes: number | null; originalFilename: string | null;
}) {
  const result = await registerMediaAsset({ provider: "cloudinary", url: input.url, publicId: input.publicId, mimeType: input.mimeType, width: input.width, height: input.height, bytes: input.bytes, originalFilename: input.originalFilename, source: "cloudinary_upload" });
  if (result.success) { revalidatePath("/admin"); revalidatePath("/admin/media"); revalidatePath("/admin/stories"); }
  return result;
}
