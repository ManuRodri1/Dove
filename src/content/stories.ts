import "server-only";

import type { Locale } from "@/i18n/config";
import type { DoveImage } from "./dove-media";
import { getFeaturedStories as getCmsFeatured, getStories } from "@/lib/cms/public-stories";

export type Story = {
  id: string;
  slug: string;
  locale: Locale;
  category: string | null;
  title: string;
  excerpt: string;
  image: DoveImage | null;
  publishedAt: string | null;
  featured: boolean;
  status: "draft" | "published";
  verified: boolean;
  href: string | null;
};

export async function getFeaturedStories(locale: Locale): Promise<Story[]> {
  const featured = await getCmsFeatured(locale, "home", 3);
  const featuredIds = new Set(featured.map((story) => story.id));
  const latest = featured.length < 3
    ? (await getStories({ locale, limit: 12 })).items.filter((story) => !featuredIds.has(story.id))
    : [];
  const rows = [...featured, ...latest].slice(0, 3);

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    locale,
    category: row.categories[0]?.name ?? null,
    title: row.title,
    excerpt: row.excerpt,
    image: row.coverImage ? {
      src: row.coverImage.url,
      alt: row.coverImage.alt,
      width: row.coverImage.width ?? 1600,
      height: row.coverImage.height ?? 1000,
    } : null,
    publishedAt: row.publishedAt,
    featured: row.featuredHome,
    status: "published",
    verified: true,
    href: row.href,
  }));
}

