import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactPage } from "@/components/ContactPage";
import { JsonLd } from "@/components/StructuredData";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { contactEn } from "@/i18n/messages/contact-copy";
import { contactEs } from "@/i18n/messages/contact-es-copy";
import { links } from "@/content/links";
import { getHome } from "@/content/home";
import { getBreadcrumbSchema } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = raw === "es" ? contactEs : contactEn;
  return localizedMetadata(raw, "/contact", copy.seo.title, copy.seo.description);
}

export default async function ContactRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const home = getHome(locale);
  const copy = locale === "es" ? contactEs : contactEn;
  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: copy.seo.title, url: `/${locale}/contact` },
  ]);
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Header home={home} activeHref={links.contact(locale)} />
      <main id="main" tabIndex={-1}>
        <ContactPage locale={locale} />
      </main>
      <Footer home={home} />
    </>
  );
}
