import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnershipsPage, { PartnershipsStructuredData } from "@/components/PartnershipsPage";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { links } from "@/content/links";
import { getPartnerships } from "@/content/partnerships";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getPartnerships(locale);
  const metadata = localizedMetadata(locale, "/partnerships", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.media.hero.src, alt: content.media.hero.alt }] } };
}

export default async function PartnershipsRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getPartnerships(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/partnerships` },
  ]);
  return <>
    <JsonLd data={breadcrumbs} />
    <Header home={home} activeHref={links.partnerships(locale)} />
    <main id="main" tabIndex={-1}>
      <PartnershipsStructuredData content={content} home={home} />
      <PartnershipsPage content={content} home={home} />
    </main>
    <Footer home={home} />
  </>;
}
