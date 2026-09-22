import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getHome } from "@/content/home";
import { getOurImpact } from "@/content/our-impact";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OurImpact from "@/components/OurImpact";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getOurImpact(locale);
  return localizedMetadata(locale, "/our-impact", content.seo.title, content.seo.description);
}

export default async function OurImpactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getOurImpact(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: content.seo.title, url: `/${locale}/our-impact` },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Header home={home} activeHref={`/${locale}/our-impact`} />
      <main id="main" tabIndex={-1}>
        <OurImpact home={home} content={content} />
      </main>
      <Footer home={home} />
    </>
  );
}
