const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/content.json'));
console.log("Total:", data.length);
console.log("Generated:", data.filter(d => d.is_generated).length);
console.log("Not generated:", data.filter(d => !d.is_generated).length);
