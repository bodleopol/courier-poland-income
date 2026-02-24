import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://rybezh.site';
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Read content.json to get all vacancies
const contentPath = path.join(__dirname, 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

/**
 * Detects near-duplicate vacancy pages that share the same city prefix and job-type
 * base (slug without city prefix and trailing numeric ID).
 * Returns a Set of slugs that are secondary variants to be excluded from the sitemap.
 * Mirrors the same logic in generate.js to keep indexing decisions consistent.
 */
function detectNearDuplicateSlugs(pages) {
  const groups = new Map();
  for (const page of pages) {
    const slug = page.slug || '';
    const parts = slug.split('-');
    if (parts.length < 2) continue;
    const cityPrefix = parts[0];
    let jobParts = parts.slice(1);
    if (jobParts.length > 0 && /^\d+$/.test(jobParts[jobParts.length - 1])) {
      jobParts = jobParts.slice(0, -1);
    }
    const jobBase = jobParts.join('-');
    if (!jobBase) continue;
    const key = `${cityPrefix}::${jobBase}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slug);
  }
  const secondarySlugs = new Set();
  for (const [, slugs] of groups) {
    if (slugs.length >= 2) {
      for (const slug of slugs.slice(1)) {
        secondarySlugs.add(slug);
      }
    }
  }
  return secondarySlugs;
}

const nearDuplicateSlugs = detectNearDuplicateSlugs(content);
const indexableVacancies = content.filter(job => !nearDuplicateSlugs.has(job.slug));

// Read posts.json to get all blog posts
const postsPath = path.join(__dirname, 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

const today = new Date().toISOString().split('T')[0];

// Generate sitemap for vacancies
function generateVacanciesSitemap() {
  const urls = indexableVacancies.flatMap(job => {
    const uaUrl = `${DOMAIN}/${job.slug}.html`;
    const plUrl = `${DOMAIN}/${job.slug}-pl.html`;
    const ruUrl = `${DOMAIN}/${job.slug}-ru.html`;
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${uaUrl}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${uaUrl}"/>`;
    return [
      `  <url>
    <loc>${uaUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

// Generate sitemap for blog posts
function generateBlogSitemap() {
  const urls = posts.flatMap(post => {
    const uaUrl = `${DOMAIN}/post-${post.slug}.html`;
    const plUrl = `${DOMAIN}/post-${post.slug}-pl.html`;
    const ruUrl = `${DOMAIN}/post-${post.slug}-ru.html`;
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${uaUrl}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${uaUrl}"/>`;
    return [
      `  <url>
    <loc>${uaUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

// Static pages for sitemap — defined as base UA pages; PL and RU variants are generated automatically.
const STATIC_SITEMAP_PAGES = [
  { url: '',                  priority: '1.0', changefreq: 'daily' },
  { url: 'vacancies.html',    priority: '0.9', changefreq: 'daily' },
  { url: 'blog.html',         priority: '0.9', changefreq: 'weekly' },
  { url: 'about.html',        priority: '0.6', changefreq: 'monthly' },
  { url: 'apply.html',        priority: '0.8', changefreq: 'monthly' },
  { url: 'contact.html',      priority: '0.6', changefreq: 'monthly' },
  { url: 'company.html',      priority: '0.6', changefreq: 'monthly' },
  { url: 'faq.html',          priority: '0.7', changefreq: 'monthly' },
  { url: 'privacy.html',      priority: '0.3', changefreq: 'yearly' },
  { url: 'terms.html',        priority: '0.3', changefreq: 'yearly' },
  { url: 'calculator.html',   priority: '0.85', changefreq: 'monthly' },
  { url: 'cv-generator.html', priority: '0.85', changefreq: 'monthly' },
  { url: 'red-flag.html',     priority: '0.8', changefreq: 'monthly' },
  { url: 'map.html',          priority: '0.9', changefreq: 'daily' },
  { url: 'proof.html',        priority: '0.9', changefreq: 'daily' },
  { url: 'for-employers.html', priority: '0.7', changefreq: 'monthly' }
];

/**
 * Derive the PL and RU alternate URLs for a static page.
 * Root page '' maps to index-pl.html / index-ru.html.
 */
function staticAlternates(baseUrl) {
  if (!baseUrl) {
    return {
      ua: `${DOMAIN}/`,
      pl: `${DOMAIN}/index-pl.html`,
      ru: `${DOMAIN}/index-ru.html`
    };
  }
  return {
    ua: `${DOMAIN}/${baseUrl}`,
    pl: `${DOMAIN}/${baseUrl.replace('.html', '-pl.html')}`,
    ru: `${DOMAIN}/${baseUrl.replace('.html', '-ru.html')}`
  };
}

// Generate sitemap for static pages
function generateStaticSitemap() {
  const urls = STATIC_SITEMAP_PAGES.flatMap(page => {
    const alts = staticAlternates(page.url);
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${alts.ua}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${alts.pl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${alts.ru}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${alts.ua}"/>`;
    return [
      `  <url>
    <loc>${alts.ua}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${alts.pl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${alts.ru}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

// Generate sitemap index (master sitemap)
function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-vacancies.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Generate main sitemap.xml (all URLs in one file for simplicity)
function generateMainSitemap() {
  const staticUrls = STATIC_SITEMAP_PAGES.flatMap(page => {
    const alts = staticAlternates(page.url);
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${alts.ua}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${alts.pl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${alts.ru}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${alts.ua}"/>`;
    return [
      `  <url>
    <loc>${alts.ua}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${alts.pl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${alts.ru}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  const vacancyUrls = indexableVacancies.flatMap(job => {
    const uaUrl = `${DOMAIN}/${job.slug}.html`;
    const plUrl = `${DOMAIN}/${job.slug}-pl.html`;
    const ruUrl = `${DOMAIN}/${job.slug}-ru.html`;
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${uaUrl}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${uaUrl}"/>`;
    return [
      `  <url>
    <loc>${uaUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  const blogUrls = posts.flatMap(post => {
    const uaUrl = `${DOMAIN}/post-${post.slug}.html`;
    const plUrl = `${DOMAIN}/post-${post.slug}-pl.html`;
    const ruUrl = `${DOMAIN}/post-${post.slug}-ru.html`;
    const xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="uk" href="${uaUrl}"/>
    <xhtml:link rel="alternate" hreflang="pl" href="${plUrl}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${ruUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${uaUrl}"/>`;
    return [
      `  <url>
    <loc>${uaUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${plUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`,
      `  <url>
    <loc>${ruUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${xhtmlLinks}
  </url>`
    ];
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${staticUrls}
${vacancyUrls}
${blogUrls}
</urlset>`;
}

// Write all sitemap files
console.log('🗺️  Generating sitemaps...');

// Main sitemap.xml with all URLs
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), generateMainSitemap(), 'utf8');
const STATIC_PAGES_COUNT = STATIC_SITEMAP_PAGES.length;
// Each base page produces 3 entries (ua/pl/ru)
const totalStaticUrls = STATIC_PAGES_COUNT * 3;
const totalVacancyUrls = indexableVacancies.length * 3;
const totalBlogUrls = posts.length * 3;
console.log(`✅ sitemap.xml: ${totalStaticUrls + totalVacancyUrls + totalBlogUrls} URLs (all languages)`);

// Sitemap index
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), generateSitemapIndex(), 'utf8');
console.log('✅ sitemap-index.xml');

// Individual sitemaps
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-static.xml'), generateStaticSitemap(), 'utf8');
console.log(`✅ sitemap-static.xml: ${totalStaticUrls} URLs (${STATIC_PAGES_COUNT} base pages × 3 languages)`);

fs.writeFileSync(path.join(DIST_DIR, 'sitemap-vacancies.xml'), generateVacanciesSitemap(), 'utf8');
console.log(`✅ sitemap-vacancies.xml: ${totalVacancyUrls} URLs (${indexableVacancies.length} vacancies × 3 languages)`);

fs.writeFileSync(path.join(DIST_DIR, 'sitemap-blog.xml'), generateBlogSitemap(), 'utf8');
console.log(`✅ sitemap-blog.xml: ${totalBlogUrls} URLs (${posts.length} posts × 3 languages)`);

console.log('\n🎉 All sitemaps generated successfully!');
console.log(`\n📊 Total URLs: ${totalStaticUrls + totalVacancyUrls + totalBlogUrls}`);
console.log(`   Static pages: ${STATIC_PAGES_COUNT} base pages (${totalStaticUrls} with all languages)`);
console.log(`   Vacancies: ${indexableVacancies.length} indexable (${totalVacancyUrls} with all languages)`);
console.log(`   Blog posts: ${posts.length} posts (${totalBlogUrls} with all languages)`);
