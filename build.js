import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { translations, editorialUi } from './lib/constants.js';
import { minifyCss, minifyJs, minifyHtml, minifyAssetIfNeeded } from './lib/minify.js';
import { extractOgImage, escapeAttr, buildJsonLdGraph, buildHeadInject } from './lib/seo.js';
import { processImages, updateImageReferencesInHtml } from './lib/images.js';
import {

  extractProfileSignals,
  collectExternalLinks,
  personNameFromTitle,
  detectPageKind,
  buildIntelAsidePerson,
  buildIntelAsideStartup,
  buildBreadcrumbHtml,
  breadcrumbPairsForJson,
  injectBulkCatalogHtml,
  replaceClearbitLogoImages
} from './lib/templating.js';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const TEMPLATE_FILE = path.join(SRC_DIR, 'templates', 'page.html');

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

try {
  execSync('node scripts/emit-interview-tables.mjs', { stdio: 'inherit', cwd: path.resolve() });
  execSync('node scripts/generate-bulk-directory.mjs', { stdio: 'inherit', cwd: path.resolve() });
  execSync('node scripts/emit-site-search-index.mjs', { stdio: 'inherit', cwd: path.resolve() });
} catch (e) {
  console.error('Pre-build scripts failed:', e.message);
  process.exit(1);
}

