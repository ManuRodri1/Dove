"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StoryRenderer from "@/components/stories/StoryRenderer";
import MediaPicker from "@/components/admin/MediaPicker";
import { saveEditorAction, type EditorPayload } from "@/app/admin/stories/actions";
import { slugify } from "@/lib/cms/validation";
import type { AdminMediaAsset, AdminStory } from "@/lib/cms/admin-queries";
import type { PublicStoryBlock } from "@/lib/cms/public-stories";
import type { BlockType } from "@/lib/supabase/database.types";
import BlockInspector from "./BlockInspector";

type Locale = "en" | "es";
type EditableTranslation = {
  id?: string;
  locale: Locale;
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string | null;
  seo_description: string | null;
  publication_status: "draft" | "published" | "archived";
  blocks: PublicStoryBlock[];
};

const blockLabels: Record<BlockType, string> = {
  heading: "Heading", rich_text: "Rich text", image: "Image", image_text_split: "Image + text",
  gallery: "Gallery", quote: "Quote", youtube: "YouTube", callout: "Callout",
  button_group: "Buttons", section_intro: "Section intro", divider: "Divider", spacer: "Spacer",
};

const defaults: Record<BlockType, Record<string, unknown>> = {
  heading: { text: "New heading", level: 2 }, rich_text: { html: "<p>Start writing…</p>" },
  image: { url: "", alt: "" }, image_text_split: { text: "<p>Start writing…</p>", url: "", alt: "", mediaPosition: "left" },
  gallery: { items: [], columns: 3 }, quote: { quote: "Add the quotation here." },
  youtube: { videoId: "", title: "Dove video" }, callout: { text: "<p>Add important context.</p>", tone: "info" },
  button_group: { buttons: [{ label: "Learn more", href: "/en", variant: "primary" }] },
  section_intro: { eyebrow: "", title: "Section title", leadText: "" }, divider: { style: "line" }, spacer: { height: "medium" },
};

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function AddBlockMenu({ onAdd, compact = false }: { onAdd: (type: BlockType) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return <div className={`add-block-menu ${compact ? "is-compact" : ""}`}><button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{compact ? "+ Add block here" : "+ Add content block"}</button>{open && <div>{(Object.keys(blockLabels) as BlockType[]).map((type) => <button key={type} type="button" onClick={() => { onAdd(type); setOpen(false); }}><strong>{blockLabels[type]}</strong><span>{type.replaceAll("_", " ")}</span></button>)}</div>}</div>;
}

/* dnd-kit exposes callback refs/listeners as render-safe bindings; React's generic ref rule cannot infer that contract. */
/* eslint-disable react-hooks/refs */
function SortableBlock({ block, selected, onSelect, onMove, onDuplicate, onToggle, onDelete }: { block: PublicStoryBlock; selected: boolean; onSelect: () => void; onMove: (amount: number) => void; onDuplicate: () => void; onToggle: () => void; onDelete: () => void }) {
  const sortable = useSortable({ id: block.id });
  return <article ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={`editor-block ${selected ? "is-selected" : ""} ${block.visible === false ? "is-hidden" : ""}`}>
    <header><button className="drag-handle" type="button" {...sortable.attributes} {...sortable.listeners} aria-label={`Drag ${blockLabels[block.blockType]} to reorder`}>↕</button><button className="editor-block-title" type="button" onClick={onSelect}><strong>{blockLabels[block.blockType]}</strong><small>{block.visible === false ? "Hidden" : "Visible"}</small></button><div className="block-actions"><button type="button" onClick={() => onMove(-1)} aria-label="Move block up">↑</button><button type="button" onClick={() => onMove(1)} aria-label="Move block down">↓</button><button type="button" onClick={onDuplicate}>Duplicate</button><button type="button" onClick={onToggle}>{block.visible === false ? "Show" : "Hide"}</button><button type="button" onClick={() => window.confirm("Delete this block?") && onDelete()}>Delete</button></div></header>
    <div className="editor-block-preview" onClick={onSelect}><StoryRenderer blocks={[{ ...block, visible: true }]} /></div>
  </article>;
}
/* eslint-enable react-hooks/refs */

export default function StoryEditor({ story, media }: { story: AdminStory | null; media: AdminMediaAsset[] }) {
  const router = useRouter();
  const makeTranslation = (locale: Locale): EditableTranslation => {
    const translation = story?.translations.find((item) => item.locale === locale);
    if (!translation) return { locale, slug: "", title: "", excerpt: "", seo_title: null, seo_description: null, publication_status: "draft", blocks: [] };
    return { ...translation, blocks: [...translation.story_blocks].sort((a, b) => a.sort_order - b.sort_order).map((block) => ({ id: block.id, blockType: block.block_type as BlockType, sortOrder: block.sort_order, data: block.data, settings: block.settings, visible: block.visible })) };
  };
  const [storyId, setStoryId] = useState(story?.id);
  const [translations, setTranslations] = useState<Record<Locale, EditableTranslation>>({ en: makeTranslation("en"), es: makeTranslation("es") });
  const [locale, setLocale] = useState<Locale>("en");
  const [meta, setMetaState] = useState({ status: story?.status ?? "draft", author_name: story?.author_name ?? "", cover_media_id: story?.cover_media_id ?? "", featured_home: story?.featured_home ?? false, featured_stories: story?.featured_stories ?? false, published_at: story?.published_at ?? null, scheduled_at: story?.scheduled_at ?? null });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const translation = translations[locale];
  const blocks = translation.blocks;
  const selected = blocks.find((block) => block.id === selectedId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setMeta = (patch: Partial<typeof meta>) => { setMetaState((current) => ({ ...current, ...patch })); setDirty(true); };
  const setTranslation = (patch: Partial<EditableTranslation>) => { setTranslations((current) => ({ ...current, [locale]: { ...current[locale], ...patch } })); setDirty(true); };
  const setBlocks = (next: PublicStoryBlock[]) => setTranslation({ blocks: next.map((block, index) => ({ ...block, sortOrder: index })) });
  const addBlock = (type: BlockType, index = blocks.length) => {
    const block: PublicStoryBlock = { id: crypto.randomUUID(), blockType: type, sortOrder: index, data: structuredClone(defaults[type]), settings: { width: "content", spacing: "normal", alignment: "left", theme: "default" }, visible: true };
    const next = [...blocks]; next.splice(index, 0, block); setBlocks(next); setSelectedId(block.id);
  };
  const updateSelected = (patch: Record<string, unknown>, key: "data" | "settings") => {
    setBlocks(blocks.map((block) => block.id === selectedId ? { ...block, [key]: { ...block[key], ...patch } } : block));
  };
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((block) => block.id === active.id);
    const to = blocks.findIndex((block) => block.id === over.id);
    if (from >= 0 && to >= 0) setBlocks(arrayMove(blocks, from, to));
  };

  const save = async (publish = false) => {
    if (!translation.title.trim()) { setMessage(`Add a ${locale === "en" ? "English" : "Spanish"} title before saving.`); return; }
    if (!translation.slug.trim() && !slugify(translation.title)) { setMessage("A valid slug is required."); return; }
    setSaving(true); setMessage(publish ? "Publishing…" : "Saving…");
    const payload: EditorPayload = {
      id: storyId,
      story: { ...meta, status: publish ? "published" : meta.status, author_name: meta.author_name || null, cover_media_id: meta.cover_media_id || null, published_at: publish ? meta.published_at ?? new Date().toISOString() : meta.published_at },
      translation: { id: translation.id, locale, slug: translation.slug || slugify(translation.title), title: translation.title, excerpt: translation.excerpt, seo_title: translation.seo_title || null, seo_description: translation.seo_description || null, publication_status: publish ? "published" : translation.publication_status },
      blocks: blocks.map((block, index) => ({ id: block.id, block_type: block.blockType, sort_order: index, data: block.data as EditorPayload["blocks"][number]["data"], settings: block.settings, visible: block.visible })),
    };
    const result = await saveEditorAction(payload);
    setSaving(false);
    if (!result.success || !result.data || typeof result.data !== "object" || !("id" in result.data) || typeof result.data.id !== "string") { setMessage(result.error ?? "Save failed. Your changes remain in this browser."); return; }
    const savedStoryId = result.data.id;
    setStoryId(savedStoryId); setDirty(false); setMessage(publish ? "Published" : "Saved");
    setTranslations((current) => ({ ...current, [locale]: { ...current[locale], slug: payload.translation.slug, publication_status: payload.translation.publication_status } }));
    if (publish) setMetaState((current) => ({ ...current, status: "published", published_at: payload.story.published_at }));
    if (!storyId) router.replace(`/admin/stories/${savedStoryId}`);
    router.refresh();
  };

  return <div className="story-editor">
    <header className="editor-topbar"><button className="admin-text-button" type="button" onClick={() => { if (!dirty || window.confirm("Leave without saving your changes?")) router.push("/admin/stories"); }}>← Stories</button><div className="editor-save-actions"><span role="status" data-dirty={dirty}>{message || (dirty ? "Unsaved changes" : "All changes saved")}</span><button className="admin-secondary" type="button" onClick={() => setPreview(!preview)}>{preview ? "Return to editor" : "Preview"}</button><button className="admin-secondary" type="button" disabled={saving || !dirty} onClick={() => save(false)}>{saving ? "Saving…" : "Save"}</button><button className="admin-primary" type="button" disabled={saving} onClick={() => save(true)}>Publish</button></div></header>
    <div className="editor-locale-bar" role="tablist" aria-label="Story language"><button role="tab" aria-selected={locale === "en"} onClick={() => { setLocale("en"); setSelectedId(null); }}>English <small>{translations.en.title ? translations.en.publication_status : "not created"}</small></button><button role="tab" aria-selected={locale === "es"} onClick={() => { setLocale("es"); setSelectedId(null); }}>Español <small>{translations.es.title ? translations.es.publication_status : "not created"}</small></button></div>
    {preview ? <section className="editor-preview"><div className="preview-controls" aria-label="Preview width"><button aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button><button aria-pressed={viewport === "tablet"} onClick={() => setViewport("tablet")}>Tablet</button><button aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}>Mobile</button></div><div className={`preview-frame preview-frame--${viewport}`}><article className="story-detail"><header className="story-detail-header section"><div className="container"><p className="eyebrow">Preview · {locale.toUpperCase()}</p><h1>{translation.title || "Untitled story"}</h1>{translation.excerpt && <p className="lede">{translation.excerpt}</p>}</div></header><StoryRenderer blocks={blocks} /></article></div></section> : <div className="editor-workbench">      <main className="editor-canvas"><section className="story-fields"><label><span>Title</span><input value={translation.title} onChange={(event) => setTranslation({ title: event.target.value, slug: translation.slug || slugify(event.target.value) })} placeholder="Story title" /></label><label><span>Slug</span><input value={translation.slug} onChange={(event) => setTranslation({ slug: slugify(event.target.value) })} /></label><label><span>Excerpt</span><textarea value={translation.excerpt} onChange={(event) => setTranslation({ excerpt: event.target.value })} placeholder="A concise introduction for cards and search results" /></label></section><AddBlockMenu onAdd={(type) => addBlock(type, 0)} />{blocks.length ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>{blocks.map((block, index) => <div key={block.id}><SortableBlock block={block} selected={selectedId === block.id} onSelect={() => setSelectedId(block.id)} onMove={(amount) => { const target = Math.max(0, Math.min(blocks.length - 1, index + amount)); if (target !== index) setBlocks(arrayMove(blocks, index, target)); }} onDuplicate={() => { const copy = { ...block, id: crypto.randomUUID(), data: structuredClone(block.data), settings: structuredClone(block.settings) }; const next = [...blocks]; next.splice(index + 1, 0, copy); setBlocks(next); }} onToggle={() => setBlocks(blocks.map((item) => item.id === block.id ? { ...item, visible: item.visible === false } : item))} onDelete={() => { setBlocks(blocks.filter((item) => item.id !== block.id)); if (selectedId === block.id) setSelectedId(null); }} /><AddBlockMenu compact onAdd={(type) => addBlock(type, index + 1)} /></div>)}</SortableContext></DndContext> : <div className="editor-empty-canvas"><h2>Build the story</h2><p>Add a heading, rich text, image, gallery, quote, video, or call to action.</p></div>}</main>
      <aside className="editor-inspector"><section><p className="admin-kicker">Inspector</p><h2>{selected ? blockLabels[selected.blockType] : "Story settings"}</h2>{selected ? <BlockInspector block={selected} media={media} updateData={(patch) => updateSelected(patch, "data")} updateSettings={(patch) => updateSelected(patch, "settings")} /> : <p className="admin-empty-inline">Select a block to edit its content and layout.</p>}</section><section><h2>Story</h2><MediaPicker assets={media} value={meta.cover_media_id} label="Choose cover image" onSelect={(asset) => setMeta({ cover_media_id: asset.id })} /><label><span>Author byline</span><input value={meta.author_name} onChange={(event) => setMeta({ author_name: event.target.value })} placeholder="Leave blank to omit" /></label><div className="admin-field-pair"><label><span>Story status</span><select value={meta.status} onChange={(event) => setMeta({ status: event.target.value as typeof meta.status })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label><span>Translation status</span><select value={translation.publication_status} onChange={(event) => setTranslation({ publication_status: event.target.value as EditableTranslation["publication_status"] })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div><label><span>Publication date</span><input type="datetime-local" value={toLocalDateTime(meta.published_at)} onChange={(event) => setMeta({ published_at: event.target.value ? new Date(event.target.value).toISOString() : null })} /></label><label><span>Schedule for</span><input type="datetime-local" value={toLocalDateTime(meta.scheduled_at)} onChange={(event) => setMeta({ scheduled_at: event.target.value ? new Date(event.target.value).toISOString() : null })} /></label><label className="admin-check"><input type="checkbox" checked={meta.featured_stories} onChange={(event) => setMeta({ featured_stories: event.target.checked })} /><span>Feature on Stories</span></label><label className="admin-check"><input type="checkbox" checked={meta.featured_home} onChange={(event) => setMeta({ featured_home: event.target.checked })} /><span>Feature on Home</span></label></section><section><h2>Search appearance</h2><label><span>SEO title</span><input value={translation.seo_title ?? ""} onChange={(event) => setTranslation({ seo_title: event.target.value })} /></label><label><span>SEO description</span><textarea value={translation.seo_description ?? ""} onChange={(event) => setTranslation({ seo_description: event.target.value })} /></label></section>{storyId && <Link className="admin-preview-link" href={translation.slug ? `/${locale}/stories/${translation.slug}` : "#"} target={translation.slug ? "_blank" : undefined} aria-disabled={!translation.slug}>Open public preview ↗</Link>}</aside>
    </div>}
  </div>;
}
