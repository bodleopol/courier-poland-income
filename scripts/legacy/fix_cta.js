const fs = require('fs');
let generateJs = fs.readFileSync('src/generate.js', 'utf8');

// The issue might be that page.cta_link or something is being populated incorrectly,
// or simply that the page uses data-i18n="btn.submit" which translates it to "Надіслати заявку".
// But let's check what actual HTML was generated.
