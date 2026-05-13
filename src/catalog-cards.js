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
      galleryHeading: b.dataset.catalogGalleryHeading || 'Photos'
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
    const aIn = document.createElement('a');
    aIn.className = 'directory-share-link';
    aIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`;
    aIn.target = '_blank';
    aIn.rel = 'noopener noreferrer';
    aIn.textContent = t.shareIn;
    const aX = document.createElement('a');
    aX.className = 'directory-share-link';
    aX.href = `https://twitter.com/intent/tweet?url=${enc}&text=${encTitle}`;
    aX.target = '_blank';
    aX.rel = 'noopener noreferrer';
    aX.textContent = t.shareX;
    const aFb = document.createElement('a');
    aFb.className = 'directory-share-link';
    aFb.href = `https://www.facebook.com/sharer/sharer.php?u=${enc}`;
    aFb.target = '_blank';
    aFb.rel = 'noopener noreferrer';
    aFb.textContent = t.shareFb;
    panel.append(copyBtn, aIn, aX, aFb);
    d.append(sum, panel);
    return d;
  }

  function stripAndNormalizeListingCards() {
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
        body.querySelectorAll('p').forEach((p) => {
          if (p.classList.contains('eyebrow') || p.classList.contains('meta') || p.classList.contains('card-teaser')) return;
          p.remove();
        });
        if (!body.querySelector('.card-teaser')) {
          const meta = body.querySelector('p.meta');
          if (meta) {
            const te = document.createElement('p');
            te.className = 'card-teaser';
            const raw = meta.textContent.trim();
            te.textContent = raw.length > 130 ? `${raw.slice(0, 127)}…` : raw;
            meta.after(te);
          }
        }
        if (body.querySelector('.directory-card-actions')) return;
        const btn = body.querySelector('.btn[href]');
        if (!btn) return;
        const wrap = document.createElement('div');
        wrap.className = 'directory-card-actions';
        const read = btn.cloneNode(true);
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

  stripAndNormalizeListingCards();
  relocateProfileHeroToGallery();
  bindShareCopy();
})();
