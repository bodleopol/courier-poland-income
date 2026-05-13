(function () {
  const LANG = (document.documentElement.getAttribute('lang') || 'uk').slice(0, 2);
  const COPY = {
    uk: {
      ecoTitle: 'Кластери в поточній вибірці',
      ecoHint: 'Торкніться сектора, щоб застосувати той самий фільтр, що й кнопки над стрічкою.',
      profileGraph: 'Теги й сусідні досьє',
      discovery: 'Семантичні переходи',
      discoveryIntro:
        'Швидкі запити в каталог за темами з цього профілю та зі схожих карток — без окремого пошуку по сайту.',
      startups: 'startups.html',
      specialists: 'specialists.html'
    },
    en: {
      ecoTitle: 'Clusters in this slice',
      ecoHint: 'Tap a sector to mirror the chip filters above the feed.',
      profileGraph: 'Tags and neighbouring dossiers',
      discovery: 'Semantic jumps',
      discoveryIntro: 'One-click catalogue queries from this profile’s themes and related cards.',
      startups: 'startups-en.html',
      specialists: 'specialists-en.html'
    },
    es: {
      ecoTitle: 'Clusters en esta vista',
      ecoHint: 'Toca un sector para aplicar el mismo filtro que los chips del listado.',
      profileGraph: 'Etiquetas y dossiers vecinos',
      discovery: 'Saltos semánticos',
      discoveryIntro: 'Consultas rápidas al catálogo según temas de esta ficha y tarjetas relacionadas.',
      startups: 'startups-es.html',
      specialists: 'specialists-es.html'
    },
    ru: {
      ecoTitle: 'Кластеры в текущей выборке',
      ecoHint: 'Нажмите на сектор — сработает тот же фильтр, что и у кнопок над лентой.',
      profileGraph: 'Теги и соседние досье',
      discovery: 'Семантические переходы',
      discoveryIntro: 'Быстрые запросы в каталог по темам профиля и похожих карточек.',
      startups: 'startups-ru.html',
      specialists: 'specialists-ru.html'
    }
  };
  const T = COPY[LANG] || COPY.uk;

  function hash32(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function initLayoutVariant() {
    const m = String(document.body.className || '').match(/\bdoc-([a-z0-9-]+)\b/i);
    const slug = m ? m[1] : 'page';
    const v = (hash32(slug) % 3) + 1;
    document.body.dataset.rzLayout = String(v);
  }

  function initProgressiveSections() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const roots = document.querySelectorAll(
      '.profile-layout__main article.profile-page > section, .profile-layout__main article.startup-page > section'
    );
    if (!roots.length) return;
    roots.forEach((el) => {
      el.classList.add('intel-section--hold');
    });
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('intel-section--visible');
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    roots.forEach((el) => io.observe(el));
  }

  function clickFilterChip(filterKey) {
    const safe = String(filterKey || '').replace(/[^a-z0-9_-]/gi, '');
    const btn = document.querySelector(`[data-directory-panel] [data-filter="${safe}"]`);
    if (btn) btn.click();
  }

  function initDirectoryEcoGraph() {
    const head = document.querySelector('.page-specialists .directory-page-head, .page-startups .directory-page-head');
    const panel = document.querySelector('[data-directory-panel]');
    const grid = panel?.parentElement?.querySelector('[data-directory-grid]');
    const mount = head?.querySelector('.eco-graph-panel');
    if (!panel || !grid || !mount) return;

    const mh = mount.querySelector('h3');
    if (mh) mh.textContent = T.ecoTitle;

    const stage = document.createElement('div');
    stage.className = 'eco-graph-stage';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 360 210');
    svg.setAttribute('class', 'eco-graph-svg--live');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', T.ecoTitle);
    stage.appendChild(svg);
    const cap = document.createElement('p');
    cap.className = 'eco-graph-live-caption';
    cap.textContent = T.ecoHint;
    mount.querySelector(':scope > svg:not(.eco-graph-svg--live)')?.remove();
    mount.append(stage, cap);

    const chips = [...panel.querySelectorAll('[data-filter]')].filter((b) => b.dataset.filter && b.dataset.filter !== 'all');
    const cx = 180;
    const cy = 105;
    const r = 78;

    function sectorLabel(key) {
      const chip = chips.find((c) => c.dataset.filter === key);
      return chip ? chip.textContent.trim() : key;
    }

    function rebuild() {
      const visible = [...grid.querySelectorAll('[data-directory-card]')].filter((c) => !c.hidden);
      const counts = {};
      visible.forEach((c) => {
        const k = (c.dataset.filterKey || 'other').toLowerCase();
        counts[k] = (counts[k] || 0) + 1;
      });
      const keys = chips.map((c) => c.dataset.filter).filter(Boolean);
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const defs = document.createElementNS(svg.namespaceURI, 'defs');
      const grad = document.createElementNS(svg.namespaceURI, 'linearGradient');
      grad.setAttribute('id', 'ecoLiveGrad');
      grad.setAttribute('x1', '0');
      grad.setAttribute('y1', '0');
      grad.setAttribute('x2', '1');
      grad.setAttribute('y2', '1');
      [['0%', '#6366f1'], ['100%', '#22d3ee']].forEach(([o, c]) => {
        const s = document.createElementNS(svg.namespaceURI, 'stop');
        s.setAttribute('offset', o);
        s.setAttribute('stop-color', c);
        grad.appendChild(s);
      });
      defs.appendChild(grad);
      svg.appendChild(defs);

      const hub = document.createElementNS(svg.namespaceURI, 'circle');
      hub.setAttribute('cx', String(cx));
      hub.setAttribute('cy', String(cy));
      hub.setAttribute('r', '18');
      hub.setAttribute('fill', 'color-mix(in oklab, var(--surface-strong) 70%, #6366f1)');
      hub.setAttribute('stroke', 'url(#ecoLiveGrad)');
      hub.setAttribute('stroke-width', '1.2');
      svg.appendChild(hub);

      const hubLabel = document.createElementNS(svg.namespaceURI, 'text');
      hubLabel.setAttribute('x', String(cx));
      hubLabel.setAttribute('y', String(cy + 5));
      hubLabel.setAttribute('text-anchor', 'middle');
      hubLabel.setAttribute('fill', 'var(--text)');
      hubLabel.setAttribute('font-size', '11');
      hubLabel.setAttribute('font-weight', '700');
      hubLabel.textContent = String(visible.length);
      svg.appendChild(hubLabel);

      const n = Math.max(keys.length, 1);
      keys.forEach((key, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        const cnt = counts[key] || 0;
        const rad = 10 + Math.min(16, Math.log(cnt + 1) * 5);

        const line = document.createElementNS(svg.namespaceURI, 'line');
        line.setAttribute('x1', String(cx));
        line.setAttribute('y1', String(cy));
        line.setAttribute('x2', String(x));
        line.setAttribute('y2', String(y));
        line.setAttribute('stroke', 'url(#ecoLiveGrad)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.35');
        svg.appendChild(line);

        const g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('class', 'eco-graph-node');
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `${sectorLabel(key)}: ${cnt}`);

        const node = document.createElementNS(svg.namespaceURI, 'circle');
        node.setAttribute('cx', String(x));
        node.setAttribute('cy', String(y));
        node.setAttribute('r', String(rad));
        node.setAttribute('fill', cnt ? 'rgba(99,102,241,0.35)' : 'rgba(148,163,184,0.2)');
        node.setAttribute('stroke', cnt ? '#a5b4fc' : 'rgba(148,163,184,0.45)');
        node.setAttribute('stroke-width', '1.1');
        g.appendChild(node);

        const tx = document.createElementNS(svg.namespaceURI, 'text');
        tx.setAttribute('x', String(x));
        tx.setAttribute('y', String(y + 4));
        tx.setAttribute('text-anchor', 'middle');
        tx.setAttribute('fill', 'var(--text)');
        tx.setAttribute('font-size', '10');
        tx.setAttribute('font-weight', '700');
        tx.textContent = String(cnt);
        g.appendChild(tx);

        const open = () => clickFilterChip(key);
        g.addEventListener('click', open);
        g.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            open();
          }
        });
        svg.appendChild(g);
      });
    }

    ['click', 'input', 'change'].forEach((evt) => {
      panel.addEventListener(evt, () => requestAnimationFrame(rebuild), evt === 'input');
    });
    rebuild();
  }

    return article.classList.contains('startup-page') ? T.startups : T.specialists;
  }

  function initSemanticDiscovery() {
    const article = document.querySelector('article.profile-page, article.startup-page');
    if (!article || article.querySelector('.semantic-discovery')) return;
    const facts = article.querySelector('.profile-facts');
    if (!facts) return;

    const tags = [...article.querySelectorAll('.profile-header .tag, .profile-info .tag')].map((t) => t.textContent.trim()).filter(Boolean);
    const related = [...article.querySelectorAll('.profile-related [data-directory-card] a.btn[href]')]
      .map((a) => ({ href: a.getAttribute('href'), label: a.closest('[data-directory-card]')?.querySelector('h3')?.textContent?.trim() || '' }))
      .filter((x) => x.href && x.label)
      .slice(0, 5);

    tags.slice(0, 5).forEach((tag) => {
      const q = encodeURIComponent(tag);
      chips.push({ href: `${tagSearchBase(article)}?q=${q}`, label: tag });
    });
    related.forEach((r) => {
      chips.push({ href: r.href, label: r.label });
    });
    if (!chips.length) return;

    const sec = document.createElement('section');
    sec.className = 'semantic-discovery';
    const h = document.createElement('h3');
    h.textContent = T.discovery;
    const intro = document.createElement('p');
    intro.className = 'semantic-discovery__intro';
    intro.textContent = T.discoveryIntro;
    const row = document.createElement('div');
    row.className = 'semantic-discovery__chips';
    const seen = new Set();
    chips.forEach((c) => {
      const k = c.href + c.label;
      if (seen.has(k)) return;
      seen.add(k);
      const a = document.createElement('a');
      a.className = 'semantic-chip';
      a.href = c.href;
      a.textContent = c.label;
      row.appendChild(a);
    });
    sec.append(h, intro, row);
    facts.after(sec);
  }

  function initProfileEcoGraph() {
    const aside = document.querySelector('.profile-intel');
    const article = document.querySelector('article.profile-page, article.startup-page');
    if (!aside || !article || aside.querySelector('.eco-profile-graph')) return;

    const h1 = article.querySelector('h1')?.textContent?.trim() || 'Profile';
    const tags = [...article.querySelectorAll('.profile-header .tag, .profile-info .tag')].map((t) => t.textContent.trim()).filter(Boolean);
    const rel = [...article.querySelectorAll('.profile-related [data-directory-card]')].slice(0, 8);

    const items = [
      ...tags.slice(0, 5).map((t, i) => ({
        label: t,
        href: `${tagSearchBase(article)}?q=${encodeURIComponent(t)}`,
        ang: (i / Math.max(tags.length, 1)) * Math.PI * 2 - Math.PI / 2
      })),
      ...rel.map((card, j) => {
        const a = card.querySelector('a.btn[href]');
        const lab = card.querySelector('h3')?.textContent?.trim() || '';
        const href = a?.getAttribute('href') || '#';
        const baseAng = ((tags.length + j) / Math.max(tags.length + rel.length, 1)) * Math.PI * 2 - Math.PI / 2;
        return { label: lab, href, ang: baseAng };
      })
    ].filter((x) => x.label);
    if (!items.length) return;

    const wrap = document.createElement('div');
    wrap.className = 'intel-card eco-profile-graph';
    const title = document.createElement('p');
    title.className = 'intel-card__eyebrow';
    title.textContent = T.profileGraph;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 280 200');
    svg.setAttribute('class', 'eco-profile-svg');
    const cx = 110;
    const cy = 100;
    const hub = document.createElementNS(svg.namespaceURI, 'circle');
    hub.setAttribute('cx', String(cx));
    hub.setAttribute('cy', String(cy));
    hub.setAttribute('r', '22');
    hub.setAttribute('fill', 'rgba(99,102,241,0.25)');
    hub.setAttribute('stroke', '#818cf8');
    hub.setAttribute('stroke-width', '1.2');

    const ht = document.createElementNS(svg.namespaceURI, 'text');
    ht.setAttribute('x', String(cx));
    ht.setAttribute('y', String(cy + 5));
    ht.setAttribute('text-anchor', 'middle');
    ht.setAttribute('font-size', '9');
    ht.setAttribute('fill', 'var(--text)');
    ht.textContent = h1.length > 18 ? `${h1.slice(0, 16)}…` : h1;

    const rr = 72;
    const lines = [];
    items.slice(0, 10).forEach((it) => {
      const x = cx + Math.cos(it.ang) * rr;
      const y = cy + Math.sin(it.ang) * rr;
      const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', String(cx));
      line.setAttribute('y1', String(cy));
      line.setAttribute('x2', String(x));
      line.setAttribute('y2', String(y));
      line.setAttribute('stroke', 'rgba(34,211,238,0.35)');
      line.setAttribute('stroke-width', '1');
      lines.push(line);
    });
    lines.forEach((ln) => svg.appendChild(ln));
    svg.appendChild(hub);
    svg.appendChild(ht);

    items.slice(0, 10).forEach((it) => {
      const x = cx + Math.cos(it.ang) * rr;
      const y = cy + Math.sin(it.ang) * rr;
      const a = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      a.setAttribute('href', it.href);
      const c = document.createElementNS(svg.namespaceURI, 'circle');
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y));
      c.setAttribute('r', '9');
      c.setAttribute('fill', 'rgba(15,23,42,0.4)');
      c.setAttribute('stroke', '#34d399');
      c.setAttribute('stroke-width', '1');
      a.appendChild(c);
      const tx = document.createElementNS(svg.namespaceURI, 'text');
      tx.setAttribute('x', String(x));
      tx.setAttribute('y', String(y + 28));
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-size', '8');
      tx.setAttribute('fill', 'var(--muted)');
      const lab = it.label.length > 14 ? `${it.label.slice(0, 12)}…` : it.label;
      tx.textContent = lab;
      a.appendChild(tx);
      svg.appendChild(a);
    });

    wrap.append(title, svg);
    aside.insertBefore(wrap, aside.firstChild);
  }

  initLayoutVariant();
  initProgressiveSections();
  initDirectoryEcoGraph();
  initSemanticDiscovery();
  initProfileEcoGraph();
})();
