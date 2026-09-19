"use server";

import { revalidatePath } from "next/cache";
import { generateCloudinaryUploadSignature, registerMediaAsset, type DoveMediaFolder } from "@/lib/cms/media";

export async function getMediaUploadSignatureAction(folder: DoveMediaFolder) {
  return generateCloudinaryUploadSignature(folder);
}

export async function registerMediaUploadAction(input: {
  url: string; publicId: string; mimeType: string | null; width: number | null; height: number | null;
  bytes: number | null; originalFilename: string | null;
}) {
  const result = await registerMediaAsset({ provider: "cloudinary", url: input.url, publicId: input.publicId, mimeType: input.mimeType, width: input.width, height: input.height, bytes: input.bytes, originalFilename: input.originalFilename, source: "cloudinary_upload" });
  if (result.success) { revalidatePath("/admin"); revalidatePath("/admin/media"); revalidatePath("/admin/stories"); }
  return result;
}
