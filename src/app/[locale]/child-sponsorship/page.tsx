import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChildSponsorship, { SponsorshipStructuredData } from "@/components/ChildSponsorship";
import { JsonLd } from "@/components/StructuredData";
import { getChildSponsorship } from "@/content/child-sponsorship";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getChildSponsorship(locale);
  const metadata = localizedMetadata(locale, "/child-sponsorship", content.seo.title, content.seo.description);
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [{ url: content.heroImage.src, alt: content.heroImage.alt }] },
  };
}

export default async function ChildSponsorshipPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getChildSponsorship(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/child-sponsorship` },
  ]);
  return <>
    <JsonLd data={breadcrumbs} />
    <SponsorshipStructuredData content={content} home={home} />
    <Header home={home} />
    <main id="main" tabIndex={-1}><ChildSponsorship content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
