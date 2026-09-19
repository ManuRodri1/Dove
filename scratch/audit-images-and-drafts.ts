import { parse } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env.local");
let wixSiteId = "";
let wixApiKey = "";
try {
  const envConfig = parse(readFileSync(envPath));
  wixSiteId = envConfig.WIX_SITE_ID;
  wixApiKey = envConfig.WIX_API_KEY;
} catch (e) {
  console.error("Failed to load .env.local", e);
}

async function fetchWix(endpoint: string) {
  const res = await fetch(`https://www.wixapis.com${endpoint}`, {
    headers: {
      Authorization: wixApiKey,
      "wix-site-id": wixSiteId,
    },
  });
  if (!res.ok) {
    console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    return null;
  }
  return res.json();
}

async function run() {
  console.log("Fetching published posts...");
  const pubData = await fetchWix("/blog/v3/posts?fieldsets=RICH_CONTENT&fieldsets=URL&fieldsets=SEO");
  const publishedPosts = pubData?.posts || [];
  
  console.log("Fetching draft posts...");
  const draftData = await fetchWix("/blog/v3/draft-posts?fieldsets=RICH_CONTENT&fieldsets=URL&fieldsets=SEO");
  const draftPosts = draftData?.draftPosts || [];

  console.log(`Published posts: ${publishedPosts.length}`);
  console.log(`Draft API records: ${draftPosts.length}`);
  
  const unpublishedChangesDrafts = draftPosts.filter((d: any) => d.hasUnpublishedChanges);
  console.log(`Drafts with unpublished changes: ${unpublishedChangesDrafts.length}`);

  const targetSlug = "greetings-from-the-dominican-republic";
  const pubPost = publishedPosts.find((p: any) => p.slug === targetSlug);
  const draftPost = draftPosts.find((d: any) => d.slug === targetSlug);

  if (pubPost && draftPost) {
    console.log(`\n--- COMPARING '${targetSlug}' ---`);
    console.log("Published title:", pubPost.title);
    console.log("Draft title:", draftPost.title);
    
    // Quick diff on text content
    const pubNodes = pubPost.richContent?.nodes || [];
    const draftNodes = draftPost.richContent?.nodes || [];
    
    console.log(`Published nodes length: ${pubNodes.length}`);
    console.log(`Draft nodes length: ${draftNodes.length}`);
    
    // Write them to a file for deeper inspection if needed
    require("fs").writeFileSync(resolve(__dirname, "pub-post.json"), JSON.stringify(pubPost, null, 2));
    require("fs").writeFileSync(resolve(__dirname, "draft-post.json"), JSON.stringify(draftPost, null, 2));
    console.log("Saved full JSONs to pub-post.json and draft-post.json");
  }

  console.log("\n--- ANALYZING IMAGE WARNINGS ---");
  let warningCount = 0;
  const imageWarningByPost = new Map<string, { title: string, id: string, warnings: any[] }>();

  for (const post of publishedPosts) {
    const nodes = post.richContent?.nodes || [];
    let inlineWarnings: any[] = [];
    
    // recursive find IMAGE nodes
    function findImages(node: any, path: string) {
      if (node.type === "IMAGE") {
        inlineWarnings.push({ path, node });
      }
      if (node.nodes) {
        node.nodes.forEach((n: any, idx: number) => findImages(n, `${path}.nodes[${idx}]`));
      }
    }
    
    nodes.forEach((n: any, idx: number) => findImages(n, `nodes[${idx}]`));
    
    if (inlineWarnings.length > 0) {
      imageWarningByPost.set(post.slug, {
        title: post.title,
        id: post.id,
        warnings: inlineWarnings
      });
      warningCount += inlineWarnings.length;
    }
  }

  console.log(`Found ${warningCount} IMAGE nodes across ${imageWarningByPost.size} posts.`);
  
  // Dump a few IMAGE nodes to see their structure
  let sampled = 0;
  for (const [slug, data] of imageWarningByPost.entries()) {
    if (sampled < 2) {
      console.log(`\nSample from post: ${slug}`);
      const firstWarning = data.warnings[0];
      console.log(`Path: ${firstWarning.path}`);
      console.log(JSON.stringify(firstWarning.node, null, 2));
      sampled++;
    }
  }
}

run().catch(console.error);
