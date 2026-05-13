(function () {
  'use strict';

  const RECENT_KEY = 'rybezh-search-recent-v1';
  const MAX_RECENT = 8;

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
      .filter((t) => t.length >= 1);
  }

  function haystack(item) {
    return fold(`${item.t || ''} ${item.s || ''} ${item.c || ''}`);
  }

  function fuzzySubsequence(hay, needle) {
    if (!needle) return true;
    let i = 0;
    for (let j = 0; j < hay.length && i < needle.length; j += 1) {
      if (hay[j] === needle[i]) i += 1;
    }
    return i === needle.length;
  }

  function tokenMatches(hay, token) {
    const ft = fold(token);
    if (!ft) return true;
    if (hay.includes(ft)) return true;
    if (ft.length >= 2 && fuzzySubsequence(hay, ft)) return true;
    return false;
  }

  function scoreItem(item, tokens, rawFolded, filterKind) {
    if (filterKind === 'person' && item.k !== 'person') return -1;
    if (filterKind === 'startup' && item.k !== 'startup') return -1;
    if (filterKind === 'page' && item.k !== 'page') return -1;

    const h = haystack(item);
    for (let i = 0; i < tokens.length; i += 1) {
      if (!tokenMatches(h, fold(tokens[i]))) return -1;
    }
    const tl = fold(item.t || '');
    const sl = fold(item.s || '');
    const cl = fold(item.c || '');
    let sc = 0;
    if (rawFolded && tl.startsWith(rawFolded)) sc += 48;
    for (let i = 0; i < tokens.length; i += 1) {
      const ft = fold(tokens[i]);
      if (tl.includes(ft)) sc += 16;
      else if (fuzzySubsequence(tl, ft)) sc += 10;
      if (sl.includes(ft)) sc += 7;
      else if (fuzzySubsequence(sl, ft)) sc += 4;
      if (cl.includes(ft)) sc += 4;
    }
    if (item.k === 'person') sc += 3;
    else if (item.k === 'startup') sc += 2;
    return sc;
  }

  function searchIndex(index, q, filterKind) {
    const rawFolded = fold(q.trim());
    const tokens = tokenize(q);
    if (!tokens.length) return [];
    const ranked = [];
    for (let i = 0; i < index.length; i += 1) {
      const item = index[i];
      const sc = scoreItem(item, tokens, rawFolded, filterKind || 'all');
      if (sc >= 0) ranked.push({ item, sc });
    }
    ranked.sort((a, b) => b.sc - a.sc || a.item.t.localeCompare(b.item.t, undefined, { sensitivity: 'base' }));
    return ranked.slice(0, 20).map((r) => r.item);
  }

  function readRecent() {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter((x) => x && typeof x.u === 'string' && typeof x.t === 'string') : [];
    } catch {
      return [];
    }
  }

  function pushRecent(entry) {
    if (!entry || !entry.u) return;
    let list = readRecent().filter((x) => x.u !== entry.u);
    list.unshift({ u: entry.u, t: entry.t, k: entry.k || 'page' });
    list = list.slice(0, MAX_RECENT);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  function pickSuggestions(index, n) {
    const pool = index.filter((x) => x.k === 'person' || x.k === 'startup');
    if (!pool.length) return [];
    const out = [];
    let a = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    function rnd() {
      a = (a * 1664525 + 1013904223) >>> 0;
      return a / 4294967296;
    }
    const used = new Set();
    let guard = 0;
    while (out.length < n && guard < pool.length * 5) {
      guard += 1;
      const pick = pool[Math.floor(rnd() * pool.length)];
      if (!used.has(pick.u)) {
        used.add(pick.u);
        out.push(pick);
      }
    }
    return out;
  }

  function badgeLabel(k, badgePerson, badgeStartup, badgePage) {
    if (k === 'startup') return badgeStartup;
    if (k === 'page') return badgePage;
    return badgePerson;
  }

  function renderHitLinks(hits, className, activeIdx) {
    return hits
      .map(
        (hit, i) =>
          `<a id="${className}-${i}" class="${className}${i === activeIdx ? ' is-active' : ''}" role="option" href="${esc(hit.u)}" data-hit-k="${esc(hit.k)}" aria-selected="${i === activeIdx ? 'true' : 'false'}"><span class="site-search__badge">${esc(badgeLabel(hit.k, arguments[3], arguments[4], arguments[5]))}</span><span class="site-search__hit-text"><strong>${esc(hit.t)}</strong>${hit.c ? `<span class="site-search__meta">${esc(hit.c)}</span>` : ''}</span></a>`
      )
      .join('');
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

    const badgePerson = root.dataset.badgePerson || 'Person';
    const badgeStartup = root.dataset.badgeStartup || 'Company';
    const badgePage = root.dataset.badgePage || 'Page';
    const emptyText = root.dataset.empty || 'No results';
    const hintText = root.dataset.hint || '';

    const debounceMs = 90;
    let debounceId = 0;
    let headerActive = -1;

    function bl(k) {
      return badgeLabel(k, badgePerson, badgeStartup, badgePage);
    }

    function renderHeaderHits(hits) {
      headerActive = hits.length ? 0 : -1;
      if (!hits.length) {
        panel.innerHTML = `<p class="site-search__empty" role="status">${esc(emptyText)}</p>`;
        if (live) live.textContent = emptyText;
        return;
      }
      panel.innerHTML = hits
        .map(
          (hit, i) =>
            `<a id="site-search-opt-${i}" class="site-search__hit${i === 0 ? ' is-active' : ''}" role="option" href="${esc(hit.u)}" data-hit-k="${esc(hit.k)}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="site-search__badge">${esc(bl(hit.k))}</span><span class="site-search__hit-text"><strong>${esc(hit.t)}</strong>${hit.c ? `<span class="site-search__meta">${esc(hit.c)}</span>` : ''}</span></a>`
        )
        .join('');
      if (live) live.textContent = hits.length ? `${hits.length} ${hintText}`.trim() : '';
    }

    function setHeaderActive(next) {
      const opts = panel.querySelectorAll('.site-search__hit');
      if (!opts.length) return;
      let i = next;
      if (i < 0) i = opts.length - 1;
      if (i >= opts.length) i = 0;
      headerActive = i;
      opts.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === i);
        el.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
      const cur = opts[i];
      if (cur && typeof cur.scrollIntoView === 'function') cur.scrollIntoView({ block: 'nearest' });
    }

    function openPanel() {
      panel.hidden = false;
      root.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
      panel.hidden = true;
      root.classList.remove('is-open');
      headerActive = -1;
      input.setAttribute('aria-expanded', 'false');
      if (live) live.textContent = '';
    }

    function runHeaderSearch() {
      const q = input.value;
      if (!q.trim()) {
        panel.innerHTML = '';
        closePanel();
        return;
      }
      const hits = searchIndex(index, q, 'all');
      openPanel();
      renderHeaderHits(hits);
    }

    function goToFirstHeaderHit() {
      runHeaderSearch();
      const opts = panel.querySelectorAll('.site-search__hit');
      if (!opts.length) return;
      opts[0].click();
    }

    input.addEventListener('input', () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(runHeaderSearch, debounceMs);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) runHeaderSearch();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (!q) return;
        if (!root.classList.contains('is-open') || panel.hidden) {
          e.preventDefault();
          goToFirstHeaderHit();
          return;
        }
        const opts = panel.querySelectorAll('.site-search__hit');
        const emptyMsg = panel.querySelector('.site-search__empty');
        if (emptyMsg) {
          e.preventDefault();
          return;
        }
        if (opts.length && headerActive >= 0 && opts[headerActive]) {
          e.preventDefault();
          opts[headerActive].click();
        } else if (opts.length) {
          e.preventDefault();
          opts[0].click();
        }
        return;
      }
      if (!root.classList.contains('is-open') || panel.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHeaderActive(headerActive + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHeaderActive(headerActive - 1);
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

    panel.addEventListener('click', (ev) => {
      const a = ev.target.closest('a[href]');
      if (!a || !panel.contains(a)) return;
      pushRecent({
        u: a.getAttribute('href'),
        t: a.querySelector('strong')?.textContent?.trim() || '',
        k: a.dataset.hitK || 'page'
      });
    });

    /* Command palette */
    const dlg = document.getElementById('site-command');
    const cmdInput = document.querySelector('[data-command-input]');
    const cmdHits = document.querySelector('[data-command-hits]');
    const cmdRecent = document.querySelector('[data-command-recent]');
    const cmdSuggested = document.querySelector('[data-command-suggested]');
    const cmdFilters = document.querySelector('[data-command-filters]');

    const labAll = root.dataset.filterAll || 'All';
    const labPeople = root.dataset.filterPeople || 'People';
    const labCo = root.dataset.filterCompanies || 'Companies';
    const labPages = root.dataset.filterPages || 'Pages';

    let cmdFilter = 'all';
    let cmdActive = -1;
    let cmdDebounce = 0;

    function renderCmdHits(hits) {
      if (!cmdHits) return;
      cmdActive = hits.length ? 0 : -1;
      if (!hits.length) {
        cmdHits.innerHTML = `<p class="site-search__empty" role="status">${esc(emptyText)}</p>`;
        return;
      }
      cmdHits.innerHTML = hits
        .map(
          (hit, i) =>
            `<a class="command-hit${i === 0 ? ' is-active' : ''}" role="option" href="${esc(hit.u)}" data-hit-k="${esc(hit.k)}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="site-search__badge">${esc(bl(hit.k))}</span><span class="site-search__hit-text"><strong>${esc(hit.t)}</strong>${hit.c ? `<span class="site-search__meta">${esc(hit.c)}</span>` : ''}</span></a>`
        )
        .join('');
    }

    function setCmdActive(next) {
      const opts = cmdHits.querySelectorAll('.command-hit');
      if (!opts.length) return;
      let i = next;
      if (i < 0) i = opts.length - 1;
      if (i >= opts.length) i = 0;
      cmdActive = i;
      opts.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === i);
        el.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
      opts[i].scrollIntoView({ block: 'nearest' });
    }

    function renderFilterChips() {
      if (!cmdFilters) return;
      const chips = [
        ['all', labAll],
        ['person', labPeople],
        ['startup', labCo],
        ['page', labPages]
      ];
      cmdFilters.innerHTML = chips
        .map(
          ([id, lab]) =>
            `<button type="button" role="tab" class="command-filter${cmdFilter === id ? ' is-active' : ''}" data-filter-kind="${id}" aria-selected="${cmdFilter === id ? 'true' : 'false'}">${esc(lab)}</button>`
        )
        .join('');
      cmdFilters.querySelectorAll('[data-filter-kind]').forEach((btn) => {
        btn.addEventListener('click', () => {
          cmdFilter = btn.getAttribute('data-filter-kind') || 'all';
          renderFilterChips();
          if (cmdInput.value.trim()) runCmdSearch();
          else renderCmdIdle();
        });
      });
    }

    function renderCmdIdle() {
      if (!cmdRecent || !cmdSuggested) return;
      const rec = readRecent();
      cmdRecent.innerHTML = rec.length
        ? rec
            .map(
              (r) =>
                `<a class="command-side-hit" href="${esc(r.u)}"><span class="site-search__badge">${esc(bl(r.k))}</span><span>${esc(r.t)}</span></a>`
            )
            .join('')
        : `<p class="command-muted">—</p>`;
      const sug = pickSuggestions(index, 6);
      cmdSuggested.innerHTML = sug
        .map(
          (r) =>
            `<a class="command-side-hit" href="${esc(r.u)}"><span class="site-search__badge">${esc(bl(r.k))}</span><span>${esc(r.t)}</span></a>`
        )
        .join('');
      if (cmdHits) cmdHits.innerHTML = '';
    }

    function runCmdSearch() {
      if (!cmdInput || !cmdHits) return;
      const q = cmdInput.value;
      if (!q.trim()) {
        renderCmdIdle();
        return;
      }
      const hits = searchIndex(index, q, cmdFilter);
      renderCmdHits(hits);
    }

    function openCommand() {
      if (!dlg || !cmdInput) return;
      renderFilterChips();
      if (!cmdInput.value.trim()) renderCmdIdle();
      else runCmdSearch();
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', 'open');
      window.setTimeout(() => cmdInput.focus(), 30);
    }

    function closeCommand() {
      if (!dlg) return;
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.removeAttribute('open');
    }

    document.querySelectorAll('[data-open-command]').forEach((btn) => {
      btn.addEventListener('click', () => openCommand());
    });
    document.querySelectorAll('[data-close-command]').forEach((btn) => {
      btn.addEventListener('click', () => closeCommand());
    });

    if (dlg) {
      dlg.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeCommand();
      });
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) closeCommand();
      });
    }

    document.addEventListener('keydown', (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommand();
        return;
      }
      if (e.key === '/' && !meta && !e.altKey) {
        const t = e.target;
        const tag = t && t.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
        e.preventDefault();
        openCommand();
      }
    });

    if (cmdInput && cmdHits) {
      cmdInput.addEventListener('input', () => {
        window.clearTimeout(cmdDebounce);
        cmdDebounce = window.setTimeout(runCmdSearch, debounceMs);
      });

      cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCmdActive(cmdActive + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCmdActive(cmdActive - 1);
        } else if (e.key === 'Enter') {
          const opts = cmdHits.querySelectorAll('.command-hit');
          const emptyMsg = cmdHits.querySelector('.site-search__empty');
          if (emptyMsg || !opts.length) return;
          e.preventDefault();
          const pick = opts[cmdActive >= 0 ? cmdActive : 0];
          if (pick) pick.click();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeCommand();
        }
      });

      cmdHits.addEventListener('click', (ev) => {
        const a = ev.target.closest('a[href]');
        if (!a || !cmdHits.contains(a)) return;
        pushRecent({
          u: a.getAttribute('href'),
          t: a.querySelector('strong')?.textContent?.trim() || '',
          k: a.dataset.hitK || 'page'
        });
        closeCommand();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
