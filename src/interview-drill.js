(function () {
  'use strict';

  const root = document.querySelector('[data-interview-drill]');
  if (!root || !window.INTERVIEW_BANK) return;

  const lang = document.documentElement.getAttribute('lang') || 'uk';
  const BANK = window.INTERVIEW_BANK[lang];
  if (!BANK) return;

  const SIZE = window.INTERVIEW_BANK_SIZE || 10000;
  const BATCH = window.INTERVIEW_BATCH_SIZE || 4;
  const maxPage = Math.floor((SIZE - 1) / BATCH);

  const UI = {
    uk: {
      trackLabel: 'Акцент ролі (зсув комбінаторики)',
      track0: 'Без зсуву — повний мікс',
      track1: 'Зсув +1 (варіація ролі)',
      track2: 'Зсув +2',
      track3: 'Зсув +3',
      track4: 'Зсув +4',
      track5: 'Зсув +5',
      track6: 'Зсув +6',
      track7: 'Зсув +7',
      prev: 'Попередні 4',
      next: 'Наступні 4',
      jump: 'Перейти до пакета №',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Пакет ${page + 1} з ${total} · питання ${lo}–${hi} з ${SIZE} (унікальні комбінації)`,
      notesPh: 'Короткі нотатки (лише у вашому браузері)',
      ariaList: 'Чотири питання поточного пакета',
      copy: 'Копіювати пакет',
      copied: 'Скопійовано',
      errCopy: 'Копіювання недоступне',
    },
    en: {
      trackLabel: 'Role emphasis (combinator shift)',
      track0: 'No shift — full mix',
      track1: 'Shift +1',
      track2: 'Shift +2',
      track3: 'Shift +3',
      track4: 'Shift +4',
      track5: 'Shift +5',
      track6: 'Shift +6',
      track7: 'Shift +7',
      prev: 'Previous 4',
      next: 'Next 4',
      jump: 'Go to batch #',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Batch ${page + 1} of ${total} · questions ${lo}–${hi} of ${SIZE} (unique combinations)`,
      notesPh: 'Short notes (stored only in your browser)',
      ariaList: 'Four questions in the current batch',
      copy: 'Copy batch',
      copied: 'Copied',
      errCopy: 'Copy unavailable',
    },
    es: {
      trackLabel: 'Énfasis de rol (desplazamiento)',
      track0: 'Sin desplazamiento',
      track1: 'Desplazamiento +1',
      track2: 'Desplazamiento +2',
      track3: 'Desplazamiento +3',
      track4: 'Desplazamiento +4',
      track5: 'Desplazamiento +5',
      track6: 'Desplazamiento +6',
      track7: 'Desplazamiento +7',
      prev: 'Anterior (4)',
      next: 'Siguiente (4)',
      jump: 'Ir al lote n.º',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Lote ${page + 1} de ${total} · preguntas ${lo}–${hi} de ${SIZE} (combinaciones únicas)`,
      notesPh: 'Notas breves (solo en su navegador)',
      ariaList: 'Cuatro preguntas del lote actual',
      copy: 'Copiar lote',
      copied: 'Copiado',
      errCopy: 'Copia no disponible',
    },
    ru: {
      trackLabel: 'Акцент роли (сдвиг комбинаторики)',
      track0: 'Без сдвига — полный микс',
      track1: 'Сдвиг +1',
      track2: 'Сдвиг +2',
      track3: 'Сдвиг +3',
      track4: 'Сдвиг +4',
      track5: 'Сдвиг +5',
      track6: 'Сдвиг +6',
      track7: 'Сдвиг +7',
      prev: 'Предыдущие 4',
      next: 'Следующие 4',
      jump: 'Перейти к пакету №',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Пакет ${page + 1} из ${total} · вопросы ${lo}–${hi} из ${SIZE} (уникальные комбинации)`,
      notesPh: 'Краткие заметки (только в браузере)',
      ariaList: 'Четыре вопроса текущего пакета',
      copy: 'Копировать пакет',
      copied: 'Скопировано',
      errCopy: 'Копирование недоступно',
    },
  };

  const u = UI[lang] || UI.en;

  const trackLbl = root.querySelector('[data-iv-track-label]');
  if (trackLbl) trackLbl.textContent = u.trackLabel;

  function situationFor(si) {
    const nO = BANK.orgs.length;
    const nZ = BANK.stressors.length;
    const o = BANK.orgs[si % nO];
    const z = BANK.stressors[Math.floor(si / nO) % nZ];
    return BANK.situationTpl.replace('{org}', o).replace('{stress}', z);
  }

  function questionAt(idx, roleShift) {
    const R = BANK.roles.length;
    const nO = BANK.orgs.length;
    const nZ = BANK.stressors.length;
    const nSit = nO * nZ;
    const C = BANK.competencies.length;
    const L = BANK.lenses.length;
    let t = idx;
    const ir0 = t % R;
    t = Math.floor(t / R);
    const isit = t % nSit;
    t = Math.floor(t / nSit);
    const ic = t % C;
    t = Math.floor(t / C);
    const il = t % L;
    const ir = (ir0 + (roleShift % R)) % R;
    const situation = situationFor(isit);
    const horizon = BANK.horizons[idx % BANK.horizons.length];
    return BANK.lenses[il]
      .replace(/\{role\}/g, BANK.roles[ir])
      .replace(/\{situation\}/g, situation)
      .replace(/\{competency\}/g, BANK.competencies[ic])
      .replace(/\{horizon\}/g, horizon);
  }

  const el = {
    track: root.querySelector('[data-iv-track]'),
    prev: root.querySelector('[data-iv-prev]'),
    next: root.querySelector('[data-iv-next]'),
    jump: root.querySelector('[data-iv-jump]'),
    jumpBtn: root.querySelector('[data-iv-jump-btn]'),
    prog: root.querySelector('[data-iv-progress]'),
    list: root.querySelector('[data-iv-list]'),
    live: root.querySelector('[data-iv-live]'),
    copy: root.querySelector('[data-iv-copy]'),
  };

  if (el.track) {
    el.track.innerHTML = '';
    for (let i = 0; i < 8; i += 1) {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = u[`track${i}`] || `Shift ${i}`;
      el.track.appendChild(o);
    }
  }

  function readPage() {
    const q = new URLSearchParams(window.location.search).get('p');
    let p = q != null ? parseInt(q, 10) : NaN;
    if (Number.isNaN(p) || p < 0) {
      const ls = localStorage.getItem(`iv-page-${lang}`);
      p = ls != null ? parseInt(ls, 10) : 0;
    }
    if (Number.isNaN(p) || p < 0) p = 0;
    if (p > maxPage) p = maxPage;
    return p;
  }

  let page = readPage();
  let track = parseInt(localStorage.getItem(`iv-track-${lang}`) || '0', 10) || 0;
  if (track < 0 || track > 7) track = 0;
  if (el.track) el.track.value = String(track);

  function writePage(p) {
    page = Math.max(0, Math.min(maxPage, p));
    const url = new URL(window.location.href);
    url.searchParams.set('p', String(page));
    window.history.replaceState({}, '', url.toString());
    localStorage.setItem(`iv-page-${lang}`, String(page));
    render();
  }

  function noteKey(i) {
    return `iv-note-${lang}-${i}`;
  }

  function render() {
    if (el.track) track = parseInt(el.track.value, 10) || 0;
    localStorage.setItem(`iv-track-${lang}`, String(track));

    const lo = page * BATCH + 1;
    const hi = Math.min(SIZE, page * BATCH + BATCH);
    if (el.prog) {
      el.prog.textContent = u.progress(page, maxPage + 1, lo, hi);
    }

    if (el.jump) el.jump.value = String(page + 1);

    if (!el.list) return;
    el.list.innerHTML = '';
    for (let k = 0; k < BATCH; k += 1) {
      const idx = page * BATCH + k;
      if (idx >= SIZE) break;
      const text = questionAt(idx, track);
      const li = document.createElement('li');
      li.className = 'interview-drill__item';
      const q = document.createElement('p');
      q.className = 'interview-drill__q';
      q.textContent = text;
      const ta = document.createElement('textarea');
      ta.className = 'interview-drill__notes';
      ta.rows = 3;
      ta.setAttribute('aria-label', `${u.notesPh} #${idx + 1}`);
      ta.placeholder = `${u.notesPh} (#${idx + 1})`;
      ta.value = localStorage.getItem(noteKey(idx)) || '';
      ta.addEventListener('input', () => {
        localStorage.setItem(noteKey(idx), ta.value);
      });
      li.appendChild(q);
      li.appendChild(ta);
      el.list.appendChild(li);
    }

    if (el.live) {
      el.live.textContent = u.progress(page, maxPage + 1, lo, hi);
    }

    if (el.prev) el.prev.disabled = page <= 0;
    if (el.next) el.next.disabled = page >= maxPage;
  }

  if (el.prev) el.prev.addEventListener('click', () => writePage(page - 1));
  if (el.next) el.next.addEventListener('click', () => writePage(page + 1));
  if (el.track) el.track.addEventListener('change', () => render());

  if (el.jumpBtn && el.jump) {
    el.jumpBtn.addEventListener('click', () => {
      const v = parseInt(String(el.jump.value).trim(), 10);
      if (Number.isNaN(v) || v < 1 || v > maxPage + 1) return;
      writePage(v - 1);
    });
  }

  if (el.copy) {
    el.copy.addEventListener('click', async () => {
      const lines = [];
      for (let k = 0; k < BATCH; k += 1) {
        const idx = page * BATCH + k;
        if (idx >= SIZE) break;
        lines.push(`${idx + 1}. ${questionAt(idx, track)}`);
      }
      const blob = lines.join('\n\n');
      try {
        await navigator.clipboard.writeText(blob);
        el.copy.textContent = u.copied;
        setTimeout(() => {
          el.copy.textContent = u.copy;
        }, 1600);
      } catch {
        el.copy.textContent = u.errCopy;
        setTimeout(() => {
          el.copy.textContent = u.copy;
        }, 2200);
      }
    });
  }

  window.addEventListener('popstate', () => {
    page = readPage();
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && page < maxPage) {
      e.preventDefault();
      writePage(page + 1);
    }
    if (e.key === 'ArrowLeft' && page > 0) {
      e.preventDefault();
      writePage(page - 1);
    }
  });

  render();
})();
