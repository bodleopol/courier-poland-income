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
      copied: 'Скопійовано'
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
      copied: 'Copied'
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
      copied: 'Copiado'
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
      copied: 'Скопировано'
    }
  };

  const ui = UI[lang] || UI.uk;

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
    difficulty: root.querySelector('[data-iv-difficulty]')
  };

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
  let track = 0;
  let mode = mcBank ? 'mcq' : 'open';
  let specialtyId = mcBank?.specialties?.[0]?.id || '';
  let topic = 'all';
  let scoreOk = 0;
  let scoreTotal = 0;

  const scoresMount = root.querySelector('[data-iv-scores]');
  const scoreEl = document.createElement('p');
  scoreEl.className = 'interview-drill__progress';
  scoreEl.style.margin = '0';
  if (scoresMount) scoresMount.appendChild(scoreEl);

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

  function renderLearn() {
    if (!el.learn) return;
    const pressure = el.difficulty?.value === 'pressure';
    const extra =
      pressure ?
        lang === 'en'
          ? '<p><strong>Cadence:</strong> answer in shorter paragraphs; surface risks explicitly.</p>'
          : lang === 'es'
            ? '<p><strong>Ritmo:</strong> responda en párrafos más cortos y nombre riesgos con claridad.</p>'
            : lang === 'ru'
              ? '<p><strong>Темп:</strong> короче абзацы, явно фиксируйте риски.</p>'
              : '<p><strong>Темп:</strong> відповідайте коротшими абзацами, фіксуйте ризики в кожній відповіді.</p>'
        : lang === 'en'
          ? '<p><strong>Cadence:</strong> allow fuller reasoning but keep a visible structure.</p>'
          : lang === 'es'
            ? '<p><strong>Ritmo:</strong> puede desarrollar más, pero mantenga una estructura visible.</p>'
            : lang === 'ru'
              ? '<p><strong>Темп:</strong> можно развернуть мысль, но держите структуру.</p>'
              : '<p><strong>Темп:</strong> дозвольте собі розгорнути мислення, але тримайте структуру.</p>';
    if (mode === 'mcq') {
      const head =
        lang === 'en'
          ? '<p><strong>MCQ:</strong> prefer answers with concrete actions, metrics, and rollback plans.</p>'
          : lang === 'es'
            ? '<p><strong>MCQ:</strong> busque acciones concretas, métricas y planes de reversión.</p>'
            : lang === 'ru'
              ? '<p><strong>MCQ:</strong> ищите вариант с действиями, метриками и планом отката.</p>'
              : '<p><strong>MCQ:</strong> шукайте варіант із діями, метриками й чітким планом відкату.</p>';
      el.learn.innerHTML = head + extra;
    } else {
      const head =
        lang === 'en'
          ? '<p><strong>Open:</strong> use STAR (Situation → Task → Action → Result) with numbers where possible.</p>'
          : lang === 'es'
            ? '<p><strong>Abierto:</strong> estructure con STAR (Situación → Tarea → Acción → Resultado) y cifras si puede.</p>'
            : lang === 'ru'
              ? '<p><strong>Open:</strong> структура STAR — ситуация, задача, действие, результат с цифрами, где уместно.</p>'
              : '<p><strong>Open:</strong> структура STAR — ситуація, задача, дія, результат з цифрами, де можливо.</p>';
      el.learn.innerHTML = head + extra;
    }
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
      turn.className = 'iv-turn';

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
      host.className = 'iv-bubble iv-bubble--host';
      const hostLabel = document.createElement('p');
      hostLabel.style.margin = '0 0 6px';
      hostLabel.style.fontSize = '0.72rem';
      hostLabel.style.fontWeight = '800';
      hostLabel.style.letterSpacing = '0.08em';
      hostLabel.style.textTransform = 'uppercase';
      hostLabel.style.color = 'var(--muted)';
      hostLabel.textContent = ui.interviewer;
      const q = document.createElement('p');
      q.textContent = text;
      host.append(hostLabel, q);

      if (qObj) {
        const box = document.createElement('div');
        box.className = 'interview-drill__mcq';
        const fb = document.createElement('p');
        fb.className = 'interview-drill__mcq-feedback';
        fb.hidden = true;
        qObj.options.forEach((opt, oi) => {
          const row = document.createElement('label');
          row.className = 'interview-drill__mcq-row';
          row.innerHTML = `<input type="radio" name="q-${idx}"> ${esc(opt)}`;
          row.querySelector('input').addEventListener('change', () => {
            scoreTotal += 1;
            if (oi === qObj.correctPos) scoreOk += 1;
            scoreEl.textContent = `${ui.score}: ${scoreOk}/${scoreTotal}`;
            updateMeter();
            fb.hidden = false;
            fb.textContent = oi === qObj.correctPos ? `✅ ${ui.feedbackOk}` : `❌ ${ui.feedbackBad}`;
          });
          box.appendChild(row);
        });
        host.appendChild(box);
        host.appendChild(fb);
      }

      const you = document.createElement('div');
      you.className = 'iv-bubble iv-bubble--you';
      const youLabel = document.createElement('p');
      youLabel.style.margin = '0 0 6px';
      youLabel.style.fontSize = '0.72rem';
      youLabel.style.fontWeight = '800';
      youLabel.style.letterSpacing = '0.08em';
      youLabel.style.textTransform = 'uppercase';
      youLabel.style.color = 'var(--muted)';
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
      empty.className = 'iv-bubble iv-bubble--host';
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
    renderLearn();
    el.feed.scrollTop = 0;
  }

  el.prev?.addEventListener('click', () => {
    page = Math.max(0, page - 1);
    render();
  });
  el.next?.addEventListener('click', () => {
    page = Math.min(maxPage, page + 1);
    render();
  });
  el.jumpBtn?.addEventListener('click', () => {
    const v = Number(el.jump?.value);
    if (v >= 1 && v <= maxPage + 1) {
      page = v - 1;
      render();
    }
  });
  el.random?.addEventListener('click', () => {
    page = Math.floor(Math.random() * (maxPage + 1));
    render();
  });
  topicSelect.addEventListener('change', () => {
    topic = topicSelect.value;
    render();
  });
  el.difficulty?.addEventListener('change', renderLearn);

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
      el.prev.click();
    }
    if (e.key === 'ArrowRight' && el.next && !el.next.disabled) {
      e.preventDefault();
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

  render();
})();
