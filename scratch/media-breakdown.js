const { parse } = require("dotenv");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const envConfig = parse(readFileSync(resolve(__dirname, "../.env.local")));
const wixApiKey = envConfig.WIX_API_KEY;
const wixSiteId = envConfig.WIX_SITE_ID;
async function run() {
  const res = await fetch("https://www.wixapis.com/blog/v3/posts?fieldsets=RICH_CONTENT", { headers: { Authorization: wixApiKey, "wix-site-id": wixSiteId }});
  const data = await res.json();
  const posts = data.posts || [];
  let cover = 0, inline = 0, gallery = 0;
  const urls = new Set();
  
  posts.forEach(p => {
      const coverUrl = p.coverMedia?.image?.url || p.media?.wixMedia?.image?.url;
      if (coverUrl) { cover++; urls.add(coverUrl); }
      
      const nodes = p.richContent?.nodes || [];
      const traverse = (n) => {
          if (n.type === 'IMAGE') {
              const u = n.imageData?.image?.src?.url || n.imageData?.image?.src?.id;
              if (u) { inline++; urls.add(u); }
          }
          if (n.type === 'GALLERY') {
              (n.galleryData?.items || []).forEach(it => {
                  const u = it.image?.media?.src?.url || it.image?.media?.src?.id || it.image?.src?.url || it.image?.src?.id;
                  if (u) { gallery++; urls.add(u); }
              });
          }
          if (n.nodes) n.nodes.forEach(traverse);
      };
      nodes.forEach(traverse);
  });
  console.log(`Total Covers: ${cover}, Inline: ${inline}, Gallery: ${gallery}`);
  console.log(`Total URLs: ${cover + inline + gallery}`);
  console.log(`Unique URLs: ${urls.size}`);
}
run();
