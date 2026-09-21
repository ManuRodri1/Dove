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
  isFallback?: boolean;
};

export async function getFeaturedStories(locale: Locale): Promise<Story[]> {
  const featured = await getCmsFeatured(locale, "home", 3);
  const featuredIds = new Set(featured.map((story) => story.id));
  const latest = featured.length < 3
    ? (await getStories({ locale, limit: 12 })).items.filter((story) => !featuredIds.has(story.id))
    : [];
  const rows = [...featured, ...latest].slice(0, 3);

  const stories: Story[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    locale: row.locale ?? locale,
    category: row.categories[0]?.name ?? null,
    title: row.title,
    excerpt: row.excerpt,
    image: row.coverImage ? {
      src: row.coverImage.url,
      alt: row.coverImage.alt,
    } : null,
    publishedAt: row.publishedAt,
    featured: row.featuredHome,
    status: "published",
    verified: true,
    href: row.href,
    isFallback: false,
  }));

  // If locale is Spanish and fewer than 3 stories exist, backfill with published English stories
  if (locale === "es" && stories.length < 3) {
    const existingIds = new Set(stories.map((s) => s.id));
    const enFeatured = await getCmsFeatured("en", "home", 3);
    const enFeaturedIds = new Set(enFeatured.map((story) => story.id));
    const enLatest = (await getStories({ locale: "en", limit: 12 })).items.filter(
      (story) => !enFeaturedIds.has(story.id)
    );
    const enPool = [...enFeatured, ...enLatest].filter((story) => !existingIds.has(story.id));
    const needed = 3 - stories.length;
    const fallbackRows = enPool.slice(0, needed);

    for (const row of fallbackRows) {
      stories.push({
        id: row.id,
        slug: row.slug,
        locale: row.locale ?? "en",
        category: row.categories[0]?.name ?? null,
        title: row.title,
        excerpt: row.excerpt,
        image: row.coverImage ? {
          src: row.coverImage.url,
          alt: row.coverImage.alt,
        } : null,
        publishedAt: row.publishedAt,
        featured: row.featuredHome,
        status: "published",
        verified: true,
        href: row.href,
        isFallback: true,
      });
    }
  }

  return stories;
}

