import { siteUrl } from "@/lib/seo";
import { doveMedia } from "@/content/dove-media";
import { links } from "@/content/links";
import type { Locale } from "@/i18n/config";
import type { PublicStoryDetail } from "@/lib/cms/public-stories";
import type { PublicCampaignDetail } from "@/lib/cms/public-campaigns";

export function getOrganizationSchema() {
  return {
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name: "Dove Youth Development",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#logo`,
      url: doveMedia.logo.main.src,
      caption: "Dove Youth Development",
    },
    image: doveMedia.logo.main.src,
    description:
      "Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.",
    email: "executivedirector@doveyouthdevelopment.org",
    telephone: [
      "+1-809-676-4071",
      "+1-612-442-5974",
    ],
    sameAs: [
      "https://www.linkedin.com/company/doveyouthdevelopment",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Dove Youth Development",
    description:
      "Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: ["en", "es"],
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

export function getStoryArticleSchema(story: PublicStoryDetail, locale: Locale) {
  const pageUrl = `${siteUrl}/${locale}/stories/${story.slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    headline: story.title,
    description: story.seoDescription || story.excerpt,
    inLanguage: locale === "es" ? "es-DO" : "en-US",
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
  if (story.coverImage?.url) {
    schema.image = [story.coverImage.url];
  }
  if (story.authorName?.trim()) {
    const trimmed = story.authorName.trim();
    const isInternalId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed) ||
      /^[0-9a-f]{24,}$/i.test(trimmed);
    if (!isInternalId) {
      schema.author = {
        "@type": "Person",
        name: trimmed,
      };
    }
  }
  return schema;
}

export function getCampaignWebPageSchema(campaign: PublicCampaignDetail, locale: Locale) {
  const pageUrl = `${siteUrl}/${locale}/campaigns/${campaign.slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    name: campaign.title,
    description: campaign.seoDescription || campaign.excerpt,
    inLanguage: locale === "es" ? "es-DO" : "en-US",
    datePublished: campaign.publishedAt,
    dateModified: campaign.publishedAt,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
  if (campaign.heroImage?.url) {
    schema.image = [campaign.heroImage.url];
  }
  return schema;
}

export function getFaqSchema(
  heading: string,
  items: ReadonlyArray<{ readonly question: string; readonly answer: string }> | Array<{ question: string; answer: string }>,
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    name: heading,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}
