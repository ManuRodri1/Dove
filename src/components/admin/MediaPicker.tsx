"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { registerMediaUploadAction } from "@/app/admin/media/actions";
import { getCloudinaryUploadSignature } from "@/lib/cloudinary/client";
import type { AdminMediaAsset } from "@/lib/cms/admin-queries";

type CloudinaryResult = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  original_filename?: string;
  error?: { message?: string };
};

export default function MediaPicker({
  assets,
  value,
  label = "Choose image",
  onSelect,
}: {
  assets: AdminMediaAsset[];
  value?: string | null;
  label?: string;
  onSelect: (asset: AdminMediaAsset) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"existing" | "upload">("existing");
  const [query, setQuery] = useState("");
  const [extraAssets, setExtraAssets] = useState<AdminMediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const allAssets = useMemo(() => {
    const combined = [...extraAssets, ...assets];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [extraAssets, assets]);

  const selected = allAssets.find((asset) => asset.id === value);

  const filtered = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase();
    if (!clean) return allAssets;
    return allAssets.filter((asset) =>
      `${asset.original_filename ?? ""} ${asset.source ?? ""} ${asset.provider}`
        .toLocaleLowerCase()
        .includes(clean)
    );
  }, [allAssets, query]);

  useEffect(() => {
    const node = dialog.current;
    return () => {
      if (node?.open) {
        node.close();
      }
    };
  }, []);

  const handleOpen = () => {
    const node = dialog.current;
    if (node && !node.open) {
      node.showModal();
    }
  };

  const handleDialogClosed = () => {
    setUploadStatus("");
  };

  const handleClose = () => dialog.current?.close();

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const node = dialog.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      handleClose();
    }
  };

  const handleSelect = (asset: AdminMediaAsset) => {
    handleClose();
    onSelect(asset);
  };

  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadStatus("Please choose an image file (JPEG, PNG, WebP, etc.).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadStatus("Images must be 15 MB or smaller.");
      return;
    }

    setUploading(true);
    setUploadStatus("Preparing secure upload…");
    try {
      const signature = await getCloudinaryUploadSignature("campaigns");
      if (!signature.success || !signature.data) {
        throw new Error(signature.error ?? "Upload is not configured.");
      }

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signature.data.apiKey);
      form.append("timestamp", String(signature.data.timestamp));
      form.append("signature", signature.data.signature);
      form.append("folder", signature.data.folder);

      setUploadStatus("Uploading to secure media storage…");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.data.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const uploaded = (await response.json()) as CloudinaryResult;
      if (!response.ok || !uploaded.secure_url || !uploaded.public_id) {
        throw new Error(uploaded.error?.message ?? "Cloudinary upload failed.");
      }

      setUploadStatus("Registering media asset…");
      const registered = await registerMediaUploadAction({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        mimeType: uploaded.format ? `image/${uploaded.format}` : file.type,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        bytes: uploaded.bytes ?? file.size,
        originalFilename: uploaded.original_filename ?? file.name,
      });

      if (!registered.success || !registered.id) {
        throw new Error(registered.error ?? "Could not register the uploaded image.");
      }

      const newAsset: AdminMediaAsset = {
        id: registered.id,
        provider: "cloudinary",
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        mime_type: uploaded.format ? `image/${uploaded.format}` : file.type,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        bytes: uploaded.bytes ?? file.size,
        original_filename: uploaded.original_filename ?? file.name,
        source: "cloudinary_upload",
        created_at: new Date().toISOString(),
      };

      setExtraAssets((prev) => [newAsset, ...prev]);
      setUploadStatus("Upload complete!");
      // Automatically select the new image and return the editor to the block
      handleSelect(newAsset);
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="media-picker-field">
      {selected && (
        <div className="media-picker-current">
          <Image src={selected.url} alt="" fill sizes="88px" />
        </div>
      )}
      <button className="admin-secondary" type="button" onClick={handleOpen}>
        {selected ? "Change image" : label}
      </button>

      <dialog
        ref={dialog}
        className="media-picker-dialog"
        onClick={handleDialogClick}
        onClose={handleDialogClosed}
      >
        <header>
          <div>
            <p className="admin-kicker">Dove media</p>
            <h2>Select or upload an image</h2>
          </div>
          <button
            className="admin-icon-button"
            type="button"
            onClick={handleClose}
            aria-label="Close media picker"
          >
            ×
          </button>
        </header>

        <div className="media-picker-tabs" role="tablist" aria-label="Media source">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "existing"}
            onClick={() => setTab("existing")}
          >
            Existing Media ({allAssets.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upload"}
            onClick={() => setTab("upload")}
          >
            Upload New From PC
          </button>
        </div>

        {tab === "existing" ? (
          <>
            <label className="admin-dialog-search">
              <span>Search media</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filename or source"
                autoFocus
              />
            </label>
            <div className="media-picker-grid">
              {filtered.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handleSelect(asset)}
                >
                  <span>
                    <Image src={asset.url} alt="" fill sizes="160px" />
                  </span>
                  <small>{asset.original_filename || asset.provider}</small>
                </button>
              ))}
            </div>
            {!filtered.length && (
              <p className="admin-empty-inline">No media matches that search.</p>
            )}
          </>
        ) : (
          <div className="media-picker-upload-view">
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />
            <div
              className="media-picker-dropzone"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadFile(e.dataTransfer.files?.[0]);
              }}
            >
              <span className="upload-icon" aria-hidden="true">📁</span>
              <strong>Choose an image from your computer</strong>
              <p>Drag and drop here, or click to browse (JPEG, PNG, WebP up to 15 MB)</p>
              <button
                className="admin-primary"
                type="button"
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInput.current?.click();
                }}
              >
                {uploading ? "Uploading…" : "Browse files"}
              </button>
            </div>
            {uploadStatus && (
              <p className="media-status" role="status">
                {uploadStatus}
              </p>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
