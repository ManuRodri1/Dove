import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/StructuredData";
import { getPrivacyContent } from "@/content/legal/privacy";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getHome } from "@/content/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const doc = getPrivacyContent(raw as Locale);
  return localizedMetadata(
    raw,
    "/privacy",
    `${doc.title} | Dove Youth Development`,
    doc.summary
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const doc = getPrivacyContent(locale);
  const home = getHome(locale);

  const breadcrumbs = getBreadcrumbSchema([
    { name: home.ui.home, url: `/${locale}` },
    { name: doc.title, url: `/${locale}/privacy` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <LegalPageLayout locale={locale} doc={doc} />
    </>
  );
}
