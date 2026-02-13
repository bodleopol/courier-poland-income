import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://rybezh.site';
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Indexing strategy (to reduce doorway/scaled-content signals):
// - keep only a limited set of vacancy pages in sitemaps
// - the rest can remain accessible but should be noindex'ed at page level
// You can override the default selection via:
// 1) INDEXABLE_VACANCIES_LIMIT env var (number)
// 2) src/indexable-vacancies.json (array of slugs)
const INDEXABLE_VACANCIES_LIMIT = Number.parseInt(process.env.INDEXABLE_VACANCIES_LIMIT || '50', 10);

// Read content.json to get all vacancies
const contentPath = path.join(__dirname, 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

function loadIndexableVacancySlugs(allJobs) {
  const whitelistPath = path.join(__dirname, 'indexable-vacancies.json');
  try {
    const raw = fs.readFileSync(whitelistPath, 'utf8');
    const slugs = JSON.parse(raw);
    if (Array.isArray(slugs) && slugs.length > 0) {
      return new Set(slugs.map(String));
    }
  } catch (e) {
    // no whitelist file, fall back to limit
  }

  const limit = Number.isFinite(INDEXABLE_VACANCIES_LIMIT) ? Math.max(0, INDEXABLE_VACANCIES_LIMIT) : 50;
  return new Set(allJobs.slice(0, limit).map(j => String(j.slug)));
}

const INDEXABLE_VACANCY_SLUGS = loadIndexableVacancySlugs(content);
const indexableVacancies = content.filter(job => INDEXABLE_VACANCY_SLUGS.has(String(job.slug)));

// Read posts.json to get all blog posts
const postsPath = path.join(__dirname, 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

const today = new Date().toISOString().split('T')[0];

// Generate sitemap for vacancies
function generateVacanciesSitemap() {
  const urls = indexableVacancies.map(job => {
    return `  <url>
    <loc>${DOMAIN}/${job.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate sitemap for blog posts
function generateBlogSitemap() {
  const urls = posts.map(post => {
    return `  <url>
    <loc>${DOMAIN}/post-${post.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate sitemap for static pages
function generateStaticSitemap() {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'vacancies.html', priority: '0.9', changefreq: 'daily' },
    { url: 'blog.html', priority: '0.9', changefreq: 'weekly' },
    { url: 'about.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'apply.html', priority: '0.8', changefreq: 'monthly' },
    { url: 'contact.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'company.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'faq.html', priority: '0.7', changefreq: 'monthly' },
    { url: 'privacy.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'terms.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'calculator.html', priority: '0.85', changefreq: 'monthly' },
    { url: 'cv-generator.html', priority: '0.85', changefreq: 'monthly' },
    { url: 'red-flag.html', priority: '0.8', changefreq: 'monthly' }
  ];

  const urls = staticPages.map(page => {
    return `  <url>
    <loc>${DOMAIN}/${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'vacancies.html', priority: '0.9', changefreq: 'daily' },
    { url: 'blog.html', priority: '0.9', changefreq: 'weekly' },
    { url: 'about.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'apply.html', priority: '0.8', changefreq: 'monthly' },
    { url: 'contact.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'company.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'faq.html', priority: '0.7', changefreq: 'monthly' },
    { url: 'privacy.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'terms.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'calculator.html', priority: '0.85', changefreq: 'monthly' },
    { url: 'cv-generator.html', priority: '0.85', changefreq: 'monthly' },
    { url: 'red-flag.html', priority: '0.8', changefreq: 'monthly' }
  ];

  const staticUrls = staticPages.map(page => {
    return `  <url>
    <loc>${DOMAIN}/${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const vacancyUrls = indexableVacancies.map(job => {
    return `  <url>
    <loc>${DOMAIN}/${job.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const blogUrls = posts.map(post => {
    return `  <url>
    <loc>${DOMAIN}/post-${post.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
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
console.log(`✅ sitemap.xml: ${indexableVacancies.length + posts.length + 10} URLs`);

// Sitemap index
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), generateSitemapIndex(), 'utf8');
console.log('✅ sitemap-index.xml');

// Individual sitemaps
fs.writeFileSync(path.join(DIST_DIR, 'sitemap-static.xml'), generateStaticSitemap(), 'utf8');
console.log('✅ sitemap-static.xml: 10 URLs');

fs.writeFileSync(path.join(DIST_DIR, 'sitemap-vacancies.xml'), generateVacanciesSitemap(), 'utf8');
console.log(`✅ sitemap-vacancies.xml: ${indexableVacancies.length} URLs`);

fs.writeFileSync(path.join(DIST_DIR, 'sitemap-blog.xml'), generateBlogSitemap(), 'utf8');
console.log(`✅ sitemap-blog.xml: ${posts.length} URLs`);

console.log('\n🎉 All sitemaps generated successfully!');
console.log(`\n📊 Total URLs: ${indexableVacancies.length + posts.length + 10}`);
console.log(`   Static pages: 10`);
console.log(`   Vacancies: ${indexableVacancies.length} (indexable only)`);
console.log(`   Blog posts: ${posts.length}`);
