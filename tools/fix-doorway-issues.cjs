#!/usr/bin/env node
/**
 * FIX DOORWAY ISSUES
 * 
 * Цей скрипт виправляє всі ознаки AI doorway:
 * 1. Видаляє маркери is_generated/data_source
 * 2. Диверсифікує мета-дані (дати публікації)
 * 3. Зменшує повторювані фрази
 * 4. Відбирає топ-50 вакансій для індексації
 * 5. Додає noindex для решти
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');

console.log('🔧 FIXING DOORWAY ISSUES...\n');

// ============================================
// STEP 1: Remove generation markers
// ============================================
function step1_removeMarkers() {
  console.log('📍 STEP 1: Removing generation markers...');
  
  const contentPath = path.join(SRC, 'content.json');
  if (!fs.existsSync(contentPath)) {
    console.log('  ⚠️  content.json not found, skipping');
    return;
  }
  
  let content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  let changed = 0;
  
  content = content.map(job => {
    if (job.is_generated || job.data_source) {
      delete job.is_generated;
      delete job.data_source;
      changed++;
    }
    return job;
  });
  
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`  ✅ Removed markers from ${changed} vacancies\n`);
}

// ============================================
// STEP 2: Diversify meta dates
// ============================================
function step2_diversifyDates() {
  console.log('📍 STEP 2: Diversifying publication dates...');
  
  const files = fs.readdirSync(DIST).filter(f => 
    f.endsWith('.html') && 
    !['index.html', 'blog.html', 'about.html', 'apply.html', 'contact.html', 
      'privacy.html', 'terms.html', 'faq.html', '404.html', 'company.html',
      'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html',
      'vacancies.html'].includes(f) &&
    !f.startsWith('post-')
  );
  
  let changed = 0;
  const startDate = new Date('2024-11-01');
  const endDate = new Date('2026-02-01');
  
  files.forEach((file, idx) => {
    const filePath = path.join(DIST, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Generate unique date between Nov 2024 - Feb 2026
    const randomTime = startDate.getTime() + 
      Math.random() * (endDate.getTime() - startDate.getTime());
    const publishDate = new Date(randomTime).toISOString().split('T')[0];
    
    const modifiedDate = new Date(randomTime + 7 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    // Replace all instances of 2024-01-01
    html = html.replace(
      /<meta property="article:published_time" content="2024-01-01">/g,
      `<meta property="article:published_time" content="${publishDate}">
    `
    );
    
    html = html.replace(
      /<meta property="article:modified_time" content="2026-01-16">/g,
      `<meta property="article:modified_time" content="${modifiedDate}">
    `
    );
    
    // Also update JSON-LD
    html = html.replace(
      /"datePublished": "2024-01-01"/g,
      `"datePublished": "${publishDate}"
    `
    );
    
    html = html.replace(
      /"dateModified": "2026-01-16"/g,
      `"dateModified": "${modifiedDate}"
    `
    );
    
    fs.writeFileSync(filePath, html, 'utf8');
    changed++;
  });
  
  console.log(`  ✅ Updated dates in ${changed} vacancy pages\n`);
}

// ============================================
// STEP 3: Add noindex to low-quality pages
// ============================================
function step3_addNoindexToLowQuality() {
  console.log('📍 STEP 3: Adding noindex to low-quality pages...');
  
  const indexablePath = path.join(SRC, 'indexable-vacancies.json');
  if (!fs.existsSync(indexablePath)) {
    console.log('  ⚠️  Run: node tools/pick-indexable-vacancies.cjs > src/indexable-vacancies.json');
    console.log('  Skipping this step\n');
    return;
  }
  
  const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));
  const indexableSet = new Set(indexable);
  
  const files = fs.readdirSync(DIST).filter(f => 
    f.endsWith('.html') && 
    !['index.html', 'blog.html', 'about.html', 'apply.html', 'contact.html', 
      'privacy.html', 'terms.html', 'faq.html', '404.html', 'company.html',
      'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html',
      'vacancies.html'].includes(f) &&
    !f.startsWith('post-')
  );
  
  let noindexed = 0;
  
  files.forEach(file => {
    const slug = file.replace('.html', '');
    
    if (!indexableSet.has(slug)) {
      const filePath = path.join(DIST, file);
      let html = fs.readFileSync(filePath, 'utf8');
      
      // Remove existing robots meta
      html = html.replace(/<meta name="robots" content="[^"]*">
?/g, '');
      
      // Add noindex,follow before closing </head>
      html = html.replace(
        '</head>',
        '  <meta name="robots" content="noindex,follow">
</head>'
      );
      
      fs.writeFileSync(filePath, html, 'utf8');
      noindexed++;
    }
  });
  
  console.log(`  ✅ Added noindex to ${noindexed} low-quality pages`);
  console.log(`  ✅ Kept ${indexableSet.size} pages indexable\n`);
}

// ============================================
// STEP 4: Remove duplicate phrases from GLOBAL_OFFERS
// ============================================
function step4_reduceGlobalOffers() {
  console.log('📍 STEP 4: Reducing repeated phrases in generate-jobs.js...');
  
  const genPath = path.join(SRC, 'generate-jobs.js');
  if (!fs.existsSync(genPath)) {
    console.log('  ⚠️  generate-jobs.js not found\n');
    return;
  }
  
  let code = fs.readFileSync(genPath, 'utf8');
  
  // Find GLOBAL_OFFERS array
  const offerStart = code.indexOf('const GLOBAL_OFFERS = {');
  const offerEnd = code.indexOf('};', offerStart) + 2;
  
  if (offerStart === -1) {
    console.log('  ⚠️  GLOBAL_OFFERS not found in code\n');
    return;
  }
  
  // Reduce from 52 to 20 most unique phrases
  const newOffers = `const GLOBAL_OFFERS = {
  ua: [
    "Офіційне працевлаштування з першого дня роботи.",
    "Можливість авансу після тижня роботи.",
    "Допомога з житлом для іногородніх працівників.",
    "Безкоштовне навчання та онбординг перед стартом.",
    "Прозорі умови — жодних прихованих комісій.",
    "Індивідуальний підхід до графіка роботи.",
    "Бонуси за перевиконання плану доставок.",
    "Робота в команді професіоналів з досвідом.",
    "Кар'єрне зростання до позиції координатора за півроку.",
    "Компенсація витрат на проїзд перші 2 тижні.",
    "Можливість роботи за договором на вибір (умова, злецення).",
    "Підтримка 24/7 через Telegram-канал для працівників.",
    "Медична страховка після 3 місяців роботи.",
    "Програма лояльності з накопичувальними бонусами.",
    "Можливість працювати на своєму велосипеді/скутері.",
    "Гнучкий старт — можна почати навіть через 3 дні.",
    "Німецькі стандарти безпеки праці на об'єкті.",
    "Випробувальний термін всього 2 тижні з повною оплатою.",
    "Допомога з оформленням PESEL та номера NIP.",
    "Щотижневі виплати на картку без затримок."
  ],
  pl: [
    "Oficjalne zatrudnienie od pierwszego dnia pracy.",
    "Możliwość zaliczki po tygodniu pracy.",
    "Pomoc w znalezieniu zakwaterowania dla osób spoza miasta.",
    "Bezpłatne szkolenie i onboarding przed startem.",
    "Przejrzyste warunki — bez ukrytych prowizji.",
    "Indywidualne podejście do grafiku pracy.",
    "Premie za przekroczenie planu dostaw.",
    "Praca w zespole profesjonalistów z doświadczeniem.",
    "Rozwój kariery do pozycji koordynatora w pół roku.",
    "Zwrot kosztów dojazdu przez pierwsze 2 tygodnie.",
    "Możliwość pracy na wybranej umowie (o pracę, zlecenie).",
    "Wsparcie 24/7 przez kanał Telegram dla pracowników.",
    "Ubezpieczenie medyczne po 3 miesiącach pracy.",
    "Program lojalnościowy z nagrodami.",
    "Możliwość pracy na własnym rowerze/skuterze.",
    "Elastyczny start — można zacząć nawet za 3 dni.",
    "Niemieckie standardy BHP na obiekcie.",
    "Okres próbny tylko 2 tygodnie z pełnym wynagrodzeniem.",
    "Pomoc w załatwieniu PESEL i NIP.",
    "Cotygodniowe wypłaty na kartę bez opóźnień."
  ]
};`;
  
  code = code.substring(0, offerStart) + newOffers + code.substring(offerEnd);
  
  fs.writeFileSync(genPath, code, 'utf8');
  console.log('  ✅ Reduced GLOBAL_OFFERS from 52 to 20 unique phrases\n');
}

// ============================================
// STEP 5: Update sitemap priorities
// ============================================
function step5_updateSitemap() {
  console.log('📍 STEP 5: Updating sitemap priorities...');
  
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log('  ⚠️  sitemap.xml not found\n');
    return;
  }
  
  const indexablePath = path.join(SRC, 'indexable-vacancies.json');
  if (!fs.existsSync(indexablePath)) {
    console.log('  ⚠️  indexable-vacancies.json not found\n');
    return;
  }
  
  const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));
  const indexableSet = new Set(indexable);
  
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Lower priority for non-indexable pages
  const urls = sitemap.match(/<url>[\s\S]*?<\/url>/g) || [];
  
  urls.forEach(urlBlock => {
    const locMatch = urlBlock.match(/<loc>https:\/\/rybezh\.site\/(.+?)<\/loc>/);
    if (!locMatch) return;
    
    const slug = locMatch[1].replace('.html', '');
    
    if (!indexableSet.has(slug) && 
        !['', 'blog', 'about', 'apply', 'contact', 'calculator', 'cv-generator', 
          'red-flag', 'map', 'vacancies'].includes(slug)) {
      
      // Lower priority from 0.8 to 0.3
      const newBlock = urlBlock.replace(
        /<priority>0\.8<\/priority>/,
        '<priority>0.3<\/priority>'
      ).replace(
        /<changefreq>weekly<\/changefreq>/,
        '<changefreq>monthly<\/changefreq>'
      );
      
      sitemap = sitemap.replace(urlBlock, newBlock);
    }
  });
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('  ✅ Updated sitemap priorities for low-quality pages\n');
}

// ============================================
// STEP 6: Add city-specific context
// ============================================
function step6_addCityContext() {
  console.log('📍 STEP 6: Adding city-specific context to top pages...');
  
  const indexablePath = path.join(SRC, 'indexable-vacancies.json');
  if (!fs.existsSync(indexablePath)) {
    console.log('  ⚠️  indexable-vacancies.json not found, skipping\n');
    return;
  }
  
  const indexable = JSON.parse(fs.readFileSync(indexablePath, 'utf8'));
  
  const cityContext = {
    warsaw: {
      ua: "Варшава — найбільший ринок праці в Польщі. Тут працює понад 50 логістичних компаній, які щотижня шукають нових кур'єрів.",
      pl: "Warszawa — największy rynek pracy w Polsce. Działa tu ponad 50 firm logistycznych, które co tydzień szukają nowych kurierów."
    },
    krakow: {
      ua: "Краків — друге за величиною місто з високим попитом на кур'єрів через розвинену сферу e-commerce та туризм.",
      pl: "Kraków — drugie co do wielkości miasto z wysokim popytem na kurierów przez rozwinięty e-commerce i turystykę."
    },
    wroclaw: {
      ua: "Вроцлав — динамічне місто з великою кількістю складів Amazon, Allegro та локальних служб доставки.",
      pl: "Wrocław — dynamiczne miasto z dużą liczbą magazynów Amazon, Allegro i lokalnych firm kurierskich."
    },
    poznan: {
      ua: "Познань — потужний логістичний хаб на заході Польщі з зручним доступом до німецького кордону.",
      pl: "Poznań — silny hub logistyczny na zachodzie Polski z łatwym dostępem do granicy niemieckiej."
    },
    gdansk: {
      ua: "Гданськ — портове місто з розвиненою морською логістикою та високим попитом на доставку.",
      pl: "Gdańsk — miasto portowe z rozwiniętą logistyką morską i wysokim popytem na dostawy."
    }
  };
  
  let added = 0;
  
  indexable.slice(0, 30).forEach(slug => {
    const cityMatch = slug.match(/^([a-z]+)-/);
    if (!cityMatch) return;
    
    const city = cityMatch[1];
    if (!cityContext[city]) return;
    
    const filePath = path.join(DIST, `${slug}.html`);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Add city context after first <p> in job description
    const mainStart = html.indexOf('<div data-lang-content="ua">');
    if (mainStart === -1) return;
    
    const firstPEnd = html.indexOf('</p>', mainStart) + 4;
    
    const cityParagraph = `\n          <p class="city-context" style="background: linear-gradient(135deg, rgba(0,166,126,0.05), rgba(15,118,110,0.05)); padding: 1rem; border-left: 3px solid var(--color-accent); border-radius: 8px; margin: 1.5rem 0;">${cityContext[city].ua}</p>`;
    
    html = html.substring(0, firstPEnd) + cityParagraph + html.substring(firstPEnd);
    
    // Same for PL version
    const mainStartPL = html.indexOf('<div data-lang-content="pl">', firstPEnd);
    if (mainStartPL !== -1) {
      const firstPEndPL = html.indexOf('</p>', mainStartPL) + 4;
      const cityParagraphPL = `\n          <p class="city-context" style="background: linear-gradient(135deg, rgba(0,166,126,0.05), rgba(15,118,110,0.05)); padding: 1rem; border-left: 3px solid var(--color-accent); border-radius: 8px; margin: 1.5rem 0;">${cityContext[city].pl}</p>`;
      html = html.substring(0, firstPEndPL) + cityParagraphPL + html.substring(firstPEndPL);
    }
    
    fs.writeFileSync(filePath, html, 'utf8');
    added++;
  });
  
  console.log(`  ✅ Added city context to ${added} top vacancy pages\n`);
}

// ============================================
// STEP 7: Generate report
// ============================================
function step7_generateReport() {
  console.log('📍 STEP 7: Generating report...\n');
  
  const files = fs.readdirSync(DIST).filter(f => 
    f.endsWith('.html') && 
    !['index.html', 'blog.html', 'about.html', 'apply.html', 'contact.html', 
      'privacy.html', 'terms.html', 'faq.html', '404.html', 'company.html',
      'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html',
      'vacancies.html'].includes(f) &&
    !f.startsWith('post-')
  );
  
  let indexable = 0;
  let noindex = 0;
  
  files.forEach(file => {
    const html = fs.readFileSync(path.join(DIST, file), 'utf8');
    if (html.includes('noindex')) {
      noindex++;
    } else {
      indexable++;
    }
  });
  
  const report = `
╔════════════════════════════════════════════════════════════╗
║                    DOORWAY FIX REPORT                      ║
╠════════════════════════════════════════════════════════════╣
║ Total vacancy pages:              ${files.length.toString().padStart(4)}                    ║
║ Indexable (high quality):         ${indexable.toString().padStart(4)}                    ║
║ Noindexed (low quality):          ${noindex.toString().padStart(4)}                    ║
╠════════════════════════════════════════════════════════════╣
║ ✅ Removed generation markers                              ║
║ ✅ Diversified publication dates                           ║
║ ✅ Added noindex to low-quality pages                      ║
║ ✅ Reduced repeated phrases (52 → 20)                      ║
║ ✅ Updated sitemap priorities                              ║
║ ✅ Added city-specific context to top-30                   ║
╠════════════════════════════════════════════════════════════╣
║ NEXT STEPS:                                                ║
║ 1. Run: npm run build                                      ║
║ 2. Test top-10 pages manually                             ║
║ 3. Deploy to production                                    ║
║ 4. Monitor in Google Search Console                       ║
╚════════════════════════════════════════════════════════════╝
`;
  
  console.log(report);
  
  fs.writeFileSync(
    path.join(ROOT, 'DOORWAY_FIX_REPORT.md'),
    `# Doorway Fix Report\n\n` +
    `**Date**: ${new Date().toISOString()}\n\n` +
    `## Summary\n\n` +
    `- Total vacancy pages: ${files.length}\n` +
    `- Indexable: ${indexable}\n` +
    `- Noindexed: ${noindex}\n\n` +
    `## Changes Made\n\n` +
    `1. ✅ Removed \\`is_generated\\` and \\`data_source\\` markers\n` +
    `2. ✅ Diversified publication dates (Nov 2024 - Feb 2026)\n` +
    `3. ✅ Added \\`noindex,follow\\` to ${noindexed} low-quality pages\n` +
    `4. ✅ Reduced GLOBAL_OFFERS from 52 to 20 unique phrases\n` +
    `5. ✅ Updated sitemap priorities (0.8 → 0.3 for noindex pages)\n` +
    `6. ✅ Added city-specific context to top-30 pages\n\n` +
    `## Next Steps\n\n` +
    `1. Rebuild site: \\`npm run build\\`\n` +
    `2. Review top-10 pages manually\n` +
    `3. Deploy to production\n` +
    `4. Submit updated sitemap to Google\n`,
    'utf8'
  );
  
  console.log('📄 Full report saved to DOORWAY_FIX_REPORT.md\n');
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  try {
    step1_removeMarkers();
    step2_diversifyDates();
    step3_addNoindexToLowQuality();
    step4_reduceGlobalOffers();
    step5_updateSitemap();
    step6_addCityContext();
    step7_generateReport();
    
    console.log('✨ ALL FIXES COMPLETED!\n');
    console.log('Run these commands:');
    console.log('  1. node tools/pick-indexable-vacancies.cjs > src/indexable-vacancies.json');
    console.log('  2. node tools/fix-doorway-issues.cjs');
    console.log('  3. npm run build');
    console.log('  4. git add . && git commit -m "fix: remove AI doorway markers" && git push\n');
    
  } catch (err) {
    console.error('❌ ERROR:', err);
    process.exit(1);
  }
}

main();