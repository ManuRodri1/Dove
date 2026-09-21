"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockRenderer from "@/components/content/BlockRenderer";
import MediaPicker from "@/components/admin/MediaPicker";
import BlockInspector from "@/components/admin/stories/BlockInspector";
import { saveCampaignEditorAction, type CampaignEditorPayload } from "@/app/admin/campaigns/actions";
import { slugify } from "@/lib/cms/validation";
import type { AdminCampaign, CampaignRelationship } from "@/lib/cms/admin-campaigns";
import type { AdminMediaAsset, AdminStorySummary } from "@/lib/cms/admin-queries";
import type { PublicStoryBlock } from "@/lib/cms/public-stories";
import type { BlockType } from "@/lib/supabase/database.types";

type Locale = "en" | "es";
type Translation = {
  id?: string;
  locale: Locale;
  slug: string;
  title: string;
  eyebrow: string;
  headline: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  publication_status: "draft" | "published" | "archived";
  blocks: PublicStoryBlock[];
};

const labels: Record<BlockType, string> = {
  heading: "Heading",
  rich_text: "Rich text",
  image: "Image",
  image_text_split: "Image + text",
  gallery: "Gallery",
  quote: "Quote",
  youtube: "YouTube",
  callout: "Callout",
  button_group: "Buttons",
  section_intro: "Section intro",
  divider: "Divider",
  spacer: "Spacer",
};

const defaults: Record<BlockType, Record<string, unknown>> = {
  heading: { text: "New heading", level: 2 },
  rich_text: { html: "<p>Start writing…</p>" },
  image: { url: "", alt: "" },
  image_text_split: { text: "<p>Start writing…</p>", url: "", alt: "", mediaPosition: "left" },
  gallery: { items: [], columns: 3 },
  quote: { quote: "Add the quotation here." },
  youtube: { videoId: "", title: "Dove video" },
  callout: { text: "<p>Add important context.</p>", tone: "info" },
  button_group: { buttons: [{ label: "Learn more", href: "/en", variant: "primary" }] },
  section_intro: { eyebrow: "", title: "Section title", leadText: "" },
  divider: { style: "line" },
  spacer: { height: "medium" },
};

const localDateTime = (value: string | null) =>
  value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
const numberOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

