import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OurTeam from "@/components/OurTeam";
import { getHome } from "@/content/home";
import { links } from "@/content/links";
import { getTeam } from "@/content/team";
import { isLocale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getTeam(locale);
  const metadata = localizedMetadata(locale, "/our-team", content.seo.title, content.seo.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: content.leader.image!.src, alt: content.leader.image!.alt }] } };
}

export default async function OurTeamPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const home = getHome(locale);
  const content = getTeam(locale);
  return <>
    <Header home={home} activeHref={links.ourTeam(locale)} />
    <main id="main" tabIndex={-1}><OurTeam content={content} home={home} /></main>
    <Footer home={home} />
  </>;
}
