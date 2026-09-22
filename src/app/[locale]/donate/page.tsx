import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonatePage, { DonateStructuredData } from "@/components/DonatePage";
import { JsonLd } from "@/components/StructuredData";
import { getDonate } from "@/content/donate";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getDonate(locale);
  const metadata = localizedMetadata(locale, "/donate", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.video.poster, alt: content.hero.videoTitle }] } };
}

export default async function DonateRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getDonate(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/donate` },
  ]);
  return <>
    <JsonLd data={breadcrumbs} />
    <DonateStructuredData content={content} home={home} />
    <Header home={home} donateActive />
    <main id="main" tabIndex={-1}><DonatePage content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
