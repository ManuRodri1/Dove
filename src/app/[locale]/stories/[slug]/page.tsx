import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryDetail from "@/components/stories/StoryDetail";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { isLocale, type Locale } from "@/i18n/config";
import { doveMedia } from "@/content/dove-media";
import { normalizePageTitle, siteUrl } from "@/lib/seo";
import { getStories, getStoryBySlug, getStoryTranslations } from "@/lib/cms/public-stories";
import { getBreadcrumbSchema, getStoryArticleSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const story = await getStoryBySlug({ locale, slug });
  if (!story) return {};

  const title = normalizePageTitle(story.seoTitle || story.title);
  const description = story.seoDescription || story.excerpt;
  const shareImage = story.coverImage?.url ?? doveMedia.history.primary.src;
  const shareAlt = story.coverImage?.alt ?? story.title;

  const translations = await getStoryTranslations(story.id);
  const hasEn = translations.some((t) => t.locale === "en");
  const hasEs = translations.some((t) => t.locale === "es");
  const enSlug = translations.find((t) => t.locale === "en")?.slug;
  const esSlug = translations.find((t) => t.locale === "es")?.slug;

  const alternates: Metadata["alternates"] = {
    canonical: `/${locale}/stories/${slug}`,
    ...(hasEn && hasEs && enSlug && esSlug
      ? {
          languages: {
            en: `/en/stories/${enSlug}`,
            es: `/es/stories/${esSlug}`,
            "x-default": `/en/stories/${enSlug}`,
          },
        }
      : {}),
  };

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${locale}/stories/${slug}`,
      publishedTime: story.publishedAt,
      authors: story.authorName ? [story.authorName] : undefined,
      images: [{ url: shareImage, alt: shareAlt }],
      locale: locale === "es" ? "es_DO" : "en_US",
      siteName: "Dove Youth Development",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: shareImage, alt: shareAlt }],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const story = await getStoryBySlug({ locale, slug });
  if (!story) notFound();
  const recent = (await getStories({ locale, limit: 6 })).items.filter((item) => item.id !== story.id).slice(0, 3);
  const home = getHome(locale);

  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: locale === "es" ? "Historias" : "Stories", url: `/${locale}/stories` },
    { name: story.title, url: `/${locale}/stories/${story.slug}` },
  ]);
  const articleSchema = getStoryArticleSchema(story, locale);

  return (
    <>
      <JsonLd data={[breadcrumbs, articleSchema]} />
      <Header home={home} activeHref={`/${locale}/stories`} />
      <main id="main" tabIndex={-1}>
        <StoryDetail story={story} recent={recent} home={home} />
      </main>
      <Footer home={home} />
    </>
  );
}
