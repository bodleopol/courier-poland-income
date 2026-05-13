(function () {
  'use strict';

  function fold(s) {
    try {
      return String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    } catch {
      return String(s || '').toLowerCase();
    }
  }

  function boot() {
    const root = document.querySelector('[data-site-search]');
    const input = root && root.querySelector('[data-site-search-input]');
    const panel = root && root.querySelector('[data-site-search-panel]');
    const live = root && root.querySelector('[data-site-search-live]');
    if (!root || !input || !panel) return;

    const rawIndex = window.SITE_SEARCH_INDEX;
    if (!rawIndex || typeof rawIndex !== 'object') return;

    const lang = (document.documentElement.getAttribute('lang') || 'uk').toLowerCase();
    const index = rawIndex[lang] || rawIndex.uk || [];
    if (!Array.isArray(index) || !index.length) return;

    const maxResults = 18;
    const debounceMs = 120;
    const minTokenLen = 1;

    const badgePerson = root.dataset.badgePerson || 'Person';
    const badgeStartup = root.dataset.badgeStartup || 'Company';
    const badgePage = root.dataset.badgePage || 'Page';
    const emptyText = root.dataset.empty || 'No results';
    const hintText = root.dataset.hint || '';

    let debounceId = 0;
    let activeIdx = -1;

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
        .split(/[\s/|,-]+/)
        .map((t) => t.replace(/["'`.,;:()[\]{}]/g, ''))
        .filter((t) => t.length >= minTokenLen);
    }

    function haystack(item) {
      return fold(`${item.t || ''} ${item.s || ''} ${item.c || ''}`);
    }

    function score(item, tokens, rawFolded) {
      const h = haystack(item);
      for (let i = 0; i < tokens.length; i += 1) {
        const ft = fold(tokens[i]);
        if (!ft || !h.includes(ft)) return -1;
      }
      const tl = fold(item.t || '');
      const sl = fold(item.s || '');
      const cl = fold(item.c || '');
      let sc = 0;
      if (rawFolded && tl.startsWith(rawFolded)) sc += 42;
      for (let i = 0; i < tokens.length; i += 1) {
        const ft = fold(tokens[i]);
        if (tl.includes(ft)) sc += 14;
        if (sl.includes(ft)) sc += 6;
        if (cl.includes(ft)) sc += 3;
      }
      if (item.k === 'person') sc += 3;
      else if (item.k === 'startup') sc += 2;
      return sc;
    }

    function search(q) {
      const rawFolded = fold(q.trim());
      const tokens = tokenize(q);
      if (!tokens.length) return [];
      const ranked = [];
      for (let i = 0; i < index.length; i += 1) {
        const item = index[i];
        const sc = score(item, tokens, rawFolded);
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
      if (!q.trim()) {
        panel.innerHTML = '';
        closePanel();
        return;
      }
      const hits = search(q);
      openPanel();
      renderResults(hits);
    }

    function goToFirstHit() {
      runSearch();
      const opts = panel.querySelectorAll('.site-search__hit');
      if (!opts.length) return;
      opts[0].click();
    }

    input.addEventListener('input', () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(runSearch, debounceMs);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) runSearch();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (!q) return;
        if (!root.classList.contains('is-open') || panel.hidden) {
          e.preventDefault();
          goToFirstHit();
          return;
        }
        const opts = panel.querySelectorAll('.site-search__hit');
        const emptyMsg = panel.querySelector('.site-search__empty');
        if (emptyMsg) {
          e.preventDefault();
          return;
        }
        if (opts.length && activeIdx >= 0 && opts[activeIdx]) {
          e.preventDefault();
          opts[activeIdx].click();
        } else if (opts.length) {
          e.preventDefault();
          opts[0].click();
        }
        return;
      }
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
      }
    });

    document.addEventListener('click', (ev) => {
      if (!root.contains(ev.target)) closePanel();
    });

    panel.addEventListener('mousedown', (ev) => {
      const a = ev.target.closest('a');
      if (a && panel.contains(a)) ev.preventDefault();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
