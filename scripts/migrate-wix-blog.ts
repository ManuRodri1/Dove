import fs from "fs";
import path from "path";
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
  postsDiscovered: number;
  categoriesFound: WixTaxonomyItem[];
  tagsFound: WixTaxonomyItem[];
  authorsFound: string[];
  mediaReferencesFound: string[];
  nodeTypesDiscovered: Record<string, number>;
  supportedBlocksGenerated: Record<string, number>;
  unsupportedNodesEncountered: Array<{
    postId: string;
    postSlug: string;
    nodeType: string;
    details: string;
  }>;
  slugCollisions: Array<{ slug: string; postIds: string[] }>;
  duplicateImportMapFindings: Array<{ wixId: string; slug: string; status: string }>;
  redirectMappingsProposed: Array<{
    sourcePath: string;
    destinationPath: string;
    statusCode: number;
  }>;
  formattingLossWarnings: Array<{
    postSlug: string;
    warning: string;
  }>;
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
      const url = img?.url || "";
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
        .map((item) => ({
          url: item.image?.src?.url || "",
          alt: item.image?.altText || "",
          caption: item.image?.caption || undefined,
        }))
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
    postsDiscovered: 0,
    categoriesFound: [],
    tagsFound: [],
    authorsFound: [],
    mediaReferencesFound: [],
    nodeTypesDiscovered: {},
    supportedBlocksGenerated: {},
    unsupportedNodesEncountered: [],
    slugCollisions: [],
    duplicateImportMapFindings: [],
    redirectMappingsProposed: [],
    formattingLossWarnings: [],
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

    try {
      // Query official Wix Blog API v3
      const headers: Record<string, string> = {
        Authorization: apiKey,
        "wix-site-id": siteId,
        "Content-Type": "application/json",
      };
      if (accountId) headers["wix-account-id"] = accountId;

      const response = await fetch("https://www.wixapis.com/blog/v3/posts?paging.limit=50", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        report.errors.push(`Wix API error: HTTP ${response.status} ${response.statusText}`);
        return report;
      }

      const json = await response.json();
      rawData = {
        posts: json.posts || [],
        categories: json.categories || [],
        tags: json.tags || [],
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
  const mediaSet = new Set<string>();
  const authorsSet = new Set<string>();

  for (const post of posts) {
    // Slug collision tracking
    const cleanSlug = slugify(post.slug || post.title);
    if (!seenSlugs.has(cleanSlug)) {
      seenSlugs.set(cleanSlug, []);
    }
    seenSlugs.get(cleanSlug)!.push(post.id);

    // Author tracking
    if (post.author?.name) {
      authorsSet.add(post.author.name.trim());
    }

    // Cover image tracking
    if (post.coverMedia?.image?.url) {
      mediaSet.add(post.coverMedia.image.url);
    }

    // Redirect mapping: Wix legacy route /post/<slug> -> /en/stories/<slug>
    report.redirectMappingsProposed.push({
      sourcePath: `/post/${post.slug}`,
      destinationPath: `/en/stories/${cleanSlug}`,
      statusCode: 301,
    });

    // Process RichContent AST nodes
    const nodes = post.richContent?.nodes || [];
    let sortOrder = 0;

    for (const node of nodes) {
      report.nodeTypesDiscovered[node.type] = (report.nodeTypesDiscovered[node.type] || 0) + 1;

      const result = transformWixNode(node, sortOrder, post.slug);

      if (result.unsupported) {
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
        // Validate with central block schema
        const check = validateBlockData(result.block.block_type, result.block.data);
        if (check.valid) {
          report.supportedBlocksGenerated[result.block.block_type] =
            (report.supportedBlocksGenerated[result.block.block_type] || 0) + 1;
          sortOrder++;

          // Track media from block
          if (result.block.block_type === "image") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const url = (result.block.data as any).url;
            if (url) mediaSet.add(url);
          } else if (result.block.block_type === "gallery") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items = (result.block.data as any).items || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.forEach((it: any) => {
              if (it.url) mediaSet.add(it.url);
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

    // Idempotency check simulation
    report.duplicateImportMapFindings.push({
      wixId: post.id,
      slug: cleanSlug,
      status: "NEW_ENTRY",
    });
  }

  // Detect slug collisions
  for (const [slug, ids] of seenSlugs.entries()) {
    if (ids.length > 1) {
      report.slugCollisions.push({ slug, postIds: ids });
    }
  }

  report.mediaReferencesFound = Array.from(mediaSet);
  report.authorsFound = Array.from(authorsSet);

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
    console.log("       DOVE YOUTH DEVELOPMENT — WIX BLOG DRY RUN REPORT");
    console.log("=======================================================\n");
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Source: ${report.source}`);
    console.log(`Posts Discovered: ${report.postsDiscovered}`);
    console.log(`Categories: ${report.categoriesFound.length}`);
    console.log(`Tags: ${report.tagsFound.length}`);
    console.log(`Authors: ${report.authorsFound.join(", ") || "None"}`);
    console.log(`Media References: ${report.mediaReferencesFound.length}`);
    console.log("\nNode Types Discovered:", JSON.stringify(report.nodeTypesDiscovered, null, 2));
    console.log(
      "\nSupported Blocks Generated:",
      JSON.stringify(report.supportedBlocksGenerated, null, 2)
    );
    console.log(
      `\nUnsupported Nodes: ${report.unsupportedNodesEncountered.length}`,
      report.unsupportedNodesEncountered
    );
    console.log(`Slug Collisions: ${report.slugCollisions.length}`, report.slugCollisions);
    console.log(`Proposed Redirects: ${report.redirectMappingsProposed.length}`);
    console.log(`Formatting Warnings: ${report.formattingLossWarnings.length}`);
    if (report.errors.length > 0) {
      console.error("\nErrors encountered:", report.errors);
    }
  });
}
