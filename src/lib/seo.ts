import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { doveMedia } from "@/content/dove-media";

export const siteUrl = process.env.SITE_URL || "https://www.doveyouthdevelopment.org";
export function normalizePageTitle(title: string, isHome = false): string {
  return isHome ? "Dove Youth Development" : title.replace(/\s*\|\s*Dove Youth Development\s*$/, "");
}
export function localizedMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const route = `/${locale}${path}`;
  const pageTitle = normalizePageTitle(title, !path);
  const shareImage = path ? doveMedia.history.primary.src : doveMedia.hero.poster.src;
  const shareAlt = "Dove Youth Development, Puerto Plata";
  return {
    title: !path ? { absolute: pageTitle } : pageTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: route, languages: { en: `/en${path}`, es: `/es${path}`, "x-default": `/en${path}` } },
    openGraph: { title: pageTitle, description, url: route, type: "website", siteName: "Dove Youth Development",
      locale: locale === "es" ? "es_DO" : "en_US", alternateLocale: locale === "es" ? ["en_US"] : ["es_DO"],
      images: [{ url: shareImage, alt: shareAlt }] },
    twitter: { card: "summary_large_image", title: pageTitle, description, images: [{ url: shareImage, alt: shareAlt }] },
  };
}
