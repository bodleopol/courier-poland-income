
const fs = require('fs');
const path = require('path');

const vacanciesDir = path.join(__dirname, '../dist');
const files = fs.readdirSync(vacanciesDir);

const results = [];

for (const file of files) {
    if (file.endsWith('.html')) {
        const filePath = path.join(vacanciesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        const hasJsonLd = content.includes('<script type="application/ld+json">');
        const hasCanonical = content.includes('<link rel="canonical"');
        
        results.push({
            path: `/${file}`,
            wordCount,
            hasJsonLd,
            hasCanonical
        });
    }
}

console.log(JSON.stringify(results, null, 2));
