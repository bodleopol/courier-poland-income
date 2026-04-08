const fs = require('fs');
let content = fs.readFileSync('src/generate.js', 'utf8');

const conflictBlock = /<<<<<<< HEAD[\s\S]*?>>>>>>> origin\/main/g;
const fixed = `        <div class="job-actions">
          <a href="\${page.cta_link || \`/respond.html?job=\${escapeHtml(page.slug)}\`}" class="btn-secondary vacancy-cta-btn" data-i18n="btn.submit">Відгукнутися на вакансію</a>`;

content = content.replace(conflictBlock, fixed);
fs.writeFileSync('src/generate.js', content);
