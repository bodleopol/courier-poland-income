import fs from 'fs';
import path from 'path';
import { escapeAttr } from './seo.js';

export function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

export function extractProfileSignals(html) {
  const h1m = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h2m = html.match(/<h2[^>]*>([^<]*)<\/h2>/i);
  const tags = [];
  const reTag = /<span[^>]*class="[^"]*\btag\b[^"]*"[^>]*>([^<]+)<\/span>/gi;
  let tm;
  while ((tm = reTag.exec(html)) !== null) {
    const v = tm[1].trim();
    if (v && !tags.includes(v)) tags.push(v);
  }
  return {
    h1: h1m ? h1m[1].trim() : '',
    h2: h2m ? h2m[1].trim() : '',
    tags
  };
}

export function collectExternalLinks(html) {
  const out = [];
  const re = /<a[^>]+href="(https?:\/\/[^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/rybezh\.site/i.test(m[1])) out.push(m[1]);
  }
  return [...new Set(out)].slice(0, 10);
}

export function personNameFromTitle(title) {
  const t = String(title || '');
  const cut = t.split(/\s*[|]\s*/)[0].split(/\s*[—\-]\s*Rybezh/i)[0].trim();
  return cut || 'Profile';
}

export function detectPageKind(relPath, basename) {
  if (/^profiles\/person-/i.test(relPath)) return 'person';
  if (/^startups\/startup-/i.test(relPath)) return 'startup';
  const base = basename.replace(/-(en|es|ru)\.html$/i, '.html');
  if (base === 'methodology.html' || base === 'faq.html' || base === 'interview-drill.html') return 'article';
  if (base === 'specialists.html') return 'specialists';
  if (base === 'startups.html') return 'startups';
  if (base === 'index.html') return 'home';
  return 'page';
}

