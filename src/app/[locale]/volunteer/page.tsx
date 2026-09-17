import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VolunteerPage from "@/components/VolunteerPage";
import { getHome } from "@/content/home";
import { getVolunteer } from "@/content/volunteer";
import { links } from "@/content/links";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getVolunteer(locale);
  const metadata = localizedMetadata(locale, "/volunteer", content.seo.title, content.seo.description);
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: content.media.hero.poster, alt: content.hero.videoTitle }],
    },
  };
}

export default async function VolunteerRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getVolunteer(locale);
  return <>
    <Header home={home} activeHref={links.volunteer.page(locale)} />
    <main id="main" tabIndex={-1}><VolunteerPage content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
