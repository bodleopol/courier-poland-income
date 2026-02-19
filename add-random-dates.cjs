
const fs = require('fs');

const contentPath = 'src/content.json';
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

function getRandomDate() {
  const start = new Date('2026-02-15T00:00:00.000Z');
  const end = new Date('2026-02-18T23:59:59.999Z');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
}

const updatedContent = content.map(vacancy => {
  vacancy.date_posted = getRandomDate();
  return vacancy;
});

fs.writeFileSync(contentPath, JSON.stringify(updatedContent, null, 2), 'utf8');

console.log(`✅ content.json: ${updatedContent.length} vacancies updated with random dates.`);