export function formatFileDate(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export function buildExpertiseWheelStyle(tags) {
  const palette = ['#6366f1', '#0d9488', '#f97316', '#8b5cf6', '#0ea5e9', '#e11d48'];
  const n = Math.max(tags.length, 1);
  const parts = [];
  let acc = 0;
  for (let i = 0; i < n; i += 1) {
    const c = palette[i % palette.length];
    const start = acc / n;
    const end = (acc + 1) / n;
    parts.push(`${c} ${start * 360}deg ${end * 360}deg`);
    acc += 1;
  }
  return `conic-gradient(${parts.join(', ')})`;
}

export function buildIntelAsidePerson(content, local, mtimeIso) {
  const sig = extractProfileSignals(content);
  const links = collectExternalLinks(content);
  const wheel = buildExpertiseWheelStyle(sig.tags.length ? sig.tags : ['—']);
  const dateStr = formatFileDate(mtimeIso);
  const tagsHtml = sig.tags
    .map((t) => `<li><span class="intel-influence__dot" aria-hidden="true"></span>${escapeHtml(t)}</li>`)
    .join('');
  const linksHtml = links
    .map((u) => `<li><a href="${escapeAttr(u)}" rel="noopener noreferrer">${escapeHtml(u.replace(/^https?:\/\//i, ''))}</a></li>`)
    .join('');

  return `<aside class="profile-intel" aria-label="${escapeAttr(local.intelAsideAria)}">
    <div class="intel-card intel-card--verify">
      <p class="intel-card__eyebrow">${escapeHtml(local.verifyTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.verifyBody)}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.lastUpdated)}</p>
      <p class="intel-card__strong">${escapeHtml(dateStr || '—')}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.timelineTitle)}</p>
      <ol class="intel-timeline">
        <li><span class="intel-timeline__mark" aria-hidden="true"></span><div><strong>${escapeHtml(local.timelineNow)}</strong><p>${escapeHtml(sig.h2 || sig.h1 || '—')}</p></div></li>
        <li><span class="intel-timeline__mark intel-timeline__mark--muted" aria-hidden="true"></span><div><strong>${escapeHtml(local.timelineDesk)}</strong><p>${escapeHtml(dateStr || '—')}</p></div></li>
      </ol>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.expertiseTitle)}</p>
      <div class="intel-expertise" role="img" aria-label="${escapeAttr(local.expertiseTitle)}">
        <div class="intel-expertise__wheel" style="background:${wheel}"></div>
        <ul class="intel-expertise__legend">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
      </div>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.influenceTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.influenceIntro)}</p>
      <ul class="intel-influence">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.sourcesTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.sourcesIntro)}</p>
      ${links.length ? `<ul class="intel-sources">${linksHtml}</ul>` : `<p class="intel-card__body">${escapeHtml('—')}</p>`}
    </div>
    <div class="intel-card intel-card--note">
      <p class="intel-card__eyebrow">${escapeHtml(local.deskNoteTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.deskNoteBody)}</p>
    </div>
  </aside>`;
}

export function buildIntelAsideStartup(content, local, mtimeIso) {
  const sig = extractProfileSignals(content);
  const links = collectExternalLinks(content);
  const wheel = buildExpertiseWheelStyle(sig.tags.length ? sig.tags : ['—']);
  const dateStr = formatFileDate(mtimeIso);
  const tagsHtml = sig.tags
    .map((t) => `<li><span class="intel-influence__dot" aria-hidden="true"></span>${escapeHtml(t)}</li>`)
    .join('');
  const linksHtml = links
    .map((u) => `<li><a href="${escapeAttr(u)}" rel="noopener noreferrer">${escapeHtml(u.replace(/^https?:\/\//i, ''))}</a></li>`)
    .join('');

  return `<aside class="profile-intel profile-intel--org" aria-label="${escapeAttr(local.orgIntelAsideAria)}">
    <div class="intel-card intel-card--verify">
      <p class="intel-card__eyebrow">${escapeHtml(local.verifyTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.verifyBody)}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.lastUpdated)}</p>
      <p class="intel-card__strong">${escapeHtml(dateStr || '—')}</p>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.orgTimelineTitle)}</p>
      <ol class="intel-timeline">
        <li><span class="intel-timeline__mark" aria-hidden="true"></span><div><strong>${escapeHtml(local.orgTimelineProduct)}</strong><p>${escapeHtml(sig.h2 || sig.h1 || '—')}</p></div></li>
        <li><span class="intel-timeline__mark intel-timeline__mark--muted" aria-hidden="true"></span><div><strong>${escapeHtml(local.orgTimelineDesk)}</strong><p>${escapeHtml(dateStr || '—')}</p></div></li>
      </ol>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.expertiseTitle)}</p>
      <div class="intel-expertise" role="img" aria-label="${escapeAttr(local.expertiseTitle)}">
        <div class="intel-expertise__wheel" style="background:${wheel}"></div>
        <ul class="intel-expertise__legend">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
      </div>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.influenceTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.influenceIntro)}</p>
      <ul class="intel-influence">${tagsHtml || `<li>${escapeHtml('—')}</li>`}</ul>
    </div>
    <div class="intel-card">
      <p class="intel-card__eyebrow">${escapeHtml(local.sourcesTitle)}</p>
      <p class="intel-card__muted">${escapeHtml(local.sourcesIntro)}</p>
      ${links.length ? `<ul class="intel-sources">${linksHtml}</ul>` : `<p class="intel-card__body">${escapeHtml('—')}</p>`}
    </div>
    <div class="intel-card intel-card--note">
      <p class="intel-card__eyebrow">${escapeHtml(local.deskNoteTitle)}</p>
      <p class="intel-card__body">${escapeHtml(local.deskNoteBody)}</p>
    </div>
  </aside>`;
}

export function buildBreadcrumbHtml(kind, local, urls, entityTitle) {
  if (kind === 'home') {
    return `<nav class="breadcrumb" aria-label="${escapeAttr(local.breadcrumbAria)}"><span class="breadcrumb__item breadcrumb__item--current" aria-current="page">${escapeHtml(local.navHome)}</span></nav>`;
  }

  const items = [];
  items.push({ label: local.navHome, href: urls.homeUrl });
  if (kind === 'person') {
    items.push({ label: local.navSpecialists, href: urls.specialistsUrl });
    items.push({ label: entityTitle, href: null });
  } else if (kind === 'startup') {
    items.push({ label: local.navStartups, href: urls.startupsUrl });
    items.push({ label: entityTitle, href: null });
  } else if (kind === 'specialists') {
    items.push({ label: local.navSpecialists, href: null });
  } else if (kind === 'startups') {
    items.push({ label: local.navStartups, href: null });
  } else if (kind === 'article') {
    items.push({ label: entityTitle, href: null });
  } else {
    items.push({ label: entityTitle, href: null });
  }

  const inner = items
    .map((it, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast || !it.href) {
        return `<span class="breadcrumb__item${isLast ? ' breadcrumb__item--current' : ''}" ${isLast ? 'aria-current="page"' : ''}>${escapeHtml(it.label)}</span>`;
      }
      return `<a class="breadcrumb__item" href="${escapeAttr(it.href)}">${escapeHtml(it.label)}</a>`;
    })
    .join('<span class="breadcrumb__sep" aria-hidden="true">/</span>');

  return `<nav class="breadcrumb" aria-label="${escapeAttr(local.breadcrumbAria)}">${inner}</nav>`;
}

