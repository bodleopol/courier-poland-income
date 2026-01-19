import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname);
const TEMPLATES = path.join(SRC, 'templates');
const DIST = path.join(process.cwd(), 'dist');

const I18N_SCRIPT = `\n<script>
/* dynamic i18n keys injected by generate.js */
(function(extraTranslations){
  try {
    window.EXTRA_TRANSLATIONS = Object.assign(window.EXTRA_TRANSLATIONS || {}, extraTranslations || {});
  } catch (e) {
    window.EXTRA_TRANSLATIONS = extraTranslations || {};
  }
})(__EXTRA_TRANSLATIONS__);
</script>\n`;
async function build() {
  // clean dist to avoid stale files
  await fs.rm(DIST, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(DIST, { recursive: true });

  const contentPath = path.join(SRC, 'content.json');
  const contentRaw = await fs.readFile(contentPath, 'utf8');
  const pages = JSON.parse(contentRaw);

  // Load blog posts
  const postsPath = path.join(SRC, 'posts.json');
  const posts = JSON.parse(await fs.readFile(postsPath, 'utf8').catch(() => '[]'));

  const pageTpl = await fs.readFile(path.join(TEMPLATES, 'page.html'), 'utf8');
  const stylesPath = path.join(TEMPLATES, 'styles.css');
  let styles = '';
  try {
    styles = await fs.readFile(stylesPath, 'utf8');
    // write styles and append nothing (we inject i18n style separately)
    await fs.writeFile(path.join(DIST, 'styles.css'), styles, 'utf8');
  } catch (e) {
    // no styles provided, continue
  }

  // Copy features.css
  try {
    const featuresPath = path.join(SRC, 'features.css');
    const featuresContent = await fs.readFile(featuresPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'features.css'), featuresContent, 'utf8');
  } catch (e) {
    // features.css not found, continue
  }

  // Copy main.js
  try {
    const mainJsPath = path.join(SRC, 'main.js');
    const mainJsContent = await fs.readFile(mainJsPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'main.js'), mainJsContent, 'utf8');
  } catch (e) {
    // main.js not found, continue
  }

  // Copy favicon.svg
  try {
    const faviconPath = path.join(SRC, 'favicon.svg');
    const faviconContent = await fs.readFile(faviconPath, 'utf8');
    await fs.writeFile(path.join(DIST, 'favicon.svg'), faviconContent, 'utf8');
  } catch (e) {
    // favicon.svg not found, continue
  }

  // Prepare dynamic translations for jobs
  const jobTranslations = {};
  pages.forEach(p => {
    jobTranslations[`job.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title };
    jobTranslations[`job.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh` };
    jobTranslations[`job.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt };
    jobTranslations[`job.${p.slug}.cta`] = { ua: p.cta_text || 'Подати заявку', pl: p.cta_text_pl || 'Złóż wniosek' };
  });

  // Prepare dynamic translations for blog
  posts.forEach(p => {
    const readMinutes = estimateReadingTime(p.body || '');
    jobTranslations[`blog.${p.slug}.title`] = { ua: p.title, pl: p.title_pl || p.title };
    jobTranslations[`blog.${p.slug}.meta_title`] = { ua: `${p.title} — Rybezh`, pl: `${p.title_pl || p.title} — Rybezh` };
    jobTranslations[`blog.${p.slug}.excerpt`] = { ua: p.excerpt, pl: p.excerpt_pl || p.excerpt };
    jobTranslations[`blog.${p.slug}.read_time`] = { ua: `${readMinutes} хв читання`, pl: `${readMinutes} min czytania` };
  });
  
  // Prepare script with injected translations
  const scriptWithData = I18N_SCRIPT.replace('__EXTRA_TRANSLATIONS__', JSON.stringify(jobTranslations));

  // copy static pages
  const staticPages = ['apply.html', 'about.html', 'contact.html', 'privacy.html', 'faq.html', '404.html'];
  for (const p of staticPages) {
    try {
      let pContent = await fs.readFile(path.join(SRC, p), 'utf8');
      pContent = pContent.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
      // inject styles and script before </body>
      if (pContent.includes('</body>')) {
        pContent = pContent.replace('</body>', `${scriptWithData}</body>`);
      } else {
        pContent += scriptWithData;
      }
      await fs.writeFile(path.join(DIST, p), pContent, 'utf8');

      // Also publish /404/index.html so /404 and /404/ resolve on static hosts
      if (p === '404.html') {
        const notFoundDir = path.join(DIST, '404');
        await fs.mkdir(notFoundDir, { recursive: true });
        await fs.writeFile(path.join(notFoundDir, 'index.html'), pContent, 'utf8');
      }
    } catch (e) {}
  }

  const links = [];
  for (const page of pages) {
    const tpl = pageTpl;
    const description = page.excerpt || page.description || '';
    const content = page.body || page.content || page.excerpt || '';
    const contentPl = page.body_pl || page.body || '';

    // Wrap content in language toggles
    const benefitsUA = `
      <div class="job-benefits">
        <h3>Чому варто працювати з Rybezh?</h3>
        <ul>
          <li>✅ Офіційне працевлаштування</li>
          <li>✅ Підтримка координатора 24/7</li>
          <li>✅ Допомога з легалізацією (Карта побиту)</li>
        </ul>
      </div>
    `;
    const benefitsPL = `
      <div class="job-benefits">
        <h3>Dlaczego warto pracować z Rybezh?</h3>
        <ul>
          <li>✅ Oficjalne zatrudnienie</li>
          <li>✅ Wsparcie koordynatora 24/7</li>
          <li>✅ Pomoc w legalizacji (Karta pobytu)</li>
        </ul>
      </div>
    `;

    const shareUrl = `https://rybezh.site/${escapeHtml(page.slug)}.html`;
    const shareText = encodeURIComponent(page.title);
    const shareUrlEnc = encodeURIComponent(shareUrl);

    const shareButtons = `
      <div class="share-section">
        <p class="share-title" data-i18n="share.title">Поділитися вакансією:</p>
        <div class="share-icons">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrlEnc}" target="_blank" rel="noopener noreferrer" class="share-btn fb" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://t.me/share/url?url=${shareUrlEnc}&text=${shareText}" target="_blank" rel="noopener noreferrer" class="share-btn tg" aria-label="Telegram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.264 2.428a2.36 2.36 0 0 0-2.434-.23C16.32 3.66 8.16 7.02 5.43 8.13c-1.78.73-2.6 1.6-1.2 2.2 1.5.64 3.4 1.27 3.4 1.27s1.1.36 1.7-.3c1.6-1.6 3.6-3.5 5.1-5 .14-.14.4-.3.5.1s-.5 1.5-2.4 3.3c-.6.56-1.2 1.1-1.2 1.1s-.4.4.2.9c1.6 1.1 2.8 2 3.6 2.6 1.1.8 2.2.6 2.6-1.2.5-2.4 1.6-9.2 1.8-10.6.04-.3-.1-.6-.57-.67z"/></path></svg>
          </a>
          <a href="https://api.whatsapp.com/send?text=${shareText}%20${shareUrlEnc}" target="_blank" rel="noopener noreferrer" class="share-btn wa" aria-label="WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.536 0 1.52 1.115 2.988 1.264 3.186.149.198 2.19 3.349 5.273 4.695 2.151.928 2.988.74 3.533.69.602-.053 1.758-.717 2.006-1.41.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></path></svg>
          </a>
        </div>
      </div>`;

    const dualContent = `
      <div class="job-page-layout">
        <div class="job-meta">
          <span class="tag">📍 ${escapeHtml(page.city)}</span>
          <span class="tag">📅 ${new Date().getFullYear()}</span>
        </div>
        <div data-lang-content="ua">${content}${benefitsUA}</div>
        <div data-lang-content="pl" style="display:none">${contentPl}${benefitsPL}</div>
        ${shareButtons}
        <div class="job-actions">
          <a href="/" class="btn-secondary" data-i18n="btn.back">Повернутись на головну</a>
        </div>
      </div>`;

    const html = tpl
      .replace(/{{TITLE}}/g, escapeHtml(page.title || ''))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(description))
      .replace(/{{CONTENT}}/g, dualContent)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/${escapeHtml(page.slug || '')}.html`)
      .replace(/{{CITY}}/g, escapeHtml(page.city || ''))
      .replace(/{{CTA_LINK}}/g, page.cta_link || '/apply.html')
      .replace(/{{CTA_TEXT}}/g, page.cta_text || 'Подати заявку');

    // inject i18n attributes into the generated page where applicable by adding lang switcher and script
    let finalHtml = html.replace(/\$\{new Date\(\)\.getFullYear\(\)}/g, String(new Date().getFullYear()));
    // ensure CTA has data-i18n if present
    finalHtml = finalHtml.replace(/(<a[^>]*class="?card-cta"?[^>]*>)([\s\S]*?)(<\/a>)/gi, function(m, open, inner, close) {
      if (/data-i18n/.test(open)) return m;
      return open.replace(/>$/, ' data-i18n="jobs.cta">') + (inner || '') + close;
    });
    
    // Add data-i18n to H1 and Title
    finalHtml = finalHtml.replace('<title>', `<title data-i18n="job.${page.slug}.meta_title">`);
    finalHtml = finalHtml.replace(
      '<meta name="description" content="',
      `<meta name="description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta property="og:title" content="',
      `<meta property="og:title" data-i18n="job.${page.slug}.meta_title" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta property="og:description" content="',
      `<meta property="og:description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta name="twitter:title" content="',
      `<meta name="twitter:title" data-i18n="job.${page.slug}.meta_title" data-i18n-attr="content" content="`
    );
    finalHtml = finalHtml.replace(
      '<meta name="twitter:description" content="',
      `<meta name="twitter:description" data-i18n="job.${page.slug}.excerpt" data-i18n-attr="content" content="`
    );
    // Replace H1 content with data-i18n span, or add attribute if simple
    finalHtml = finalHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="job.${page.slug}.title">$1</h1>`);

    // Inject JobPosting structured data (job pages only)
    const jobPostingScript = jsonLdScript(buildJobPostingJsonLd(page));
    if (finalHtml.includes('</head>')) {
      finalHtml = finalHtml.replace('</head>', `${jobPostingScript}\n</head>`);
    }

    // Add specific styles for job pages
    const jobStyles = `
    <style>
      .job-page-layout { margin-top: 1rem; }
      .job-meta { margin-bottom: 1.5rem; display: flex; gap: 10px; }
      .job-meta .tag { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-size: 0.9rem; font-weight: 500; }
      .job-benefits { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1.5rem; border-radius: 12px; margin: 2rem 0; }
      .job-benefits h3 { margin-top: 0; color: #15803d; font-size: 1.2rem; }
      .job-benefits ul { list-style: none; padding: 0; margin: 0; }
      .job-benefits li { margin-bottom: 0.5rem; }
      .share-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
      .share-title { font-weight: 600; margin-bottom: 1rem; color: var(--color-primary); }
      .share-icons { display: flex; gap: 1rem; }
      .share-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: white; transition: transform 0.2s; }
      .share-btn:hover { transform: translateY(-2px); }
      .share-btn.fb { background: #1877f2; }
      .share-btn.tg { background: #229ed9; }
      .share-btn.wa { background: #25d366; }
      .job-actions { margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
      .btn-secondary { display: inline-block; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; background: #f3f4f6; color: #374151; font-weight: 600; }
      .btn-secondary:hover { background: #e5e7eb; }
    </style>`;

    // inject lang switcher and scripts before </body>
    if (finalHtml.includes('</body>')) {
      // add script
      finalHtml = finalHtml.replace('</body>', `${jobStyles}${scriptWithData}</body>`);
    } else {
      finalHtml += jobStyles + scriptWithData;
    }

    const outFile = path.join(DIST, `${page.slug}.html`);
    await fs.writeFile(outFile, finalHtml, 'utf8');
    links.push({ title: page.title, slug: page.slug, city: page.city || '' });
  }

  // Pagination for Blog
  const POSTS_PER_PAGE = 20;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  function generatePaginationHtml(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    
    let paginationHtml = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
      const prevPage = currentPage === 2 ? '/blog.html' : `/blog-${currentPage - 1}.html`;
      paginationHtml += `<a href="${prevPage}" class="pagination-btn" data-i18n="blog.pagination.prev">← Назад</a>`;
    }
    
    // Page numbers
    paginationHtml += '<div class="pagination-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const pageUrl = i === 1 ? '/blog.html' : `/blog-${i}.html`;
        const activeClass = i === currentPage ? ' active' : '';
        paginationHtml += `<a href="${pageUrl}" class="pagination-number${activeClass}">${i}</a>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationHtml += '<span class="pagination-ellipsis">...</span>';
      }
    }
    
    paginationHtml += '</div>';
    
    // Next button
    if (currentPage < totalPages) {
      paginationHtml += `<a href="/blog-${currentPage + 1}.html" class="pagination-btn" data-i18n="blog.pagination.next">Вперед →</a>`;
    }
    
    paginationHtml += '</div>';
    return paginationHtml;
  }

  // Generate blog pages with pagination
  for (let page = 1; page <= totalPages; page++) {
    const startIdx = (page - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    const pagePosts = posts.slice(startIdx, endIdx);

    const blogListHtml = pagePosts.map(p => {
      const readMinutes = estimateReadingTime(p.body || '');
      return `
      <div class="blog-card">
        <div class="blog-icon">${p.image || '📝'}</div>
        <div class="blog-content">
          <div class="blog-meta-row">
            <div class="blog-date" data-format-date="${p.date}">${p.date}</div>
            <div class="blog-readtime" data-i18n="blog.${p.slug}.read_time">${readMinutes} хв читання</div>
          </div>
          <h3><a href="/post-${p.slug}.html" data-i18n="blog.${p.slug}.title">${escapeHtml(p.title)}</a></h3>
          <p data-i18n="blog.${p.slug}.excerpt">${escapeHtml(p.excerpt)}</p>
          <a href="/post-${p.slug}.html" class="read-more" data-i18n="blog.read_more">Читати далі →</a>
        </div>
      </div>
    `;
    }).join('');

    const paginationHtml = generatePaginationHtml(page, totalPages);

    // Note: the page template already has a single <h1>{{TITLE}}</h1>.
    // Keep blog content H1-free to avoid duplicate headings.
    const blogIndexContent = `
      <div class="blog-intro">
        <p data-i18n="blog.subtitle">Корисні статті та новини для кур'єрів</p>
      </div>
      <div class="blog-grid">
        ${blogListHtml}
      </div>
      ${paginationHtml}
    `;

    const blogFileName = page === 1 ? 'blog.html' : `blog-${page}.html`;
    const canonicalUrl = page === 1 ? 'https://rybezh.site/blog.html' : `https://rybezh.site/blog-${page}.html`;

    let blogHtml = pageTpl
      .replace(/{{TITLE}}/g, `Блог${page > 1 ? ` (сторінка ${page})` : ''}`)
      .replace(/{{DESCRIPTION}}/g, 'Корисні статті для кур\'єрів у Польщі')
      .replace(/{{CONTENT}}/g, blogIndexContent)
      .replace(/{{CANONICAL}}/g, canonicalUrl)
      .replace(/{{CITY}}/g, '')
      .replace(/{{CTA_LINK}}/g, '/apply.html')
      .replace(/{{CTA_TEXT}}/g, '');

    // Make <title> and template H1 translatable
    blogHtml = blogHtml.replace('<title>', '<title data-i18n="blog.meta_title">');
    blogHtml = blogHtml.replace(
      '<meta name="description" content="',
      '<meta name="description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta property="og:title" content="',
      '<meta property="og:title" data-i18n="blog.meta_title" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta property="og:description" content="',
      '<meta property="og:description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta name="twitter:title" content="',
      '<meta name="twitter:title" data-i18n="blog.meta_title" data-i18n-attr="content" content="'
    );
    blogHtml = blogHtml.replace(
      '<meta name="twitter:description" content="',
      '<meta name="twitter:description" data-i18n="blog.meta_description" data-i18n-attr="content" content="'
    );

    // Make the template H1 translatable
    blogHtml = blogHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="blog.title">Блог Rybezh</h1>`);
  
    if (blogHtml.includes('</body>')) blogHtml = blogHtml.replace('</body>', `${scriptWithData}</body>`);
    else blogHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, blogFileName), blogHtml, 'utf8');
  }

  // Generate Blog Posts
  for (const post of posts) {
    const heroImageUrl = extractImageUrl(post.body) || extractImageUrl(post.image);
    const readMinutes = estimateReadingTime(post.body || '');
    const postContent = `
      <div class="blog-post">
        <a href="/blog.html" class="back-link" data-i18n="blog.back">← До списку статей</a>
        <div class="post-meta">📅 <span data-format-date="${post.date}">${post.date}</span> · <span class="post-readtime" data-i18n="blog.${post.slug}.read_time">${readMinutes} хв читання</span></div>
        <div data-lang-content="ua">${post.body}</div>
        <div data-lang-content="pl" style="display:none">${post.body_pl || post.body}</div>
      </div>`;
    
    let postHtml = pageTpl
      .replace(/{{TITLE}}/g, escapeHtml(post.title))
      .replace(/{{DESCRIPTION}}/g, escapeHtml(post.excerpt))
      .replace(/{{CONTENT}}/g, postContent)
      .replace(/{{CANONICAL}}/g, `https://rybezh.site/post-${post.slug}.html`)
      .replace(/{{CITY}}/g, '')
      .replace(/{{CTA_LINK}}/g, '/apply.html')
      .replace(/{{CTA_TEXT}}/g, '');

    // Translate browser tab title for this post
    postHtml = postHtml.replace('<title>', `<title data-i18n="blog.${post.slug}.meta_title">`);
    postHtml = postHtml.replace(
      '<meta name="description" content="',
      `<meta name="description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta property="og:title" content="',
      `<meta property="og:title" data-i18n="blog.${post.slug}.meta_title" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta property="og:description" content="',
      `<meta property="og:description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta name="twitter:title" content="',
      `<meta name="twitter:title" data-i18n="blog.${post.slug}.meta_title" data-i18n-attr="content" content="`
    );
    postHtml = postHtml.replace(
      '<meta name="twitter:description" content="',
      `<meta name="twitter:description" data-i18n="blog.${post.slug}.excerpt" data-i18n-attr="content" content="`
    );

    // Make the template H1 translatable for this post
    postHtml = postHtml.replace(
      /<h1>(.*?)<\/h1>/,
      `<h1 data-i18n="blog.${post.slug}.title">${escapeHtml(post.title)}</h1>`
    );

    // Inject BlogPosting structured data
    const blogPostingScript = jsonLdScript(buildBlogPostingJsonLd(post, heroImageUrl));
    if (postHtml.includes('</head>')) {
      postHtml = postHtml.replace('</head>', `${blogPostingScript}\n</head>`);
    }

    if (postHtml.includes('</body>')) postHtml = postHtml.replace('</body>', `${scriptWithData}</body>`);
    else postHtml += scriptWithData;
    await fs.writeFile(path.join(DIST, `post-${post.slug}.html`), postHtml, 'utf8');
  }

    // generate index
    const indexContent = generateIndexContent(links);
    let indexHtml = pageTpl
      .replace(/{{TITLE}}/g, "Rybezh — Робота кур'єром у Польщі")
      .replace(/{{DESCRIPTION}}/g, "Актуальні вакансії кур'єрів у містах Польщі. Робота з гнучким графіком, щоденними виплатами та підтримкою.")
      .replace(/{{CONTENT}}/g, indexContent)
      .replace(/{{CANONICAL}}/g, "https://rybezh.site/")
      .replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, String(new Date().getFullYear()));
    
    // Inject data-i18n into index title and description
    indexHtml = indexHtml.replace('<title>', '<title data-i18n="meta.title">');
    indexHtml = indexHtml.replace('<meta name="description" content="', '<meta name="description" data-i18n="meta.description" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta property="og:title" content="', '<meta property="og:title" data-i18n="meta.title" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta property="og:description" content="', '<meta property="og:description" data-i18n="meta.description" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta name="twitter:title" content="', '<meta name="twitter:title" data-i18n="meta.title" data-i18n-attr="content" content="');
    indexHtml = indexHtml.replace('<meta name="twitter:description" content="', '<meta name="twitter:description" data-i18n="meta.description" data-i18n-attr="content" content="');

    // Make the template H1 translatable
    indexHtml = indexHtml.replace(/<h1>(.*?)<\/h1>/, `<h1 data-i18n="meta.title">$1</h1>`);

    // inject i18n into index
    if (indexHtml.includes('</body>')) {
      indexHtml = indexHtml.replace('</body>', `${scriptWithData}</body>`);
    } else {
      indexHtml += scriptWithData;
    }

    await fs.writeFile(path.join(DIST, 'index.html'), indexHtml, 'utf8');

    // write sitemap.xml
    try {
      const sitemap = generateSitemap(links, posts);
      await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
    } catch (e) {}

    // write robots.txt
    try {
      const robots = `# Robots.txt for rybezh.site - Job search platform for couriers in Poland
# All search engines are allowed to access all pages

User-agent: *
Allow: /

Sitemap: https://rybezh.site/sitemap.xml
`;
      await fs.writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
    } catch (e) {}

    // write CNAME for GitHub Pages custom domain
    try {
      await fs.writeFile(path.join(DIST, 'CNAME'), 'rybezh.site', 'utf8');
    } catch (e) {}

    // disable Jekyll processing on GitHub Pages (serve underscore files as-is)
    try {
      await fs.writeFile(path.join(DIST, '.nojekyll'), '', 'utf8');
    } catch (e) {}

    // write _redirects to serve custom 404 for unknown paths (Netlify/Cloudflare Pages)
    try {
      const redirects = `/* /404.html 404\n`;
      await fs.writeFile(path.join(DIST, '_redirects'), redirects, 'utf8');
    } catch (e) {}

    console.log('Build complete. Pages:', links.length);
}

function generateIndexContent(links) {
  const cityMap = {
    'Варшава': 'city.warszawa',
    'Краків': 'city.krakow',
    'Гданськ': 'city.gdansk',
    'Вроцлав': 'city.wroclaw',
    'Познань': 'city.poznan',
    'Лодзь': 'city.lodz',
    'Катовіце': 'city.katowice',
    'Щецін': 'city.szczecin',
    'Люблін': 'city.lublin',
    'Білосток': 'city.bialystok',
    'Бидгощ': 'city.bydgoszcz',
    'Жешув': 'city.rzeszow',
    'Торунь': 'city.torun',
    'Ченстохова': 'city.czestochowa',
    'Радом': 'city.radom',
    'Сосновець': 'city.sosnowiec',
    'Кельце': 'city.kielce',
    'Гливіце': 'city.gliwice',
    'Ольштин': 'city.olsztyn',
    'Бєльско-Бяла': 'city.bielsko'
  };

  const cards = links.map(l => {
    const cityAttr = escapeHtml(l.city || '');
    const cityKey = cityMap[l.city];
    const cityDisplay = cityKey ? `<span data-i18n="${cityKey}">${cityAttr}</span>` : cityAttr;
    return `    <div class="job-card" data-city="${cityAttr}">
      <h3><a href="./${l.slug}.html" data-i18n="job.${l.slug}.title">${escapeHtml(l.title)}</a></h3>
      <p class="muted">${cityDisplay}</p>
      <a class="card-cta" href="./${l.slug}.html" data-i18n="jobs.cta">Деталі</a>
    </div>`;
  }).join('\n');

  return `
    <div class="hero-modern">
      <div class="hero-content">
        <h2 class="hero-title" data-i18n="home.hero.title">🚀 Робота мрії чекає тебе!</h2>
        <p class="hero-subtitle" data-i18n="home.hero.subtitle">
          <strong>Тисячі кур'єрів вже заробляють</strong> у Польщі. 📦 Безкоштовна консультація, <strong>щоденні виплати</strong> 💰 та <strong>гнучкий графік</strong> ⏰
        </p>
        <div class="hero-actions">
          <a href="/apply.html" class="btn-primary hero-btn" data-i18n="home.hero.cta_primary">Почати прямо зараз</a>
          <a href="#jobs" class="btn-outline hero-btn" data-i18n="home.hero.cta_secondary">Переглянути вакансії</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-blob"></div>
        <div class="hero-icon">🚴‍♂️</div>
      </div>
    </div>

    <!-- Calculator Section -->
    <div class="calculator-section" style="background: var(--color-surface); padding: 2rem; border-radius: 16px; border: 1px solid var(--color-border); margin-bottom: 3rem; box-shadow: var(--shadow-md);">
      <h3 style="text-align: center; margin-bottom: 2rem; color: var(--color-primary);" data-i18n="calc.title">Калькулятор заробітку</h3>
      <div class="calc-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
        <div class="calc-inputs">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;" data-i18n="calc.hours">Годин на тиждень</label>
          <input type="range" id="calc-hours" min="10" max="60" value="40" style="width: 100%; margin-bottom: 0.5rem;">
          <div style="text-align: right; font-weight: bold; color: var(--color-accent);"><span id="val-hours">40</span> h</div>
          
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; margin-top: 1rem;" data-i18n="calc.rate">Ставка (PLN/год)</label>
          <input type="range" id="calc-rate" min="20" max="50" value="35" style="width: 100%; margin-bottom: 0.5rem;">
          <div style="text-align: right; font-weight: bold; color: var(--color-accent);"><span id="val-rate">35</span> PLN</div>
        </div>
        <div class="calc-result" style="text-align: center; background: var(--color-bg); padding: 1.5rem; border-radius: 12px;">
          <p style="margin: 0; color: var(--color-secondary);" data-i18n="calc.result">Ваш дохід на місяць:</p>
          <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent); margin: 0.5rem 0;"><span id="total-earn">5600</span> PLN</div>
          <p style="font-size: 0.9rem; color: var(--color-secondary); margin: 0;" data-i18n="calc.note">*приблизний розрахунок</p>
        </div>
      </div>
    </div>

    <!-- STATISTICS SECTION -->
    <div style="background: linear-gradient(135deg, rgba(0, 166, 126, 0.08), rgba(15, 118, 110, 0.05)); padding: 2.5rem; border-radius: 16px; margin: 3rem 0; border: 1px solid var(--color-border);">
      <h3 style="text-align: center; color: var(--color-primary); margin-bottom: 2rem; font-size: 1.4rem;" data-i18n="home.stats.title">📊 Статистика успіху</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2rem;">
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">3500+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.couriers.line1">Кур'єрів скористалось</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.couriers.line2">нашими послугами</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">65+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.partners.line1">Партнерських компаній</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.partners.line2">у Польщі</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">20+</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.cities.line1">Міст із вакансіями</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.cities.line2">від Варшави до Гданська</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 2.8rem; font-weight: 800; color: var(--color-accent); margin-bottom: 0.5rem;">⭐4.8/5</div>
          <p style="color: var(--color-secondary); margin: 0; font-size: 1rem;" data-i18n="home.stats.rating.line1">Рейтинг задоволення</p>
          <p style="color: var(--color-secondary); margin: 0; font-size: 0.9rem;" data-i18n="home.stats.rating.line2">від кур'єрів</p>
        </div>
      </div>
    </div>

    <!-- TESTIMONIALS SECTION -->
    <div style="padding: 2.5rem 0;">
      <h3 style="text-align: center; color: var(--color-primary); margin-bottom: 2rem; font-size: 1.4rem;" data-i18n="home.testimonials.title">💬 Що кажуть кур'єри</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t1.quote">
            "Дуже задоволений! За 3 дні отримав все необхідне та почав роботу. Підтримка команди Rybezh — просто супер!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t1.name">Ігор К., Варшава</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t1.role">Кур'єр з 6 міс. досвіду</p>
        </div>
        
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t2.quote">
            "Я приїхав з нічим, а за місяць вже купив велосипед. Щоденні виплати як обіцяно. Рекомендую!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t2.name">Максим В., Краків</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t2.role">Кур'єр з 3 міс. досвіду</p>
        </div>
        
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
          <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 1rem;" data-i18n="home.testimonials.t3.quote">
            "Гнучкий графік дозволяє мені вчитися та одночасно заробляти. Це саме то, що мені потрібно було!"
          </p>
          <p style="color: var(--color-primary); font-weight: 600; margin: 0;" data-i18n="home.testimonials.t3.name">Софія Л., Вроцлав</p>
          <p style="color: var(--color-secondary); font-size: 0.9rem; margin: 0;" data-i18n="home.testimonials.t3.role">Студентка, 4 міс. досвіду</p>
        </div>
      </div>
    </div>

    <p class="lead" style="text-align:center; margin-bottom:2rem; margin-top: 3rem; color:var(--color-secondary);" data-i18n="hero.lead">Актуальні вакансії кур'єрів у 20+ містах Польщі. Гнучкий графік, щоденні виплати.</p>
    
    <h3 style="font-size: 1.5rem; margin: 2rem 0 1rem 0; text-align: center; color: var(--color-primary);" data-i18n="home.search.title">🔍 Знайди роботу за містом:</h3>
    <form class="search-form" action="/" method="get" aria-label="Фільтр вакансій">
      <label class="sr-only" for="q" data-i18n="search.sr">Пошук</label>
      <input id="q" name="q" placeholder="Пошук за містом або типом роботи" aria-label="Пошук вакансій" data-i18n="search.placeholder" data-i18n-attr="placeholder" />
      <select id="city" name="city" aria-label="Вибір міста">
        <option value="" data-i18n="city.all">Всі міста</option>
        <option value="Варшава" data-i18n="city.warszawa">Варшава</option>
        <option value="Краків" data-i18n="city.krakow">Краків</option>
        <option value="Лодзь" data-i18n="city.lodz">Лодзь</option>
        <option value="Вроцлав" data-i18n="city.wroclaw">Вроцлав</option>
        <option value="Познань" data-i18n="city.poznan">Познань</option>
        <option value="Гданськ" data-i18n="city.gdansk">Гданськ</option>
        <option value="Щецін" data-i18n="city.szczecin">Щецін</option>
        <option value="Бидгощ" data-i18n="city.bydgoszcz">Бидгощ</option>
        <option value="Люблін" data-i18n="city.lublin">Люблін</option>
        <option value="Білосток" data-i18n="city.bialystok">Білосток</option>
        <option value="Катовіце" data-i18n="city.katowice">Катовіце</option>
        <option value="Гливіце" data-i18n="city.gliwice">Гливіце</option>
        <option value="Ченстохова" data-i18n="city.czestochowa">Ченстохова</option>
        <option value="Жешув" data-i18n="city.rzeszow">Жешув</option>
        <option value="Торунь" data-i18n="city.torun">Торунь</option>
        <option value="Кельце" data-i18n="city.kielce">Кельце</option>
        <option value="Ольштин" data-i18n="city.olsztyn">Ольштин</option>
        <option value="Радом" data-i18n="city.radom">Радом</option>
        <option value="Сосновець" data-i18n="city.sosnowiec">Сосновець</option>
        <option value="Бєльско-Бяла" data-i18n="city.bielsko">Бєльско-Бяла</option>
      </select>
      <button type="submit" data-i18n="search.button">Знайти</button>
    </form>
    <div class="jobs-grid" id="jobs" aria-label="Список вакансій" style="margin-top: 2rem;">
${cards}
    </div>

    <div style="background: linear-gradient(135deg, rgba(0, 166, 126, 0.1), rgba(15, 118, 110, 0.1)); padding: 2.5rem; border-radius: 12px; border: 1px solid var(--color-accent); margin-top: 3rem; text-align: center;">
      <h3 style="color: var(--color-primary); margin: 0 0 1rem 0;" data-i18n="home.features.title">✨ Більше ніж просто робота</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 1.5rem;">
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f1.title">💵 Щоденні виплати</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f1.text">Отримуй гроші прямо в день роботи</p>
        </div>
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f2.title">⏰ Гнучкий графік</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f2.text">Працюй коли захочеш, скільки захочеш</p>
        </div>
        <div>
          <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;" data-i18n="home.features.f3.title">🤝 Повна підтримка 24/7</h4>
          <p style="color: var(--color-secondary); margin: 0;" data-i18n="home.features.f3.text">Допомога з документами та легалізацією</p>
        </div>
      </div>
    </div>
    <script>
      (function(){
        const q = document.getElementById('q');
        const city = document.getElementById('city');
        const form = document.querySelector('.search-form');
        const jobs = Array.from(document.querySelectorAll('.job-card'));
        function normalize(s){return String(s||'').toLowerCase();}
        function filter(){
          const qv = normalize(q.value.trim());
          const cv = normalize(city.value.trim());
          jobs.forEach(card => {
            const text = normalize(card.textContent);
            const c = normalize(card.dataset.city || '');
            const matchQ = !qv || text.includes(qv);
            const matchC = !cv || c === cv || c.includes(cv);
            card.style.display = (matchQ && matchC) ? '' : 'none';
          });
        }
        form.addEventListener('submit', function(e){ e.preventDefault(); filter(); });
        q.addEventListener('input', filter);
        city.addEventListener('change', filter);

        // Calculator Logic
        const hInput = document.getElementById('calc-hours');
        const rInput = document.getElementById('calc-rate');
        const hVal = document.getElementById('val-hours');
        const rVal = document.getElementById('val-rate');
        const total = document.getElementById('total-earn');
        function calc() { const h = +hInput.value; const r = +rInput.value; hVal.textContent = h; rVal.textContent = r; total.textContent = (h * r * 4).toLocaleString(); }
        hInput.addEventListener('input', calc);
        rInput.addEventListener('input', calc);
      })();
    </script>`;
}

function generateSitemap(links, posts = []) {
  const base = 'https://rybezh.site';
  // Format date as YYYY-MM-DD for lastmod (Google recommends this format)
  const today = new Date().toISOString().split('T')[0];
  
  // Main pages with priority based on importance for job seeking platform
  const mainPages = [
    { 
      url: `${base}/`, 
      priority: '1.0', 
      changefreq: 'daily',
      lastmod: today
    },
    { 
      url: `${base}/apply.html`, 
      priority: '0.95', 
      changefreq: 'daily',
      lastmod: today
    },
    { 
      url: `${base}/faq.html`, 
      priority: '0.85', 
      changefreq: 'weekly',
      lastmod: today
    },
    { 
      url: `${base}/about.html`, 
      priority: '0.8', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/contact.html`, 
      priority: '0.8', 
      changefreq: 'monthly',
      lastmod: today
    },
    { 
      url: `${base}/privacy.html`, 
      priority: '0.5', 
      changefreq: 'yearly',
      lastmod: today
    }
  ];

  const blogPages = [
    {
      url: `${base}/blog.html`,
      priority: '0.75',
      changefreq: 'weekly',
      lastmod: today
    },
    ...posts.map(post => ({
      url: `${base}/post-${post.slug}.html`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: (post.date || today)
    }))
  ];
  
  // Job pages - prioritize by relevance (multiple job listings = more important)
  const jobPageCounts = {};
  links.forEach(l => {
    const city = l.city || 'unknown';
    jobPageCounts[city] = (jobPageCounts[city] || 0) + 1;
  });
  
  const jobPages = links.map(l => {
    // High-demand cities (Warszawa, Kraków) get slightly higher priority
    const majorCities = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];
    const isPrioritized = majorCities.includes(l.city);
    const priority = isPrioritized ? '0.85' : '0.75';
    
    return {
      url: `${base}/${l.slug}.html`,
      priority: priority,
      changefreq: 'weekly',
      lastmod: today
    };
  });
  
  const allPages = [...mainPages, ...blogPages, ...jobPages];
  
  const items = allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(str) {
  return String(str || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadingTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractImageUrl(html) {
  const match = String(html || '').match(/src="([^"]+)"/i);
  return match ? match[1] : '';
}

function toISODate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function cityToJobAddress(cityUa) {
  // Best-effort mapping to satisfy JobPosting rich results requirements.
  // If you have a real office address per offer, consider adding it into content.json instead.
  const fallback = {
    streetAddress: 'Centrum miasta',
    addressLocality: cityUa || 'Polska',
    addressRegion: 'PL',
    postalCode: '00-000'
  };

  const map = {
    'Варшава': { streetAddress: 'Centrum miasta', addressLocality: 'Warszawa', addressRegion: 'Mazowieckie', postalCode: '00-001' },
    'Краків': { streetAddress: 'Centrum miasta', addressLocality: 'Kraków', addressRegion: 'Małopolskie', postalCode: '31-001' },
    'Гданськ': { streetAddress: 'Centrum miasta', addressLocality: 'Gdańsk', addressRegion: 'Pomorskie', postalCode: '80-001' },
    'Вроцлав': { streetAddress: 'Centrum miasta', addressLocality: 'Wrocław', addressRegion: 'Dolnośląskie', postalCode: '50-001' },
    'Познань': { streetAddress: 'Centrum miasta', addressLocality: 'Poznań', addressRegion: 'Wielkopolskie', postalCode: '60-001' },
    'Лодзь': { streetAddress: 'Centrum miasta', addressLocality: 'Łódź', addressRegion: 'Łódzkie', postalCode: '90-001' },
    'Щецін': { streetAddress: 'Centrum miasta', addressLocality: 'Szczecin', addressRegion: 'Zachodniopomorskie', postalCode: '70-001' },
    'Бидгощ': { streetAddress: 'Centrum miasta', addressLocality: 'Bydgoszcz', addressRegion: 'Kujawsko-Pomorskie', postalCode: '85-001' },
    'Люблін': { streetAddress: 'Centrum miasta', addressLocality: 'Lublin', addressRegion: 'Lubelskie', postalCode: '20-001' },
    'Білосток': { streetAddress: 'Centrum miasta', addressLocality: 'Białystok', addressRegion: 'Podlaskie', postalCode: '15-001' },
    'Катовіце': { streetAddress: 'Centrum miasta', addressLocality: 'Katowice', addressRegion: 'Śląskie', postalCode: '40-001' },
    'Гливіце': { streetAddress: 'Centrum miasta', addressLocality: 'Gliwice', addressRegion: 'Śląskie', postalCode: '44-100' },
    'Ченстохова': { streetAddress: 'Centrum miasta', addressLocality: 'Częstochowa', addressRegion: 'Śląskie', postalCode: '42-200' },
    'Жешув': { streetAddress: 'Centrum miasta', addressLocality: 'Rzeszów', addressRegion: 'Podkarpackie', postalCode: '35-001' },
    'Торунь': { streetAddress: 'Centrum miasta', addressLocality: 'Toruń', addressRegion: 'Kujawsko-Pomorskie', postalCode: '87-100' },
    'Кельце': { streetAddress: 'Centrum miasta', addressLocality: 'Kielce', addressRegion: 'Świętokrzyskie', postalCode: '25-001' },
    'Ольштин': { streetAddress: 'Centrum miasta', addressLocality: 'Olsztyn', addressRegion: 'Warmińsko-Mazurskie', postalCode: '10-001' },
    'Радом': { streetAddress: 'Centrum miasta', addressLocality: 'Radom', addressRegion: 'Mazowieckie', postalCode: '26-600' },
    'Сосновець': { streetAddress: 'Centrum miasta', addressLocality: 'Sosnowiec', addressRegion: 'Śląskie', postalCode: '41-200' },
    'Бєльско-Бяла': { streetAddress: 'Centrum miasta', addressLocality: 'Bielsko-Biała', addressRegion: 'Śląskie', postalCode: '43-300' }
  };

  return map[cityUa] || fallback;
}

function buildJobPostingJsonLd(page) {
  const now = new Date();
  const datePosted = toISODate(now);
  const validThrough = toISODate(addDays(now, 30));
  const addr = cityToJobAddress(page.city);

  // Prefer excerpt as short description; fall back to body stripped of HTML
  const description = stripHtml(page.excerpt || page.description || page.body || '');
  const url = `https://rybezh.site/${page.slug}.html`;

  // Salary is not explicitly stored in content.json yet; keep a conservative generic range.
  const salaryMin = 25;
  const salaryMax = 45;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: page.title || "Робота кур'єром",
    description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Rybezh',
      value: page.slug
    },
    datePosted,
    validThrough,
    employmentType: ['FULL_TIME', 'PART_TIME', 'TEMPORARY'],
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Rybezh',
      url: 'https://rybezh.site',
      logo: 'https://rybezh.site/favicon.svg'
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: addr.streetAddress,
        addressLocality: addr.addressLocality,
        addressRegion: addr.addressRegion,
        postalCode: addr.postalCode,
        addressCountry: 'PL'
      }
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'PL'
    },
    directApply: true,
    url,
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'PLN',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryMin,
        maxValue: salaryMax,
        unitText: 'HOUR'
      }
    }
  };
}

function buildBlogPostingJsonLd(post, imageUrl) {
  const url = `https://rybezh.site/post-${post.slug}.html`;
  const published = post.date ? toISODate(post.date) : toISODate(new Date());
  const description = stripHtml(post.excerpt || '');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title || 'Blog',
    description,
    datePublished: published,
    dateModified: published,
    author: {
      '@type': 'Organization',
      name: 'Rybezh'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rybezh',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rybezh.site/favicon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  if (imageUrl) {
    data.image = [imageUrl];
  }

  return data;
}

function jsonLdScript(obj) {
  return `\n<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>\n`;
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});