(function () {
  'use strict';

  const root = document.querySelector('[data-site-search]');
  const input = root && root.querySelector('[data-site-search-input]');
  const panel = root && root.querySelector('[data-site-search-panel]');
  const live = root && root.querySelector('[data-site-search-live]');
  if (!root || !input || !panel || !window.SITE_SEARCH_INDEX) return;

  const lang = (document.documentElement.getAttribute('lang') || 'uk').toLowerCase();
  const index = window.SITE_SEARCH_INDEX[lang] || window.SITE_SEARCH_INDEX.uk || [];
  const maxResults = 12;
  const debounceMs = 140;

  const badgePerson = root.dataset.badgePerson || 'Person';
  const badgeStartup = root.dataset.badgeStartup || 'Company';
  const badgePage = root.dataset.badgePage || 'Page';
  const emptyText = root.dataset.empty || 'No results';
  const hintText = root.dataset.hint || '';

  let debounceId = 0;
  let activeIdx = -1;
  let lastHits = [];

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function tokenize(q) {
    return q
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.replace(/["'`.,;:]/g, ''))
      .filter(Boolean);
  }

  function haystack(item) {
    return `${item.t} ${item.s} ${item.c}`.toLowerCase();
  }

  function score(item, tokens, rawLower) {
    const h = haystack(item);
    for (let i = 0; i < tokens.length; i += 1) {
      if (!h.includes(tokens[i])) return -1;
    }
    const tl = item.t.toLowerCase();
    let sc = 0;
    if (rawLower && tl.startsWith(rawLower)) sc += 40;
    for (let i = 0; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (tl.includes(t)) sc += 12;
      if (item.s.includes(t)) sc += 4;
      if (item.c && item.c.toLowerCase().includes(t)) sc += 2;
    }
    if (item.k === 'person') sc += 3;
    else if (item.k === 'startup') sc += 2;
    else sc += 0;
    return sc;
  }

  function search(q) {
    const rawLower = q.trim().toLowerCase();
    const tokens = tokenize(q);
    if (!tokens.length) return [];
    const ranked = [];
    for (let i = 0; i < index.length; i += 1) {
      const item = index[i];
      const sc = score(item, tokens, rawLower);
      if (sc >= 0) ranked.push({ item, sc });
    }
    ranked.sort((a, b) => b.sc - a.sc || a.item.t.localeCompare(b.item.t, undefined, { sensitivity: 'base' }));
    return ranked.slice(0, maxResults).map((r) => r.item);
  }

  function badgeLabel(k) {
    if (k === 'startup') return badgeStartup;
    if (k === 'page') return badgePage;
    return badgePerson;
  }

  function renderResults(hits) {
    lastHits = hits;
    activeIdx = hits.length ? 0 : -1;
    if (!hits.length) {
      panel.innerHTML = `<p class="site-search__empty" role="status">${esc(emptyText)}</p>`;
      if (live) live.textContent = emptyText;
      return;
    }
    panel.innerHTML = hits
      .map(
        (hit, i) =>
          `<a id="site-search-opt-${i}" class="site-search__hit${i === 0 ? ' is-active' : ''}" role="option" href="${esc(hit.u)}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="site-search__badge">${esc(badgeLabel(hit.k))}</span><span class="site-search__hit-text"><strong>${esc(hit.t)}</strong>${hit.c ? `<span class="site-search__meta">${esc(hit.c)}</span>` : ''}</span></a>`
      )
      .join('');
    if (live) live.textContent = hits.length ? `${hits.length} ${hintText}`.trim() : '';
  }

  function setActive(next) {
    const opts = panel.querySelectorAll('.site-search__hit');
    if (!opts.length) return;
    let i = next;
    if (i < 0) i = opts.length - 1;
    if (i >= opts.length) i = 0;
    activeIdx = i;
    opts.forEach((el, idx) => {
      el.classList.toggle('is-active', idx === i);
      el.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
    const cur = opts[i];
    if (cur && typeof cur.scrollIntoView === 'function') {
      cur.scrollIntoView({ block: 'nearest' });
    }
  }

  function openPanel() {
    panel.hidden = false;
    root.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panel.hidden = true;
    root.classList.remove('is-open');
    activeIdx = -1;
    input.setAttribute('aria-expanded', 'false');
    if (live) live.textContent = '';
  }

  function runSearch() {
    const q = input.value;
    const hits = search(q);
    if (!q.trim()) {
      panel.innerHTML = '';
      closePanel();
      return;
    }
    openPanel();
    renderResults(hits);
  }

  input.addEventListener('input', () => {
    window.clearTimeout(debounceId);
    debounceId = window.setTimeout(runSearch, debounceMs);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      runSearch();
      openPanel();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (!root.classList.contains('is-open') || panel.hidden) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIdx + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIdx - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      input.blur();
    } else if (e.key === 'Enter') {
      const opts = panel.querySelectorAll('.site-search__hit');
      if (opts.length && activeIdx >= 0 && opts[activeIdx]) {
        e.preventDefault();
        opts[activeIdx].click();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) closePanel();
  });

  panel.addEventListener('mousedown', (e) => {
    const a = e.target.closest('a');
    if (a && panel.contains(a)) e.preventDefault();
  });
})();
