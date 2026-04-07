const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

code = code.replace(
  /'https:\/\/script\.google\.com\/macros\/s\/.*\/exec'/,
  "'https://script.google.com/macros/s/AKfycbxTumA94hc0uIu24ga9ZkQ8n1zOcWbYLFPXtiYe8IulPabzVCv6PMduZ8Axc2e6n9w/exec'"
);

fs.writeFileSync('src/main.js', code);
