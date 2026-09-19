const fs = require('fs');
const pub = JSON.parse(fs.readFileSync('scratch/pub-post.json', 'utf8'));
const draftObj = JSON.parse(fs.readFileSync('scratch/draft-post.json', 'utf8'));
const draft = draftObj.draftPost || draftObj;

console.log("Published title:", pub.title);
console.log("Draft title:", draft.title);
console.log("Titles differ?", pub.title !== draft.title);

const pubRich = JSON.stringify(pub.richContent || {});
const draftRich = JSON.stringify(draft.richContent || {});
console.log("Rich content differs?", pubRich !== draftRich);

if (pubRich !== draftRich) {
  // Let's find exactly what's different in the JSON strings, just length for now
  console.log("Pub rich length:", pubRich.length);
  console.log("Draft rich length:", draftRich.length);
}
