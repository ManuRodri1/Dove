import type { BlockType } from "../../supabase/database.types";

// ==============================================================================
// CONTROLLED PRESENTATION ENUMS
// ==============================================================================
export const BLOCK_WIDTHS = ["narrow", "content", "wide", "full"] as const;
export type BlockWidth = (typeof BLOCK_WIDTHS)[number];

export const BLOCK_ALIGNMENTS = ["left", "center", "right"] as const;
export type BlockAlignment = (typeof BLOCK_ALIGNMENTS)[number];

export const MEDIA_POSITIONS = ["left", "right", "top", "bottom", "full"] as const;
export type MediaPosition = (typeof MEDIA_POSITIONS)[number];

export const BLOCK_THEMES = ["default", "warm", "teal", "dark", "accent"] as const;
export type BlockTheme = (typeof BLOCK_THEMES)[number];

export const BLOCK_SPACINGS = ["compact", "normal", "generous"] as const;
export type BlockSpacing = (typeof BLOCK_SPACINGS)[number];

export const IMAGE_FITS = ["cover", "contain"] as const;
export type ImageFit = (typeof IMAGE_FITS)[number];

export interface BlockSettings {
  width?: BlockWidth;
  alignment?: BlockAlignment;
  mediaPosition?: MediaPosition;
  theme?: BlockTheme;
  spacing?: BlockSpacing;
  imageFit?: ImageFit;
}

// ==============================================================================
// BLOCK DATA DEFINITIONS
// ==============================================================================

export interface HeadingBlockData {
  text: string;
  level?: 2 | 3 | 4;
}

export interface RichTextBlockData {
  html: string;
}

export interface ImageBlockData {
  mediaAssetId?: string;
  url: string;
  alt: string;
  caption?: string;
  focalX?: number;
  focalY?: number;
}

export interface ImageTextSplitBlockData {
  text: string;
  mediaAssetId?: string;
  url: string;
  alt: string;
  caption?: string;
  mediaPosition: "left" | "right";
}

