const { parse } = require("dotenv");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const envConfig = parse(readFileSync(resolve(__dirname, "../.env.local")));
const wixSiteId = envConfig.WIX_SITE_ID;
const wixApiKey = envConfig.WIX_API_KEY;

async function run() {
  const pubRes = await fetch("https://www.wixapis.com/blog/v3/posts?fieldsets=RICH_CONTENT&fieldsets=URL&fieldsets=SEO", {
    headers: { Authorization: wixApiKey, "wix-site-id": wixSiteId }
  });
  const pubData = await pubRes.json();
  const draft = JSON.parse(readFileSync(resolve(__dirname, "draft-post.json"), "utf8"));
  const pubPost = pubData.posts.find(p => p.id === draft.draftPost.id); // Assuming IDs match or slug
  
  if (pubPost) {
    require("fs").writeFileSync(resolve(__dirname, "pub-post.json"), JSON.stringify(pubPost, null, 2));
    console.log("Published post saved");
  } else {
    console.log("Could not find matching published post by ID. Trying by title...", draft.draftPost.title);
    const pubPostByTitle = pubData.posts.find(p => p.title === draft.draftPost.title);
    if (pubPostByTitle) {
        require("fs").writeFileSync(resolve(__dirname, "pub-post.json"), JSON.stringify(pubPostByTitle, null, 2));
        console.log("Published post saved (by title)");
    }
  }
}
run();
