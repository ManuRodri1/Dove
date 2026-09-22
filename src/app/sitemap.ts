import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getPublicStorySlugs } from "@/lib/cms/public-stories";
import { getPublicCampaignSlugs } from "@/lib/cms/public-campaigns";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = [
    "",
    "/our-story",
    "/our-team",
    "/our-impact",
    "/what-we-do",
    "/child-sponsorship",
    "/vocational-training-center",
    "/donate",
    "/volunteer",
    "/travel-with-purpose",
    "/partnerships",
    "/stories",
    "/campaigns",
    "/contact",
    "/privacy",
    "/terms",
  ].flatMap((path) =>
    (["en", "es"] as const).map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: {
        languages: {
          en: `${siteUrl}/en${path}`,
          es: `${siteUrl}/es${path}`,
          "x-default": `${siteUrl}/en${path}`,
        },
      },
    }))
  );

  const [storyItems, campaignItems] = await Promise.all([
    getPublicStorySlugs(),
    getPublicCampaignSlugs(),
  ]);

  const stories = storyItems.map(({ locale, slug, lastModified }) => ({
    url: `${siteUrl}/${locale}/stories/${slug}`,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  }));

  const campaigns = campaignItems.map(({ locale, slug, lastModified }) => ({
    url: `${siteUrl}/${locale}/campaigns/${slug}`,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  }));

  return [...fixed, ...stories, ...campaigns];
}
