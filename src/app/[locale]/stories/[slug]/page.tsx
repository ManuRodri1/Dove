import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryDetail from "@/components/stories/StoryDetail";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/seo";
import { getStories, getStoryBySlug } from "@/lib/cms/public-stories";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const story = await getStoryBySlug({ locale, slug });
  if (!story) return {};
  const title = story.seoTitle || `${story.title} | Dove Youth Development`;
  const description = story.seoDescription || story.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/stories/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${locale}/stories/${slug}`,
      publishedTime: story.publishedAt,
      authors: story.authorName ? [story.authorName] : undefined,
      images: story.coverImage ? [{ url: story.coverImage.url, alt: story.coverImage.alt }] : undefined,
      locale: locale === "es" ? "es_DO" : "en_US",
    },
    metadataBase: new URL(siteUrl),
  };
}

export default async function StoryPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const story = await getStoryBySlug({ locale, slug });
  if (!story) notFound();
  const recent = (await getStories({ locale, limit: 6 })).items.filter((item) => item.id !== story.id).slice(0, 3);
  const home = getHome(locale);
  return <>
    <Header home={home} activeHref={`/${locale}/stories`} />
    <main id="main" tabIndex={-1}><StoryDetail story={story} recent={recent} home={home} /></main>
    <Footer home={home} />
  </>;
}

