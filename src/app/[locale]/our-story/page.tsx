import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getHome } from "@/content/home";
import { getOurStory } from "@/content/our-story";
import { localizedMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OurStory from "@/components/OurStory";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { seo } = getOurStory(locale);
  return localizedMetadata(locale, "/our-story", seo.title, seo.description);
}
export default async function OurStoryPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  return <><Header home={home} /><main id="main" tabIndex={-1}><OurStory home={home} story={getOurStory(locale)} /></main><Footer home={home} /></>;
}
