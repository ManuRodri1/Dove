"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getMediaUploadSignatureAction, registerMediaUploadAction } from "@/app/admin/media/actions";
import type { AdminMediaAsset } from "@/lib/cms/admin-queries";

type CloudinaryResult = { secure_url?: string; public_id?: string; resource_type?: string; format?: string; width?: number; height?: number; bytes?: number; original_filename?: string; error?: { message?: string } };

export default function MediaLibrary({ assets, query }: { assets: AdminMediaAsset[]; query: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<AdminMediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => { if (selected && dialog.current && !dialog.current.open) dialog.current.showModal(); }, [selected]);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setStatus("Choose an image file."); return; }
    if (file.size > 15 * 1024 * 1024) { setStatus("Images must be 15 MB or smaller."); return; }
    setUploading(true); setStatus("Preparing secure upload…");
    try {
      const signature = await getMediaUploadSignatureAction("uploads");
      if (!signature.success || !signature.data) throw new Error(signature.error ?? "Upload is not configured.");
      const form = new FormData();
      form.append("file", file); form.append("api_key", signature.data.apiKey); form.append("timestamp", String(signature.data.timestamp)); form.append("signature", signature.data.signature); form.append("folder", signature.data.folder);
      setStatus("Uploading image…");
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.data.cloudName}/image/upload`, { method: "POST", body: form });
      const uploaded = await response.json() as CloudinaryResult;
      if (!response.ok || !uploaded.secure_url || !uploaded.public_id) throw new Error(uploaded.error?.message ?? "Cloudinary upload failed.");
      const registered = await registerMediaUploadAction({ url: uploaded.secure_url, publicId: uploaded.public_id, mimeType: uploaded.format ? `image/${uploaded.format}` : file.type, width: uploaded.width ?? null, height: uploaded.height ?? null, bytes: uploaded.bytes ?? file.size, originalFilename: uploaded.original_filename ?? file.name });
      if (!registered.success) throw new Error(registered.error ?? "Could not register the uploaded image.");
      setStatus("Upload complete."); router.refresh();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  };

  return <>
    <div className="media-toolbar"><form method="GET"><label><span>Search media</span><input type="search" name="q" defaultValue={query} placeholder="Filename, provider, or source" /></label><button className="admin-secondary" type="submit">Search</button></form><input ref={input} className="sr-only" type="file" accept="image/*" onChange={(event) => upload(event.target.files?.[0])} /><button className="admin-primary" type="button" disabled={uploading} onClick={() => input.current?.click()}>{uploading ? "Uploading…" : "Upload image"}</button></div>
    <p className="media-status" role="status">{status || `${assets.length} asset${assets.length === 1 ? "" : "s"}`}</p>
    {assets.length ? <div className="media-library-grid">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => setSelected(asset)}><span><Image src={asset.url} alt="" fill sizes="(min-width: 1200px) 220px, (min-width: 600px) 30vw, 46vw" /></span><strong>{asset.original_filename || "Untitled image"}</strong><small>{asset.provider} · {asset.width && asset.height ? `${asset.width} × ${asset.height}` : "Dimensions unknown"}</small></button>)}</div> : <div className="admin-empty"><h2>No media found</h2><p>{query ? "Try a different search." : "Upload the first image when it is ready."}</p></div>}
    <dialog ref={dialog} className="media-detail-dialog" onClose={() => setSelected(null)}>{selected && <><header><div><p className="admin-kicker">{selected.provider}</p><h2>{selected.original_filename || "Media asset"}</h2></div><button className="admin-icon-button" type="button" onClick={() => dialog.current?.close()} aria-label="Close preview">×</button></header><div className="media-detail-image"><Image src={selected.url} alt="" fill sizes="80vw" /></div><dl><div><dt>Dimensions</dt><dd>{selected.width && selected.height ? `${selected.width} × ${selected.height}` : "Unknown"}</dd></div><div><dt>Type</dt><dd>{selected.mime_type || "Unknown"}</dd></div><div><dt>Added</dt><dd>{new Date(selected.created_at).toLocaleDateString()}</dd></div></dl></>}</dialog>
  </>;
}