export interface GalleryItem {
  mediaAssetId?: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlockData {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
}

export interface QuoteBlockData {
  quote: string;
  author?: string;
  role?: string;
  source?: string;
}

export interface YoutubeBlockData {
  videoId: string;
  title: string;
  caption?: string;
  startTime?: number;
}

export interface CalloutBlockData {
  title?: string;
  text: string;
  tone?: "info" | "warning" | "inspiration";
}

export interface LinkButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface ButtonGroupBlockData {
  buttons: LinkButton[];
}

export interface SectionIntroBlockData {
  eyebrow?: string;
  title: string;
  leadText?: string;
}

export interface DividerBlockData {
  style?: "line" | "dots" | "blank";
}

export interface SpacerBlockData {
  height?: "small" | "medium" | "large";
}

export type BlockDataMap = {
  heading: HeadingBlockData;
  rich_text: RichTextBlockData;
  image: ImageBlockData;
  image_text_split: ImageTextSplitBlockData;
  gallery: GalleryBlockData;
  quote: QuoteBlockData;
  youtube: YoutubeBlockData;
  callout: CalloutBlockData;
  button_group: ButtonGroupBlockData;
  section_intro: SectionIntroBlockData;
  divider: DividerBlockData;
  spacer: SpacerBlockData;
};

export interface StoryBlockInput<T extends BlockType = BlockType> {
  id?: string;
  block_type: T;
  sort_order: number;
  data: BlockDataMap[T];
  settings?: BlockSettings;
  visible?: boolean;
}

// ==============================================================================
// VALIDATION HELPERS
// ==============================================================================

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

export function isValidUrl(urlString: string): boolean {
  if (typeof urlString !== "string") return false;
  // Allow internal routes or valid secure https URLs
  if (urlString.startsWith("/")) return !urlString.startsWith("//");
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function sanitizeHtml(rawHtml: string): string {
  if (typeof rawHtml !== "string") return "";
  // Strip dangerous tags: <script>, <style>, <iframe>, <object>, <embed>, on* handlers, javascript: URIs
  const clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/\s*on\w+\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/href\s*=\s*(["'])javascript:[\s\S]*?\1/gi, 'href="#"')
    .replace(/src\s*=\s*(["'])javascript:[\s\S]*?\1/gi, 'src=""');

  return clean.trim();
}

export function validateBlockSettings(settings?: unknown): { valid: boolean; error?: string } {
  if (!settings || typeof settings !== "object") return { valid: true };
  const s = settings as Record<string, unknown>;

  if (s.width && !BLOCK_WIDTHS.includes(s.width as BlockWidth)) {
    return { valid: false, error: `Invalid width: ${s.width}` };
  }
  if (s.alignment && !BLOCK_ALIGNMENTS.includes(s.alignment as BlockAlignment)) {
    return { valid: false, error: `Invalid alignment: ${s.alignment}` };
  }
  if (s.mediaPosition && !MEDIA_POSITIONS.includes(s.mediaPosition as MediaPosition)) {
    return { valid: false, error: `Invalid mediaPosition: ${s.mediaPosition}` };
  }
  if (s.theme && !BLOCK_THEMES.includes(s.theme as BlockTheme)) {
    return { valid: false, error: `Invalid theme: ${s.theme}` };
  }
  if (s.spacing && !BLOCK_SPACINGS.includes(s.spacing as BlockSpacing)) {
    return { valid: false, error: `Invalid spacing: ${s.spacing}` };
  }
  if (s.imageFit && !IMAGE_FITS.includes(s.imageFit as ImageFit)) {
    return { valid: false, error: `Invalid imageFit: ${s.imageFit}` };
  }

  return { valid: true };
}

export function validateBlockData(
  type: BlockType,
  data: unknown
): { valid: boolean; sanitizedData?: unknown; error?: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Block data must be an object" };
  }
  const d = data as Record<string, unknown>;

  switch (type) {
    case "heading": {
      if (!isNonEmptyString(d.text)) {
        return { valid: false, error: "Heading requires a non-empty 'text'" };
      }
      const level = d.level ?? 2;
      if (![2, 3, 4].includes(level as number)) {
        return { valid: false, error: "Heading level must be 2, 3, or 4" };
      }
      return { valid: true, sanitizedData: { text: d.text.trim(), level } };
    }

    case "rich_text": {
      if (typeof d.html !== "string") {
        return { valid: false, error: "Rich text requires 'html' string" };
      }
      const sanitized = sanitizeHtml(d.html);
      return { valid: true, sanitizedData: { html: sanitized } };
    }

    case "image": {
      if (!isNonEmptyString(d.url) || !isValidUrl(d.url)) {
        return { valid: false, error: "Image requires a valid 'url'" };
      }
      if (typeof d.alt !== "string") {
        return { valid: false, error: "Image requires an 'alt' string" };
      }
      return {
        valid: true,
        sanitizedData: {
          mediaAssetId: typeof d.mediaAssetId === "string" ? d.mediaAssetId : undefined,
          url: d.url.trim(),
          alt: d.alt.trim(),
          caption: typeof d.caption === "string" ? d.caption.trim() : undefined,
          focalX: typeof d.focalX === "number" ? Math.max(0, Math.min(1, d.focalX)) : undefined,
          focalY: typeof d.focalY === "number" ? Math.max(0, Math.min(1, d.focalY)) : undefined,
        },
      };
    }

    case "image_text_split": {
      if (!isNonEmptyString(d.text)) {
        return { valid: false, error: "Image-text split requires non-empty 'text'" };
      }
      if (!isNonEmptyString(d.url) || !isValidUrl(d.url)) {
        return { valid: false, error: "Image-text split requires a valid 'url'" };
      }
      if (typeof d.alt !== "string") {
        return { valid: false, error: "Image-text split requires an 'alt' string" };
      }
      const pos = d.mediaPosition === "right" ? "right" : "left";
      return {
        valid: true,
        sanitizedData: {
          text: sanitizeHtml(d.text),
          mediaAssetId: typeof d.mediaAssetId === "string" ? d.mediaAssetId : undefined,
          url: d.url.trim(),
          alt: d.alt.trim(),
          caption: typeof d.caption === "string" ? d.caption.trim() : undefined,
          mediaPosition: pos,
        },
      };
    }

    case "gallery": {
      if (!Array.isArray(d.items) || d.items.length === 0) {
        return { valid: false, error: "Gallery requires a non-empty 'items' array" };
      }
      const validItems: GalleryItem[] = [];
      for (const item of d.items) {
        if (!item || typeof item !== "object" || !isNonEmptyString(item.url) || !isValidUrl(item.url)) {
          return { valid: false, error: "Each gallery item requires a valid 'url'" };
        }
        validItems.push({
          mediaAssetId: typeof item.mediaAssetId === "string" ? item.mediaAssetId : undefined,
          url: item.url.trim(),
          alt: typeof item.alt === "string" ? item.alt.trim() : "",
          caption: typeof item.caption === "string" ? item.caption.trim() : undefined,
        });
      }
      const cols = [2, 3, 4].includes(d.columns as number) ? (d.columns as 2 | 3 | 4) : 3;
      return { valid: true, sanitizedData: { items: validItems, columns: cols } };
    }

    case "quote": {
      if (!isNonEmptyString(d.quote)) {
        return { valid: false, error: "Quote block requires non-empty 'quote'" };
      }
      return {
        valid: true,
        sanitizedData: {
          quote: d.quote.trim(),
          author: typeof d.author === "string" ? d.author.trim() : undefined,
          role: typeof d.role === "string" ? d.role.trim() : undefined,
          source: typeof d.source === "string" ? d.source.trim() : undefined,
        },
      };
    }

    case "youtube": {
      if (!isNonEmptyString(d.videoId)) {
        return { valid: false, error: "YouTube block requires 'videoId'" };
      }
      // Sanitize videoId to ensure alphanumeric/dash/underscore only (standard YouTube IDs)
      if (!/^[a-zA-Z0-9_-]{6,15}$/.test(d.videoId.trim())) {
        return { valid: false, error: "Invalid YouTube videoId format" };
      }
      return {
        valid: true,
        sanitizedData: {
          videoId: d.videoId.trim(),
          title: typeof d.title === "string" ? d.title.trim() : "YouTube video",
          caption: typeof d.caption === "string" ? d.caption.trim() : undefined,
          startTime: typeof d.startTime === "number" && d.startTime >= 0 ? d.startTime : undefined,
        },
      };
    }

    case "callout": {
      if (!isNonEmptyString(d.text)) {
        return { valid: false, error: "Callout requires non-empty 'text'" };
      }
      const tone = ["info", "warning", "inspiration"].includes(d.tone as string)
        ? (d.tone as "info" | "warning" | "inspiration")
        : "info";
      return {
        valid: true,
        sanitizedData: {
          title: typeof d.title === "string" ? d.title.trim() : undefined,
          text: sanitizeHtml(d.text),
          tone,
        },
      };
    }

    case "button_group": {
      if (!Array.isArray(d.buttons) || d.buttons.length === 0) {
        return { valid: false, error: "Button group requires a non-empty 'buttons' array" };
      }
      const validButtons: LinkButton[] = [];
      for (const btn of d.buttons) {
        if (!btn || typeof btn !== "object" || !isNonEmptyString(btn.label) || !isNonEmptyString(btn.href)) {
          return { valid: false, error: "Button requires 'label' and 'href'" };
        }
        if (!isValidUrl(btn.href)) {
          return { valid: false, error: `Invalid button href: ${btn.href}` };
        }
        const variant = ["primary", "secondary", "outline"].includes(btn.variant as string)
          ? (btn.variant as "primary" | "secondary" | "outline")
          : "primary";
        validButtons.push({
          label: btn.label.trim(),
          href: btn.href.trim(),
          variant,
        });
      }
      return { valid: true, sanitizedData: { buttons: validButtons } };
    }

    case "section_intro": {
      if (!isNonEmptyString(d.title)) {
        return { valid: false, error: "Section intro requires non-empty 'title'" };
      }
      return {
        valid: true,
        sanitizedData: {
          eyebrow: typeof d.eyebrow === "string" ? d.eyebrow.trim() : undefined,
          title: d.title.trim(),
          leadText: typeof d.leadText === "string" ? d.leadText.trim() : undefined,
        },
      };
    }

    case "divider": {
      const style = ["line", "dots", "blank"].includes(d.style as string)
        ? (d.style as "line" | "dots" | "blank")
        : "line";
      return { valid: true, sanitizedData: { style } };
    }

    case "spacer": {
      const height = ["small", "medium", "large"].includes(d.height as string)
        ? (d.height as "small" | "medium" | "large")
        : "medium";
      return { valid: true, sanitizedData: { height } };
    }

    default:
      return { valid: false, error: `Unsupported block type: ${type}` };
  }
}
