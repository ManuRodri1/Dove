import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TravelWithPurpose, { TravelWithPurposeStructuredData } from "@/components/TravelWithPurpose";
import { getHome } from "@/content/home";
import { getTravelWithPurpose } from "@/content/travel-with-purpose";
import { links } from "@/content/links";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getTravelWithPurpose(locale);
  const metadata = localizedMetadata(locale, "/travel-with-purpose", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.media.hero.src, alt: content.media.hero.alt }] } };
}

export default async function TravelWithPurposeRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getTravelWithPurpose(locale);
  return <>
    <Header home={home} activeHref={links.travel.page(locale)} />
    <main id="main" tabIndex={-1}>
      <TravelWithPurposeStructuredData content={content} home={home} />
      <TravelWithPurpose content={content} home={home} />
    </main>
    <Footer home={home} />
  </>;
}
