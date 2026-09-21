import { createClient } from "@/lib/supabase/client";

export type DoveMediaFolder = "uploads" | "stories" | "campaigns";

export type CloudinaryUploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

export async function getCloudinaryUploadSignature(folder: DoveMediaFolder = "uploads") {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("dove-cloudinary-signature", {
    body: { folder },
  });

  if (error) return { success: false as const, error: error.message };

  const payload = data as Partial<CloudinaryUploadSignature> & { error?: unknown } | null;
  if (!payload || typeof payload.signature !== "string" || typeof payload.apiKey !== "string" || typeof payload.cloudName !== "string" || typeof payload.folder !== "string" || typeof payload.timestamp !== "number") {
    return {
      success: false as const,
      error: typeof payload?.error === "string" ? payload.error : "Upload is not configured.",
    };
  }

  return { success: true as const, data: payload as CloudinaryUploadSignature };
}
