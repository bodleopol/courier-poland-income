(function () {
  function readI18n() {
    const b = document.body;
    return {
      shareOpen: b.dataset.catalogShareOpen || 'Share',
      shareCopy: b.dataset.catalogShareCopy || 'Copy link',
      shareCopied: b.dataset.catalogShareCopied || 'Copied',
      shareIn: b.dataset.catalogShareIn || 'LinkedIn',
      shareX: b.dataset.catalogShareX || 'X',
      shareFb: b.dataset.catalogShareFb || 'Facebook',
      shareTelegram: b.dataset.catalogShareTelegram || 'Telegram',
      shareWhatsapp: b.dataset.catalogShareWhatsapp || 'WhatsApp',
      shareNative: b.dataset.catalogShareNative || 'Share…',
      galleryHeading: b.dataset.catalogGalleryHeading || 'Photos',
      readProfile: b.dataset.catalogReadProfile || 'Read profile'
    };
  }

  function absUrl(href) {
    try {
      return new URL(href, window.location.href).toString();
    } catch {
      return href;
    }
  }

  function buildShareDetails(href, titleText) {
    const t = readI18n();
    const full = absUrl(href);
    const enc = encodeURIComponent(full);
    const encTitle = encodeURIComponent(titleText || '');
    const waText = encodeURIComponent(`${titleText ? `${titleText} — ` : ''}${full}`);
    const tgHref = `https://t.me/share/url?url=${enc}&text=${encTitle}`;
    const waHref = `https://api.whatsapp.com/send?text=${waText}`;

    const d = document.createElement('details');
    d.className = 'directory-share';
    const sum = document.createElement('summary');
    sum.className = 'btn secondary';
    sum.textContent = t.shareOpen;
    const panel = document.createElement('div');
    panel.className = 'directory-share-panel';
    panel.setAttribute('role', 'group');

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'directory-share-copy';
    copyBtn.dataset.url = full;
    copyBtn.textContent = t.shareCopy;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      const nat = document.createElement('button');
      nat.type = 'button';
      nat.className = 'directory-share-native';
      nat.textContent = t.shareNative;
      nat.addEventListener('click', async (ev) => {
        ev.preventDefault();
        try {
          await navigator.share({ title: titleText || document.title, url: full });
        } catch {
          /* user cancelled */
        }
      });
      panel.appendChild(nat);
    }

    const mk = (href0, label, cls) => {
      const a = document.createElement('a');
      a.className = cls || 'directory-share-link';
      a.href = href0;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = label;
      return a;
    };

    panel.append(
      copyBtn,
      mk(`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, t.shareIn),
      mk(`https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`, t.shareX),
      mk(`https://www.facebook.com/sharer/sharer.php?u=${enc}`, t.shareFb),
      mk(tgHref, t.shareTelegram),
      mk(waHref, t.shareWhatsapp)
    );
    d.append(sum, panel);
    return d;
  }

  function truncateTeaser(raw, maxLen) {
    const t = String(raw || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!t) return '';
    if (t.length <= maxLen) return t;
    const cut = t.slice(0, maxLen);
    const sp = cut.lastIndexOf(' ');
    const base = sp > 40 ? cut.slice(0, sp) : cut;
    return `${base}…`;
  }

  function stripAndNormalizeListingCards() {
    const t = readI18n();
    const roots = [
      ...document.querySelectorAll(
        '[data-directory-grid], #featuredGridMount, #startupGridMount, #recentGridMount, #editorialTeamMount, .compact-grid'
      ),
      ...document.querySelectorAll('.profile-related .startup-grid, .profile-related .compact-grid')
    ];
    roots.forEach((root) => {
      root.querySelectorAll('[data-directory-card]').forEach((card) => {
        const topImg = card.querySelector(':scope > img');
        if (topImg) topImg.remove();
        const body = card.querySelector('.card-body');
        if (!body) return;

        const meta = body.querySelector('p.meta');
        let longBits = '';
        body.querySelectorAll('p').forEach((p) => {
          if (p.classList.contains('eyebrow') || p.classList.contains('meta') || p.classList.contains('card-teaser')) return;
          const bit = p.textContent.trim();
          if (bit) longBits = longBits ? `${longBits} ${bit}` : bit;
        });

        body.querySelector('.eyebrow')?.remove();
        body.querySelector('.tags')?.remove();
        body.querySelectorAll('p').forEach((p) => {
          if (p.classList.contains('meta') || p.classList.contains('card-teaser')) return;
          p.remove();
        });

        let te = body.querySelector('.card-teaser');
        if (!te) {
          te = document.createElement('p');
          te.className = 'card-teaser';
          const raw = longBits || meta?.textContent.trim() || '';
          te.textContent = truncateTeaser(raw, card.classList.contains('startup-card') ? 148 : 132);
          if (meta) meta.after(te);
          else body.querySelector('h3')?.after(te);
        } else {
          te.textContent = truncateTeaser(te.textContent, 148);
        }

        if (body.querySelector('.directory-card-actions')) {
          const readExisting = body.querySelector('.directory-card-actions .btn[href]');
          if (readExisting) readExisting.textContent = t.readProfile;
          return;
        }
        const btn = body.querySelector('.btn[href]');
        if (!btn) return;
        const wrap = document.createElement('div');
        wrap.className = 'directory-card-actions';
        const read = btn.cloneNode(true);
        read.textContent = t.readProfile;
        btn.replaceWith(wrap);
        wrap.appendChild(read);
        const title = body.querySelector('h3')?.textContent?.trim() || '';
        wrap.appendChild(buildShareDetails(read.getAttribute('href'), title));
      });
    });
  }

  function relocateProfileHeroToGallery() {
    const root = document.querySelector('article.profile-page, article.startup-page');
    if (!root) return;
    const heroImg = root.querySelector('.profile-header > img.profile-avatar-large');
    if (!heroImg) return;
    let gallery = root.querySelector('.profile-gallery');
    const t = readI18n();
    if (!gallery) {
      gallery = document.createElement('section');
      gallery.className = 'profile-gallery';
      const h = document.createElement('h3');
      h.textContent = t.galleryHeading;
      const grid = document.createElement('div');
      grid.className = 'gallery-grid';
      gallery.append(h, grid);
      const ins = root.querySelector('.profile-content');
      if (ins) ins.after(gallery);
      else root.querySelector('.profile-header')?.after(gallery);
    }
    let grid = gallery.querySelector('.gallery-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'gallery-grid';
      gallery.appendChild(grid);
    }
    const fig = document.createElement('figure');
    fig.appendChild(heroImg);
    grid.prepend(fig);
  }

  function enhanceProfileOrStartupArticle() {
    const root = document.querySelector('article.profile-page, article.startup-page');
    if (!root) return;
    root.classList.add('profile-article--intel');

    const hdr = root.querySelector('.profile-header');
    if (hdr) {
      hdr.classList.add('profile-header--editorial');
      const h1 = root.querySelector('h1')?.textContent?.trim() || '';
      if (!hdr.querySelector('.profile-header-share') && h1) {
        const wrap = document.createElement('div');
        wrap.className = 'profile-header-share';
        wrap.appendChild(buildShareDetails(window.location.href, h1));
        hdr.appendChild(wrap);
      }
    }

    const hdrNav = root.querySelector('.profile-header');
    if (hdrNav && !root.querySelector('.profile-jump-nav')) {
      const sections = [...root.querySelectorAll(':scope > section')].filter(
        (s) => !s.classList.contains('profile-related')
      );
      const items = [];
      sections.forEach((sec, idx) => {
        const ht = sec.querySelector('h2, h3');
        const label = ht?.textContent?.trim();
        if (!label) return;
        if (!sec.id) sec.id = `profile-section-${idx + 1}`;
        items.push({ id: sec.id, label });
      });
      if (items.length > 1) {
        const nav = document.createElement('nav');
        nav.className = 'profile-jump-nav';
        nav.setAttribute('aria-label', 'On this page');
        const ul = document.createElement('ul');
        items.forEach(({ id, label }) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${id}`;
          a.textContent = label;
          li.appendChild(a);
          ul.appendChild(li);
        });
        nav.appendChild(ul);
        hdrNav.after(nav);
      }
    }
  }

  function bindShareCopy() {
    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('.directory-share-copy');
      if (!btn) return;
      const url = btn.dataset.url;
      if (!url) return;
      e.preventDefault();
      const t = readI18n();
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
        else {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const prev = btn.textContent;
        btn.textContent = t.shareCopied;
        setTimeout(() => {
          btn.textContent = prev;
        }, 1600);
      } catch {
        /* ignore */
      }
    });
  }

  function closeOtherShareDetails(opened) {
    document.querySelectorAll('details.directory-share[open]').forEach((d) => {
      if (d !== opened) d.removeAttribute('open');
    });
  }

  document.addEventListener('toggle', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLDetailsElement)) return;
    if (!t.classList.contains('directory-share')) return;
    if (t.open) closeOtherShareDetails(t);
  });

  function markDirectoryCards() {
    document.querySelectorAll('[data-directory-grid]').forEach((grid) => {
      const cards = grid.querySelectorAll('[data-directory-card]');
      cards.forEach((card, i) => {
        card.style.setProperty('--directory-card-i', String(i));
      });
      grid.classList.add('directory-grid--shuffled');
    });
  }

  stripAndNormalizeListingCards();
  relocateProfileHeroToGallery();
  enhanceProfileOrStartupArticle();
  bindShareCopy();
  markDirectoryCards();
})();
