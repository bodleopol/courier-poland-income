import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/content.json'));
const filtered = data.filter(d => d.is_generated !== true);
fs.writeFileSync('src/content.json', JSON.stringify(filtered, null, 2));
console.log('Kept', filtered.length, 'jobs');
