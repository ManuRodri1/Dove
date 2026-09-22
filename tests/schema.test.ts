import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getStoryArticleSchema,
  getCampaignWebPageSchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from "../src/lib/schema";

test("Organization schema uses only verified properties", () => {
  const org = getOrganizationSchema();
  assert.equal(org["@type"], "NGO");
  assert.equal(org["@id"], "https://www.doveyouthdevelopment.org/#organization");
  assert.equal(org.name, "Dove Youth Development");
  assert.equal(org.url, "https://www.doveyouthdevelopment.org");
  assert.equal(org.email, "executivedirector@doveyouthdevelopment.org");
  assert.deepEqual(org.telephone, ["+1-809-676-4071", "+1-612-442-5974"]);
  assert.deepEqual(org.sameAs, ["https://www.linkedin.com/company/doveyouthdevelopment"]);
  assert.equal(org.logo.url, "https://res.cloudinary.com/vloh9uw1/image/fetch/f_auto,q_auto/https://static.wixstatic.com/media/294108_5540425cbe8648ff94b4acce95758bf1~mv2.png");
  assert.ok(!("address" in org), "Must not have unconfirmed physical address");
  assert.ok(!("aggregateRating" in org), "Must not have unconfirmed rating");
  assert.ok(!org.description.includes("at-risk"), "Must not include unsupported labels");
});

test("WebSite schema references authoritative organization", () => {
  const site = getWebSiteSchema();
  assert.equal(site["@type"], "WebSite");
  assert.equal(site["@id"], "https://www.doveyouthdevelopment.org/#website");
  assert.equal(site.publisher["@id"], "https://www.doveyouthdevelopment.org/#organization");
  assert.deepEqual(site.inLanguage, ["en", "es"]);
});

test("Story Article schema omits author when no public author exists", () => {
  const story = {
    id: "story-1",
    slug: "youth-empowerment",
    locale: "en" as const,
    title: "Youth Empowerment in DR",
    excerpt: "Story excerpt here",
    seoTitle: null,
    seoDescription: null,
    authorName: null,
    publishedAt: "2026-03-01T12:00:00Z",
    coverImage: {
      url: "https://static.wixstatic.com/media/cover.jpg",
      alt: "Youth",
      width: 800,
      height: 600,
      focalX: null,
      focalY: null,
    },
    categories: [],
    tags: [],
    featuredHome: false,
    featuredStories: false,
    href: "/en/stories/youth-empowerment",
    blocks: [],
    readingMinutes: 2,
  };

  const schema = getStoryArticleSchema(story, "en") as any;
  assert.equal(schema["@type"], "Article");
  assert.equal(schema["@id"], "https://www.doveyouthdevelopment.org/en/stories/youth-empowerment#article");
  assert.equal(schema.publisher?.["@id"], "https://www.doveyouthdevelopment.org/#organization");
  assert.equal(schema.headline, "Youth Empowerment in DR");
  assert.equal(schema.author, undefined, "Author must be omitted when authorName is null");
});

test("Story Article schema omits author when authorName is a system UUID or hex ID", () => {
  const story = {
    id: "story-2",
    slug: "community-work",
    locale: "en" as const,
    title: "Community Work",
    excerpt: "Story excerpt",
    seoTitle: null,
    seoDescription: null,
    authorName: "e58b3e8a-4d2b-4fa8-bcf6-5085e3a8b29c",
    publishedAt: "2026-03-01T12:00:00Z",
    coverImage: null,
    categories: [],
    tags: [],
    featuredHome: false,
    featuredStories: false,
    href: "/en/stories/community-work",
    blocks: [],
    readingMinutes: 1,
  };

  const schema = getStoryArticleSchema(story, "en") as any;
  assert.equal(schema.author, undefined, "UUID author name must be omitted");
});

test("Story Article schema includes author only when a genuine human name is present", () => {
  const story = {
    id: "story-3",
    slug: "community-voices",
    locale: "en" as const,
    title: "Community Voices",
    excerpt: "Story excerpt",
    seoTitle: null,
    seoDescription: null,
    authorName: "Maria Rodriguez",
    publishedAt: "2026-03-01T12:00:00Z",
    coverImage: null,
    categories: [],
    tags: [],
    featuredHome: false,
    featuredStories: false,
    href: "/en/stories/community-voices",
    blocks: [],
    readingMinutes: 1,
  };

  const schema = getStoryArticleSchema(story, "en") as any;
  assert.deepEqual(schema.author, {
    "@type": "Person",
    name: "Maria Rodriguez",
  });
});

test("Campaign WebPage schema avoids fake Event schemas", () => {
  const campaign = {
    id: "camp-1",
    slug: "vocational-center-2026",
    locale: "en" as const,
    title: "Vocational Center 2026",
    eyebrow: "Vocational Expansion",
    headline: "Expanding practical skills",
    excerpt: "Campaign excerpt",
    seoTitle: null,
    seoDescription: null,
    publishedAt: "2026-01-01T00:00:00Z",
    startDate: null,
    endDate: null,
    lifecycle: "active" as const,
    featuredHome: false,
    featuredCampaigns: false,
    sortOrder: 1,
    heroImage: {
      url: "https://static.wixstatic.com/media/camp.jpg",
      alt: "Campaign",
      width: 800,
      height: 600,
      focalX: null,
      focalY: null,
    },
    categories: [],
    tags: [],
    href: "/en/campaigns/vocational-center-2026",
    blocks: [],
    readingMinutes: 2,
    goal: {
      hasGoal: true,
      targetAmount: 10000,
      currentAmount: 5000,
      currency: "USD" as const,
      percent: 50,
      source: "manual" as const,
      sourceLabel: null,
    },
    donateCta: {
      label: "Donate",
      url: "https://dovemissions.networkforgood.com",
    },
  };

  const schema = getCampaignWebPageSchema(campaign as any, "en") as any;
  assert.equal(schema["@type"], "WebPage");
  assert.equal(schema["@id"], "https://www.doveyouthdevelopment.org/en/campaigns/vocational-center-2026#webpage");
  assert.equal(schema.publisher?.["@id"], "https://www.doveyouthdevelopment.org/#organization");
});
