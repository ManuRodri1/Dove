import "server-only";
import type { Locale } from "@/i18n/config";
import type { DoveImage } from "./dove-media";

export type Story = {
  id: string; slug: string; locale: Locale; category: string; title: string;
  excerpt: string; image: DoveImage | null; publishedAt: string | null;
  featured: boolean; status: "draft" | "published"; verified: boolean;
  /** Set only after an article destination has been verified during migration. */
  href: string | null;
};
// TODO: CONNECT VERIFIED STORIES / NEWS CONTENT SOURCE
const migratedStories: Story[] = [];
export async function getFeaturedStories(locale: Locale): Promise<Story[]> {
  const published = migratedStories.filter((story) => story.locale === locale && story.featured && story.verified && story.status === "published" && story.publishedAt && story.href);
  if (published.length || process.env.NODE_ENV !== "development") return published.slice(0, 3);
  return ["Leonela Peña", "Jodelka & Elian", locale === "es" ? "Experiencias de voluntariado" : "Volunteer experiences"].map((title, i) => ({
    id: `migration-${i}`, slug: ["leonela-pena", "jodelka-and-elian", "volunteer-experiences"][i], locale,
    category: locale === "es" ? "Archivo de Dove" : "Dove archive", title, excerpt: "", image: null,
    publishedAt: null, featured: true, status: "draft", verified: false, href: null,
  }));
}
