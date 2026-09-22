import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignDetail from "@/components/campaigns/CampaignDetail";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { isLocale, type Locale } from "@/i18n/config";
import { doveMedia } from "@/content/dove-media";
import { getCampaignBySlug, getCampaignTranslations } from "@/lib/cms/public-campaigns";
import { normalizePageTitle, siteUrl } from "@/lib/seo";
import { getBreadcrumbSchema, getCampaignWebPageSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const campaign = await getCampaignBySlug(locale, slug);
  if (!campaign) return {};

  const title = normalizePageTitle(campaign.seoTitle || campaign.title);
  const description = campaign.seoDescription || campaign.excerpt;
  const shareImage = campaign.heroImage?.url ?? doveMedia.history.primary.src;
  const shareAlt = campaign.title;

  const translations = await getCampaignTranslations(campaign.id);
  const hasEn = translations.some((t) => t.locale === "en");
  const hasEs = translations.some((t) => t.locale === "es");
  const enSlug = translations.find((t) => t.locale === "en")?.slug;
  const esSlug = translations.find((t) => t.locale === "es")?.slug;

  const alternates: Metadata["alternates"] = {
    canonical: `/${locale}/campaigns/${slug}`,
    ...(hasEn && hasEs && enSlug && esSlug
      ? {
          languages: {
            en: `/en/campaigns/${enSlug}`,
            es: `/es/campaigns/${esSlug}`,
            "x-default": `/en/campaigns/${enSlug}`,
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
      url: `/${locale}/campaigns/${slug}`,
      locale: locale === "es" ? "es_DO" : "en_US",
      siteName: "Dove Youth Development",
      images: [{ url: shareImage, alt: shareAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: shareImage, alt: shareAlt }],
    },
  };
}

export default async function CampaignPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const campaign = await getCampaignBySlug(locale, slug);
  if (!campaign) notFound();
  const home = getHome(locale);

  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: locale === "es" ? "Campañas" : "Campaigns", url: `/${locale}/campaigns` },
    { name: campaign.title, url: `/${locale}/campaigns/${campaign.slug}` },
  ]);
  const campaignSchema = getCampaignWebPageSchema(campaign, locale);

  return (
    <>
      <JsonLd data={[breadcrumbs, campaignSchema]} />
      <Header home={home} activeHref={`/${locale}/campaigns`} />
      <main id="main" tabIndex={-1}>
        <CampaignDetail campaign={campaign} locale={locale} />
      </main>
      <Footer home={home} />
    </>
  );
}
