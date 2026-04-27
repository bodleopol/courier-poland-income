const fs = require('fs');
const content = fs.readFileSync('dist/poznan-cleaning-sprzatacz-local-4.html', 'utf8');
const regex = /<a[^>]*btn-secondary[^>]*>.*?<\/a>/g;
const matches = content.match(regex);
console.log("Found:", matches);
