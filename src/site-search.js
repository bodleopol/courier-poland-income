(function () {
  const root = document.getElementById('site-search-root');
  const input = document.getElementById('site-search-input');
  const list = document.getElementById('site-search-results');
  const status = document.getElementById('site-search-status');
  const panel = root.querySelector('.site-search-panel');
  const dialog = document.getElementById('site-search-dialog');
  const openButtons = document.querySelectorAll('[data-site-search-open]');
  const closeEls = document.querySelectorAll('[data-site-search-close]');

  if (!root || !input || !list || !panel || !dialog) return;

  const pageLang = document.documentElement.getAttribute('lang') || 'uk';
  const LABEL = {
    site: dialog.getAttribute('data-label-site') || 'Page',
    person: dialog.getAttribute('data-label-person') || 'Person',
    startup: dialog.getAttribute('data-label-startup') || 'Company'
  };

  function msg(key) {
    if (!status) return '';
    return status.getAttribute('data-' + key) || '';
  }

  let itemsAll = null;
  let loadPromise = null;
  let debounceTimer = null;
  let activeIndex = -1;
  let lastFocus = null;

  function fold(s) {
    try {
      return String(s || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '');
    } catch {
      return String(s || '').toLowerCase();
    }
  }

  function tokenize(q) {
    const f = fold(q);
    try {
      return f
        .split(/\s+/)
        .map(function (t) {
          return t.replace(/[^\p{L}\p{N}_-]+/gu, '');
        })
        .filter(Boolean);
    } catch {
      return f
        .split(/\s+/)
        .map(function (t) {
          return t.replace(/[^a-z0-9\u0400-\u04FF_-]+/gi, '');
        })
        .filter(Boolean);
    }
  }

  function kindLabel(k) {
    if (k === 'person') return LABEL.person;
    if (k === 'startup') return LABEL.startup;
    return LABEL.site;
  }

  function scoreItem(it, tokens) {
    const title = fold(it.t);
    const desc = fold(it.d);
    const body = fold(it.x);
    let score = 0;
    for (let i = 0; i < tokens.length; i += 1) {
      const tok = tokens[i];
      if (!tok) continue;
      if (title.indexOf(tok) !== -1) score += 16;
      else if (desc.indexOf(tok) !== -1) score += 8;
      else if (body.indexOf(tok) !== -1) score += 3;
    }
    return score;
  }

  function loadIndex() {
    if (itemsAll) return Promise.resolve(itemsAll);
    if (loadPromise) return loadPromise;
    loadPromise = fetch('site-search-index.json', { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('bad status');
        return r.json();
      })
      .then(function (data) {
        itemsAll = Array.isArray(data.items) ? data.items : [];
        return itemsAll;
      });
    return loadPromise;
  }

  function setStatus(text) {
    if (status) status.textContent = text || '';
  }

  function setActive(next) {
    const links = list.querySelectorAll('.site-search-hit');
    if (!links.length) {
      activeIndex = -1;
      return;
    }
    if (next < 0) next = 0;
    if (next >= links.length) next = links.length - 1;
    activeIndex = next;
    links.forEach(function (a, i) {
      a.classList.toggle('is-active', i === activeIndex);
      if (i === activeIndex) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    const cur = links[activeIndex];
    if (cur && typeof cur.scrollIntoView === 'function') {
      cur.scrollIntoView({ block: 'nearest' });
    }
  }

  function renderHits(query) {
    const tokens = tokenize(query);
    list.innerHTML = '';
    activeIndex = -1;
    if (!itemsAll || !itemsAll.length) {
      setStatus(msg('error'));
      return;
    }
    const pool = itemsAll.filter(function (it) {
      return it.l === pageLang;
    });
    if (!tokens.length) {
      setStatus('');
      return;
    }
    const ranked = [];
    for (let i = 0; i < pool.length; i += 1) {
      const it = pool[i];
      const sc = scoreItem(it, tokens);
      if (sc > 0) ranked.push({ it: it, sc: sc });
    }
    ranked.sort(function (a, b) {
      if (b.sc !== a.sc) return b.sc - a.sc;
      return fold(a.it.t).localeCompare(fold(b.it.t));
    });
    const top = ranked.slice(0, 60);
    if (!top.length) {
      setStatus(msg('empty'));
      return;
    }
    setStatus('');
    const frag = document.createDocumentFragment();
    for (let j = 0; j < top.length; j += 1) {
      const row = top[j].it;
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      const a = document.createElement('a');
      a.className = 'site-search-hit';
      a.href = row.u;
      a.setAttribute('role', 'option');
      const badge = document.createElement('span');
      badge.className = 'site-search-hit__kind';
      badge.textContent = kindLabel(row.k);
      const main = document.createElement('span');
      main.className = 'site-search-hit__main';
      const t = document.createElement('span');
      t.className = 'site-search-hit__title';
      t.textContent = row.t;
      const d = document.createElement('span');
      d.className = 'site-search-hit__desc';
      d.textContent = row.d || String(row.x || '').slice(0, 160);
      main.appendChild(t);
      main.appendChild(d);
      a.appendChild(badge);
      a.appendChild(main);
      li.appendChild(a);
      frag.appendChild(li);
    }
    list.appendChild(frag);
    setActive(0);
  }

  function runSearchDebounced() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      renderHits(input.value);
    }, 180);
  }

  function openSearch() {
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add('site-search--open');
    openButtons.forEach(function (b) {
      b.setAttribute('aria-expanded', 'true');
    });
    setStatus(msg('loading'));
    loadIndex()
      .then(function () {
        setStatus('');
        renderHits(input.value);
        input.focus();
        input.select();
      })
      .catch(function () {
        setStatus(msg('error'));
        itemsAll = null;
        loadPromise = null;
      });
  }

  function closeSearch() {
    root.hidden = true;
    document.body.classList.remove('site-search--open');
    openButtons.forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    list.innerHTML = '';
    activeIndex = -1;
    setStatus('');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try {
        lastFocus.focus();
      } catch {
        /* ignore */
      }
    }
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (root.hidden) openSearch();
      else {
        input.focus();
      }
    });
  });

  closeEls.forEach(function (el) {
    el.addEventListener('click', function () {
      closeSearch();
    });
  });

  input.addEventListener('input', function () {
    runSearchDebounced();
  });

  input.addEventListener('keydown', function (e) {
    const links = list.querySelectorAll('.site-search-hit');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIndex + 1 >= links.length ? 0 : activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIndex <= 0 ? links.length - 1 : activeIndex - 1);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && links[activeIndex]) {
        e.preventDefault();
        window.location.href = links[activeIndex].getAttribute('href');
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      if (e.repeat) return;
      e.preventDefault();
      if (root.hidden) openSearch();
      else {
        input.focus();
        input.select();
      }
    } else if (e.key === 'Escape' && !root.hidden) {
      e.preventDefault();
      closeSearch();
    }
  });

  list.addEventListener('click', function (e) {
    const a = e.target.closest('.site-search-hit');
    if (a && list.contains(a)) closeSearch();
  });
})();
