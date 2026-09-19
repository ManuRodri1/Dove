const fs = require('fs');
const pub = JSON.parse(fs.readFileSync('scratch/pub-post.json', 'utf8'));
const draftObj = JSON.parse(fs.readFileSync('scratch/draft-post.json', 'utf8'));
const draft = draftObj.draftPost || draftObj;

for (const key of Object.keys(draft)) {
  if (JSON.stringify(draft[key]) !== JSON.stringify(pub[key])) {
    console.log(`Key ${key} differs:`);
    console.log(`  Pub: ${JSON.stringify(pub[key])?.substring(0, 50)}`);
    console.log(`  Draft: ${JSON.stringify(draft[key])?.substring(0, 50)}`);
  }
}
