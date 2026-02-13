/**
 * Script to add "Інструменти" dropdown to navigation across all static pages and templates.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

// The tools dropdown for desktop nav
const toolsDropdownDesktop = `
        <div class="nav-dropdown" aria-label="Інструменти">
          <button type="button" class="nav-link nav-dropdown__toggle" data-i18n="nav.tools">Інструменти</button>
          <div class="nav-dropdown__menu">
            <a href="/calculator.html" data-i18n="nav.calculator">💰 Калькулятор зарплати</a>
            <a href="/cv-generator.html" data-i18n="nav.cvgenerator">📄 Генератор CV</a>
            <a href="/red-flag.html" data-i18n="nav.redflag">🚩 Перевірка вакансій</a>
            <a href="/map.html" data-i18n="nav.map">🗺️ Карта українців</a>
          </div>
        </div>`;

// The tools section for mobile menu
const toolsMobile = `
      <div class="mobile-tools">
        <button type="button" class="nav-link mobile-tools__toggle" onclick="this.parentElement.classList.toggle('is-open')">🛠️ Інструменти</button>
        <div class="mobile-tools__menu">
          <a href="/calculator.html" class="nav-link">💰 Калькулятор</a>
          <a href="/cv-generator.html" class="nav-link">📄 Генератор CV</a>
          <a href="/red-flag.html" class="nav-link">🚩 Перевірка вакансій</a>
          <a href="/map.html" class="nav-link">🗺️ Карта українців</a>
        </div>
      </div>`;

// Files that have nav-dropdown for Categories (standard order: Блог → Про нас)
const group1 = ['about.html', 'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html', 'contact.html', 'privacy.html'];

// Files that have nav-dropdown for Categories (swapped: Про нас → Блог)
const group2 = ['terms.html', 'company.html'];
const group2Template = [path.join('templates', 'page.html')];

// Files WITHOUT Categories dropdown
const group3 = ['apply.html', 'faq.html', '404.html'];

let updatedCount = 0;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Skip if already has tools dropdown
  if (content.includes('nav.tools') || content.includes('mobile-tools')) {
    console.log(`  SKIP (already has tools): ${filePath}`);
    return;
  }

  // ---- DESKTOP NAV ----
  // Try to insert after Categories dropdown (for files that have it)
  const catDropdownEnd = '</div>\n        </div>\n        <a href="/blog.html"';
  const catDropdownEndAlt = '</div>\n        </div>\n        <a href="/about.html"';

  if (content.includes(catDropdownEnd)) {
    // Group 1: has categories, then Блог
    content = content.replace(
      '</div>\n        </div>\n        <a href="/blog.html"',
      `</div>\n        </div>${toolsDropdownDesktop}\n        <a href="/blog.html"`
    );
  } else if (content.includes(catDropdownEndAlt)) {
    // Group 2: has categories, then Про нас
    content = content.replace(
      '</div>\n        </div>\n        <a href="/about.html"',
      `</div>\n        </div>${toolsDropdownDesktop}\n        <a href="/about.html"`
    );
  } else {
    // Group 3: no categories dropdown — insert after Вакансії link
    const afterVacancies = /<a href="\/vacancies\.html" class="nav-link" data-i18n="nav\.jobs">(?:Вакансії)<\/a>\n/;
    const match = content.match(afterVacancies);
    if (match) {
      content = content.replace(
        afterVacancies,
        match[0] + toolsDropdownDesktop + '\n'
      );
    }
  }

  // ---- MOBILE NAV ----
  // Try to insert after mobile-categories div
  const mobileCatEnd = '<div class="mobile-categories" id="mobileCategoryNav"></div>';
  if (content.includes(mobileCatEnd)) {
    content = content.replace(
      mobileCatEnd,
      mobileCatEnd + '\n' + toolsMobile
    );
  } else {
    // No mobile categories — insert after Вакансії in mobile menu
    // Find the mobile-menu section
    const mobileMenuStart = content.indexOf('<div class="mobile-menu">');
    if (mobileMenuStart !== -1) {
      const mobileSection = content.substring(mobileMenuStart);
      const mobileVacanciesPattern = /(<a href="\/vacancies\.html" class="nav-link" data-i18n="nav\.jobs">(?:Вакансії)<\/a>\n)/;
      const mobileMatch = mobileSection.match(mobileVacanciesPattern);
      if (mobileMatch) {
        const insertPos = mobileMenuStart + mobileMatch.index + mobileMatch[0].length;
        content = content.substring(0, insertPos) + toolsMobile + '\n' + content.substring(insertPos);
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`  UPDATED: ${filePath}`);
  } else {
    console.log(`  NO CHANGE: ${filePath}`);
  }
}

console.log('Updating navigation in all files...\n');

// Process all groups
const allFiles = [...group1, ...group2, ...group3, ...group2Template];

for (const file of allFiles) {
  const filePath = path.join(SRC, file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.log(`  NOT FOUND: ${filePath}`);
  }
}

console.log(`\nDone! Updated ${updatedCount} files.`);
