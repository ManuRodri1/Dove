import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/our-story", "/what-we-do", "/child-sponsorship", "/vocational-training-center", "/donate", "/volunteer", "/travel-with-purpose", "/partnerships"].flatMap((path) => (["en", "es"] as const).map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    alternates: { languages: { en: `${siteUrl}/en${path}`, es: `${siteUrl}/es${path}` } },
  })));
}
