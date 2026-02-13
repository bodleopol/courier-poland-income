/**
 * Comprehensive nav improvement script:
 * 1. Add missing desktop Інструменти dropdown to 10 files
 * 2. Fix blog/about link ordering (terms, company, page.html)  
 * 3. Standardize navigation across all files
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

const toolsDropdownDesktop = `
        <div class="nav-dropdown" aria-label="Інструменти">
          <button type="button" class="nav-link nav-dropdown__toggle" data-i18n="nav.tools">🛠️ Інструменти <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style="margin-left:2px"><path d="M1 1l4 4 4-4"/></svg></button>
          <div class="nav-dropdown__menu nav-dropdown__menu--tools">
            <a href="/calculator.html">💰 Калькулятор зарплати</a>
            <a href="/cv-generator.html">📄 Генератор CV</a>
            <a href="/red-flag.html">🚩 Перевірка вакансій</a>
            <a href="/map.html">🗺️ Карта українців</a>
          </div>
        </div>`;

let stats = { toolsAdded: 0, orderFixed: 0, total: 0 };

function addDesktopTools(content, fileName) {
  // Skip if already has desktop tools dropdown
  if (content.includes('aria-label="Інструменти"') && content.includes('nav-dropdown__menu--tools')) {
    return content;
  }
  
  // Remove old desktop tools dropdown if exists (from apply/faq/404 with old format)
  const oldToolsPattern = /\n\s*<div class="nav-dropdown" aria-label="Інструменти">[\s\S]*?<\/div>\n\s*<\/div>/g;
  if (content.includes('aria-label="Інструменти"')) {
    content = content.replace(oldToolsPattern, '');
  }

  // Insert after Categories dropdown end (</div>\n        </div>\n        <a href="/blog)
  // or after Categories dropdown end for reversed pages (</div>\n        </div>\n        <a href="/about)
  const afterCatBlog = '</div>\n        </div>\n        <a href="/blog.html"';
  const afterCatAbout = '</div>\n        </div>\n        <a href="/about.html"';
  // Also handle \r\n
  const afterCatBlogR = '</div>\r\n        </div>\r\n        <a href="/blog.html"';
  const afterCatAboutR = '</div>\r\n        </div>\r\n        <a href="/about.html"';

  let inserted = false;
  
  if (content.includes(afterCatBlog)) {
    content = content.replace(afterCatBlog, '</div>\n        </div>' + toolsDropdownDesktop + '\n        <a href="/blog.html"');
    inserted = true;
  } else if (content.includes(afterCatBlogR)) {
    content = content.replace(afterCatBlogR, '</div>\r\n        </div>' + toolsDropdownDesktop + '\r\n        <a href="/blog.html"');
    inserted = true;
  } else if (content.includes(afterCatAbout)) {
    content = content.replace(afterCatAbout, '</div>\n        </div>' + toolsDropdownDesktop + '\n        <a href="/about.html"');
    inserted = true;
  } else if (content.includes(afterCatAboutR)) {
    content = content.replace(afterCatAboutR, '</div>\r\n        </div>' + toolsDropdownDesktop + '\r\n        <a href="/about.html"');
    inserted = true;
  }

  // For files without categories dropdown (apply, faq, 404)
  if (!inserted) {
    const navVac = /(<a href="\/vacancies\.html" class="nav-link"[^>]*>[^<]*<\/a>)\s*\n(\s*<a href="\/blog\.html")/;
    const navVacR = /(<a href="\/vacancies\.html" class="nav-link"[^>]*>[^<]*<\/a>)\s*\r\n(\s*<a href="\/blog\.html")/;
    if (navVac.test(content)) {
      content = content.replace(navVac, '$1\n' + toolsDropdownDesktop + '\n$2');
      inserted = true;
    } else if (navVacR.test(content)) {
      content = content.replace(navVacR, '$1\r\n' + toolsDropdownDesktop + '\r\n$2');
      inserted = true;
    }
  }

  if (inserted) {
    stats.toolsAdded++;
    console.log(`  ✅ Desktop tools added: ${fileName}`);
  } else {
    console.log(`  ⚠️ Could not add desktop tools: ${fileName}`);
  }
  
  return content;
}

function fixBlogAboutOrder(content, fileName) {
  // Fix desktop nav: swap "Про нас → Блог" to "Блог → Про нас"
  const wrongOrder = /(<a href="\/about\.html" class="nav-link"[^>]*>[^<]*<\/a>)\s*\n(\s*<a href="\/blog\.html" class="nav-link"[^>]*>[^<]*<\/a>)/;
  const wrongOrderR = /(<a href="\/about\.html" class="nav-link"[^>]*>[^<]*<\/a>)\s*\r\n(\s*<a href="\/blog\.html" class="nav-link"[^>]*>[^<]*<\/a>)/;
  
  let fixed = false;
  if (wrongOrder.test(content)) {
    content = content.replace(wrongOrder, '$2\n$1');
    fixed = true;
  }
  if (wrongOrderR.test(content)) {
    content = content.replace(wrongOrderR, '$2\r\n$1');
    fixed = true;
  }
  
  // Also fix in mobile menu - same swap but with different indentation
  const wrongOrderMobile = /(<a href="\/about\.html" class="nav-link"[^>]*>[^<]*<\/a>)\s*\n(\s*<a href="\/blog\.html" class="nav-link"[^>]*>[^<]*<\/a>)/;
  if (wrongOrderMobile.test(content)) {
    content = content.replace(wrongOrderMobile, '$2\n$1');
    fixed = true;
  }
  
  if (fixed) {
    stats.orderFixed++;
    console.log(`  🔄 Blog/About order fixed: ${fileName}`);
  }
  
  return content;
}

// Also add chevron to Categories button
function addChevronToCategories(content, fileName) {
  const oldCatBtn = 'data-i18n="nav.categories">Категорії</button>';
  const newCatBtn = 'data-i18n="nav.categories">Категорії <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style="margin-left:2px"><path d="M1 1l4 4 4-4"/></svg></button>';
  
  if (content.includes(oldCatBtn) && !content.includes(newCatBtn)) {
    content = content.replaceAll(oldCatBtn, newCatBtn);
    console.log(`  ▼ Chevron added to Categories: ${fileName}`);
  }
  return content;
}

console.log('🚀 Improving navigation across all files...\n');

const allFiles = [
  'about.html', 'calculator.html', 'cv-generator.html', 'red-flag.html', 
  'map.html', 'contact.html', 'privacy.html', 'terms.html', 'company.html',
  'apply.html', 'faq.html', '404.html',
  path.join('templates', 'page.html')
];

for (const file of allFiles) {
  const filePath = path.join(SRC, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ NOT FOUND: ${file}`);
    continue;
  }

  stats.total++;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix blog/about ordering first (only in terms, company, page.html)
  if (['terms.html', 'company.html', path.join('templates', 'page.html')].includes(file)) {
    content = fixBlogAboutOrder(content, file);
  }

  // Add desktop tools dropdown
  content = addDesktopTools(content, file);

  // Add chevron to categories
  content = addChevronToCategories(content, file);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log(`\n📊 Stats: ${stats.total} files processed, ${stats.toolsAdded} tools added, ${stats.orderFixed} order fixes`);
