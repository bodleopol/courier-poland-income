/**
 * Script to add "Для роботодавців" link to nav and footer across all static HTML files
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// All files with inline nav/footer
const files = [
  'apply.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html',
  'company.html', 'faq.html', '404.html', 'calculator.html', 'cv-generator.html',
  'red-flag.html', 'map.html', 'for-employers.html', 'blog.html', 'article-template.html',
  'templates/page.html', 'templates/article.html'
];

let updated = 0;

for (const file of files) {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // 1. Desktop nav: Add "Для роботодавців" link before btn-cta
  //    Pattern: <a href="/contact.html" ...>Контакти</a>\n        <a href="/apply.html" class="btn-cta"
  if (!html.includes('/for-employers.html') || file === 'for-employers.html') {
    // Desktop nav - insert before btn-cta line
    const desktopPattern = /(<a href="\/contact\.html"[^>]*>Контакти<\/a>\s*\n)(\s*<a href="\/apply\.html" class="btn-cta")/;
    if (desktopPattern.test(html)) {
      html = html.replace(desktopPattern, '$1        <a href="/for-employers.html" class="nav-link">Для роботодавців</a>\n$2');
      changed = true;
    }

    // Mobile nav - insert before btn-cta line in mobile menu
    const mobilePattern = /(<a href="\/contact\.html"[^>]*>Контакти<\/a>\s*\n)(\s*<a href="\/apply\.html" class="btn-cta"[^>]*style="text-align:center")/;
    if (mobilePattern.test(html)) {
      html = html.replace(mobilePattern, '$1      <a href="/for-employers.html" class="nav-link">Для роботодавців</a>\n$2');
      changed = true;
    }

    // Footer nav - insert after "Контакти" in the footer nav column
    // Pattern: <a href="/contact.html" ...>Контакти</a>\n        </div>\n        <div class="footer-col">
    const footerPattern = /(<a href="\/contact\.html"[^>]*>Контакти<\/a>\s*\n)(\s*<\/div>\s*\n\s*<div class="footer-col">\s*\n\s*<h4[^>]*>Вакансії<\/h4>)/;
    if (footerPattern.test(html)) {
      html = html.replace(footerPattern, '$1          <a href="/for-employers.html">Для роботодавців</a>\n$2');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✅ Updated: ${file}`);
    updated++;
  } else {
    console.log(`⏭️  Skipped (already has link or no match): ${file}`);
  }
}

console.log(`\nDone. Updated ${updated} files.`);