function AddBlockMenu({ onAdd, compact = false }: { onAdd: (type: BlockType) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`add-block-menu ${compact ? "is-compact" : ""}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {compact ? "+ Add block here" : "+ Add content block"}
      </button>
      {open && (
        <div>
          {(Object.keys(labels) as BlockType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
            >
              <strong>{labels[type]}</strong>
              <span>{type.replaceAll("_", " ")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* eslint-disable react-hooks/refs */
function SortableCampaignBlock({
  block,
  selected,
  onSelect,
  onMove,
  onRemove,
  onDuplicate,
  onToggle,
}: {
  block: PublicStoryBlock;
  selected: boolean;
  onSelect: () => void;
  onMove: (amount: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onToggle: () => void;
}) {
  const sortable = useSortable({ id: block.id });
  return (
    <article
      ref={sortable.setNodeRef}
      style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }}
      className={`editor-block ${selected ? "is-selected" : ""} ${block.visible === false ? "is-hidden" : ""}`}
    >
      <header>
        <button className="drag-handle" type="button" {...sortable.attributes} {...sortable.listeners} aria-label={`Drag ${labels[block.blockType]}`}>
          ↕
        </button>
        <button className="editor-block-title" type="button" onClick={onSelect}>
          <strong>{labels[block.blockType]}</strong>
          <small>{block.visible === false ? "Hidden" : "Visible"}</small>
        </button>
        <div className="block-actions">
          <button type="button" onClick={() => onMove(-1)} aria-label="Move block up">
            ↑
          </button>
          <button type="button" onClick={() => onMove(1)} aria-label="Move block down">
            ↓
          </button>
          <button type="button" onClick={onDuplicate}>
            Duplicate
          </button>
          <button type="button" onClick={onToggle}>
            {block.visible === false ? "Show" : "Hide"}
          </button>
          <button type="button" onClick={() => window.confirm("Delete this block?") && onRemove()}>
            Delete
          </button>
        </div>
      </header>
      <div className="editor-block-preview" onClick={onSelect}>
        <BlockRenderer blocks={[{ ...block, visible: true }]} />
      </div>
    </article>
  );
}
/* eslint-enable react-hooks/refs */

export default function CampaignEditor({
  campaign,
  media,
  stories,
}: {
  campaign: AdminCampaign | null;
  media: AdminMediaAsset[];
  stories: AdminStorySummary[];
}) {
  const router = useRouter();
  const makeTranslation = (locale: Locale): Translation => {
    const value = campaign?.translations.find((item) => item.locale === locale);
    return value
      ? {
          ...value,
          eyebrow: value.eyebrow ?? "",
          headline: value.headline ?? "",
          seo_title: value.seo_title ?? "",
          seo_description: value.seo_description ?? "",
          blocks: [...value.campaign_blocks]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((block) => ({
              id: block.id,
              blockType: block.block_type as BlockType,
              sortOrder: block.sort_order,
              data: block.data,
              settings: block.settings,
              visible: block.visible,
            })),
        }
      : {
          locale,
          slug: "",
          title: "",
          eyebrow: "",
          headline: "",
          excerpt: "",
          seo_title: "",
          seo_description: "",
          publication_status: "draft",
          blocks: [],
        };
  };

  const [campaignId, setCampaignId] = useState(campaign?.id);
  const [locale, setLocale] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Record<Locale, Translation>>({
    en: makeTranslation("en"),
    es: makeTranslation("es"),
  });
  const [meta, setMetaState] = useState({
    status: campaign?.status ?? "draft",
    hero_media_id: campaign?.hero_media_id ?? "",
    start_date: campaign?.start_date ?? "",
    end_date: campaign?.end_date ?? "",
    lifecycle_override: campaign?.lifecycle_override ?? "",
    location: campaign?.location ?? "",
    goal_amount: campaign?.goal_amount?.toString() ?? "",
    currency: campaign?.currency ?? "USD",
    raised_amount: campaign?.raised_amount?.toString() ?? "",
    raised_amount_is_final: campaign?.raised_amount_is_final ?? false,
    progress_source: campaign?.progress_source ?? "none",
    progress_updated_at: campaign?.progress_updated_at ?? null,
    external_provider: campaign?.external_provider ?? "",
    external_campaign_id: campaign?.external_campaign_id ?? "",
    donation_url: campaign?.donation_url ?? "",
    featured_home: campaign?.featured_home ?? false,
    featured_campaigns: campaign?.featured_campaigns ?? false,
    published_at: campaign?.published_at ?? null,
    scheduled_at: campaign?.scheduled_at ?? null,
  });
  const [storyLinks, setStoryLinks] = useState((campaign?.campaign_story_links ?? []).sort((a, b) => a.sort_order - b.sort_order));
  const [storyToAdd, setStoryToAdd] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const translation = translations[locale];
  const blocks = translation.blocks;
  const selected = blocks.find((block) => block.id === selectedId);
  const selectedHero = media.find((item) => item.id === meta.hero_media_id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const setMeta = (patch: Partial<typeof meta>) => setMetaState((current) => ({ ...current, ...patch }));
  const setTranslation = (patch: Partial<Translation>) =>
    setTranslations((current) => ({ ...current, [locale]: { ...current[locale], ...patch } }));
  const setBlocks = (next: PublicStoryBlock[]) =>
    setTranslation({ blocks: next.map((block, index) => ({ ...block, sortOrder: index })) });

  const addBlock = (type: BlockType, index = blocks.length) => {
    const block: PublicStoryBlock = {
      id: crypto.randomUUID(),
      blockType: type,
      sortOrder: index,
      data: structuredClone(defaults[type]),
      settings: { width: "content", spacing: "normal", alignment: "left", theme: "default" },
      visible: true,
    };
    const next = [...blocks];
    next.splice(index, 0, block);
    setBlocks(next);
    setSelectedId(block.id);
  };

  const moveBlock = (index: number, amount: number) => {
    const target = index + amount;
    if (target < 0 || target >= blocks.length) return;
    setBlocks(arrayMove(blocks, index, target));
  };

  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((block) => block.id === active.id);
    const to = blocks.findIndex((block) => block.id === over.id);
    if (from >= 0 && to >= 0) setBlocks(arrayMove(blocks, from, to));
  };

  const save = async (publish = false) => {
    if (!translation.title.trim()) {
      setMessage("Add a title before saving.");
      return;
    }
    setSaving(true);
    setMessage("Saving…");
    const payload: CampaignEditorPayload = {
      id: campaignId,
      campaign: {
        status: publish ? "published" : meta.status,
        hero_media_id: meta.hero_media_id || null,
        start_date: meta.start_date || null,
        end_date: meta.end_date || null,
        lifecycle_override: (meta.lifecycle_override || null) as any,
        location: meta.location || null,
        goal_amount: numberOrNull(meta.goal_amount),
        currency: meta.currency.toUpperCase(),
        raised_amount: numberOrNull(meta.raised_amount),
        raised_amount_is_final: meta.raised_amount_is_final,
        progress_source: meta.progress_source,
        progress_updated_at: meta.progress_updated_at,
        external_provider: (meta.external_provider || null) as any,
        external_campaign_id: meta.external_campaign_id || null,
        donation_url: meta.donation_url || null,
        featured_home: meta.featured_home,
        featured_campaigns: meta.featured_campaigns,
        published_at: publish ? meta.published_at ?? new Date().toISOString() : meta.published_at,
        scheduled_at: meta.scheduled_at,
      },
      translation: {
        locale,
        slug: translation.slug || slugify(translation.title),
        title: translation.title,
        eyebrow: translation.eyebrow || null,
        headline: translation.headline || null,
        excerpt: translation.excerpt,
        seo_title: translation.seo_title || null,
        seo_description: translation.seo_description || null,
        publication_status: publish ? "published" : translation.publication_status,
      },
      blocks: blocks.map((block, index) => ({
        block_type: block.blockType,
        sort_order: index,
        data: block.data as any,
        settings: block.settings,
        visible: block.visible,
      })),
      storyLinks,
    };
    const result = await saveCampaignEditorAction(payload);
    setSaving(false);
    if (!result.success || !("data" in result) || !result.data || typeof result.data !== "object" || !("id" in result.data)) {
      setMessage(result.error ?? "Unable to save campaign.");
      return;
    }
    const savedId = String(result.data.id);
    setCampaignId(savedId);
    setMessage("Saved");
    if (!campaignId) router.replace(`/admin/campaigns/${savedId}`);
    router.refresh();
  };

  const updateSelected = (patch: Record<string, unknown>, key: "data" | "settings") =>
    setBlocks(blocks.map((block) => (block.id === selectedId ? { ...block, [key]: { ...block[key], ...patch } } : block)));

  const storyTitle = (id: string) => {
    const story = stories.find((item) => item.id === id);
    return story?.translations.find((item) => item.locale === locale)?.title ?? story?.translations[0]?.title ?? "Untitled story";
  };

  return (
    <div className="story-editor">
      <header className="editor-topbar">
        <button className="admin-text-button" type="button" onClick={() => router.push("/admin/campaigns")}>
          ← Campaigns
        </button>
        <div className="editor-save-actions">
          <span role="status">{message}</span>
          <button className="admin-secondary" type="button" onClick={() => setPreview(!preview)}>
            {preview ? "Return to editor" : "Preview"}
          </button>
          <button className="admin-secondary" disabled={saving} type="button" onClick={() => save(false)}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="admin-primary" disabled={saving} type="button" onClick={() => save(true)}>
            Publish
          </button>
        </div>
      </header>

      <div className="editor-locale-bar" role="tablist" aria-label="Campaign language">
        {(["en", "es"] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={locale === item}
            onClick={() => {
              setLocale(item);
              setSelectedId(null);
            }}
          >
            {item === "en" ? "English" : "Español"}
            <small>{translations[item].title ? translations[item].publication_status : "not created"}</small>
          </button>
        ))}
      </div>

      {preview ? (
        <section className="editor-preview">
          <div className="preview-frame">
            <article className="campaign-detail">
              <header className={`campaign-detail-hero ${selectedHero ? "has-media" : ""}`}>
                {selectedHero && (
                  <Image
                    src={selectedHero.url}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className="campaign-detail-overlay" />
                <div className="container campaign-detail-heading">
                  <p className="eyebrow">{translation.eyebrow || `Preview · ${locale.toUpperCase()}`}</p>
                  <h1>{translation.headline || translation.title || "Untitled campaign"}</h1>
                  <p className="lede">{translation.excerpt}</p>
                </div>
              </header>
              <section className="campaign-detail-summary">
                <div className="container">
                  <div className="campaign-detail-status">
                    <span>{meta.lifecycle_override || "active"}</span>
                    {meta.location && <strong>{meta.location}</strong>}
                  </div>
                  {meta.donation_url && (
                    <a className="button button--primary" href={meta.donation_url} target="_blank" rel="noopener noreferrer">
                      Support Campaign
                    </a>
                  )}
                </div>
              </section>
              <BlockRenderer blocks={blocks} />
            </article>
          </div>
        </section>
      ) : (
        <div className="editor-workbench">
          <main className="editor-canvas">
            <section className="story-fields">
              <label>
                <span>Title</span>
                <input
                  value={translation.title}
                  onChange={(event) =>
                    setTranslation({
                      title: event.target.value,
                      slug: translation.slug || slugify(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                <span>Slug</span>
                <input
                  value={translation.slug}
                  onChange={(event) => setTranslation({ slug: slugify(event.target.value) })}
                />
              </label>
              <label>
                <span>Eyebrow</span>
                <input
                  value={translation.eyebrow}
                  onChange={(event) => setTranslation({ eyebrow: event.target.value })}
                />
              </label>
              <label>
                <span>Headline</span>
                <textarea
                  value={translation.headline}
                  onChange={(event) => setTranslation({ headline: event.target.value })}
                />
              </label>
              <label>
                <span>Excerpt</span>
                <textarea
                  value={translation.excerpt}
                  onChange={(event) => setTranslation({ excerpt: event.target.value })}
                />
              </label>
            </section>

            <AddBlockMenu onAdd={(type) => addBlock(type, 0)} />

            {blocks.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
                <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block, index) => (
                    <div key={block.id}>
                      <SortableCampaignBlock
                        block={block}
                        selected={block.id === selectedId}
                        onSelect={() => setSelectedId(block.id)}
                        onMove={(amount) => moveBlock(index, amount)}
                        onRemove={() => setBlocks(blocks.filter((item) => item.id !== block.id))}
                        onDuplicate={() =>
                          setBlocks(
                            blocks.toSpliced(index + 1, 0, {
                              ...block,
                              id: crypto.randomUUID(),
                              data: structuredClone(block.data),
                              settings: structuredClone(block.settings),
                            })
                          )
                        }
                        onToggle={() =>
                          setBlocks(
                            blocks.map((item) => (item.id === block.id ? { ...item, visible: item.visible === false } : item))
                          )
                        }
                      />
                      <AddBlockMenu onAdd={(type) => addBlock(type, index + 1)} compact />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="editor-empty-canvas">
                <h2>No blocks yet</h2>
                <p>Add rich blocks like images, stories, text splits, galleries, and button groups.</p>
                <AddBlockMenu onAdd={(type) => addBlock(type)} />
              </div>
            )}

            <section className="campaign-related-editor">
              <h2>Related Stories / Campaign Updates</h2>
              <div className="campaign-story-add">
                <select value={storyToAdd} onChange={(event) => setStoryToAdd(event.target.value)}>
                  <option value="">Choose an existing Story…</option>
                  {stories
                    .filter((story) => !storyLinks.some((link) => link.story_id === story.id))
                    .map((story) => (
                      <option key={story.id} value={story.id}>
                        {storyTitle(story.id)}
                      </option>
                    ))}
                </select>
                <button
                  className="admin-secondary"
                  type="button"
                  onClick={() => {
                    if (storyToAdd) {
                      setStoryLinks([
                        ...storyLinks,
                        { story_id: storyToAdd, relationship_type: "related", sort_order: storyLinks.length },
                      ]);
                      setStoryToAdd("");
                    }
                  }}
                >
                  Attach Story
                </button>
              </div>
              {storyLinks.map((link, index) => (
                <div className="campaign-story-link" key={link.story_id}>
                  <strong>{storyTitle(link.story_id)}</strong>
                  <select
                    value={link.relationship_type}
                    onChange={(event) =>
                      setStoryLinks(
                        storyLinks.map((item) =>
                          item.story_id === link.story_id
                            ? { ...item, relationship_type: event.target.value as CampaignRelationship }
                            : item
                        )
                      )
                    }
                  >
                    <option value="announcement">Announcement</option>
                    <option value="update">Update</option>
                    <option value="result">Result</option>
                    <option value="related">Related</option>
                  </select>
                  <button type="button" disabled={index === 0} onClick={() => setStoryLinks(arrayMove(storyLinks, index, index - 1))}>
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === storyLinks.length - 1}
                    onClick={() => setStoryLinks(arrayMove(storyLinks, index, index + 1))}
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => setStoryLinks(storyLinks.filter((item) => item.story_id !== link.story_id))}>
                    Remove
                  </button>
                </div>
              ))}
            </section>
          </main>

          <aside className="editor-inspector">
            <section>
              <p className="admin-kicker">Inspector</p>
              <h2>{selected ? labels[selected.blockType] : "Campaign settings"}</h2>
              {selected ? (
                <BlockInspector
                  block={selected}
                  media={media}
                  updateData={(patch) => updateSelected(patch, "data")}
                  updateSettings={(patch) => updateSelected(patch, "settings")}
                />
              ) : (
                <p className="admin-empty-inline">Select a block to edit it.</p>
              )}
            </section>

            <section>
              <h2>Campaign Hero & Details</h2>
              <MediaPicker
                assets={media}
                value={meta.hero_media_id}
                label="Choose hero image"
                onSelect={(asset) => setMeta({ hero_media_id: asset.id })}
              />
              <div className="admin-field-pair">
                <label>
                  <span>Start date</span>
                  <input type="date" value={meta.start_date} onChange={(event) => setMeta({ start_date: event.target.value })} />
                </label>
                <label>
                  <span>End date</span>
                  <input type="date" value={meta.end_date} onChange={(event) => setMeta({ end_date: event.target.value })} />
                </label>
              </div>
              <label>
                <span>Lifecycle override</span>
                <select
                  value={meta.lifecycle_override}
                  onChange={(event) => setMeta({ lifecycle_override: event.target.value as any })}
                >
                  <option value="">Automatic from dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </label>
              <label>
                <span>Location</span>
                <input value={meta.location} onChange={(event) => setMeta({ location: event.target.value })} />
              </label>
              <div className="admin-field-pair">
                <label>
                  <span>Goal amount</span>
                  <input
                    type="number"
                    min="0"
                    value={meta.goal_amount}
                    onChange={(event) => setMeta({ goal_amount: event.target.value })}
                  />
                </label>
                <label>
                  <span>Currency</span>
                  <input
                    maxLength={3}
                    value={meta.currency}
                    onChange={(event) => setMeta({ currency: event.target.value.toUpperCase() })}
                  />
                </label>
              </div>
              <div className="admin-field-pair">
                <label>
                  <span>Raised amount</span>
                  <input
                    type="number"
                    min="0"
                    value={meta.raised_amount}
                    onChange={(event) => setMeta({ raised_amount: event.target.value })}
                  />
                </label>
                <label>
                  <span>Progress source</span>
                  <select
                    value={meta.progress_source}
                    onChange={(event) => setMeta({ progress_source: event.target.value as any })}
                  >
                    <option value="none">None</option>
                    <option value="manual">Manual</option>
                    <option value="external">External</option>
                    <option value="embed">Embed</option>
                    <option value="api">API</option>
                  </select>
                </label>
              </div>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={meta.raised_amount_is_final}
                  onChange={(event) => setMeta({ raised_amount_is_final: event.target.checked })}
                />
                <span>Raised amount is final</span>
              </label>
              <label>
                <span>Progress updated</span>
                <input
                  type="datetime-local"
                  value={localDateTime(meta.progress_updated_at)}
                  onChange={(event) =>
                    setMeta({
                      progress_updated_at: event.target.value ? new Date(event.target.value).toISOString() : null,
                    })
                  }
                />
              </label>
              <label>
                <span>Donation / Action URL</span>
                <input
                  type="url"
                  value={meta.donation_url}
                  onChange={(event) => setMeta({ donation_url: event.target.value })}
                  placeholder="https://… or internal link"
                />
              </label>
              <label>
                <span>External provider</span>
                <select
                  value={meta.external_provider}
                  onChange={(event) => setMeta({ external_provider: event.target.value as any })}
                >
                  <option value="">None</option>
                  <option value="network_for_good">Network for Good</option>
                  <option value="bonterra">Bonterra</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                <span>External campaign ID</span>
                <input
                  value={meta.external_campaign_id}
                  onChange={(event) => setMeta({ external_campaign_id: event.target.value })}
                />
              </label>
              <div className="admin-field-pair">
                <label>
                  <span>Campaign status</span>
                  <select
                    value={meta.status}
                    onChange={(event) => setMeta({ status: event.target.value as any })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label>
                  <span>Translation status</span>
                  <select
                    value={translation.publication_status}
                    onChange={(event) => setTranslation({ publication_status: event.target.value as any })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Publication date</span>
                <input
                  type="datetime-local"
                  value={localDateTime(meta.published_at)}
                  onChange={(event) =>
                    setMeta({ published_at: event.target.value ? new Date(event.target.value).toISOString() : null })
                  }
                />
              </label>
              <label>
                <span>Schedule for</span>
                <input
                  type="datetime-local"
                  value={localDateTime(meta.scheduled_at)}
                  onChange={(event) =>
                    setMeta({ scheduled_at: event.target.value ? new Date(event.target.value).toISOString() : null })
                  }
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={meta.featured_home}
                  onChange={(event) => setMeta({ featured_home: event.target.checked })}
                />
                <span>Feature on Home</span>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={meta.featured_campaigns}
                  onChange={(event) => setMeta({ featured_campaigns: event.target.checked })}
                />
                <span>Feature on Campaigns</span>
              </label>
            </section>

            <section>
              <h2>Search appearance</h2>
              <label>
                <span>SEO title</span>
                <input
                  value={translation.seo_title}
                  onChange={(event) => setTranslation({ seo_title: event.target.value })}
                />
              </label>
              <label>
                <span>SEO description</span>
                <textarea
                  value={translation.seo_description}
                  onChange={(event) => setTranslation({ seo_description: event.target.value })}
                />
              </label>
            </section>

            {campaign?.campaign_sources.length ? (
              <section className="campaign-provenance">
                <h2>Migration provenance</h2>
                {campaign.campaign_sources.map((source) => (
                  <dl key={source.id}>
                    <div>
                      <dt>Legacy source</dt>
                      <dd>{source.source_title || source.source_url}</dd>
                    </div>
                    <div>
                      <dt>Source type</dt>
                      <dd>{source.source_type}</dd>
                    </div>
                    <div>
                      <dt>Original URL</dt>
                      <dd>
                        {source.source_url ? (
                          <a href={source.source_url} rel="external noopener noreferrer">
                            Open source ↗
                          </a>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Imported</dt>
                      <dd>{new Date(source.imported_at).toLocaleString()}</dd>
                    </div>
                  </dl>
                ))}
              </section>
            ) : null}

            {campaignId && translation.slug && (
              <Link className="admin-preview-link" href={`/${locale}/campaigns/${translation.slug}`} target="_blank">
                Open public preview ↗
              </Link>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
