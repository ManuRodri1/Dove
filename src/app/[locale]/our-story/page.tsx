import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getHome } from "@/content/home";
import { getOurStory } from "@/content/our-story";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/StructuredData";
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
  const story = getOurStory(locale);
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: story.seo.title, url: `/${locale}/our-story` },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Header home={home} />
      <main id="main" tabIndex={-1}>
        <OurStory home={home} story={story} />
      </main>
      <Footer home={home} />
    </>
  );
}
