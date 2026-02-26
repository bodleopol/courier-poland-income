import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/content.json'));
const unique = [];
const seen = new Set();
for (const d of data) {
  if (!seen.has(d.title)) {
    seen.add(d.title);
    unique.push(d);
  }
}
fs.writeFileSync('src/content.json', JSON.stringify(unique, null, 2));
console.log('Kept', unique.length, 'unique jobs');
