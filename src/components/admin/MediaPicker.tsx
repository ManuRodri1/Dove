"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminMediaAsset } from "@/lib/cms/admin-queries";

export default function MediaPicker({ assets, value, label = "Choose image", onSelect }: { assets: AdminMediaAsset[]; value?: string | null; label?: string; onSelect: (asset: AdminMediaAsset) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = assets.find((asset) => asset.id === value);
  const filtered = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase();
    if (!clean) return assets;
    return assets.filter((asset) => `${asset.original_filename ?? ""} ${asset.source ?? ""} ${asset.provider}`.toLocaleLowerCase().includes(clean));
  }, [assets, query]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <div className="media-picker-field">
      {selected && <div className="media-picker-current"><Image src={selected.url} alt="" fill sizes="88px" /></div>}
      <button className="admin-secondary" type="button" onClick={() => setOpen(true)}>{selected ? "Change image" : label}</button>
      <dialog ref={dialog} className="media-picker-dialog" onClose={() => setOpen(false)}>
        <header><div><p className="admin-kicker">Dove media</p><h2>Select an image</h2></div><button className="admin-icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close media picker">×</button></header>
        <label className="admin-dialog-search"><span>Search media</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filename or source" autoFocus /></label>
        <div className="media-picker-grid">{filtered.map((asset) => <button key={asset.id} type="button" onClick={() => { onSelect(asset); setOpen(false); }}><span><Image src={asset.url} alt="" fill sizes="160px" /></span><small>{asset.original_filename || asset.provider}</small></button>)}</div>
        {!filtered.length && <p className="admin-empty-inline">No media matches that search.</p>}
      </dialog>
    </div>
  );
}
