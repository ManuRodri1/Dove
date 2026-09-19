const { parse } = require("dotenv");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const envConfig = parse(readFileSync(resolve(__dirname, "../.env.local")));
const wixApiKey = envConfig.WIX_API_KEY;
const wixSiteId = envConfig.WIX_SITE_ID;
async function run() {
  const res = await fetch("https://www.wixapis.com/blog/v3/posts?fieldsets=RICH_CONTENT", { headers: { Authorization: wixApiKey, "wix-site-id": wixSiteId }});
  const data = await res.json();
  const post = data.posts.find(p => p.slug === "may-2022-celebrating-20-years-of-service");
  if (post) {
      const galleries = post.richContent.nodes.filter(n => n.type === "GALLERY");
      console.log(JSON.stringify(galleries, null, 2));
  }
}
run();
