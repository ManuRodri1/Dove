const { parse } = require("dotenv");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const envConfig = parse(readFileSync(resolve(__dirname, "../.env.local")));
const wixSiteId = envConfig.WIX_SITE_ID;
const wixApiKey = envConfig.WIX_API_KEY;
async function run() {
  const res = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
    headers: { Authorization: wixApiKey, "wix-site-id": wixSiteId }
  });
  const data = await res.json();
  const unpub = (data.draftPosts || []).filter(d => d.hasUnpublishedChanges);
  if (unpub.length > 0) {
    const res2 = await fetch("https://www.wixapis.com/blog/v3/draft-posts/" + unpub[0].id, {
      headers: { Authorization: wixApiKey, "wix-site-id": wixSiteId }
    });
    console.log("Status:", res2.status, res2.statusText);
    const json = await res2.json();
    require("fs").writeFileSync(resolve(__dirname, "draft-post.json"), JSON.stringify(json, null, 2));
    console.log("Draft saved");
  }
}
run();
