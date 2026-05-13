export function extractOgImage(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? m[1].trim() : '';
}

export function escapeAttr(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/\s+/g, ' ')
    .trim();
}

function ogLocaleForLang(lang) {
  if (lang === 'en') return 'en_US';
  if (lang === 'es') return 'es_ES';
  if (lang === 'ru') return 'ru_RU';
  return 'uk_UA';
}

export function buildJsonLdGraph({
  kind,
  title,
  description,
  canonical,
  lang,
  sig,
  sameAs,
  entityTitle,
  breadcrumbPairs
}) {
  const canonicalBase = 'https://rybezh.site/';
  const orgId = `${canonicalBase}#rybezh-org`;
  const siteId = `${canonicalBase}#rybezh-site`;
  const graph = [];

  graph.push({
    '@type': 'Organization',
    '@id': orgId,
    name: 'Rybezh.site',
    url: canonicalBase,
    description: 'Editorial intelligence on people, operators, startups, and technology ecosystems.',
    logo: `${canonicalBase}assets/images/rybezh-logo.svg`,
    email: 'jobs.r@protonmail.com'
  });

  graph.push({
    '@type': 'WebSite',
    '@id': siteId,
    name: 'Rybezh.site',
    url: canonicalBase,
    description: 'Reference and editorial pages about specialists and companies, with multilingual coverage.',
    inLanguage: ['uk', 'en', 'es', 'ru'],
    publisher: { '@id': orgId }
  });

  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': siteId },
    inLanguage: lang
  };
  graph.push(webPage);

  if (breadcrumbPairs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbPairs.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        item: p.item
      }))
    });
  }

  if (kind === 'person') {
    graph.push({
      '@type': 'Person',
      '@id': `${canonical}#person`,
      name: entityTitle || sig.h1,
      jobTitle: sig.h2 || undefined,
      description,
      url: canonical,
      knowsAbout: sig.tags && sig.tags.length ? sig.tags : undefined,
      sameAs: sameAs && sameAs.length ? sameAs : undefined,
      mainEntityOfPage: { '@id': `${canonical}#webpage` }
    });
  } else if (kind === 'startup') {
    graph.push({
      '@type': 'Organization',
      '@id': `${canonical}#company`,
      name: entityTitle || sig.h1,
      description,
      url: canonical,
      knowsAbout: sig.tags && sig.tags.length ? sig.tags : undefined,
      sameAs: sameAs && sameAs.length ? sameAs : undefined,
      mainEntityOfPage: { '@id': `${canonical}#webpage` }
    });
  } else if (kind === 'article') {
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: title,
      description,
      url: canonical,
      inLanguage: lang,
      isPartOf: { '@id': siteId },
      author: { '@id': orgId },
      publisher: { '@id': orgId }
    });
  }

  const payload = { '@context': 'https://schema.org', '@graph': graph };
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

export function buildHeadInject({
  title,
  description,
  canonical,
  lang,
  ogImage,
  jsonLdHtml
}) {
  const canonicalBase = 'https://rybezh.site';
  let absImg = ogImage || `${canonicalBase}/assets/images/rybezh-logo.svg`;
  if (absImg && !/^https?:\/\//i.test(absImg)) {
    absImg = `${canonicalBase}/${String(absImg).replace(/^\//, '')}`;
  }
  const safeT = escapeAttr(title);
  const safeD = escapeAttr(description);
  const safeUrl = escapeAttr(canonical);
  const safeImg = escapeAttr(absImg);
  const loc = ogLocaleForLang(lang);
  return `<meta property="og:type" content="website">
<meta property="og:title" content="${safeT}">
<meta property="og:description" content="${safeD}">
<meta property="og:url" content="${safeUrl}">
<meta property="og:image" content="${safeImg}">
<meta property="og:locale" content="${loc}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeT}">
<meta name="twitter:description" content="${safeD}">
<meta name="twitter:image" content="${safeImg}">
${jsonLdHtml}`;
}
