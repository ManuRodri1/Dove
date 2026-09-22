import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatWeDo from "@/components/WhatWeDo";
import { JsonLd } from "@/components/StructuredData";
import { getHome } from "@/content/home";
import { getWhatWeDo } from "@/content/what-we-do";
import { links } from "@/content/links";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getWhatWeDo(locale);
  const metadata = localizedMetadata(locale, "/what-we-do", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.heroImage.src, alt: content.heroImage.alt }] } };
}

export default async function WhatWeDoPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getWhatWeDo(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/what-we-do` },
  ]);
  return <>
    <JsonLd data={breadcrumbs} />
    <Header home={home} activeHref={links.whatWeDo(locale)} />
    <main id="main" tabIndex={-1}><WhatWeDo content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
