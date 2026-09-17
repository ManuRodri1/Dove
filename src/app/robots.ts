import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", ...(process.env.SITE_INDEXABLE === "true" ? { allow: "/" } : { disallow: "/" }) }, sitemap: `${siteUrl}/sitemap.xml` };
}
