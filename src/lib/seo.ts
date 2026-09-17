import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { doveMedia } from "@/content/dove-media";

export const siteUrl = process.env.SITE_URL || "https://www.doveyouthdevelopment.org";
export function localizedMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const route = `/${locale}${path}`;
  return {
    title, description, metadataBase: new URL(siteUrl),
    alternates: { canonical: route, languages: { en: `/en${path}`, es: `/es${path}`, "x-default": path || "/" } },
    openGraph: { title, description, url: route, type: "website", siteName: "Dove Youth Development",
      locale: locale === "es" ? "es_DO" : "en_US", alternateLocale: locale === "es" ? ["en_US"] : ["es_DO"],
      images: [{ url: path ? doveMedia.history.primary.src : doveMedia.hero.poster.src, alt: "Dove Youth Development, Puerto Plata" }] },
  };
}
