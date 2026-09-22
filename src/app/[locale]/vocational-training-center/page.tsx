import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VocationalTrainingCenter, { VocationalStructuredData } from "@/components/VocationalTrainingCenter";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { getVocationalTraining } from "@/content/vocational-training";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getVocationalTraining(locale);
  const metadata = localizedMetadata(locale, "/vocational-training-center", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.heroImage.src, alt: content.heroImage.alt }] } };
}

export default async function VocationalTrainingPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getVocationalTraining(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/vocational-training-center` },
  ]);
  return <>
    <JsonLd data={breadcrumbs} />
    <VocationalStructuredData content={content} home={home} />
    <Header home={home} />
    <main id="main" tabIndex={-1}><VocationalTrainingCenter content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
