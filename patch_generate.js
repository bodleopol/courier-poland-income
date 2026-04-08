const fs = require('fs');
let content = fs.readFileSync('src/generate.js', 'utf8');

const conflict = `<<<<<<< HEAD
        <div class="job-actions">
          <a href="\${page.cta_link || \`/respond.html?job=\${escapeHtml(page.slug)}\`}" class="btn-secondary vacancy-cta-btn" data-i18n="btn.submit">Відгукнутися на вакансію</a>
=======
        <div class="job-actions" style="margin-top: 1rem; margin-bottom: 2rem;">
          <a href="\\$\\{page.cta_link || \\`/respond.html?job=\\$\\{escapeHtml(page.slug)\\}\\`\\}" class="btn-secondary" style="background:#e74c3c; color:white;" data-i18n="btn.submit">Відгукнутися на вакансію</a>
>>>>>>> origin/main`;

const fixed = `        <div class="job-actions">
          <a href="\${page.cta_link || \`/respond.html?job=\${escapeHtml(page.slug)}\`}" class="btn-secondary vacancy-cta-btn" data-i18n="btn.submit">Відгукнутися на вакансію</a>`;

content = content.replace(/<<<<<<< HEAD[\s\S]*?>>>>>>> origin\/main/, fixed);
fs.writeFileSync('src/generate.js', content);
