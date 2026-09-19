"use client";

import Image from "next/image";
import MediaPicker from "@/components/admin/MediaPicker";
import type { AdminMediaAsset } from "@/lib/cms/admin-queries";
import type { PublicStoryBlock } from "@/lib/cms/public-stories";
import RichTextEditor from "./RichTextEditor";

type GalleryItem = { mediaAssetId?: string; url: string; alt: string; caption?: string };
type ButtonItem = { label: string; href: string; variant: "primary" | "secondary" | "outline" };

const text = (value: unknown) => typeof value === "string" ? value : "";
const numeric = (value: unknown, fallback = 0) => typeof value === "number" ? value : fallback;

export default function BlockInspector({ block, media, updateData, updateSettings }: {
  block: PublicStoryBlock;
  media: AdminMediaAsset[];
  updateData: (patch: Record<string, unknown>) => void;
  updateSettings: (patch: Record<string, unknown>) => void;
}) {
  const data = block.data;
  const settings = block.settings;
  const chooseImage = (asset: AdminMediaAsset) => updateData({ mediaAssetId: asset.id, url: asset.url });
  const imageControls = (
    <>
      <MediaPicker assets={media} value={text(data.mediaAssetId)} onSelect={chooseImage} />
      <label><span>Image URL</span><input value={text(data.url)} onChange={(event) => updateData({ url: event.target.value })} /></label>
      <label><span>Alt text</span><input value={text(data.alt)} onChange={(event) => updateData({ alt: event.target.value })} placeholder="Describe the image" /></label>
      <label><span>Caption</span><input value={text(data.caption)} onChange={(event) => updateData({ caption: event.target.value })} /></label>
      <div className="admin-field-pair">
        <label><span>Crop</span><select value={text(settings.imageRatio) || "natural"} onChange={(event) => updateSettings({ imageRatio: event.target.value })}><option value="natural">Natural</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option><option value="square">Square</option><option value="wide">Wide</option></select></label>
        <label><span>Fit</span><select value={text(settings.imageFit) || "cover"} onChange={(event) => updateSettings({ imageFit: event.target.value })}><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
      </div>
      <div className="admin-field-pair">
        <label><span>Focal point X</span><input type="number" min="0" max="1" step="0.05" value={numeric(data.focalX, .5)} onChange={(event) => updateData({ focalX: Number(event.target.value) })} /></label>
        <label><span>Focal point Y</span><input type="number" min="0" max="1" step="0.05" value={numeric(data.focalY, .5)} onChange={(event) => updateData({ focalY: Number(event.target.value) })} /></label>
      </div>
    </>
  );

  let content: React.ReactNode;
  switch (block.blockType) {
    case "heading":
      content = <><label><span>Heading</span><textarea value={text(data.text)} onChange={(event) => updateData({ text: event.target.value })} /></label><label><span>Level</span><select value={String(data.level ?? 2)} onChange={(event) => updateData({ level: Number(event.target.value) })}><option value="2">H2</option><option value="3">H3</option><option value="4">H4</option></select></label></>;
      break;
    case "rich_text":
      content = <RichTextEditor value={text(data.html)} onChange={(html) => updateData({ html })} />;
      break;
    case "image":
      content = imageControls;
      break;
    case "image_text_split":
      content = <>{imageControls}<label><span>Media position</span><select value={text(data.mediaPosition) || "left"} onChange={(event) => updateData({ mediaPosition: event.target.value })}><option value="left">Left</option><option value="right">Right</option></select></label><div className="admin-field-pair"><label><span>Desktop ratio</span><select value={text(settings.splitRatio) || "50-50"} onChange={(event) => updateSettings({ splitRatio: event.target.value })}><option value="40-60">40 / 60</option><option value="50-50">50 / 50</option><option value="60-40">60 / 40</option></select></label><label><span>Mobile order</span><select value={text(settings.mobileOrder) || "media-first"} onChange={(event) => updateSettings({ mobileOrder: event.target.value })}><option value="media-first">Image first</option><option value="text-first">Text first</option></select></label></div><div><span className="admin-field-label">Text</span><RichTextEditor value={text(data.text)} onChange={(html) => updateData({ text: html })} /></div></>;
      break;
    case "gallery": {
      const items = Array.isArray(data.items) ? data.items as GalleryItem[] : [];
      const setItems = (next: GalleryItem[]) => updateData({ items: next });
      content = <><label><span>Columns</span><select value={String(data.columns ?? 3)} onChange={(event) => updateData({ columns: Number(event.target.value) })}><option value="2">2 columns</option><option value="3">3 columns</option><option value="4">4 columns</option></select></label><label><span>Layout</span><select value={text(settings.galleryLayout) || "grid"} onChange={(event) => updateSettings({ galleryLayout: event.target.value })}><option value="grid">Grid</option><option value="editorial">Editorial grid</option><option value="feature">Large + supporting</option></select></label><MediaPicker assets={media} label="Add image" onSelect={(asset) => setItems([...items, { mediaAssetId: asset.id, url: asset.url, alt: "" }])} /><div className="gallery-editor-list">{items.map((item, index) => <div key={`${item.mediaAssetId ?? item.url}-${index}`}><span className="gallery-editor-thumb"><Image src={item.url} alt="" fill sizes="64px" /></span><label><span>Alt text</span><input value={item.alt} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, alt: event.target.value } : entry))} /></label><label><span>Caption</span><input value={item.caption ?? ""} onChange={(event) => setItems(items.map((entry, position) => position === index ? { ...entry, caption: event.target.value } : entry))} /></label><div><button type="button" onClick={() => index > 0 && setItems(items.map((entry) => entry).toSpliced(index - 1, 2, items[index], items[index - 1]))} aria-label={`Move image ${index + 1} up`}>↑</button><button type="button" onClick={() => index < items.length - 1 && setItems(items.map((entry) => entry).toSpliced(index, 2, items[index + 1], items[index]))} aria-label={`Move image ${index + 1} down`}>↓</button><button type="button" onClick={() => setItems(items.filter((_, position) => position !== index))}>Remove</button></div></div>)}</div></>;
      break;
    }
    case "quote":
      content = <><label><span>Quotation</span><textarea value={text(data.quote)} onChange={(event) => updateData({ quote: event.target.value })} /></label><label><span>Attribution</span><input value={text(data.author)} onChange={(event) => updateData({ author: event.target.value })} /></label><label><span>Role or context</span><input value={text(data.role)} onChange={(event) => updateData({ role: event.target.value })} /></label><label><span>Source</span><input value={text(data.source)} onChange={(event) => updateData({ source: event.target.value })} /></label></>;
      break;
    case "youtube":
      content = <><label><span>YouTube URL or ID</span><input value={text(data.videoId)} onChange={(event) => { const value = event.target.value.trim(); let videoId = value; try { const url = new URL(value); videoId = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? value; } catch { videoId = value; } updateData({ videoId }); }} /></label><label><span>Accessible title</span><input value={text(data.title)} onChange={(event) => updateData({ title: event.target.value })} /></label><label><span>Caption</span><input value={text(data.caption)} onChange={(event) => updateData({ caption: event.target.value })} /></label><label><span>Start time in seconds</span><input type="number" min="0" value={numeric(data.startTime)} onChange={(event) => updateData({ startTime: Number(event.target.value) })} /></label></>;
      break;
    case "callout":
      content = <><label><span>Title</span><input value={text(data.title)} onChange={(event) => updateData({ title: event.target.value })} /></label><label><span>Tone</span><select value={text(data.tone) || "info"} onChange={(event) => updateData({ tone: event.target.value })}><option value="info">Information</option><option value="inspiration">Inspiration</option><option value="warning">Important</option></select></label><div><span className="admin-field-label">Text</span><RichTextEditor value={text(data.text)} onChange={(html) => updateData({ text: html })} /></div></>;
      break;
    case "button_group": {
      const buttons = Array.isArray(data.buttons) ? data.buttons as ButtonItem[] : [];
      const setButtons = (next: ButtonItem[]) => updateData({ buttons: next });
      content = <><div className="button-editor-list">{buttons.map((button, index) => <div key={index}><label><span>Label</span><input value={button.label} onChange={(event) => setButtons(buttons.map((entry, position) => position === index ? { ...entry, label: event.target.value } : entry))} /></label><label><span>Destination</span><input value={button.href} onChange={(event) => setButtons(buttons.map((entry, position) => position === index ? { ...entry, href: event.target.value } : entry))} placeholder="/en/page or https://…" /></label><label><span>Style</span><select value={button.variant} onChange={(event) => setButtons(buttons.map((entry, position) => position === index ? { ...entry, variant: event.target.value as ButtonItem["variant"] } : entry))}><option value="primary">Primary</option><option value="secondary">Secondary</option></select></label><button type="button" onClick={() => setButtons(buttons.filter((_, position) => position !== index))}>Remove</button></div>)}</div><button className="admin-secondary" type="button" onClick={() => setButtons([...buttons, { label: "Learn more", href: "/en", variant: "primary" }])}>Add button</button></>;
      break;
    }
    case "section_intro":
      content = <><label><span>Eyebrow</span><input value={text(data.eyebrow)} onChange={(event) => updateData({ eyebrow: event.target.value })} /></label><label><span>Heading</span><textarea value={text(data.title)} onChange={(event) => updateData({ title: event.target.value })} /></label><label><span>Lead text</span><textarea value={text(data.leadText)} onChange={(event) => updateData({ leadText: event.target.value })} /></label></>;
      break;
    case "divider":
      content = <label><span>Divider style</span><select value={text(data.style) || "line"} onChange={(event) => updateData({ style: event.target.value })}><option value="line">Line</option><option value="dots">Dots</option><option value="blank">Blank</option></select></label>;
      break;
    case "spacer":
      content = <label><span>Space</span><select value={text(data.height) || "medium"} onChange={(event) => updateData({ height: event.target.value })}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>;
      break;
  }

  return <div className="block-inspector-fields">
    <div className="admin-field-pair"><label><span>Width</span><select value={text(settings.width) || "content"} onChange={(event) => updateSettings({ width: event.target.value })}><option value="narrow">Narrow</option><option value="content">Content</option><option value="wide">Wide</option><option value="full">Full</option></select></label><label><span>Alignment</span><select value={text(settings.alignment) || "left"} onChange={(event) => updateSettings({ alignment: event.target.value })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label></div>
    <div className="admin-field-pair"><label><span>Spacing</span><select value={text(settings.spacing) || "normal"} onChange={(event) => updateSettings({ spacing: event.target.value })}><option value="compact">Compact</option><option value="normal">Normal</option><option value="generous">Generous</option></select></label><label><span>Theme</span><select value={text(settings.theme) || "default"} onChange={(event) => updateSettings({ theme: event.target.value })}><option value="default">Default</option><option value="warm">Warm</option><option value="teal">Teal</option><option value="dark">Dark</option><option value="accent">Accent</option></select></label></div>
    <hr />{content}
  </div>;
}
