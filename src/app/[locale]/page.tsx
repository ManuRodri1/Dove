import { notFound } from "next/navigation";
import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import { OriginStory, DovePathway, SupportWays, ImpactStrip, ExperienceDove, PartnershipCallout, FinalCTA } from "@/components/HomeSections";
import FeaturedCampaign from "@/components/FeaturedCampaign";
import StoriesFromDove from "@/components/StoriesFromDove";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getHome, featuredCampaign } from "@/content/home";
import { getFeaturedStories } from "@/content/stories";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { seo } = getHome(locale);
  return localizedMetadata(locale, "", seo.title, seo.description);
}
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const stories = await getFeaturedStories(locale);
  return <><Header home={home} /><main id="main" tabIndex={-1}>
    <HeroVideo home={home} /><OriginStory home={home} /><DovePathway home={home} />
    <SupportWays home={home} /><ImpactStrip home={home} /><ExperienceDove home={home} />
    <PartnershipCallout home={home} /><FeaturedCampaign campaign={featuredCampaign} />
    <StoriesFromDove home={home} stories={stories} /><Newsletter home={home} /><FinalCTA home={home} />
  </main><Footer home={home} /></>;
}
