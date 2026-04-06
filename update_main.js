const fs = require('fs');
let file = fs.readFileSync('src/index.html', 'utf8');
// wait, src/index.html is a template. Let's look for "apply.html" in src/index.html
