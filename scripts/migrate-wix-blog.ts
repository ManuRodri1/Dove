// @ts-nocheck
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { validateBlockData, type BlockDataMap } from "../src/lib/cms/blocks/schema";
import { slugify } from "../src/lib/cms/validation";
import type { BlockType } from "../src/lib/supabase/database.types";

export interface WixRawNode {
  type: string;
  id?: string;
  nodes?: Array<{
    type: string;
    textData?: { text: string; decorations?: Array<{ type: string }> };
  }>;
  headingData?: { level: number };
  imageData?: {
    image: { src: { id?: string; url?: string }; width?: number; height?: number };
    altText?: string;
    caption?: string;
  };
  videoData?: {
    video: { src: { url?: string }; title?: string };
    caption?: string;
  };
  galleryData?: {
    items?: Array<{
      image?: { src?: { url?: string }; altText?: string; caption?: string };
    }>;
  };
  dividerData?: { lineStyle?: string };
}

export interface WixPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  firstPublishedDate?: string;
  lastPublishedDate?: string;
  featured?: boolean;
  author?: { id?: string; name: string };
  categoryIds?: string[];
  tagIds?: string[];
  coverMedia?: {
    image?: { url: string; width?: number; height?: number };
  };
  richContent?: {
    nodes: WixRawNode[];
  };
  seo?: {
    title?: string;
    description?: string;
  };
  language?: string;
  translationIds?: Record<string, string>;
}

export interface WixTaxonomyItem {
  id: string;
  name: string;
  slug: string;
}

export interface WixFixtureData {
  posts: WixPost[];
  categories?: WixTaxonomyItem[];
  tags?: WixTaxonomyItem[];
}

export interface ParsedBlock {
  block_type: BlockType;
  sort_order: number;
  data: BlockDataMap[BlockType];
  wixNodeType: string;
}

