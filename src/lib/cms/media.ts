import "server-only";
import crypto from "crypto";
import { createClient } from "../supabase/server";
import type { MediaProvider } from "../supabase/database.types";
import { getStaffSession } from "./admin-stories";

export const CLOUDINARY_DOVE_NAMESPACE = "dove-youth-development";
export const APPROVED_MEDIA_FOLDERS = [
  "stories",
  "news",
  "covers",
  "uploads",
  "archive",
  "partners",
] as const;
export type DoveMediaFolder = (typeof APPROVED_MEDIA_FOLDERS)[number];

export interface CloudinarySignatureResult {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

/**
 * Generate a server-side signature for secure direct browser-to-Cloudinary upload.
 * The CLOUDINARY_API_SECRET is NEVER sent to the client.
 */
export async function generateCloudinaryUploadSignature(
  folderName: DoveMediaFolder = "stories"
): Promise<{ success: boolean; data?: CloudinarySignatureResult; error?: string }> {
  const staff = await getStaffSession();
  if (!staff) {
    return { success: false, error: "Unauthorized" };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "vloh9uw1";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary upload credentials are not configured on this server.",
    };
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `${CLOUDINARY_DOVE_NAMESPACE}/${folderName}`;

  // Cloudinary signature algorithm: sort parameters alphabetically, serialize, append api_secret, hash with SHA-1
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const stringToSign = `${paramsToSign}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  return {
    success: true,
    data: {
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
    },
  };
}

export interface RegisterMediaInput {
  provider: MediaProvider;
  url: string;
  publicId?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  originalFilename?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  focalX?: number | null;
  focalY?: number | null;
}

/**
 * Register a newly uploaded or migrated media asset in the media_assets table
 */
export async function registerMediaAsset(
  input: RegisterMediaInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const staff = await getStaffSession();
  if (!staff) {
    return { success: false, error: "Unauthorized" };
  }

  if (!input.url || typeof input.url !== "string") {
    return { success: false, error: "Media URL is required" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        provider: input.provider,
        url: input.url.trim(),
        public_id: input.publicId ?? null,
        mime_type: input.mimeType ?? null,
        width: input.width ?? null,
        height: input.height ?? null,
        bytes: input.bytes ?? null,
        original_filename: input.originalFilename ?? null,
        source: input.source ?? null,
        source_url: input.sourceUrl ?? null,
        focal_x: input.focalX ?? null,
        focal_y: input.focalY ?? null,
        created_by: staff.userId,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: "Failed to register media asset" };
    }

    return { success: true, id: data.id };
  } catch {
    return { success: false, error: "Server error registering media asset" };
  }
}
