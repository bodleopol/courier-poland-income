(function () {
  'use strict';

  const reduce =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleInPlace(arr, rng) {
    const a = arr;
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function sessionPageSeed() {
    try {
      let base = parseInt(sessionStorage.getItem('rybezh-shuffle-base'), 10);
      if (!Number.isFinite(base) || base === 0) {
        base = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
        sessionStorage.setItem('rybezh-shuffle-base', String(base));
      }
      let h = 0;
      const path = window.location.pathname || '';
      for (let i = 0; i < path.length; i += 1) h = (h * 31 + path.charCodeAt(i)) >>> 0;
      return (base ^ h) >>> 0;
    } catch {
      return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    }
  }

  function shufflePolicySections(article) {
    if (reduce) return;
    const sections = Array.from(article.querySelectorAll(':scope > section.policy-section'));
    if (sections.length < 2) return;
    const rng = mulberry32(sessionPageSeed() + sections.length * 9973);
    const order = shuffleInPlace(sections.slice(), rng);
    const parent = article;
    order.forEach((s) => parent.appendChild(s));
  }

  function shouldShuffleDirectoryCards() {
    const sortSel = document.querySelector('[data-directory-panel] [data-directory-sort]');
    if (sortSel && sortSel.value !== 'default') return false;
    let sortParam = '';
    try {
      sortParam = new URL(window.location.href).searchParams.get('sort') || '';
    } catch {
      sortParam = '';
    }
    if (sortParam && sortParam !== 'default') return false;
    return true;
  }

  function shuffleDirectoryGrid(grid) {
    if (reduce) return;
    if (!shouldShuffleDirectoryCards()) return;
    const nodes = Array.from(grid.querySelectorAll(':scope > article[data-directory-card]'));
    if (nodes.length < 2) return;
    const rng = mulberry32(sessionPageSeed() + nodes.length * 7919);
    shuffleInPlace(nodes, rng);
    nodes.forEach((n) => grid.appendChild(n));
  }

  document.querySelectorAll('article.policy-page[data-shuffle-sections]').forEach(shufflePolicySections);
  document.querySelectorAll('[data-directory-grid][data-shuffle-cards]').forEach((grid) => {
    if (grid.getAttribute('data-shuffle-cards') === '0') return;
    shuffleDirectoryGrid(grid);
  });
})();