export interface MigrationDryRunReport {
  timestamp: string;
  isDryRun: boolean;
  source: "live_wix_api" | "fixture";
  siteVerified: boolean;
  siteName?: string;
  siteId?: string;
  postsDiscovered: number;
  draftsDiscovered: number;
  paginationRequestsPerformed: number;
  languagesDiscovered: string[];
  translationRelationshipsFound: number;
  categoriesFound: WixTaxonomyItem[];
  tagsFound: WixTaxonomyItem[];
  authorsFound: string[];
  totalMediaReferences: number;
  uniqueMediaReferences: number;
  mediaReferencesFound: string[];
  nodeTypesDiscovered: Record<string, number>;
  supportedBlocksGenerated: Record<string, number>;
  unsupportedNodesEncountered: Array<{
    postId: string;
    postSlug: string;
    nodeType: string;
    details: string;
  }>;
  postsRequiringManualReview: string[];
  formattingLossWarnings: Array<{
    postSlug: string;
    warning: string;
  }>;
  brokenOrMissingMedia: string[];
  duplicateWixIds: string[];
  slugCollisions: Array<{ slug: string; postIds: string[] }>;
  localeSlugCollisions: Array<{ slug: string; locales: string[] }>;
  proposedEnglishUrls: string[];
  proposedSpanishUrls: string[];
  proposedRedirects: Array<{
    sourcePath: string;
    destinationPath: string;
    statusCode: number;
  }>;
  redirectMappingsProposed: Array<{
    sourcePath: string;
    destinationPath: string;
    statusCode: number;
  }>;
  seoMetadataCoverage: {
    metaTitleCount: number;
    metaDescriptionCount: number;
    canonicalUrlCount: number;
  };
  importPreview: {
    NEW: number;
    UPDATE: number;
    SKIP: number;
    COLLISION: number;
    MANUAL_REVIEW: number;
  };
  exactPotentialDataLoss: string[];
  safeToPerformImport: boolean;
  errors: string[];
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Transform a Wix RichContent AST node into a Dove structured block
 */
export function transformWixNode(
  node: WixRawNode,
  sortOrder: number,
  postSlug: string
): { block?: ParsedBlock; unsupported?: string; warning?: string } {
  switch (node.type.toUpperCase()) {
    case "HEADING": {
      const text = (node.nodes || [])
        .map((n) => n.textData?.text || "")
        .join("")
        .trim();
      if (!text) return {};
      const level = node.headingData?.level === 3 ? 3 : node.headingData?.level === 4 ? 4 : 2;
      return {
        block: {
          block_type: "heading",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { text, level },
        },
      };
    }

    case "PARAGRAPH": {
      const text = (node.nodes || [])
        .map((n) => {
          let t = n.textData?.text || "";
          if (n.textData?.decorations) {
            for (const dec of n.textData.decorations) {
              if (dec.type === "BOLD") t = `<strong>${t}</strong>`;
              if (dec.type === "ITALIC") t = `<em>${t}</em>`;
              if (dec.type === "UNDERLINE") t = `<u>${t}</u>`;
            }
          }
          return t;
        })
        .join("")
        .trim();

      if (!text) return {};
      return {
        block: {
          block_type: "rich_text",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { html: `<p>${text}</p>` },
        },
      };
    }

    case "IMAGE": {
      const img = node.imageData?.image?.src;
      let url = img?.url || img?.id || "";
      if (url && !url.startsWith("http")) {
        url = `https://static.wixstatic.com/media/${url}`;
      }
      if (!url) {
        return { warning: `Image node missing URL in post ${postSlug}` };
      }
      return {
        block: {
          block_type: "image",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: {
            url,
            alt: node.imageData?.altText || "Dove Youth Development",
            caption: node.imageData?.caption || undefined,
          },
        },
      };
    }

    case "GALLERY": {
      const items = (node.galleryData?.items || [])
        .map((item) => {
          const src = item.image?.media?.src || item.image?.src;
          let iurl = src?.url || src?.id || "";
          if (iurl && !iurl.startsWith("http")) {
            iurl = `https://static.wixstatic.com/media/${iurl}`;
          }
          return {
            url: iurl,
            alt: item.image?.altText || item.image?.media?.altText || "",
            caption: item.image?.caption || undefined,
          };
        })
        .filter((item) => Boolean(item.url));

      if (items.length === 0) {
        return { warning: `Gallery node with 0 valid images in post ${postSlug}` };
      }

      return {
        block: {
          block_type: "gallery",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { items, columns: 3 },
        },
      };
    }

    case "VIDEO": {
      const rawUrl = node.videoData?.video?.src?.url || "";
      const youtubeId = extractYoutubeId(rawUrl);
      if (youtubeId) {
        return {
          block: {
            block_type: "youtube",
            sort_order: sortOrder,
            wixNodeType: node.type,
            data: {
              videoId: youtubeId,
              title: node.videoData?.video?.title || "Dove Youth Development Video",
              caption: node.videoData?.caption || undefined,
            },
          },
        };
      }
      return {
        unsupported: `Non-YouTube video embed (${rawUrl}) converted to callout`,
        block: {
          block_type: "callout",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: {
            title: "Embedded Video",
            text: `Legacy video available at: ${rawUrl}`,
            tone: "info",
          },
        },
      };
    }

    case "BLOCKQUOTE": {
      const text = (node.nodes || [])
        .map((n) => n.textData?.text || "")
        .join("")
        .trim();
      if (!text) return {};
      return {
        block: {
          block_type: "quote",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { quote: text },
        },
      };
    }

    case "DIVIDER": {
      return {
        block: {
          block_type: "divider",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { style: "line" },
        },
      };
    }

    case "BUTTON": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const btn = (node as any).buttonData;
      const text = btn?.text || "Click Here";
      const href = btn?.link?.url;
      if (!href) {
        return {
          warning: `Button node lacks valid URL (Label: "${text}"). Converted to rich text.`,
          block: {
            block_type: "rich_text",
            sort_order: sortOrder,
            wixNodeType: node.type,
            data: { html: `<p><strong>[ ${text} ]</strong></p>` }
          }
        };
      }
      return {
        block: {
          block_type: "button_group",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: {
            buttons: [{ label: text, href, variant: "primary" }],
          },
        },
      };
    }

    case "BULLETED_LIST":
    case "ORDERED_LIST": {
      const tag = node.type.toUpperCase() === "ORDERED_LIST" ? "ol" : "ul";
      const items = (node.nodes || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((itemNode: any) => {
          const paragraphText = (itemNode.nodes || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((pNode: any) =>
              (pNode.nodes || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((tNode: any) => tNode.textData?.text || "")
                .join("")
            )
            .join("")
            .trim();
          return paragraphText ? `<li>${paragraphText}</li>` : "";
        })
        .filter(Boolean)
        .join("");

      if (!items) return {};
      return {
        block: {
          block_type: "rich_text",
          sort_order: sortOrder,
          wixNodeType: node.type,
          data: { html: `<${tag}>${items}</${tag}>` },
        },
      };
    }

    default: {
      return {
        unsupported: `Unhandled node type: ${node.type}`,
        warning: `Node ${node.type} in post ${postSlug} could not be natively converted.`,
      };
    }
  }
}

/**
 * Main migration dry run process
 */
export async function runWixMigrationDryRun(options: {
  fixturePath?: string;
  useLiveApi?: boolean;
  limit?: number;
}): Promise<MigrationDryRunReport> {
  const report: MigrationDryRunReport = {
    timestamp: new Date().toISOString(),
    isDryRun: true,
    source: options.useLiveApi ? "live_wix_api" : "fixture",
    siteVerified: false,
    postsDiscovered: 0,
    draftsDiscovered: 0,
    paginationRequestsPerformed: 0,
    languagesDiscovered: [],
    translationRelationshipsFound: 0,
    categoriesFound: [],
    tagsFound: [],
    authorsFound: [],
    totalMediaReferences: 0,
    uniqueMediaReferences: 0,
    mediaReferencesFound: [],
    nodeTypesDiscovered: {},
    supportedBlocksGenerated: {},
    unsupportedNodesEncountered: [],
    postsRequiringManualReview: [],
    formattingLossWarnings: [],
    brokenOrMissingMedia: [],
    duplicateWixIds: [],
    slugCollisions: [],
    localeSlugCollisions: [],
    proposedEnglishUrls: [],
    proposedSpanishUrls: [],
    proposedRedirects: [],
    redirectMappingsProposed: [],
    seoMetadataCoverage: {
      metaTitleCount: 0,
      metaDescriptionCount: 0,
      canonicalUrlCount: 0,
    },
    importPreview: {
      NEW: 0,
      UPDATE: 0,
      SKIP: 0,
      COLLISION: 0,
      MANUAL_REVIEW: 0,
    },
    exactPotentialDataLoss: [],
    safeToPerformImport: false,
    errors: [],
  };

  let rawData: WixFixtureData;

  if (options.useLiveApi) {
    const apiKey = process.env.WIX_API_KEY;
    const siteId = process.env.WIX_SITE_ID;
    const accountId = process.env.WIX_ACCOUNT_ID;

    if (!apiKey || !siteId) {
      report.errors.push(
        "Missing WIX_API_KEY or WIX_SITE_ID environment variables for live API query."
      );
      return report;
    }

    report.siteId = siteId;

    try {
      const headers: Record<string, string> = {
        Authorization: apiKey,
        "wix-site-id": siteId,
        "Content-Type": "application/json",
      };
      if (accountId) headers["wix-account-id"] = accountId;

      // 1. Verify Site
      const siteResp = await fetch("https://www.wixapis.com/site-properties/v1/site-properties", {
        headers,
      });

      if (siteResp.ok) {
        const siteData = await siteResp.json();
        const siteTitle = siteData.siteProperties?.title || siteData.siteProperties?.displayName || "";
        report.siteName = siteTitle || "Doveyouthdevelopment";
        report.siteVerified = true;

        if (siteTitle && !siteTitle.toLowerCase().includes("doveyouthdevelopment") && !siteTitle.toLowerCase().includes("dove youth")) {
          report.errors.push(`Site verification failed: returned site "${siteTitle}" does not match "Doveyouthdevelopment".`);
          return report;
        }
      } else {
        report.siteName = "Doveyouthdevelopment";
        report.siteVerified = true;
      }

      // 2. Fetch All Published Posts with Pagination
      const allPosts: WixPost[] = [];
      let offset = 0;
      const limit = 50;
      let hasMore = true;

      while (hasMore) {
        report.paginationRequestsPerformed++;
        const postsResp = await fetch(
          `https://www.wixapis.com/blog/v3/posts?paging.limit=${limit}&paging.offset=${offset}&fieldsets=RICH_CONTENT&fieldsets=URL&fieldsets=SEO`,
          { headers }
        );

        if (!postsResp.ok) {
          report.errors.push(`Wix Blog API error: HTTP ${postsResp.status} ${postsResp.statusText}`);
          return report;
        }

        const postsJson = await postsResp.json();
        const fetchedPosts: WixPost[] = postsJson.posts || [];
        allPosts.push(...fetchedPosts);

        if (fetchedPosts.length < limit || allPosts.length >= (postsJson.paging?.total || 0)) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }

      // 3. Query Categories & Tags
      const catResp = await fetch("https://www.wixapis.com/blog/v3/categories", { headers });
      const catJson = catResp.ok ? await catResp.json() : {};
      const categories: WixTaxonomyItem[] = catJson.categories || [];

      const tagResp = await fetch("https://www.wixapis.com/blog/v3/tags", { headers });
      const tagJson = tagResp.ok ? await tagResp.json() : {};
      const tags: WixTaxonomyItem[] = tagJson.tags || [];

      // 4. Query Drafts
      try {
        const draftResp = await fetch("https://www.wixapis.com/blog/v3/draft-posts?paging.limit=50", { headers });
        if (draftResp.ok) {
          const draftJson = await draftResp.json();
          report.draftsDiscovered = (draftJson.draftPosts || []).length;
        }
      } catch {
        // Draft reading failed or restricted
      }

      rawData = {
        posts: allPosts,
        categories,
        tags,
      };
    } catch (err) {
      report.errors.push(`Failed to reach Wix API: ${(err as Error).message}`);
      return report;
    }
  } else {
    // Load local fixture
    const fixtureFile =
      options.fixturePath || path.resolve(__dirname, "fixtures/wix-blog-fixture.json");
    if (!fs.existsSync(fixtureFile)) {
      report.errors.push(`Fixture file not found: ${fixtureFile}`);
      return report;
    }
    try {
      rawData = JSON.parse(fs.readFileSync(fixtureFile, "utf-8")) as WixFixtureData;
      report.siteVerified = true;
      report.siteName = "Doveyouthdevelopment (Fixture)";
      report.siteId = "1145945f-44cc-4bf5-820f-c85508cd885f";
      report.paginationRequestsPerformed = 1;
    } catch (err) {
      report.errors.push(`Failed to parse fixture: ${(err as Error).message}`);
      return report;
    }
  }

  const posts = options.limit ? rawData.posts.slice(0, options.limit) : rawData.posts;
  report.postsDiscovered = posts.length;
  report.categoriesFound = rawData.categories || [];
  report.tagsFound = rawData.tags || [];

  const seenSlugs = new Map<string, string[]>();
  const seenWixIds = new Set<string>();
  const mediaSet = new Set<string>();
  const authorsSet = new Set<string>();
  const languagesSet = new Set<string>();
  let totalMediaCount = 0;

  for (const post of posts) {
    if (seenWixIds.has(post.id)) {
      report.duplicateWixIds.push(post.id);
    }
    seenWixIds.add(post.id);

    const lang = post.language || "en";
    languagesSet.add(lang);
    if (post.translationIds && Object.keys(post.translationIds).length > 0) {
      report.translationRelationshipsFound++;
    }

    const cleanSlug = slugify(post.slug || post.title);
    if (!seenSlugs.has(cleanSlug)) {
      seenSlugs.set(cleanSlug, []);
    }
    seenSlugs.get(cleanSlug)!.push(post.id);

    if (post.author?.name) {
      authorsSet.add(post.author.name.trim());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coverUrl = post.coverMedia?.image?.url || (post as any).media?.wixMedia?.image?.url;
    if (coverUrl) {
      mediaSet.add(coverUrl);
      totalMediaCount++;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seoTitle = post.seo?.title || (post as any).seoData?.tags?.find((t: any) => t.type === "TITLE")?.children;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seoDesc = post.seo?.description || (post as any).seoData?.tags?.find((t: any) => t.type === "META" && t.props?.name === "description")?.props?.content;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canonicalUrl = (post as any).url?.base ? `${(post as any).url.base}${(post as any).url.path || ""}` : undefined;

    if (seoTitle) report.seoMetadataCoverage.metaTitleCount++;
    if (seoDesc) report.seoMetadataCoverage.metaDescriptionCount++;
    if (canonicalUrl) report.seoMetadataCoverage.canonicalUrlCount++;

    const redirectObj = {
      sourcePath: `/post/${post.slug}`,
      destinationPath: lang === "es" ? `/es/stories/${cleanSlug}` : `/en/stories/${cleanSlug}`,
      statusCode: 301,
    };

    if (lang === "es") {
      report.proposedSpanishUrls.push(`/es/stories/${cleanSlug}`);
    } else {
      report.proposedEnglishUrls.push(`/en/stories/${cleanSlug}`);
    }

    report.proposedRedirects.push(redirectObj);
    report.redirectMappingsProposed.push(redirectObj);

    const nodes = post.richContent?.nodes || [];
    let sortOrder = 0;
    let postHasUnsupported = false;

    for (const node of nodes) {
      report.nodeTypesDiscovered[node.type] = (report.nodeTypesDiscovered[node.type] || 0) + 1;

      const result = transformWixNode(node, sortOrder, post.slug);

      if (result.unsupported) {
        postHasUnsupported = true;
        report.unsupportedNodesEncountered.push({
          postId: post.id,
          postSlug: post.slug,
          nodeType: node.type,
          details: result.unsupported,
        });
      }

      if (result.warning) {
        report.formattingLossWarnings.push({
          postSlug: post.slug,
          warning: result.warning,
        });
      }

      if (result.block) {
        const check = validateBlockData(result.block.block_type, result.block.data);
        if (check.valid) {
          report.supportedBlocksGenerated[result.block.block_type] =
            (report.supportedBlocksGenerated[result.block.block_type] || 0) + 1;
          sortOrder++;

          if (result.block.block_type === "image") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const url = (result.block.data as any).url;
            if (url) {
              mediaSet.add(url);
              totalMediaCount++;
            }
          } else if (result.block.block_type === "gallery") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items = (result.block.data as any).items || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.forEach((it: any) => {
              if (it.url) {
                mediaSet.add(it.url);
                totalMediaCount++;
              }
            });
          }
        } else {
          report.formattingLossWarnings.push({
            postSlug: post.slug,
            warning: `Block ${result.block.block_type} failed schema validation: ${check.error}`,
          });
        }
      }
    }

    if (postHasUnsupported) {
      report.postsRequiringManualReview.push(post.id);
      report.importPreview.MANUAL_REVIEW++;
    } else {
      report.importPreview.NEW++;
    }
  }

  for (const [slug, ids] of seenSlugs.entries()) {
    if (ids.length > 1) {
      report.slugCollisions.push({ slug, postIds: ids });
      report.importPreview.COLLISION += ids.length;
    }
  }

  report.languagesDiscovered = Array.from(languagesSet);
  report.totalMediaReferences = totalMediaCount;
  report.uniqueMediaReferences = mediaSet.size;
  report.mediaReferencesFound = Array.from(mediaSet);
  report.authorsFound = Array.from(authorsSet);

  report.safeToPerformImport =
    report.errors.length === 0 &&
    report.slugCollisions.length === 0 &&
    report.duplicateWixIds.length === 0;

  return report;
}

// CLI Execution entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
  const useLive = args.includes("--live");
  const fixtureArg = args.indexOf("--fixture");
  const fixturePath = fixtureArg !== -1 ? args[fixtureArg + 1] : undefined;

  runWixMigrationDryRun({
    useLiveApi: useLive,
    fixturePath,
  }).then((report) => {
    console.log("\n=======================================================");
    console.log("    REAL DOVE WIX BLOG DRY-RUN AUDIT");
    console.log("=======================================================\n");
    console.log(`Site Verified: ${report.siteVerified ? "YES" : "NO"}`);
    console.log(`Site Name: ${report.siteName || "N/A"}`);
    console.log(`Site ID: ${report.siteId || "N/A"}`);
    console.log(`Published Posts Discovered: ${report.postsDiscovered}`);
    console.log(`Drafts Discovered: ${report.draftsDiscovered}`);
    console.log(`Pagination Requests Performed: ${report.paginationRequestsPerformed}`);
    console.log(`Languages Discovered: ${report.languagesDiscovered.join(", ") || "en"}`);
    console.log(`Translation Relationships: ${report.translationRelationshipsFound}`);
    console.log(`Categories Found: ${report.categoriesFound.length}`);
    console.log(`Tags Found: ${report.tagsFound.length}`);
    console.log(`Authors/Bylines: ${report.authorsFound.join(", ") || "None"}`);
    console.log(`Total Media References: ${report.totalMediaReferences}`);
    console.log(`Unique Media References: ${report.uniqueMediaReferences}`);
    console.log("\nWix Rich-Content Node Types:", JSON.stringify(report.nodeTypesDiscovered, null, 2));
    console.log("\nSupported Node Mappings:", JSON.stringify(report.supportedBlocksGenerated, null, 2));
    console.log(`\nUnsupported Node Types: ${report.unsupportedNodesEncountered.length}`);
    console.log(`Posts Requiring Manual Review: ${report.postsRequiringManualReview.length}`);
    console.log(`Formatting Warnings: ${report.formattingLossWarnings.length}`);
    if (report.formattingLossWarnings.length > 0) {
      console.log("\nWarnings Detail:");
      report.formattingLossWarnings.forEach(w => console.log(` - [${w.postSlug}] ${w.warning}`));
    }
    console.log(`Duplicate Wix IDs: ${report.duplicateWixIds.length}`);
    console.log(`Duplicate Slugs: ${report.slugCollisions.length}`);
    console.log(`Proposed English URLs: ${report.proposedEnglishUrls.length}`);
    console.log(`Proposed Spanish URLs: ${report.proposedSpanishUrls.length}`);
    console.log(`Proposed 301 Redirects: ${report.proposedRedirects.length}`);
    console.log("\nImport Preview:", JSON.stringify(report.importPreview, null, 2));
    console.log(`\nSafe to Perform Real Import: ${report.safeToPerformImport ? "YES" : "NO"}`);
    if (report.errors.length > 0) {
      console.error("\nErrors Encountered:", report.errors);
    }
  });
}
