import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignDetail from "@/components/campaigns/CampaignDetail";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";
import { getCampaignBySlug } from "@/lib/cms/public-campaigns";
import { siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const campaign = await getCampaignBySlug(locale, slug); if (!campaign) return {}; const title = campaign.seoTitle || `${campaign.title} | Dove Youth Development`; const description = campaign.seoDescription || campaign.excerpt; return { title, description, metadataBase: new URL(siteUrl), alternates: { canonical: `/${locale}/campaigns/${slug}` }, openGraph: { title, description, type: "article", url: `/${locale}/campaigns/${slug}`, locale: locale === "es" ? "es_DO" : "en_US", images: campaign.heroImage ? [{ url: campaign.heroImage.url, alt: campaign.title }] : undefined } }; }
export default async function CampaignPage({ params }: Props) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const campaign = await getCampaignBySlug(locale, slug); if (!campaign) notFound(); const home = getHome(locale); return <><Header home={home} activeHref={`/${locale}/campaigns`} /><main id="main" tabIndex={-1}><CampaignDetail campaign={campaign} locale={locale} /></main><Footer home={home} /></>; }