export function breadcrumbPairsForJson(kind, local, urls, canonical, entityTitle) {
  const full = (href) => {
    if (!href) return canonical;
    if (href === 'index.html') return 'https://rybezh.site/';
    return `https://rybezh.site/${href}`;
  };
  if (kind === 'home') {
    return [{ name: local.navHome, item: full(urls.homeUrl) }];
  }
  const pairs = [{ name: local.navHome, item: full(urls.homeUrl) }];
  if (kind === 'person') {
    pairs.push({ name: local.navSpecialists, item: full(urls.specialistsUrl) });
    pairs.push({ name: entityTitle, item: canonical });
  } else if (kind === 'startup') {
    pairs.push({ name: local.navStartups, item: full(urls.startupsUrl) });
    pairs.push({ name: entityTitle, item: canonical });
  } else if (kind === 'specialists') {
    pairs.push({ name: local.navSpecialists, item: canonical });
  } else if (kind === 'startups') {
    pairs.push({ name: local.navStartups, item: canonical });
  } else if (kind === 'article') {
    pairs.push({ name: entityTitle, item: canonical });
  } else {
    pairs.push({ name: entityTitle, item: canonical });
  }
  return pairs;
}

export function injectBulkCatalogHtml(html, filename, SRC_DIR) {
  const marker = '<!--RYBEZH_BULK_INJECT-->';
  if (!html.includes(marker)) return html;
  const base = filename.replace(/-(en|es|ru)\.html$/i, '.html');
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';
  let incName = '';
  if (/^specialists\.html$/i.test(base)) incName = `bulk-specialists-${lang}.inc.html`;
  else if (/^startups\.html$/i.test(base)) incName = `bulk-startups-${lang}.inc.html`;
  if (!incName) return html.replaceAll(marker, '');
  const incPath = path.join(SRC_DIR, 'generated', incName);
  if (!fs.existsSync(incPath)) return html.replaceAll(marker, '');
  const bulk = fs.readFileSync(incPath, 'utf8');
  return html.replaceAll(marker, bulk);
}

const UNSPLASH_STARTUP_POOL = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80'
];

function hashStringForIndex(str, modulus) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % modulus;
}

function pickUnsplashFromPool(seed) {
  return UNSPLASH_STARTUP_POOL[hashStringForIndex(seed, UNSPLASH_STARTUP_POOL.length)];
}

function extractImgAlt(tag) {
  const d = tag.match(/\salt\s*=\s*"([^"]*)"/i);
  if (d) return d[1].trim();
  const s = tag.match(/\salt\s*=\s*'([^']*)'/i);
  return s ? s[1].trim() : '';
}

export function replaceClearbitLogoImages(html, basename) {
  return html.replace(/<img\b[^>]*\ssrc="https:\/\/logo\.clearbit\.com\/[^"]+"[^>]*>/gi, (full) => {
    if (/images\.unsplash\.com/i.test(full)) return full;
    let alt = extractImgAlt(full);
    if (!alt) {
      alt = basename
        .replace(/\.html$/i, '')
        .replace(/^startup-/i, '')
        .replace(/-(en|es|ru)$/i, '')
        .replace(/-/g, ' ')
        .trim() || 'Startup';
    }
    const src = pickUnsplashFromPool(alt);
    let next = full.replace(/\ssrc="https:\/\/logo\.clearbit\.com\/[^"]+"/i, ` src="${src}"`);
    if (/\salt="/i.test(next)) {
      next = next.replace(/\salt="[^"]*"/i, ` alt="${alt.replace(/"/g, '&quot;')}"`);
    } else {
      next = next.replace(/<img\b/i, `<img alt="${alt.replace(/"/g, '&quot;')}"`);
    }
    if (!/referrerpolicy/i.test(next)) {
      next = next.replace(/>$/, ' referrerpolicy="no-referrer">');
    }
    return next;
  });
}