function processDirectory(dirPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const srcFile = path.join(dirPath, entry.name);
    let destFile = path.join(destPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'templates' && entry.name !== 'pages') {
          // Skip the explicitly processed image folder to avoid double handling
          const isAssetsImages = srcFile.replace(/\\/g, '/') === 'src/assets/images';
          if (!isAssetsImages) {
            processDirectory(srcFile, destFile);
          }
      }
    } else if (!srcFile.endsWith('.html')) {
      if (srcFile.endsWith('.css') || srcFile.endsWith('.js')) {
        const rawAsset = fs.readFileSync(srcFile, 'utf8');
        const skipMinifyJs =
          srcFile.endsWith('interview-drill.js') ||
          srcFile.endsWith('interview-bank-data.js') ||
          srcFile.endsWith('site-search-index.js') ||
          srcFile.endsWith('site-search.js');
        fs.writeFileSync(destFile, skipMinifyJs ? rawAsset : minifyAssetIfNeeded(srcFile, rawAsset));
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

function processPages(srcPath, destPath) {
     if (!fs.existsSync(srcPath)) return;
     const entries = fs.readdirSync(srcPath, { withFileTypes: true });
     for (const entry of entries) {
         const fullSrc = path.join(srcPath, entry.name);
         if (entry.isDirectory()) {
             processPages(fullSrc, destPath);
         } else if (fullSrc.endsWith('.html') || fullSrc.endsWith('.xml')) {
             if (fullSrc.endsWith('.html')) {
                compileHTML(fullSrc, path.join(destPath, entry.name));
             } else {
                fs.copyFileSync(fullSrc, path.join(destPath, entry.name));
             }
         }
     }
}

function compileHTML(srcFile, destFile) {
  let content = fs.readFileSync(srcFile, 'utf8');
  content = injectBulkCatalogHtml(content, path.basename(srcFile), SRC_DIR);

  let titleMatch = content.match(/<title>(.*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1] : 'Rybezh';
  if (titleMatch) content = content.replace(/<title>.*?<\/title>/i, '');

  let descriptionMatch = content.match(/<meta\s+name="description"\s+content="(.*?)">/i);
  let description = descriptionMatch ? descriptionMatch[1] : '';
  content = content.replace(/<meta\s+name="description"\s+content=".*?">/i, '');

  let robotsMatch = content.match(/<meta\s+name="robots"\s+content="(.*?)">/i);
  let robotsBlock = robotsMatch ? robotsMatch[0] : '';
  content = content.replace(/<meta\s+name="robots"\s+content=".*?">/i, '');

  let styleBlock = '';
  let styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
      styleBlock = styleMatch[0];
      content = content.replace(/<style>[\s\S]*?<\/style>/i, '');
  }

  content = content.replace(/<!doctype html>/gi, '')
                   .replace(/<html.*?>/gi, '')
                   .replace(/<\/html>/gi, '')
                   .replace(/<head.*?>[\s\S]*?<\/head>/gi, '')
                   .replace(/<body.*?>/gi, '')
                   .replace(/<\/body>/gi, '')
                   .replace(/<main.*?>/gi, '')
                   .replace(/<\/main>/gi, '');

  content = replaceClearbitLogoImages(content, path.basename(srcFile));
  content = updateImageReferencesInHtml(content); // Apply WebP transformation

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  const filename = path.basename(srcFile);
  let lang = 'uk';
  if (filename.endsWith('-en.html')) lang = 'en';
  else if (filename.endsWith('-es.html')) lang = 'es';
  else if (filename.endsWith('-ru.html')) lang = 'ru';

  const canonicalBase = 'https://rybezh.site/';
  let baseName = filename.replace(/-(en|es|ru)\.html$/, '.html');
  if (baseName === 'index.html') baseName = '';

  const canonicalMap = {
      uk: baseName ? canonicalBase + baseName : canonicalBase,
      en: baseName ? canonicalBase + baseName.replace('.html', '-en.html') : canonicalBase + 'index-en.html',
      es: baseName ? canonicalBase + baseName.replace('.html', '-es.html') : canonicalBase + 'index-es.html',
      ru: baseName ? canonicalBase + baseName.replace('.html', '-ru.html') : canonicalBase + 'index-ru.html',
  };
  const canonicalNow = canonicalMap[lang];

  const localMerged = { ...translations[lang], ...editorialUi[lang] };
  const homeUrl = lang === 'uk' ? 'index.html' : `index-${lang}.html`;
  const specialistsUrl = lang === 'uk' ? 'specialists.html' : `specialists-${lang}.html`;
  const startupsUrl = lang === 'uk' ? 'startups.html' : `startups-${lang}.html`;
  const privacyUrl = lang === 'uk' ? 'privacy.html' : `privacy-${lang}.html`;
  const cookiesUrl = lang === 'uk' ? 'cookies.html' : `cookies-${lang}.html`;
  const termsUrl = lang === 'uk' ? 'terms.html' : `terms-${lang}.html`;
  const methodologyUrl = lang === 'uk' ? 'methodology.html' : `methodology-${lang}.html`;
  const faqUrl = lang === 'uk' ? 'faq.html' : `faq-${lang}.html`;
  const interviewUrl = lang === 'uk' ? 'interview-drill.html' : `interview-drill-${lang}.html`;

  const relPath = path.relative(path.join(SRC_DIR, 'pages'), srcFile).replace(/\\/g, '/');
  const pageKind = detectPageKind(relPath, filename);
  const stat = fs.statSync(srcFile);
  const mtimeIso = stat.mtime.toISOString();

  let mainBody = content;
  if (pageKind === 'person') {
    mainBody = `<div class="profile-layout"><div class="profile-layout__main">${content}</div>${buildIntelAsidePerson(content, localMerged, mtimeIso)}</div>`;
  } else if (pageKind === 'startup') {
    mainBody = `<div class="profile-layout"><div class="profile-layout__main">${content}</div>${buildIntelAsideStartup(content, localMerged, mtimeIso)}</div>`;
  }

  const sig = extractProfileSignals(content);
  const sameAs = collectExternalLinks(content);
  let entityTitle = sig.h1 || personNameFromTitle(title);
  if (pageKind === 'home') entityTitle = localMerged.navHome;
  else if (pageKind === 'specialists') entityTitle = localMerged.navSpecialists;
  else if (pageKind === 'startups') entityTitle = localMerged.navStartups;
  else if (pageKind === 'article' || pageKind === 'page') entityTitle = personNameFromTitle(title);

  const urlPack = { homeUrl, specialistsUrl, startupsUrl, methodologyUrl, faqUrl, interviewUrl };
  const breadcrumbNav = buildBreadcrumbHtml(pageKind, localMerged, urlPack, entityTitle);
  const schemaKind = pageKind === 'person' ? 'person' : pageKind === 'startup' ? 'startup' : pageKind === 'article' ? 'article' : 'none';
  const bcPairs = breadcrumbPairsForJson(pageKind, localMerged, urlPack, canonicalNow, entityTitle);
  const jsonLdHtml = buildJsonLdGraph({
    kind: schemaKind,
    title,
    description,
    canonical: canonicalNow,
    lang,
    sig,
    sameAs,
    entityTitle,
    breadcrumbPairs: bcPairs
  });

  const headInject = buildHeadInject({
    title,
    description,
    canonical: canonicalNow,
    lang,
    ogImage: extractOgImage(content),
    jsonLdHtml
  });

  const slug = filename.replace(/\.html$/i, '').replace(/-(en|es|ru)$/i, '');
  const bodyClass = `site-body page-${pageKind} doc-${slug}`;
  const wrappedMain = `${breadcrumbNav}<div class="page-shell">${mainBody}</div>`;

  let finalHtml = template.replace('{{CONTENT}}', () => wrappedMain)
                          .replace('{{TITLE}}', escapeHtml(title))
                          .replace('{{DESCRIPTION}}', escapeHtml(description))
                          .replace('{{HEAD_INJECT}}', headInject)
                          .replace('{{BODY_CLASS}}', bodyClass)
                          .replace('</head>', `${robotsBlock}\n${styleBlock}\n</head>`);

  finalHtml = finalHtml.replaceAll('{{CANONICAL}}', canonicalMap[lang])
                       .replaceAll('{{CANONICAL_ES}}', canonicalMap.es)
                       .replaceAll('{{CANONICAL_RU}}', canonicalMap.ru)
                       .replaceAll('{{CANONICAL_EN}}', canonicalMap.en);

  const mappings = {
      '{{NAV_ARIA}}': localMerged.navAria,
      '{{NAV_HOME}}': localMerged.navHome,
      '{{NAV_SPECIALISTS}}': localMerged.navSpecialists,
      '{{NAV_STARTUPS}}': localMerged.navStartups,
      '{{NAV_METHODOLOGY}}': localMerged.navMethodology,
      '{{NAV_FAQ}}': localMerged.navFaq,
      '{{NAV_INTERVIEW}}': localMerged.navInterview,
      '{{NAV_MENU}}': localMerged.navMenu,
      '{{NAV_PRIVACY}}': localMerged.navPrivacy,
      '{{NAV_COOKIES}}': localMerged.navCookies,
      '{{NAV_TERMS}}': localMerged.navTerms,
      '{{HOME_URL}}': homeUrl,
      '{{SPECIALISTS_URL}}': specialistsUrl,
      '{{STARTUPS_URL}}': startupsUrl,
      '{{PRIVACY_URL}}': privacyUrl,
      '{{COOKIES_URL}}': cookiesUrl,
      '{{TERMS_URL}}': termsUrl,
      '{{METHODOLOGY_URL}}': methodologyUrl,
      '{{FAQ_URL}}': faqUrl,
      '{{INTERVIEW_URL}}': interviewUrl,
      '{{SEARCH_ARIA}}': localMerged.searchAria,
      '{{SEARCH_PLACEHOLDER}}': localMerged.searchPlaceholder,
      '{{SEARCH_BADGE_PERSON}}': localMerged.searchBadgePerson,
      '{{SEARCH_BADGE_STARTUP}}': localMerged.searchBadgeStartup,
      '{{SEARCH_BADGE_PAGE}}': localMerged.searchBadgePage,
      '{{SEARCH_EMPTY}}': localMerged.searchEmpty,
      '{{SEARCH_HINT}}': localMerged.searchHint,
      '{{FOOTER_ABOUT}}': localMerged.footerAbout,
      '{{FOOTER_NAV_TITLE}}': localMerged.footerNavTitle,
      '{{FOOTER_SCOPE_TITLE}}': localMerged.footerScopeTitle,
      '{{FOOTER_SCOPE_TEXT}}': localMerged.footerScopeText,
      '{{FOOTER_LANGUAGES}}': localMerged.footerLanguages,
      '{{FOOTER_RIGHTS}}': localMerged.footerRights,
      '{{FOOTER_POLICIES_TITLE}}': localMerged.footerPoliciesTitle,
      '{{FOOTER_POLICIES_TEXT}}': localMerged.footerPoliciesText,
      '{{FOOTER_TAGLINE}}': localMerged.footerTagline,
      '{{FOOTER_SITEMAP}}': localMerged.footerSitemap,
      '{{SKIP_LINK}}': localMerged.skipLink,
      '{{BRAND_TAGLINE}}': localMerged.brandTagline,
      '{{CONTACT_LABEL}}': localMerged.contactLabel,
      '{{NAV_DOCK_ARIA}}': localMerged.navDockAria,
      '{{CMD_OPEN_ARIA}}': localMerged.cmdOpenAria,
      '{{CMD_HINT}}': localMerged.cmdHint,
      '{{CMD_TITLE}}': localMerged.cmdTitle,
      '{{CMD_RECENT}}': localMerged.cmdRecent,
      '{{CMD_SUGGESTED}}': localMerged.cmdSuggested,
      '{{FILTER_ALL}}': localMerged.filterAll,
      '{{FILTER_PEOPLE}}': localMerged.filterPeople,
      '{{FILTER_COMPANIES}}': localMerged.filterCompanies,
      '{{FILTER_PAGES}}': localMerged.filterPages,
      '{{CMD_CLOSE}}': localMerged.cmdClose,
      '{{COOKIE_TITLE}}': localMerged.cookieTitle,
      '{{COOKIE_TEXT}}': localMerged.cookieText,
      '{{COOKIE_ACCEPT}}': localMerged.cookieAccept,
      '{{COOKIE_DECLINE}}': localMerged.cookieDecline
  };

  for (const [key, value] of Object.entries(mappings)) {
      finalHtml = finalHtml.replaceAll(key, value);
  }

  finalHtml = finalHtml.replace('<html lang="uk">', `<html lang="${lang}">`);
  finalHtml = finalHtml.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) => `<style>${minifyCss(css)}</style>`);
  finalHtml = finalHtml.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js) => `<script>${minifyJs(js)}</script>`);
  finalHtml = minifyHtml(finalHtml);

  fs.writeFileSync(destFile, finalHtml);
}

async function build() {
  processDirectory(SRC_DIR, DIST_DIR);
  const imagesSrcPath = path.join(SRC_DIR, 'assets', 'images');
  const imagesDestPath = path.join(DIST_DIR, 'assets', 'images');
  if (fs.existsSync(imagesSrcPath)) {
     await processImages(imagesSrcPath, imagesDestPath);
  }
  processPages(path.join(SRC_DIR, 'pages'), DIST_DIR);
  console.log('Build completed successfully.');
}

build();
