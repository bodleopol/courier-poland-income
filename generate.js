import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC = __dirname;
const DIST = path.join(__dirname, '..', 'dist');

// --- Helper Functions ---

function escapeHtml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function estimateReadingTime(text) {
  const wpm = 200;
  const words = (text || '').trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getRandomItems(arr, count, seed) {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr];
  let m = shuffled.length, t, i;
  while (m) {
    i = (seed + m) % m--; 
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled.slice(0, count);
}

// --- Content Generators ---

function generateJobFAQ(job, lang) {
  const isPl = lang === 'pl';
  const questions = [
    {
      q: isPl ? "Jakie dokumenty są potrzebne?" : "Які документи потрібні?",
      a: isPl ? "Wymagany jest paszport oraz wiza lub status UKR (PESEL). Pomagamy w formalnościach." : "Потрібен паспорт та віза або статус UKR (PESEL). Ми допомагаємо з оформленням."
    },
    {
      q: isPl ? "Czy zapewniacie zakwaterowanie?" : "Чи надається житло?",
      a: isPl ? (job.housing_pl || "Tak, oferujemy pomoc w zakwaterowaniu.") : (job.housing_ua || "Так, ми пропонуємо допомогу з житлом.")
    },
    {
      q: isPl ? "Kiedy mogę zacząć?" : "Коли можна почати?",
      a: isPl ? (job.start_pl || "Od zaraz.") : (job.start_ua || "Терміново.")
    }
  ];

  return `
    <div class="job-faq">
      <h3>${isPl ? 'Częste pytania' : 'Часті запитання'}</h3>
      ${questions.map(item => `
        <details>
          <summary>${escapeHtml(item.q)}</summary>
          <p>${escapeHtml(item.a)}</p>
        </details>
      `).join('')}
    </div>
  `;
}

function generateRelatedJobs(currentJob, allJobs, lang) {
  const isPl = lang === 'pl';
  // Find jobs in same category or city
  const related = getRandomItems(
    allJobs.filter(j => j.slug !== currentJob.slug && (j.category === currentJob.category || j.city === currentJob.city)),
    3,
    hashString(currentJob.slug)
  );

  if (related.length === 0) return '';

  return `
    <div class="related-jobs">
      <h3>${isPl ? 'Podobne oferty' : 'Схожі вакансії'}</h3>
      <div class="related-grid">
        ${related.map(r => `
          <a href="/${r.slug}${isPl ? '-pl' : ''}.html" class="related-card">
            <h4>${escapeHtml(isPl ? r.title_pl : r.title)}</h4>
            <div class="related-meta">
              <span>📍 ${escapeHtml(isPl ? r.city_pl : r.city)}</span>
              <span>💰 ${escapeHtml(r.salary)}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// --- Main Build Function ---

async function build() {
  console.log('🚀 Starting build process...');
  
  await fs.mkdir(DIST, { recursive: true });

  // Load Data
  const pages = JSON.parse(await fs.readFile(path.join(SRC, 'content.json'), 'utf8'));
  
  let posts = [];
  try {
    posts = JSON.parse(await fs.readFile(path.join(SRC, 'posts.json'), 'utf8'));
  } catch (e) {
    console.log('ℹ️ No posts.json found, skipping blog generation.');
  }

  let categories = {};
  try {
    categories = JSON.parse(await fs.readFile(path.join(SRC, 'categories.json'), 'utf8'));
  } catch (e) {
    console.log('ℹ️ No categories.json found.');
  }

  const pageTpl = await fs.readFile(path.join(SRC, 'page.html'), 'utf8');

  // Copy Assets
  const assets = ['styles.css', 'features.css', 'jobs.js', 'jobs-loader.js', 'main.js', 'favicon.svg', 'og-image.svg', 'engagement.css', 'engagement-helpers.js', 'categories.json', 'posts.json'];
  for (const asset of assets) {
    try {
      await fs.copyFile(path.join(SRC, asset), path.join(DIST, asset));
    } catch (e) {
      // console.warn(`⚠️ Asset missing: ${asset}`);
    }
  }

  // --- Generate Job Pages (UA & PL) ---
  console.log(`📦 Generating ${pages.length} job pages...`);
  
  for (const page of pages) {
    await createJobPage(page, 'ua', pageTpl, pages);
    await createJobPage(page, 'pl', pageTpl, pages);
  }

  // --- Generate Blog Pages ---
  if (posts.length > 0) {
    console.log(`📝 Generating blog pages...`);
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (const post of sortedPosts) {
      await createBlogPost(post, 'ua', pageTpl, sortedPosts);
      if (post.title_pl) {
        await createBlogPost(post, 'pl', pageTpl, sortedPosts);
      }
    }

    // Blog Index
    await createBlogIndex(sortedPosts, pageTpl);
  }

  // --- Generate Static Pages ---
  const staticPages = ['index.html', 'vacancies.html', 'apply.html', 'about.html', 'contact.html', 'faq.html', 'privacy.html', 'terms.html', 'company.html', '404.html', 'calculator.html', 'cv-generator.html', 'red-flag.html', 'map.html', 'for-employers.html'];
  
  for (const p of staticPages) {
    try {
      let content = await fs.readFile(path.join(SRC, p), 'utf8');
      
      // Inject shared data
      const dataScript = `<script>window.CATEGORIES = ${JSON.stringify(categories)};</script>`;
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${dataScript}</head>`);
      }
      
      // Update year
      content = content.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));

      // Write UA version (default)
      await fs.writeFile(path.join(DIST, p), content, 'utf8');
      
      // Create PL version
      if (p !== '404.html') {
        const plContent = content
          .replace(/<html lang="uk">/g, '<html lang="pl">')
          .replace(/href="\/"/g, 'href="/index-pl.html"')
          // Виправлено регулярний вираз і видалено помилкове дублювання коду тут:
          .replace(/href="\/([^"]+)\.html"/g, 'href="/$1-pl.html"');
          
        const plFilename = p === 'index.html' ? 'index-pl.html' : p.replace('.html', '-pl.html');
        await fs.writeFile(path.join(DIST, plFilename), plContent, 'utf8');
      }

    } catch (e) {
       console.warn(`⚠️ Static page missing or error: ${p}`);
    }
  }

  // Generate Sitemap
  await createSitemap(pages, posts, staticPages);

  console.log('✅ Build complete!');
}

async function createJobPage(job, lang, tpl, allJobs) {
  const isPl = lang === 'pl';
  const slug = isPl ? `${job.slug}-pl` : job.slug;
  const filename = `${slug}.html`;
  
  const title = isPl ? (job.title_pl || job.title) : job.title;
  const description = isPl ? (job.excerpt_pl || job.excerpt) : job.excerpt;
  const body = isPl ? (job.body_pl || job.body) : job.body;
  const city = isPl ? (job.city_pl || job.city) : job.city;
  const ctaText = isPl ? (job.cta_text_pl || 'Aplikuj') : (job.cta_text || 'Подати заявку');
  
  const faqHtml = generateJobFAQ(job, lang);
  const relatedHtml = generateRelatedJobs(job, allJobs, lang);

  const contentHtml = `
    <div class="job-page">
      <div class="job-header">
        <span class="tag">📍 ${escapeHtml(city)}</span>
        <span class="tag">💰 ${escapeHtml(job.salary)}</span>
      </div>
      <div class="job-body">
        ${body}
      </div>
      ${faqHtml}
      ${relatedHtml}
      <div class="job-actions">
        <a href="/apply.html" class="btn-primary">${escapeHtml(ctaText)}</a>
        <a href="/${isPl ? 'vacancies-pl.html' : 'vacancies.html'}" class="btn-secondary">${isPl ? 'Wróć do listy' : 'Назад до списку'}</a>
      </div>
    </div>
  `;

  const canonical = `https://rybezh.site/${job.slug}${isPl ? '-pl' : ''}.html`;
  // Виправлено вставку HTML
  let html = tpl
    .replace(/{{TITLE}}/g, escapeHtml(title))
    .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
    .replace(/{{CONTENT}}/g, contentHtml)
    .replace(/{{CANONICAL}}/g, canonical)
    .replace(/{{CITY}}/g, escapeHtml(city))
    .replace(/{{CTA_LINK}}/g, '/apply.html')
    .replace(/{{CTA_TEXT}}/g, escapeHtml(ctaText));

  if (isPl) {
    html = html.replace(/<html lang="uk">/g, `<html lang="pl">`);
  }

  // Додаємо hreflang
  const hreflang = `
    <link rel="alternate" hreflang="uk" href="https://rybezh.site/${job.slug}.html" />
    <link rel="alternate" hreflang="pl" href="https://rybezh.site/${job.slug}-pl.html" />
  `;
  html = html.replace('</head>', `${hreflang}</head>`);

  await fs.writeFile(path.join(DIST, filename), html, 'utf8');
}

async function createBlogPost(post, lang, tpl, allPosts) {
  const isPl = lang === 'pl';
  const slug = `post-${post.slug}${isPl ? '-pl' : ''}`;
  const filename = `${slug}.html`;
  
  const title = isPl ? (post.title_pl || post.title) : post.title;
  const excerpt = isPl ? (post.excerpt_pl || post.excerpt) : post.excerpt;
  const body = isPl ? (post.body_pl || post.body) : post.body;
  const readTime = estimateReadingTime(body);

  const contentHtml = `
    <article class="blog-post">
      <h1>${escapeHtml(title)}</h1>
      <div class="post-meta">📅 ${post.date} · ⏱️ ${readTime} ${isPl ? 'min' : 'хв'}</div>
      <div class="post-content">${body}</div>
      <div class="post-footer">
        <a href="/${isPl ? 'blog-pl.html' : 'blog.html'}" class="btn-secondary">← ${isPl ? 'Wróć do bloga' : 'Назад до блогу'}</a>
      </div>
    </article>
  `;

  const canonical = `https://rybezh.site/post-${post.slug}${isPl ? '-pl' : ''}.html`;
  
  let html = tpl
    .replace(/{{TITLE}}/g, escapeHtml(title))
    .replace(/{{DESCRIPTION}}/g, escapeHtml(excerpt))
    .replace(/{{CONTENT}}/g, contentHtml)
    .replace(/{{CANONICAL}}/g, canonical)
    .replace(/{{CITY}}/g, '')
    .replace(/{{CTA_LINK}}/g, '/apply.html')
    .replace(/{{CTA_TEXT}}/g, isPl ? 'Aplikuj' : 'Подати заявку');

  if (isPl) {
    html = html.replace(/<html lang="uk">/g, `<html lang="pl">`);
  }

  const hreflang = `
    <link rel="alternate" hreflang="uk" href="https://rybezh.site/post-${post.slug}.html" />
    <link rel="alternate" hreflang="pl" href="https://rybezh.site/post-${post.slug}-pl.html" />
  `;
  html = html.replace('</head>', `${hreflang}</head>`);

  await fs.writeFile(path.join(DIST, filename), html, 'utf8');
}

async function createBlogIndex(posts, tpl) {
  const content = `
    <div class="blog-index">
      <h1>Блог Rybezh</h1>
      <div class="blog-grid">
        ${posts.map(p => `
          <div class="blog-card">
            <h3><a href="/post-${p.slug}.html">${escapeHtml(p.title)}</a></h3>
            <p>${escapeHtml(p.excerpt)}</p>
            <a href="/post-${p.slug}.html" class="read-more">Читати далі →</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  let html = tpl
    .replace(/{{TITLE}}/g, 'Блог — Робота в Польщі')
    .replace(/{{DESCRIPTION}}/g, 'Корисні статті та поради для українців у Польщі.')
    .replace(/{{CONTENT}}/g, content)
    .replace(/{{CANONICAL}}/g, 'https://rybezh.site/blog.html')
    .replace(/{{CITY}}/g, '')
    .replace(/{{CTA_LINK}}/g, '/apply.html')
    .replace(/{{CTA_TEXT}}/g, 'Подати заявку');

  await fs.writeFile(path.join(DIST, 'blog.html'), html, 'utf8');
}

async function createSitemap(pages, posts, staticPages) {
  const today = new Date().toISOString().split('T')[0];
  
  let urls = [];
  
  // Static
  staticPages.forEach(p => {
    if (p === '404.html') return;
    urls.push({ loc: `/`, priority: 0.8 });
    urls.push({ loc: `/${p.replace('.html', '-pl.html')}`, priority: 0.8 });
  });
  
  // Jobs
  pages.forEach(p => {
    urls.push({ loc: `/${p.slug}.html`, priority: 0.9 });
    urls.push({ loc: `/${p.slug}-pl.html`, priority: 0.9 });
  });
  
  // Posts
  posts.forEach(p => {
    urls.push({ loc: `/post-${p.slug}.html`, priority: 0.7 });
    if (p.title_pl) urls.push({ loc: `/post-${p.slug}-pl.html`, priority: 0.7 });
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>https://rybezh.site${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapContent, 'utf8');
}

build().catch(console.error);