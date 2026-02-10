/**
 * Google-Eye Audit: аналізує dist/ HTML як Googlebot
 * Перевіряє: шаблонність, повторення, дубльований контент, тонкий контент, мета-конфлікти
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

// Get all vacancy HTML files (not static pages)
const staticPages = new Set(['index.html', 'about.html', 'apply.html', 'blog.html', 'faq.html',
  'contact.html', 'company.html', 'privacy.html', 'terms.html', 'vacancies.html', '404.html']);

const files = fs.readdirSync(DIST)
  .filter(f => f.endsWith('.html') && !staticPages.has(f) && !f.startsWith('post-') && !f.startsWith('blog'));

console.log(`\n🔍 GOOGLE-EYE AUDIT: Analyzing ${files.length} vacancy pages\n`);

const issues = {
  critical: [],
  high: [],
  medium: [],
  low: []
};

// === 1. ROBOTS META CONFLICT ===
let robotsConflicts = 0;
let robotsNoindex = 0;
files.forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const indexFollow = html.includes('content="index, follow"');
  const noindexFollow = html.includes('content="noindex,follow"');
  if (indexFollow && noindexFollow) robotsConflicts++;
  if (noindexFollow) robotsNoindex++;
});

if (robotsConflicts > 0) {
  issues.critical.push(`🔴 ROBOTS META CONFLICT: ${robotsConflicts} pages have BOTH "index,follow" AND "noindex,follow" meta tags. Google sees conflicting signals.`);
}
if (robotsNoindex > 0) {
  issues.high.push(`🟠 NOINDEX ON VACANCIES: ${robotsNoindex}/${files.length} vacancy pages have noindex. Google won't index them. If these should bring traffic — remove noindex.`);
}

// === 2. CONTENT UNIQUENESS ANALYSIS ===
const contentFingerprints = new Map(); // fingerprint -> [files]
const titleMap = new Map(); // title -> [files]
const descriptionMap = new Map(); // description -> [files]
const bodyTexts = []; // for pairwise similarity

files.forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/ — Rybezh$/, '').trim() : '';
  if (!titleMap.has(title)) titleMap.set(title, []);
  titleMap.get(title).push(f);
  
  // Extract meta description
  const descMatch = html.match(/<meta name="description"[^>]*content="([^"]*?)"/);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (!descriptionMap.has(desc)) descriptionMap.set(desc, []);
  descriptionMap.get(desc).push(f);
  
  // Extract visible text content between <main> and </main>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    // Strip HTML tags, normalize whitespace
    const text = mainMatch[1]
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    bodyTexts.push({ file: f, text, length: text.length });
    
    // Create fingerprint from key phrases (first 200 chars of visible content)
    const fp = text.substring(0, 300).toLowerCase();
    if (!contentFingerprints.has(fp)) contentFingerprints.set(fp, []);
    contentFingerprints.get(fp).push(f);
  }
});

// Check duplicate titles
const dupTitles = [...titleMap.entries()].filter(([_, files]) => files.length > 1);
if (dupTitles.length > 0) {
  issues.high.push(`🟠 DUPLICATE TITLES: ${dupTitles.length} titles used on multiple pages:`);
  dupTitles.slice(0, 10).forEach(([title, files]) => {
    issues.high.push(`   "${title}" → ${files.length} pages`);
  });
}

// Check duplicate descriptions
const dupDescs = [...descriptionMap.entries()].filter(([_, files]) => files.length > 1);
if (dupDescs.length > 0) {
  issues.medium.push(`🟡 DUPLICATE META DESCRIPTIONS: ${dupDescs.length} descriptions shared across pages`);
}

// === 3. THIN CONTENT CHECK ===
const thinPages = bodyTexts.filter(p => p.length < 500);
const avgLength = bodyTexts.reduce((s, p) => s + p.length, 0) / bodyTexts.length;
if (thinPages.length > 0) {
  issues.high.push(`🟠 THIN CONTENT: ${thinPages.length} pages have < 500 chars of visible text`);
}

// === 4. REPEATED PHRASES ACROSS PAGES ===
// Count how often exact sentences appear
const sentenceCount = new Map();
bodyTexts.forEach(({ text }) => {
  // Split into sentences (rough but effective)
  const sentences = text.split(/[.!?]/).map(s => s.trim().toLowerCase()).filter(s => s.length > 20);
  sentences.forEach(s => {
    sentenceCount.set(s, (sentenceCount.get(s) || 0) + 1);
  });
});

const repeatedSentences = [...sentenceCount.entries()]
  .filter(([_, count]) => count > files.length * 0.3) // appears in >30% of pages
  .sort((a, b) => b[1] - a[1]);

if (repeatedSentences.length > 0) {
  issues.medium.push(`🟡 REPEATED SENTENCES (>30% of pages):`);
  repeatedSentences.slice(0, 15).forEach(([sentence, count]) => {
    const pct = ((count / files.length) * 100).toFixed(0);
    issues.medium.push(`   [${pct}%] "${sentence.substring(0, 80)}..."`);
  });
}

// === 5. STRUCTURAL TEMPLATE DETECTION ===
// Count HTML structure fingerprints
const structFingerprints = new Map();
files.forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  // Extract tag sequence from main content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    const tags = mainMatch[1].match(/<(h[1-6]|div|section|ul|li|p|a|hr|strong)[^>]*>/g) || [];
    const tagSequence = tags.map(t => t.match(/<(\w+)/)[1]).join(',');
    if (!structFingerprints.has(tagSequence)) structFingerprints.set(tagSequence, []);
    structFingerprints.get(tagSequence).push(f);
  }
});

const uniqueStructures = structFingerprints.size;
const largestGroup = Math.max(...[...structFingerprints.values()].map(v => v.length));

if (uniqueStructures <= 3) {
  issues.high.push(`🟠 LOW STRUCTURAL DIVERSITY: Only ${uniqueStructures} unique HTML structures across ${files.length} pages (largest group: ${largestGroup} pages)`);
} else if (uniqueStructures <= 10) {
  issues.medium.push(`🟡 MODERATE STRUCTURAL DIVERSITY: ${uniqueStructures} unique structures across ${files.length} pages`);
}

// === 6. NOTICE/DISCLAIMER TEXT REPETITION ===
let noticeCount = 0;
const noticeText = 'Це опис типових умов і обовʼязків';
files.forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  if (html.includes(noticeText)) noticeCount++;
});
if (noticeCount > files.length * 0.5) {
  issues.medium.push(`🟡 DISCLAIMER ON ${noticeCount}/${files.length} (${((noticeCount/files.length)*100).toFixed(0)}%) pages: "${noticeText}..." — tells Google these aren't real job listings.`);
}

// === 7. BOILERPLATE RATIO ===
// Compare unique words per page vs shared words
const allWords = new Map();
const pageWordSets = [];
bodyTexts.forEach(({ file, text }) => {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordSet = new Set(words);
  pageWordSets.push({ file, wordSet, totalWords: words.length });
  words.forEach(w => allWords.set(w, (allWords.get(w) || 0) + 1));
});

// Words appearing in >50% of pages = boilerplate
const boilerplateWords = new Set([...allWords.entries()].filter(([_, c]) => c > files.length * 0.5).map(([w]) => w));
const boilerplateRatios = pageWordSets.map(({ file, wordSet, totalWords }) => {
  const boilerCount = [...wordSet].filter(w => boilerplateWords.has(w)).length;
  return { file, ratio: boilerCount / wordSet.size, totalWords, uniqueWords: wordSet.size };
});
const avgBoilerplate = boilerplateRatios.reduce((s, r) => s + r.ratio, 0) / boilerplateRatios.length;

if (avgBoilerplate > 0.5) {
  issues.high.push(`🟠 HIGH BOILERPLATE: Average ${(avgBoilerplate * 100).toFixed(0)}% of words per page are shared across >50% of all pages`);
}

// === 8. CATEGORY-SPECIFIC CONTENT CHECK ===
const categories = new Map();
files.forEach(f => {
  const parts = f.split('-');
  if (parts.length >= 3) {
    const cat = parts[1]; // city-CATEGORY-...
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat).push(f);
  }
});

// Check if pages within same category share too much
categories.forEach((catFiles, cat) => {
  if (catFiles.length < 3) return;
  const catTexts = catFiles.map(f => {
    const html = fs.readFileSync(path.join(DIST, f), 'utf8');
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    return mainMatch ? mainMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  });
  
  // Check pairwise similarity (sample first 5 pairs)
  let highSimilarity = 0;
  const pairs = Math.min(catFiles.length, 5);
  for (let i = 0; i < pairs - 1; i++) {
    const words1 = new Set(catTexts[i].toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const words2 = new Set(catTexts[i+1].toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const intersection = [...words1].filter(w => words2.has(w)).length;
    const similarity = intersection / Math.max(words1.size, words2.size);
    if (similarity > 0.7) highSimilarity++;
  }
  
  if (highSimilarity > 0) {
    issues.medium.push(`🟡 CATEGORY "${cat}": ${highSimilarity} page pairs have >70% word overlap within this category`);
  }
});

// === 9. CONTENT DATA MISMATCH (UA vs PL) ===
let dataMismatch = 0;
let checkedFiles = 0;
files.slice(0, 30).forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const uaBlock = html.match(/data-lang-content="ua">([\s\S]*?)(?=<div data-lang-content="pl")/);
  const plBlock = html.match(/data-lang-content="pl"[^>]*>([\s\S]*?)(?=<\/div>\s*<div class="share)/);
  
  if (uaBlock && plBlock) {
    checkedFiles++;
    // Extract schedule/pattern from both  
    const uaSchedule = uaBlock[1].match(/<li>Графік:\s*(.*?)<\/li>/);
    const plSchedule = plBlock[1].match(/<li>Grafik:\s*(.*?)<\/li>/);
    
    const uaSystem = uaBlock[1].match(/<li>Режим:\s*(.*?)<\/li>/);
    const plSystem = plBlock[1].match(/<li>System:\s*(.*?)<\/li>/);
    
    const uaContract = uaBlock[1].match(/<li>Договір:\s*(.*?)<\/li>/);
    const plContract = plBlock[1].match(/<li>Umowa:\s*(.*?)<\/li>/);
    
    // Check if UA and PL semantically match (comparing values that should be same)
    if (uaContract && plContract && uaContract[1] !== plContract[1]) {
      dataMismatch++;
    }
  }
});

if (dataMismatch > 0) {
  issues.critical.push(`🔴 UA/PL DATA MISMATCH: ${dataMismatch}/${checkedFiles} checked pages have different contract values between UA and PL versions`);
}

// === 10. WORD COUNT DISTRIBUTION ===
const wordCounts = bodyTexts.map(p => p.text.split(/\s+/).length);
const minWords = Math.min(...wordCounts);
const maxWords = Math.max(...wordCounts);
const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
const stdDev = Math.round(Math.sqrt(wordCounts.reduce((s, w) => s + Math.pow(w - avgWords, 2), 0) / wordCounts.length));

if (stdDev < avgWords * 0.15) {
  issues.medium.push(`🟡 UNIFORM PAGE LENGTH: All pages ~${avgWords} words (±${stdDev}). Range: ${minWords}-${maxWords}. Natural sites vary more.`);
}

// === 11. LINK STRUCTURE ===
let pagesWithInternalLinks = 0;
let totalInternalLinks = 0;
files.forEach(f => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    const links = mainMatch[1].match(/href="\/[^"]+\.html"/g) || [];
    // Exclude apply.html and index
    const contentLinks = links.filter(l => !l.includes('apply.html') && l !== 'href="/"');
    if (contentLinks.length > 0) pagesWithInternalLinks++;
    totalInternalLinks += contentLinks.length;
  }
});

if (pagesWithInternalLinks < files.length * 0.3) {
  issues.medium.push(`🟡 LOW INTERLINKING: Only ${pagesWithInternalLinks}/${files.length} vacancy pages link to other content pages. Google values interconnected content.`);
}

// === PRINT RESULTS ===
console.log('=' .repeat(70));
console.log('CRITICAL ISSUES (must fix immediately):');
console.log('=' .repeat(70));
if (issues.critical.length === 0) console.log('  ✅ No critical issues found');
issues.critical.forEach(i => console.log('  ' + i));

console.log('\n' + '='.repeat(70));
console.log('HIGH PRIORITY ISSUES:');
console.log('='.repeat(70));
if (issues.high.length === 0) console.log('  ✅ No high-priority issues');
issues.high.forEach(i => console.log('  ' + i));

console.log('\n' + '='.repeat(70));
console.log('MEDIUM PRIORITY:');
console.log('='.repeat(70));
if (issues.medium.length === 0) console.log('  ✅ No medium issues');
issues.medium.forEach(i => console.log('  ' + i));

console.log('\n' + '='.repeat(70));
console.log('STATS:');
console.log('='.repeat(70));
console.log(`  Total vacancy pages: ${files.length}`);
console.log(`  Unique HTML structures: ${uniqueStructures}`);
console.log(`  Avg word count: ${avgWords} (std dev: ${stdDev}, range: ${minWords}-${maxWords})`);
console.log(`  Avg boilerplate ratio: ${(avgBoilerplate * 100).toFixed(1)}%`);
console.log(`  Pages with content interlinking: ${pagesWithInternalLinks}/${files.length}`);
console.log(`  Unique titles: ${titleMap.size}/${files.length}`);
console.log(`  Unique descriptions: ${descriptionMap.size}/${files.length}`);
console.log(`  Categories found: ${[...categories.keys()].join(', ')}`);
