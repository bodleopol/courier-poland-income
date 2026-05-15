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
      copied: 'Скопійовано',
      focusEnter: 'Режим фокусу',
      focusExit: 'Вийти з фокусу',
      livePack: 'Пакет {a} з {b}',
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
      coachHintPressure: 'Коротші абзаци; явно фіксуйте ризики в кожній відповіді.'
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
      coachHintPressure: 'Answer in shorter paragraphs; surface risks explicitly.'
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
      coachHintPressure: 'Responda en párrafos más cortos y nombre riesgos con claridad.'
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
      coachHintPressure: 'Короче абзацы, явно фиксируйте риски.'
    }
  };

  const ui = UI[lang] || UI.uk;

  const CALLING_UI={
    uk:{title:'Лабораторія покликання',start:'Почати тест',practice:'Практика співбесіди',quick:'Швидкий тест · 12',deep:'Глибокий тест · 36',privacy:'Відповіді зберігаються лише локально в браузері.'},
    en:{title:'Calling Lab',start:'Start test',practice:'Practice interview',quick:'Quick test · 12',deep:'Deep test · 36',privacy:'Answers are stored locally in your browser only.'},
    es:{title:'Laboratorio de vocación',start:'Iniciar test',practice:'Practicar entrevista',quick:'Test rápido · 12',deep:'Test profundo · 36',privacy:'Las respuestas se guardan solo en tu navegador.'},
    ru:{title:'Лаборатория призвания',start:'Начать тест',practice:'Практика собеседования',quick:'Быстрый тест · 12',deep:'Глубокий тест · 36',privacy:'Ответы хранятся только локально в браузере.'}
  };
  const cu=CALLING_UI[lang]||CALLING_UI.en;
  const dims=['autonomy','stability','creativity','analysis','leadership','operations','communication','technicalDepth','risk','impact','income','learning'];
  const qset=[
   ['I prefer setting my own process', 'autonomy',2],['I want predictable routines','stability',2],['I enjoy ambiguous problems','creativity',2],['I like breaking problems into models','analysis',2],['I naturally coordinate people','leadership',2],['I optimize systems and execution','operations',2],['I gain energy from communication','communication',2],['I enjoy deep technical work','technicalDepth',2],['I tolerate uncertainty for upside','risk',2],['I choose purpose over status','impact',2],['Compensation strongly drives my choices','income',2],['I learn new domains quickly','learning',2]
  ];
  const shell=document.createElement('section'); shell.className='calling-lab-shell';
  shell.innerHTML=`<h2>${cu.title}</h2><p>10–15 minutes. Reflection tool for work/life direction.</p><div class="calling-lab-actions"><button class="btn" data-c-start>${cu.start}</button><button class="btn secondary" data-c-practice>${cu.practice}</button></div><p><strong>Modes:</strong> ${cu.quick} · ${cu.deep} · Interview practice · Career stress test · Founder/operator test</p><p>${cu.privacy}</p><div data-c-body hidden></div>`;
  root.before(shell);
  const body=shell.querySelector('[data-c-body]'); let qi=0,total=12,score={}; dims.forEach(d=>score[d]=0);
  shell.querySelector('[data-c-practice]').addEventListener('click',()=>root.scrollIntoView({behavior:'smooth'}));
  function renderQ(){ const qq=qset[qi%qset.length]; const pct=Math.round((qi/total)*100); body.innerHTML=`<p>Question ${qi+1}/${total}</p><div class='calling-lab-progress'><span style='width:${pct}%'></span></div><h3>${qq[0]}</h3><div class='calling-lab-answers'><button class='btn secondary calling-lab-answer' data-v='0'>Not me</button><button class='btn secondary calling-lab-answer' data-v='1'>Sometimes</button><button class='btn calling-lab-answer' data-v='2'>Strongly me</button></div><p><button class='btn secondary' data-back>Back</button> <button class='btn secondary' data-restart>Restart</button></p>`;
    body.querySelectorAll('[data-v]').forEach(b=>b.addEventListener('click',()=>{score[qq[1]] += Number(b.dataset.v);qi++; localStorage.setItem('calling-lab-state',JSON.stringify({qi,score,total})); qi>=total?renderResult():renderQ();}));
    body.querySelector('[data-back]').onclick=()=>{if(qi>0)qi--;renderQ();}; body.querySelector('[data-restart]').onclick=()=>{qi=0;dims.forEach(d=>score[d]=0);renderQ();};
  }
  function renderResult(){ const top=Object.entries(score).sort((a,b)=>b[1]-a[1]); const txt=`Main archetype: ${top[0][0]}\nSecondary: ${top[1][0]}\nStrengths: ${top.slice(0,4).map(x=>x[0]).join(', ')}`; body.innerHTML=`<h3>Results</h3><p>${txt.replace(/\n/g,'<br>')}</p><p>7-day action plan: 1) journal daily work energy 2) test one role experiment 3) review with mentor.</p><div class='calling-lab-actions'><button class='btn' data-copy>Copy result</button><button class='btn secondary' data-share>Share result</button><button class='btn secondary' data-restart>Restart</button></div>`; body.querySelector('[data-copy]').onclick=()=>navigator.clipboard?.writeText(txt); body.querySelector('[data-share]').onclick=()=>navigator.share?.({title:cu.title,text:txt}); body.querySelector('[data-restart]').onclick=()=>{qi=0;dims.forEach(d=>score[d]=0);renderQ();}; }
  shell.querySelector('[data-c-start]').addEventListener('click',()=>{body.hidden=false;renderQ();});


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
    diffSnap: root.querySelector('[data-iv-diff-snap]')
  };

  const stageDots = root.querySelectorAll('[data-iv-stage-dot]');

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
  let lastAnnouncedPage = -1;

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
      hostLabel.className = 'iv-bubble__label';
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
            const ok = oi === qObj.correctPos;
            fb.textContent = ok ? `✅ ${ui.feedbackOk}` : `❌ ${ui.feedbackBad}`;
            fb.classList.toggle('interview-drill__mcq-feedback--ok', ok);
            fb.classList.toggle('interview-drill__mcq-feedback--bad', !ok);
          });
          box.appendChild(row);
        });
        host.appendChild(box);
        host.appendChild(fb);
      }

      const you = document.createElement('div');
      you.className = 'iv-bubble iv-bubble--you';
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

  updateDiffSnap();
  lastAnnouncedPage = -1;
  render();
})();
