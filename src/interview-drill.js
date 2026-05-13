(function () {
  'use strict';

  const root = document.querySelector('[data-interview-drill]');
  if (!root || !window.INTERVIEW_BANK) return;

  const lang = document.documentElement.getAttribute('lang') || 'uk';
  const BANK = window.INTERVIEW_BANK[lang];
  if (!BANK) return;

  const MC = window.INTERVIEW_MCQ && window.INTERVIEW_MCQ[lang] ? window.INTERVIEW_MCQ[lang] : null;

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
      modeLabel: 'Режим',
      modeOpen: 'Відкриті сценарні питання',
      modeMcq: 'Тест: 5 варіантів (один найкращий)',
      specialtyLabel: 'Спеціалізація',
      specialtyHint: '144 комбінації рівня та напряму — оберіть профіль для контексту або MCQ.',
      contextBanner: (label) => `Контекст обраної спеціалізації: «${label}».`,
      prev: 'Попередні 4',
      next: 'Наступні 4',
      jump: 'Перейти до пакета №',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Пакет ${page + 1} з ${total} · питання ${lo}–${hi} з ${SIZE} (унікальні комбінації)`,
      notesPh: 'Короткі нотатки (лише у вашому браузері)',
      ariaListOpen: 'Чотири питання поточного пакета',
      ariaListMcq: 'Чотири тестові питання поточного пакета',
      copy: 'Копіювати пакет',
      copied: 'Скопійовано',
      errCopy: 'Копіювання недоступне',
      randomBatch: 'Випадковий пакет',
      mcqCorrect: 'Правильно.',
      mcqWrong: 'Неправильно. Найкраща відповідь позначена в підказці нижче.',
      mcqAriaChoice: (n) => `Варіант ${n + 1}`,
      hintUrl:
        'Параметри URL: <code>p</code> (індекс пакета від 0), <code>t</code>/<code>track</code> (зсув ролі 0–7), <code>m</code> (<code>open</code> або <code>mcq</code>), <code>s</code> (id спеціалізації, напр. <code>lv2-tr0</code>), <code>r=1</code> — випадковий пакет при відкритті.',
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
      modeLabel: 'Mode',
      modeOpen: 'Open scenario prompts',
      modeMcq: 'Drill: 5 choices (pick the best)',
      specialtyLabel: 'Specialty',
      specialtyHint: '144 level × track combinations — pick a profile for context or MCQs.',
      contextBanner: (label) => `Selected specialty context: «${label}».`,
      prev: 'Previous 4',
      next: 'Next 4',
      jump: 'Go to batch #',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Batch ${page + 1} of ${total} · questions ${lo}–${hi} of ${SIZE} (unique combinations)`,
      notesPh: 'Short notes (stored only in your browser)',
      ariaListOpen: 'Four questions in the current batch',
      ariaListMcq: 'Four multiple-choice questions in the current batch',
      copy: 'Copy batch',
      copied: 'Copied',
      errCopy: 'Copy unavailable',
      randomBatch: 'Random batch',
      mcqCorrect: 'Correct.',
      mcqWrong: 'Not the best answer. See the hint below for the recommended choice.',
      mcqAriaChoice: (n) => `Option ${n + 1}`,
      hintUrl:
        'URL query: <code>p</code> (batch index from 0), <code>t</code>/<code>track</code> (role shift 0–7), <code>m</code> (<code>open</code> or <code>mcq</code>), <code>s</code> (specialty id, e.g. <code>lv2-tr0</code>), <code>r=1</code> random batch on load.',
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
      modeLabel: 'Modo',
      modeOpen: 'Prompts abiertos (escenario)',
      modeMcq: 'Test: 5 opciones (una recomendada)',
      specialtyLabel: 'Especialidad',
      specialtyHint: '144 combinaciones nivel × track — elija un perfil para contexto o MCQ.',
      contextBanner: (label) => `Contexto de especialidad: «${label}».`,
      prev: 'Anterior (4)',
      next: 'Siguiente (4)',
      jump: 'Ir al lote n.º',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Lote ${page + 1} de ${total} · preguntas ${lo}–${hi} de ${SIZE} (combinaciones únicas)`,
      notesPh: 'Notas breves (solo en su navegador)',
      ariaListOpen: 'Cuatro preguntas del lote actual',
      ariaListMcq: 'Cuatro preguntas tipo test del lote actual',
      copy: 'Copiar lote',
      copied: 'Copiado',
      errCopy: 'Copia no disponible',
      randomBatch: 'Lote aleatorio',
      mcqCorrect: 'Correcto.',
      mcqWrong: 'No es la mejor opción. Vea la pista debajo.',
      mcqAriaChoice: (n) => `Opción ${n + 1}`,
      hintUrl:
        'URL: <code>p</code>, <code>t</code>/<code>track</code> (0–7), <code>m</code> (<code>open</code> o <code>mcq</code>), <code>s</code> (id de especialidad, p.ej. <code>lv2-tr0</code>), <code>r=1</code> aleatorio al cargar.',
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
      modeLabel: 'Режим',
      modeOpen: 'Открытые сценарные вопросы',
      modeMcq: 'Тест: 5 вариантов (один лучший)',
      specialtyLabel: 'Специализация',
      specialtyHint: '144 комбинации уровня и трека — выберите профиль для контекста или MCQ.',
      contextBanner: (label) => `Контекст выбранной специализации: «${label}».`,
      prev: 'Предыдущие 4',
      next: 'Следующие 4',
      jump: 'Перейти к пакету №',
      go: 'OK',
      progress: (page, total, lo, hi) =>
        `Пакет ${page + 1} из ${total} · вопросы ${lo}–${hi} из ${SIZE} (уникальные комбинации)`,
      notesPh: 'Краткие заметки (только в браузере)',
      ariaListOpen: 'Четыре вопроса текущего пакета',
      ariaListMcq: 'Четыре тестовых вопроса текущего пакета',
      copy: 'Копировать пакет',
      copied: 'Скопировано',
      errCopy: 'Копирование недоступно',
      randomBatch: 'Случайный пакет',
      mcqCorrect: 'Верно.',
      mcqWrong: 'Не лучший ответ. Рекомендуемый вариант см. ниже.',
      mcqAriaChoice: (n) => `Вариант ${n + 1}`,
      hintUrl:
        'URL: <code>p</code>, <code>t</code>/<code>track</code> (0–7), <code>m</code> (<code>open</code> или <code>mcq</code>), <code>s</code> (id специализации, напр. <code>lv2-tr0</code>), <code>r=1</code> — случайный пакет при открытии.',
    },
  };

  const u = UI[lang] || UI.en;

  const trackLbl = root.querySelector('[data-iv-track-label]');
  if (trackLbl) trackLbl.textContent = u.trackLabel;

  const modeLbl = root.querySelector('[data-iv-mode-label]');
  const specLbl = root.querySelector('[data-iv-specialty-label]');
  const specHint = root.querySelector('[data-iv-specialty-hint]');
  const modeWrap = root.querySelector('[data-iv-mode-wrap]');
  const specWrap = root.querySelector('[data-iv-specialty-wrap]');
  if (MC) {
    if (modeLbl) modeLbl.textContent = u.modeLabel;
    if (specLbl) specLbl.textContent = u.specialtyLabel;
    if (specHint) specHint.textContent = u.specialtyHint;
  } else if (modeWrap) modeWrap.hidden = true;
  if (!MC && specWrap) specWrap.hidden = true;
  if (MC && modeWrap) modeWrap.hidden = false;
  if (MC && specWrap) specWrap.hidden = false;

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

  function mix32(a, b, c) {
    let x = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1442695041)) >>> 0;
    x = (x ^ (x >>> 13)) >>> 0;
    x = Math.imul(x, 1274126177) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  }

  function specialtyById(id) {
    if (!MC || !MC.specialties.length) return { id: 'none', label: '' };
    const found = MC.specialties.find((s) => s.id === id);
    return found || MC.specialties[0];
  }

  function mcqQuestion(specId, qIndex) {
    const spec = specialtyById(specId);
    const si = Math.max(0, MC.specialties.findIndex((s) => s.id === spec.id));
    const cat = MC.catalog;
    const row = cat[mix32(qIndex, si, 0) % cat.length];
    const stem = row.stem.replace(/\{s\}/g, spec.label);
    const correct = row.correct.replace(/\{s\}/g, spec.label);
    const wrongPool = row.wrongs.map((w) => w.replace(/\{s\}/g, spec.label));
    const picked = [];
    const used = new Set();
    let salt = 1;
    while (picked.length < 4 && salt < 500) {
      const j = mix32(qIndex, si, salt) % wrongPool.length;
      salt += 1;
      const w = wrongPool[j];
      if (w === correct || used.has(w)) continue;
      used.add(w);
      picked.push(w);
    }
    while (picked.length < 4) picked.push('…');
    const correctPos = mix32(qIndex, si, 999) % 5;
    const options = new Array(5);
    let pi = 0;
    for (let p = 0; p < 5; p += 1) {
      if (p === correctPos) options[p] = correct;
      else {
        options[p] = picked[pi];
        pi += 1;
      }
    }
    return { stem, options, correctIndex: correctPos, correctText: correct };
  }

  const el = {
    track: root.querySelector('[data-iv-track]'),
    mode: root.querySelector('[data-iv-mode]'),
    specialty: root.querySelector('[data-iv-specialty]'),
    prev: root.querySelector('[data-iv-prev]'),
    next: root.querySelector('[data-iv-next]'),
    jump: root.querySelector('[data-iv-jump]'),
    jumpBtn: root.querySelector('[data-iv-jump-btn]'),
    random: root.querySelector('[data-iv-random]'),
    prog: root.querySelector('[data-iv-progress]'),
    list: root.querySelector('[data-iv-list]'),
    live: root.querySelector('[data-iv-live]'),
    copy: root.querySelector('[data-iv-copy]'),
    hint: root.querySelector('[data-iv-hint]'),
    context: root.querySelector('[data-iv-context]'),
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

  if (MC && el.specialty) {
    el.specialty.innerHTML = '';
    for (const s of MC.specialties) {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.label;
      el.specialty.appendChild(o);
    }
  }

  if (el.mode && MC) {
    el.mode.innerHTML = '';
    const o1 = document.createElement('option');
    o1.value = 'open';
    o1.textContent = u.modeOpen;
    const o2 = document.createElement('option');
    o2.value = 'mcq';
    o2.textContent = u.modeMcq;
    el.mode.appendChild(o1);
    el.mode.appendChild(o2);
  }

  function readPageFromUrlOrStorage(allowRandom) {
    const sp = new URLSearchParams(window.location.search);
    if (allowRandom && (sp.get('r') === '1' || sp.get('random') === '1')) {
      return Math.floor(Math.random() * (maxPage + 1));
    }
    const q = sp.get('p');
    let p = q != null ? parseInt(q, 10) : NaN;
    if (Number.isNaN(p) || p < 0) {
      const ls = localStorage.getItem(`iv-page-${lang}`);
      p = ls != null ? parseInt(ls, 10) : 0;
    }
    if (Number.isNaN(p) || p < 0) p = 0;
    if (p > maxPage) p = maxPage;
    return p;
  }

  function readTrackFromUrlOrStorage() {
    const sp = new URLSearchParams(window.location.search);
    const tRaw = sp.get('t') ?? sp.get('track');
    let t = tRaw != null ? parseInt(tRaw, 10) : NaN;
    if (Number.isNaN(t) || t < 0 || t > 7) {
      t = parseInt(localStorage.getItem(`iv-track-${lang}`) || '0', 10) || 0;
    }
    if (t < 0 || t > 7) t = 0;
    return t;
  }

  function readModeFromUrlOrStorage() {
    if (!MC) return 'open';
    const sp = new URLSearchParams(window.location.search);
    const m = (sp.get('m') || sp.get('mode') || '').toLowerCase();
    if (m === 'mcq' || m === 'test' || m === 'choice') return 'mcq';
    if (m === 'open' || m === 'scenario') return 'open';
    const ls = localStorage.getItem(`iv-mode-${lang}`);
    if (ls === 'mcq') return 'mcq';
    return 'open';
  }

  function readSpecialtyFromUrlOrStorage() {
    if (!MC || !MC.specialties.length) return MC ? MC.specialties[0].id : '';
    const sp = new URLSearchParams(window.location.search);
    const sid = sp.get('s') || sp.get('specialty') || sp.get('spec');
    if (sid && MC.specialties.some((x) => x.id === sid)) return sid;
    const ls = localStorage.getItem(`iv-specialty-${lang}`);
    if (ls && MC.specialties.some((x) => x.id === ls)) return ls;
    return MC.specialties[0].id;
  }

  const initialSearch = new URLSearchParams(window.location.search);
  const hadRandomParam = initialSearch.get('r') === '1' || initialSearch.get('random') === '1';
  const hasExplicitParams =
    initialSearch.has('p') ||
    initialSearch.has('t') ||
    initialSearch.has('track') ||
    initialSearch.has('m') ||
    initialSearch.has('mode') ||
    initialSearch.has('s') ||
    initialSearch.has('specialty');

  let page = readPageFromUrlOrStorage(true);
  let track = readTrackFromUrlOrStorage();
  let mode = readModeFromUrlOrStorage();
  let specialtyId = readSpecialtyFromUrlOrStorage();
  if (track < 0 || track > 7) track = 0;
  if (el.track) el.track.value = String(track);
  if (el.mode && MC) el.mode.value = mode;
  if (el.specialty && MC) el.specialty.value = specialtyId;

  if (el.random) {
    el.random.textContent = u.randomBatch;
    el.random.setAttribute('aria-label', u.randomBatch);
  }

  if (el.hint) el.hint.innerHTML = u.hintUrl;

  function syncUrl() {
    page = Math.max(0, Math.min(maxPage, page));
    track = Math.max(0, Math.min(7, track));
    if (MC) {
      if (mode !== 'open' && mode !== 'mcq') mode = 'open';
      specialtyId = specialtyById(specialtyId).id;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('p', String(page));
    if (track !== 0) url.searchParams.set('t', String(track));
    else url.searchParams.delete('t');
    if (MC) {
      if (mode === 'mcq') url.searchParams.set('m', 'mcq');
      else url.searchParams.delete('m');
      const defId = MC.specialties[0] && MC.specialties[0].id;
      if (specialtyId && specialtyId !== defId) url.searchParams.set('s', specialtyId);
      else url.searchParams.delete('s');
    }
    url.searchParams.delete('r');
    url.searchParams.delete('random');
    window.history.replaceState({}, '', url.toString());
    localStorage.setItem(`iv-page-${lang}`, String(page));
    localStorage.setItem(`iv-track-${lang}`, String(track));
    if (MC) {
      localStorage.setItem(`iv-mode-${lang}`, mode);
      localStorage.setItem(`iv-specialty-${lang}`, specialtyId);
    }
  }

  function writePage(p) {
    page = Math.max(0, Math.min(maxPage, p));
    syncUrl();
    render();
  }

  function noteKey(i) {
    const spec = MC ? specialtyId : 'na';
    const m = MC ? mode : 'open';
    return `iv-note-${lang}-${m}-${spec}-${i}`;
  }

  function render() {
    if (el.track) track = parseInt(el.track.value, 10) || 0;
    if (el.mode && MC) mode = el.mode.value === 'mcq' ? 'mcq' : 'open';
    if (el.specialty && MC) specialtyId = el.specialty.value || specialtyId;
    localStorage.setItem(`iv-track-${lang}`, String(track));
    if (MC) {
      localStorage.setItem(`iv-mode-${lang}`, mode);
      localStorage.setItem(`iv-specialty-${lang}`, specialtyId);
    }

    const lo = page * BATCH + 1;
    const hi = Math.min(SIZE, page * BATCH + BATCH);
    if (el.prog) {
      el.prog.textContent = u.progress(page, maxPage + 1, lo, hi);
    }

    if (el.jump) el.jump.value = String(page + 1);

    const specLabel = specialtyById(specialtyId).label;
    if (el.context && MC) {
      el.context.textContent = u.contextBanner(specLabel);
      el.context.hidden = false;
    } else if (el.context) {
      el.context.hidden = true;
    }

    if (el.list) {
      el.list.setAttribute('aria-label', mode === 'mcq' && MC ? u.ariaListMcq : u.ariaListOpen);
      el.list.innerHTML = '';
      for (let k = 0; k < BATCH; k += 1) {
        const idx = page * BATCH + k;
        if (idx >= SIZE) break;
        const li = document.createElement('li');
        li.className = 'interview-drill__item';

        if (mode === 'mcq' && MC) {
          const mq = mcqQuestion(specialtyId, idx);
          const q = document.createElement('p');
          q.className = 'interview-drill__q';
          q.id = `iv-mcq-q-${lang}-${idx}`;
          q.textContent = mq.stem;

          const rg = document.createElement('div');
          rg.className = 'interview-drill__mcq';
          rg.setAttribute('role', 'radiogroup');
          rg.setAttribute('aria-labelledby', q.id);

          const feedback = document.createElement('p');
          feedback.className = 'interview-drill__mcq-feedback';
          feedback.setAttribute('aria-live', 'polite');
          feedback.hidden = true;

          const groupName = `iv-mcq-${lang}-${page}-${idx}`;

          for (let oi = 0; oi < 5; oi += 1) {
            const row = document.createElement('div');
            row.className = 'interview-drill__mcq-row';
            const inp = document.createElement('input');
            inp.type = 'radio';
            inp.name = groupName;
            inp.value = String(oi);
            inp.id = `${groupName}-${oi}`;
            inp.setAttribute('aria-label', `${u.mcqAriaChoice(oi)}: ${mq.options[oi]}`);
            const lab = document.createElement('label');
            lab.htmlFor = inp.id;
            lab.className = 'interview-drill__mcq-label';
            lab.textContent = mq.options[oi];
            inp.addEventListener('change', () => {
              if (!inp.checked) return;
              const ok = oi === mq.correctIndex;
              feedback.hidden = false;
              feedback.textContent = ok ? u.mcqCorrect : u.mcqWrong;
              feedback.className =
                'interview-drill__mcq-feedback' +
                (ok ? ' interview-drill__mcq-feedback--ok' : ' interview-drill__mcq-feedback--bad');
              if (el.live) el.live.textContent = ok ? u.mcqCorrect : u.mcqWrong;
              rg.querySelectorAll('input[type="radio"]').forEach((r) => {
                const lbl = r.nextElementSibling;
                if (!(lbl instanceof HTMLLabelElement)) return;
                lbl.classList.remove(
                  'interview-drill__mcq-label--picked',
                  'interview-drill__mcq-label--correct',
                  'interview-drill__mcq-label--wrong'
                );
              });
              lab.classList.add('interview-drill__mcq-label--picked');
              lab.classList.add(ok ? 'interview-drill__mcq-label--correct' : 'interview-drill__mcq-label--wrong');
              const correctLab = rg.querySelector(`label[for="${groupName}-${mq.correctIndex}"]`);
              if (correctLab && !ok) correctLab.classList.add('interview-drill__mcq-label--reveal');
            });
            row.appendChild(inp);
            row.appendChild(lab);
            rg.appendChild(row);
          }

          const ta = document.createElement('textarea');
          ta.className = 'interview-drill__notes';
          ta.rows = 2;
          ta.setAttribute('aria-label', `${u.notesPh} #${idx + 1}`);
          ta.placeholder = `${u.notesPh} (#${idx + 1})`;
          ta.value = localStorage.getItem(noteKey(idx)) || '';
          ta.addEventListener('input', () => {
            localStorage.setItem(noteKey(idx), ta.value);
          });

          li.appendChild(q);
          li.appendChild(rg);
          li.appendChild(feedback);
          li.appendChild(ta);
        } else {
          const text = questionAt(idx, track);
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
        }
        el.list.appendChild(li);
      }
    }

    if (el.live) el.live.textContent = '';
    if (el.next) el.next.disabled = page >= maxPage;
  }

  if (el.prev) el.prev.addEventListener('click', () => writePage(page - 1));
  if (el.next) el.next.addEventListener('click', () => writePage(page + 1));
  if (el.track) {
    el.track.addEventListener('change', () => {
      render();
      syncUrl();
    });
  }
  if (el.mode && MC) {
    el.mode.addEventListener('change', () => {
      render();
      syncUrl();
    });
  }
  if (el.specialty && MC) {
    el.specialty.addEventListener('change', () => {
      render();
      syncUrl();
    });
  }

  if (el.random) {
    el.random.addEventListener('click', () => {
      page = Math.floor(Math.random() * (maxPage + 1));
      syncUrl();
      render();
    });
  }

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
      const specLabel = MC ? specialtyById(specialtyId).label : '';
      if (MC) lines.push(`[${mode}] ${u.specialtyLabel}: ${specLabel}`);
      for (let k = 0; k < BATCH; k += 1) {
        const idx = page * BATCH + k;
        if (idx >= SIZE) break;
        if (mode === 'mcq' && MC) {
          const mq = mcqQuestion(specialtyId, idx);
          lines.push(`${idx + 1}. ${mq.stem}`);
          for (let oi = 0; oi < 5; oi += 1) {
            const mark = oi === mq.correctIndex ? ' ✓' : '';
            lines.push(`   ${String.fromCharCode(65 + oi)}. ${mq.options[oi]}${mark}`);
          }
        } else {
          lines.push(`${idx + 1}. ${questionAt(idx, track)}`);
        }
      }
      const clipText = lines.join('\n');
      try {
        await navigator.clipboard.writeText(clipText);
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
    page = readPageFromUrlOrStorage(false);
    track = readTrackFromUrlOrStorage();
    mode = readModeFromUrlOrStorage();
    specialtyId = readSpecialtyFromUrlOrStorage();
    if (track < 0 || track > 7) track = 0;
    if (el.track) el.track.value = String(track);
    if (el.mode && MC) el.mode.value = mode;
    if (el.specialty && MC) el.specialty.value = specialtyId;
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
  if (hadRandomParam || hasExplicitParams) syncUrl();
})();
