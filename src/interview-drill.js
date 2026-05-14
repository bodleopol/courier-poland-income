(function () {
  'use strict';

  const root = document.querySelector('[data-interview-drill]');
  if (!root) return;

  const lang = document.documentElement.getAttribute('lang') || 'uk';
  const mcBank = window.INTERVIEW_MCQ?.[lang] || null;
  const openBank = window.INTERVIEW_BANK?.[lang] || null;
  if (!mcBank && !openBank) return;

  const SIZE = window.INTERVIEW_BANK_SIZE || 10000;
  const BATCH = window.INTERVIEW_BATCH_SIZE || 4;
  const maxPage = Math.floor((SIZE - 1) / BATCH);

  const FLOW_KEY = `iv-flow-max-${lang}`;
  const PACK_VISIT_KEY = `iv-pack-visits-${lang}`;

  const UI = {
    uk: {
      notes: 'Нотатки до відповіді',
      empty: 'За поточним фільтром питань немає. Спробуйте іншу тему або випадковий пакет.',
      score: 'Результат тесту',
      all: 'Усі теми',
      comm: 'Комунікація',
      exec: 'Виконання',
      tech: 'Техніка/якість',
      pack: 'Пакет',
      interviewer: 'Інтервʼюер',
      you: 'Ваш чернетковий відповідь',
      feedbackOk: 'Вірно.',
      feedbackBad: 'Еталонна відповідь позначена нижче.',
      copy: 'Копіювати пакет',
      copied: 'Скопійовано',
      focusEnter: 'Режим фокусу',
      focusExit: 'Вийти з фокусу',
      livePack: 'Пакет {a} з {b}',
      sessionLive: 'Симуляція активна',
      streak: 'Серія · {n} пакетів',
      mcqCoachOk: 'Сильний вибір: дії, власники ризику й план відкату узгоджені.',
      mcqCoachMiss: 'Порівняйте з підсвіченим еталоном і сформулюйте рішення в одному реченні.',
      nudge: [
        'Прогрів: дихайте рівно — перша відповідь «на холодну» завжди найважча.',
        'Набір темпу: тримайте структуру STAR і називайте метрики, навіть якщо це приблизні.',
        'Розгін: ускладнюйте відповідь — ризики, відкат, стейкхолдери.',
        'Закріплення: ви вже пройшли довгий шлях банку — залишайтеся конкретними до кінця.'
      ],
      coachMcq: 'MCQ',
      coachOpen: 'Відкриті',
      coachCadence: 'Темп',
      coachHintMcq: 'Обирайте варіант із діями, метриками й планом відкату.',
      coachHintOpen: 'Структура STAR: ситуація → задача → дія → результат (з цифрами, де можливо).',
      coachHintSteady: 'Можна розгорнути думку, але тримайте видиму структуру абзаців.',
      coachHintPressure: 'Коротші абзаци; явно фіксуйте ризики в кожній відповіді.',
      hintNext: 'Далі: натисніть «Наступні 4», коли закінчите цей блок.'
    },
    en: {
      notes: 'Draft notes',
      empty: 'No questions for this filter. Try another topic or a random pack.',
      score: 'MCQ score',
      all: 'All topics',
      comm: 'Communication',
      exec: 'Execution',
      tech: 'Technical quality',
      pack: 'Pack',
      interviewer: 'Interviewer',
      you: 'Your draft',
      feedbackOk: 'Correct.',
      feedbackBad: 'Benchmark answer is highlighted.',
      copy: 'Copy pack link',
      copied: 'Copied',
      focusEnter: 'Focus mode',
      focusExit: 'Exit focus',
      livePack: 'Pack {a} of {b}',
      sessionLive: 'Simulation live',
      streak: 'Run streak · {n} packs',
      mcqCoachOk: 'Strong pick — actions, owners, and rollback read as one story.',
      mcqCoachMiss: 'Compare with the highlighted teaching answer, then restate the decision in one sentence.',
      nudge: [
        'Warm-up: breathe steady — the first answer is the hardest; clarity beats polish.',
        'Build cadence: keep STAR visible and name metrics, even when they are directional.',
        'Stretch: add rollback paths, stakeholders, and explicit tradeoffs.',
        'Lock-in: you are deep in the bank — stay specific and finish strong.'
      ],
      coachMcq: 'MCQ',
      coachOpen: 'Open',
      coachCadence: 'Cadence',
      coachHintMcq: 'Favor options with concrete actions, metrics, and rollback plans.',
      coachHintOpen: 'Use STAR (Situation → Task → Action → Result) with numbers where possible.',
      coachHintSteady: 'Allow fuller reasoning but keep a visible outline.',
      coachHintPressure: 'Answer in shorter paragraphs; surface risks explicitly.',
      hintNext: 'Next: tap “Next 4” when you finish this block.'
    },
    es: {
      notes: 'Notas de respuesta',
      empty: 'No hay preguntas con este filtro. Prueba otro tema o un paquete aleatorio.',
      score: 'Resultado MCQ',
      all: 'Todos los temas',
      comm: 'Comunicación',
      exec: 'Ejecución',
      tech: 'Calidad técnica',
      pack: 'Paquete',
      interviewer: 'Entrevistador',
      you: 'Tu borrador',
      feedbackOk: 'Correcto.',
      feedbackBad: 'La respuesta de referencia queda marcada.',
      copy: 'Copiar enlace del paquete',
      copied: 'Copiado',
      focusEnter: 'Modo foco',
      focusExit: 'Salir del foco',
      livePack: 'Paquete {a} de {b}',
      sessionLive: 'Simulación activa',
      streak: 'Racha · {n} lotes',
      mcqCoachOk: 'Buena elección: acciones, responsables y reversión alineados.',
      mcqCoachMiss: 'Contraste con la respuesta modelo resaltada y cierre en una frase.',
      nudge: [
        'Calentamiento: respire con calma — la primera respuesta cuesta más; priorice claridad.',
        'Ritmo: mantenga STAR visible y cite métricas, aunque sean orientativas.',
        'Extensión: sume planes de reversión, partes y tradeoffs explícitos.',
        'Cierre: ya recorrió mucho banco — sea concreto hasta el final.'
      ],
      coachMcq: 'MCQ',
      coachOpen: 'Abierto',
      coachCadence: 'Ritmo',
      coachHintMcq: 'Busque acciones concretas, métricas y planes de reversión.',
      coachHintOpen: 'Estructure con STAR (Situación → Tarea → Acción → Resultado) y cifras si puede.',
      coachHintSteady: 'Puede desarrollar más, pero mantenga una estructura visible.',
      coachHintPressure: 'Responda en párrafos más cortos y nombre riesgos con claridad.',
      hintNext: 'Siguiente: pulse «Siguiente (4)» al cerrar este bloque.'
    },
    ru: {
      notes: 'Заметки к ответу',
      empty: 'Нет вопросов по текущему фильтру. Попробуйте другую тему или случайный пакет.',
      score: 'Результат MCQ',
      all: 'Все темы',
      comm: 'Коммуникация',
      exec: 'Исполнение',
      tech: 'Техника/качество',
      pack: 'Пакет',
      interviewer: 'Интервьюер',
      you: 'Ваш черновик',
      feedbackOk: 'Верно.',
      feedbackBad: 'Эталонный ответ отмечен ниже.',
      copy: 'Копировать ссылку на пакет',
      copied: 'Скопировано',
      focusEnter: 'Режим фокуса',
      focusExit: 'Выйти из фокуса',
      livePack: 'Пакет {a} из {b}',
      sessionLive: 'Симуляция активна',
      streak: 'Серия · {n} пакетов',
      mcqCoachOk: 'Сильный выбор: действия, владельцы рисков и откат согласованы.',
      mcqCoachMiss: 'Сравните с подсвеченным эталоном и сформулируйте решение в одном предложении.',
      nudge: [
        'Разминка: дышите ровно — первый ответ самый трудный; ясность важнее «лака».',
        'Набор темпа: держите STAR на виду и называйте метрики, пусть даже ориентиры.',
        'Ускорение: добавляйте откат, стейкхолдеров и явные компромиссы.',
        'Финиш: вы уже глубоко в банке — оставайтесь конкретными до конца.'
      ],
      coachMcq: 'MCQ',
      coachOpen: 'Открытые',
      coachCadence: 'Темп',
      coachHintMcq: 'Ищите вариант с действиями, метриками и планом отката.',
      coachHintOpen: 'Структура STAR — ситуация, задача, действие, результат с цифрами, где уместно.',
      coachHintSteady: 'Можно развернуть мысль, но держите структуру.',
      coachHintPressure: 'Короче абзацы, явно фиксируйте риски.',
      hintNext: 'Далее: нажмите «Следующие 4», когда закончите блок.'
    }
  };

  const ui = UI[lang] || UI.uk;

  if (mcBank) {
    root.querySelector('[data-iv-mode-wrap]')?.removeAttribute('hidden');
    root.querySelector('[data-iv-specialty-wrap]')?.removeAttribute('hidden');
  }

  const el = {
    learn: document.querySelector('[data-iv-learn]'),
    track: root.querySelector('[data-iv-track]'),
    mode: root.querySelector('[data-iv-mode]'),
    specialty: root.querySelector('[data-iv-specialty]'),
    prev: root.querySelector('[data-iv-prev]'),
    next: root.querySelector('[data-iv-next]'),
    jump: root.querySelector('[data-iv-jump]'),
    jumpBtn: root.querySelector('[data-iv-jump-btn]'),
    random: root.querySelector('[data-iv-random]'),
    prog: root.querySelector('[data-iv-progress]'),
    feed: root.querySelector('[data-iv-feed]'),
    copy: root.querySelector('[data-iv-copy]'),
    meterFill: root.querySelector('[data-iv-meter-fill]'),
    difficulty: root.querySelector('[data-iv-difficulty]'),
    context: root.querySelector('[data-iv-context]'),
    live: root.querySelector('[data-iv-live]'),
    packFill: root.querySelector('[data-iv-pack-fill]'),
    focusToggle: root.querySelector('[data-iv-focus-toggle]'),
    diffSnap: root.querySelector('[data-iv-diff-snap]'),
    diffBadge: root.querySelector('[data-iv-diff-badge]'),
    sessionStatus: root.querySelector('[data-iv-session-status]'),
    streak: root.querySelector('[data-iv-streak]'),
    hint: root.querySelector('[data-iv-hint]')
  };

  const stageDots = root.querySelectorAll('[data-iv-stage-dot]');
  const flowSteps = root.querySelectorAll('[data-iv-flow-step]');

  const topicSelect = document.createElement('select');
  topicSelect.className = 'interview-drill__select';
  [
    ['all', ui.all],
    ['comm', ui.comm],
    ['exec', ui.exec],
    ['tech', ui.tech]
  ].forEach(([v, t]) => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = t;
    topicSelect.appendChild(o);
  });
  const topicWrap = document.createElement('div');
  topicWrap.className = 'interview-drill__field';
  topicWrap.innerHTML = '<label class="interview-drill__label">Фільтр теми</label>';
  topicWrap.querySelector('label').textContent =
    lang === 'en'
      ? 'Topic filter'
      : lang === 'es'
        ? 'Filtro de tema'
        : lang === 'ru'
          ? 'Фильтр темы'
          : 'Фільтр теми';
  topicWrap.appendChild(topicSelect);
  root.querySelector('.interview-drill__toolbar')?.appendChild(topicWrap);

  let page = Math.max(0, (Number(new URLSearchParams(location.search).get('p')) || 1) - 1);
  const entryPage = page;
  let track = 0;
  let mode = mcBank ? 'mcq' : 'open';
  let specialtyId = mcBank?.specialties?.[0]?.id || '';
  let topic = 'all';
  let scoreOk = 0;
  let scoreTotal = 0;
  let lastAnnouncedPage = -1;
  const answeredMcq = new Set();

  function loadFlowMax() {
    const v = Number(sessionStorage.getItem(FLOW_KEY));
    return Number.isFinite(v) ? Math.max(0, Math.min(4, v)) : 0;
  }

  let flowMax = loadFlowMax();

  function saveFlowMax() {
    sessionStorage.setItem(FLOW_KEY, String(flowMax));
  }

  function touchFlow(n) {
    const t = Math.min(4, Math.max(0, n));
    const next = Math.max(flowMax, t);
    if (next !== flowMax) {
      flowMax = next;
      saveFlowMax();
      updateFlowVisual();
    }
  }

  function updateFlowVisual() {
    flowSteps.forEach((node, i) => {
      node.classList.toggle('is-done', i < flowMax);
      node.classList.toggle('is-active', i === flowMax);
      node.classList.toggle('is-upcoming', i > flowMax);
    });
  }

  const scoresMount = root.querySelector('[data-iv-scores]');
  const scoreEl = document.createElement('p');
  scoreEl.className = 'interview-drill__progress iv-score-chip';
  scoreEl.style.margin = '0';
  if (scoresMount) scoresMount.appendChild(scoreEl);

  if (el.focusToggle) {
    el.focusToggle.textContent = ui.focusEnter;
    el.focusToggle.addEventListener('click', () => {
      const on = root.classList.toggle('iv-lab--focus');
      el.focusToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      el.focusToggle.textContent = on ? ui.focusExit : ui.focusEnter;
    });
  }

  root.addEventListener(
    'change',
    (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('.interview-drill__toolbar')) touchFlow(1);
    },
    true
  );

  root.addEventListener(
    'input',
    (e) => {
      const t = e.target;
      if (t instanceof HTMLTextAreaElement && t.closest('[data-iv-feed]')) {
        touchFlow(2);
        if (mode !== 'mcq' && t.value.trim().length >= 24) touchFlow(3);
      }
    },
    true
  );

  el.feed?.addEventListener('focusin', () => {
    touchFlow(1);
  });

  el.feed?.addEventListener('change', (e) => {
    const t = e.target;
    if (t instanceof HTMLInputElement && t.type === 'radio' && t.closest('.interview-drill__mcq--stack')) {
      touchFlow(2);
    }
  });

  function notePackVisit() {
    if (!el.streak) return;
    let arr = [];
    try {
      arr = JSON.parse(sessionStorage.getItem(PACK_VISIT_KEY) || '[]');
    } catch {
      arr = [];
    }
    if (!Array.isArray(arr)) arr = [];
    const k = `${page}`;
    if (!arr.includes(k)) arr.push(k);
    sessionStorage.setItem(PACK_VISIT_KEY, JSON.stringify(arr.slice(-80)));
    const n = arr.length;
    if (n >= 2) {
      el.streak.textContent = ui.streak.replace('{n}', String(n));
      el.streak.removeAttribute('hidden');
    } else {
      el.streak.setAttribute('hidden', '');
    }
  }

  function updateBadgesAndStatus() {
    if (el.diffBadge && el.difficulty) {
      const opt = el.difficulty.selectedOptions[0];
      el.diffBadge.textContent = opt ? opt.textContent.trim() : '';
    }
    if (el.sessionStatus) {
      el.sessionStatus.textContent = ui.sessionLive;
    }
  }

  function mix32(a, b, c) {
    let x = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1442695041)) >>> 0;
    x = (x ^ (x >>> 13)) >>> 0;
    x = Math.imul(x, 1274126177) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  }

  function mcqQuestion(specId, idx) {
    const si = Math.max(0, mcBank.specialties.findIndex((s) => s.id === specId));
    const row = mcBank.catalog[mix32(idx, si, 0) % mcBank.catalog.length];
    const stem = row.stem.replace(/\{s\}/g, mcBank.specialties[si]?.label || '');
    const correct = row.correct.replace(/\{s\}/g, mcBank.specialties[si]?.label || '');
    const wrongs = row.wrongs.map((w) => w.replace(/\{s\}/g, mcBank.specialties[si]?.label || '')).slice(0, 4);
    const correctPos = mix32(idx, si, 999) % 5;
    const options = [];
    for (let i = 0, j = 0; i < 5; i += 1) options.push(i === correctPos ? correct : wrongs[j++]);
    return { stem, correctPos, options };
  }

  function openQuestion(idx, roleShift) {
    if (!openBank) return mcqQuestion(specialtyId, idx).stem;
    const R = openBank.roles.length;
    const nSit = openBank.orgs.length * openBank.stressors.length;
    const C = openBank.competencies.length;
    const L = openBank.lenses.length;
    let t = idx;
    const ir0 = t % R;
    t = Math.floor(t / R);
    const isit = t % nSit;
    t = Math.floor(t / nSit);
    const ic = t % C;
    t = Math.floor(t / C);
    const il = t % L;
    const ir = (ir0 + roleShift) % R;
    const o = openBank.orgs[isit % openBank.orgs.length];
    const z = openBank.stressors[Math.floor(isit / openBank.orgs.length) % openBank.stressors.length];
    const situation = openBank.situationTpl.replace('{org}', o).replace('{stress}', z);
    return openBank.lenses[il]
      .replace(/\{role\}/g, openBank.roles[ir])
      .replace(/\{situation\}/g, situation)
      .replace(/\{competency\}/g, openBank.competencies[ic])
      .replace(/\{horizon\}/g, openBank.horizons[idx % openBank.horizons.length]);
  }

  function passTopic(text) {
    const low = text.toLowerCase();
    if (topic === 'all') return true;
    const map = {
      comm: ['stakeholder', 'комун', 'communication', 'конфлікт', 'client', 'comunic'],
      exec: ['roadmap', 'delivery', 'backlog', 'пріоритет', 'deadline', 'prioridad'],
      tech: ['incident', 'security', 'latency', 'slo', 'test', 'quality', 'calidad']
    };
    return map[topic].some((k) => low.includes(k));
  }

  function updateMeter() {
    if (!el.meterFill) return;
    const pct = scoreTotal ? Math.round((100 * scoreOk) / scoreTotal) : 0;
    el.meterFill.style.width = `${pct}%`;
  }

  function sessionPhase() {
    const ratio = maxPage > 0 ? page / maxPage : 0;
    if (ratio < 0.12) return 0;
    if (ratio < 0.42) return 1;
    if (ratio < 0.74) return 2;
    return 3;
  }

  function updateJourneyChrome() {
    const phase = sessionPhase();
    stageDots.forEach((dot, i) => {
      dot.classList.toggle('iv-dot--active', i === phase);
      dot.classList.toggle('iv-dot--done', i < phase);
    });
    if (el.packFill) {
      const pct = maxPage >= 0 ? ((page + 1) / (maxPage + 1)) * 100 : 0;
      el.packFill.style.width = `${pct}%`;
    }
    if (el.context) {
      const line = ui.nudge[phase] || '';
      el.context.textContent = line;
      if (line) el.context.removeAttribute('hidden');
      else el.context.setAttribute('hidden', '');
    }
  }

  function updateDiffSnap() {
    if (!el.diffSnap || !el.difficulty) return;
    const pressure = el.difficulty.value === 'pressure';
    el.diffSnap.classList.toggle('iv-diff-snap--pressure', pressure);
    el.diffSnap.classList.toggle('iv-diff-snap--steady', !pressure);
    updateBadgesAndStatus();
  }

  function announcePackIfNeeded() {
    if (!el.live || page === lastAnnouncedPage) return;
    lastAnnouncedPage = page;
    el.live.textContent = ui.livePack.replace('{a}', String(page + 1)).replace('{b}', String(maxPage + 1));
  }

  function renderLearn() {
    if (!el.learn) return;
    const pressure = el.difficulty?.value === 'pressure';
    const modeKey = mode === 'mcq' ? ui.coachMcq : ui.coachOpen;
    const modeBody = mode === 'mcq' ? ui.coachHintMcq : ui.coachHintOpen;
    const cadenceBody = pressure ? ui.coachHintPressure : ui.coachHintSteady;
    el.learn.innerHTML = `
      <div class="iv-coach-grid">
        <div class="iv-coach-card">
          <p class="iv-coach-card__eyebrow">${modeKey}</p>
          <p class="iv-coach-card__body">${modeBody}</p>
        </div>
        <div class="iv-coach-card iv-coach-card--accent">
          <p class="iv-coach-card__eyebrow">${ui.coachCadence}</p>
          <p class="iv-coach-card__body">${cadenceBody}</p>
        </div>
      </div>`;
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render() {
    if (!el.feed) return;
    for (const key of [...answeredMcq]) {
      if (!key.startsWith(`${page}-`)) answeredMcq.delete(key);
    }
    el.feed.innerHTML = '';
    let visible = 0;
    for (let k = 0; k < BATCH; k += 1) {
      const idx = page * BATCH + k;
      if (idx >= SIZE) break;
      const qObj = mode === 'mcq' ? mcqQuestion(specialtyId, idx) : null;
      const text = qObj ? qObj.stem : openQuestion(idx, track);
      if (!passTopic(text)) continue;
      visible += 1;

      const turn = document.createElement('article');
      turn.className = 'iv-turn iv-turn--card';

      const meta = document.createElement('div');
      meta.className = 'iv-turn__meta';
      const badge = document.createElement('span');
      badge.className = 'iv-badge';
      badge.textContent = mode === 'mcq' ? 'MCQ' : 'Open';
      const packLabel = document.createElement('span');
      packLabel.textContent = `${ui.pack} · ${idx + 1}`;
      meta.append(badge, packLabel);
      turn.appendChild(meta);

      const host = document.createElement('div');
      host.className = 'iv-bubble iv-bubble--host iv-q-card';
      const hostLabel = document.createElement('p');
      hostLabel.className = 'iv-bubble__label';
      hostLabel.textContent = ui.interviewer;
      const q = document.createElement('p');
      q.className = 'iv-q-card__q';
      q.textContent = text;
      host.append(hostLabel, q);

      if (qObj) {
        const box = document.createElement('div');
        box.className = 'interview-drill__mcq interview-drill__mcq--stack';
        box.setAttribute('role', 'radiogroup');
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const mcqKey = `${page}-${idx}`;
        const fb = document.createElement('div');
        fb.className = 'iv-mcq-feedback-block';
        fb.hidden = true;

        qObj.options.forEach((opt, oi) => {
          const id = `iv-mcq-${idx}-${oi}`;
          const lab = document.createElement('label');
          lab.className = 'interview-drill__mcq-opt';
          lab.setAttribute('for', id);
          lab.innerHTML = `<span class="interview-drill__mcq-key" aria-hidden="true">${letters[oi]}</span><span class="interview-drill__mcq-txt">${esc(opt)}</span><input class="interview-drill__mcq-input" type="radio" name="q-${idx}" id="${id}">`;
          const input = lab.querySelector('input');
          input.addEventListener('change', () => {
            if (answeredMcq.has(mcqKey)) return;
            touchFlow(1);
            touchFlow(2);
            answeredMcq.add(mcqKey);
            const ok = oi === qObj.correctPos;
            scoreTotal += 1;
            if (ok) scoreOk += 1;
            scoreEl.textContent = `${ui.score}: ${scoreOk}/${scoreTotal}`;
            updateMeter();
            fb.hidden = false;
            fb.classList.toggle('iv-mcq-feedback-block--ok', ok);
            fb.classList.toggle('iv-mcq-feedback-block--bad', !ok);
            fb.innerHTML = `<p class="iv-mcq-feedback-block__title">${ok ? `✅ ${ui.feedbackOk}` : `❌ ${ui.feedbackBad}`}</p><p class="iv-mcq-feedback-block__coach">${ok ? ui.mcqCoachOk : ui.mcqCoachMiss}</p>`;
            touchFlow(3);
            box.querySelectorAll('.interview-drill__mcq-opt').forEach((elLab, j) => {
              elLab.classList.add('interview-drill__mcq-opt--locked');
              const inp = elLab.querySelector('input');
              if (inp) inp.disabled = true;
              if (j === oi) {
                elLab.classList.add('interview-drill__mcq-opt--picked');
                elLab.classList.add(ok ? 'interview-drill__mcq-opt--correct' : 'interview-drill__mcq-opt--wrong');
              }
              if (j === qObj.correctPos && !ok) elLab.classList.add('interview-drill__mcq-opt--reveal');
            });
          });
          box.appendChild(lab);
        });
        host.appendChild(box);
        host.appendChild(fb);
      }

      const you = document.createElement('div');
      you.className = 'iv-bubble iv-bubble--you iv-answer-card';
      const youLabel = document.createElement('p');
      youLabel.className = 'iv-bubble__label';
      youLabel.textContent = ui.you;
      const ta = document.createElement('textarea');
      ta.className = 'interview-drill__notes';
      ta.rows = 3;
      ta.placeholder = `${ui.notes} · ${idx + 1}`;
      const key = `iv-note-${lang}-${mode}-${specialtyId}-${idx}`;
      ta.value = localStorage.getItem(key) || '';
      ta.addEventListener('input', () => localStorage.setItem(key, ta.value));
      you.append(youLabel, ta);

      turn.append(host, you);
      el.feed.appendChild(turn);
    }

    if (!visible) {
      const empty = document.createElement('p');
      empty.className = 'iv-bubble iv-bubble--host iv-bubble--empty';
      empty.style.margin = '0';
      empty.textContent = ui.empty;
      el.feed.appendChild(empty);
    }

    if (el.prog) el.prog.textContent = `${ui.pack} ${page + 1} / ${maxPage + 1}`;
    if (el.jump) el.jump.value = String(page + 1);
    if (el.prev) el.prev.disabled = page <= 0;
    if (el.next) el.next.disabled = page >= maxPage;
    scoreEl.textContent = scoreTotal ? `${ui.score}: ${scoreOk}/${scoreTotal}` : '';
    updateMeter();
    updateJourneyChrome();
    updateDiffSnap();
    renderLearn();
    announcePackIfNeeded();
    notePackVisit();
    updateBadgesAndStatus();
    updateDockHint();
    el.feed.scrollTop = 0;
  }

  function updateDockHint() {
    if (!el.hint || !el.next) return;
    const base =
      lang === 'en'
        ? 'Tip: <kbd>←</kbd> / <kbd>→</kbd> switch batches when focus is not in a field.'
        : lang === 'es'
          ? 'Consejo: <kbd>←</kbd> / <kbd>→</kbd> cambian de lote cuando el foco no está en un campo.'
          : lang === 'ru'
            ? 'Подсказка: <kbd>←</kbd> / <kbd>→</kbd> переключают пакеты, когда фокус не в поле ввода.'
            : 'Підказка: стрілки <kbd>←</kbd> / <kbd>→</kbd> перемикають пакети, коли фокус не в полі вводу.';
    const extra = !el.next.disabled ? ` ${ui.hintNext}` : '';
    el.hint.innerHTML = base + extra;
  }

  function advancePack() {
    if (page !== entryPage) touchFlow(4);
  }

  el.prev?.addEventListener('click', () => {
    touchFlow(1);
    page = Math.max(0, page - 1);
    advancePack();
    render();
  });
  el.next?.addEventListener('click', () => {
    touchFlow(1);
    page = Math.min(maxPage, page + 1);
    advancePack();
    render();
  });
  el.jumpBtn?.addEventListener('click', () => {
    touchFlow(1);
    const v = Number(el.jump?.value);
    if (v >= 1 && v <= maxPage + 1) {
      page = v - 1;
      advancePack();
      render();
    }
  });
  el.random?.addEventListener('click', () => {
    touchFlow(1);
    page = Math.floor(Math.random() * (maxPage + 1));
    advancePack();
    render();
  });
  topicSelect.addEventListener('change', () => {
    topic = topicSelect.value;
    render();
  });
  el.difficulty?.addEventListener('change', () => {
    updateDiffSnap();
    renderLearn();
  });

  el.copy?.addEventListener('click', async () => {
    const u = new URL(location.href);
    u.searchParams.set('p', String(page + 1));
    await navigator.clipboard.writeText(u.toString());
    el.copy.textContent = ui.copied;
    setTimeout(() => {
      el.copy.textContent = ui.copy;
    }, 1200);
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const typing =
      t instanceof HTMLInputElement ||
      t instanceof HTMLTextAreaElement ||
      t instanceof HTMLSelectElement;
    if (typing) return;
    if (e.key === 'ArrowLeft' && el.prev && !el.prev.disabled) {
      e.preventDefault();
      touchFlow(1);
      el.prev.click();
    }
    if (e.key === 'ArrowRight' && el.next && !el.next.disabled) {
      e.preventDefault();
      touchFlow(1);
      el.next.click();
    }
  });

  if (el.track) {
    el.track.innerHTML = '';
    for (let i = 0; i < 8; i += 1) {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent =
        lang === 'en'
          ? `Role shift +${i}`
          : lang === 'es'
            ? `Desplazamiento de rol +${i}`
            : lang === 'ru'
              ? `Сдвиг роли +${i}`
              : `Зсув +${i}`;
      el.track.appendChild(o);
    }
    el.track.addEventListener('change', () => {
      track = Number(el.track.value) || 0;
      render();
    });
  }

  if (mcBank && el.mode) {
    el.mode.innerHTML = '<option value="mcq">MCQ</option><option value="open">Open</option>';
    el.mode.addEventListener('change', () => {
      mode = el.mode.value;
      render();
    });
  }

  if (mcBank && el.specialty) {
    el.specialty.innerHTML = mcBank.specialties.map((s) => `<option value="${s.id}">${s.label}</option>`).join('');
    el.specialty.addEventListener('change', () => {
      specialtyId = el.specialty.value;
      render();
    });
  }

  if (el.random) {
    el.random.textContent =
      lang === 'en'
        ? 'Random pack'
        : lang === 'es'
          ? 'Paquete aleatorio'
          : lang === 'ru'
            ? 'Случайный пакет'
            : 'Випадковий пакет';
  }

  updateDiffSnap();
  updateFlowVisual();
  lastAnnouncedPage = -1;
  render();
})();
