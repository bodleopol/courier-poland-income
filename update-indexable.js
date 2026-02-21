import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/content.json'));
const slugs = data.map(d => d.slug);
fs.writeFileSync('src/indexable-vacancies.json', JSON.stringify(slugs, null, 2));
console.log('Updated indexable-vacancies.json with', slugs.length, 'slugs');
