(function () {
  const root = document.querySelector('[data-interview-drill]');
  if (!root || root.querySelector('[data-calling-lab]')) return;
  const lang = (document.documentElement.getAttribute('lang') || 'uk').slice(0, 2);

  const copy = {
    en: {
      badge: 'Career intelligence studio', title: 'Calling Lab', subtitle: 'A guided discovery experience for career direction, strengths, work style, and industry fit.',
      privacy: 'Private by design: answers are saved in your browser only.', start: 'Start lab', resume: 'Continue saved session', reset: 'Reset',
      practice: 'Open interview practice', back: 'Back', next: 'Next question', finish: 'View results', progress: 'Progress',
      modes: { quick: 'Quick scan · 8', deep: 'Deep profile · 18', pivot: 'Career pivot · 12', founder: 'Founder/operator · 14' },
      dimensions: ['Autonomy','Execution','Creativity','Analysis','Leadership','Collaboration','Risk'],
      archetypes: { architect:'Systems Architect', operator:'Execution Operator', explorer:'Creative Explorer', catalyst:'Team Catalyst' },
      summary: 'Top career fits', industry: 'Suggested industries', saved: 'Session saved locally',
    },
    uk: {
      badge: 'Карʼєрна intelligence-студія', title: 'Лабораторія покликання', subtitle: 'Інтерактивна діагностика карʼєрного напряму, сильних сторін, стилю роботи та відповідних індустрій.',
      privacy: 'Приватність: відповіді зберігаються лише у вашому браузері.', start: 'Почати лаб', resume: 'Продовжити збережене', reset: 'Скинути',
      practice: 'Відкрити тренажер співбесіди', back: 'Назад', next: 'Далі', finish: 'До результату', progress: 'Прогрес',
      modes: { quick: 'Швидкий скан · 8', deep: 'Глибокий профіль · 18', pivot: 'Карʼєрний півот · 12', founder: 'Фаундер/оператор · 14' },
      dimensions: ['Автономія','Виконання','Креативність','Аналіз','Лідерство','Співпраця','Ризик'],
      archetypes: { architect:'Архітектор систем', operator:'Оператор виконання', explorer:'Креативний дослідник', catalyst:'Командний каталізатор' },
      summary: 'Найкращі траєкторії', industry: 'Рекомендовані індустрії', saved: 'Сесію збережено локально',
    },
    es: {
      badge: 'Estudio de inteligencia profesional', title: 'Laboratorio de Vocación', subtitle: 'Descubre dirección profesional, fortalezas, estilo de trabajo e industrias adecuadas.',
      privacy: 'Privacidad: las respuestas se guardan solo en tu navegador.', start: 'Iniciar laboratorio', resume: 'Continuar sesión', reset: 'Reiniciar',
      practice: 'Abrir práctica de entrevista', back: 'Atrás', next: 'Siguiente', finish: 'Ver resultados', progress: 'Progreso',
      modes: { quick: 'Escaneo rápido · 8', deep: 'Perfil profundo · 18', pivot: 'Cambio de carrera · 12', founder: 'Founder/operator · 14' },
      dimensions: ['Autonomía','Ejecución','Creatividad','Análisis','Liderazgo','Colaboración','Riesgo'],
      archetypes: { architect:'Arquitecto de Sistemas', operator:'Operador de Ejecución', explorer:'Explorador Creativo', catalyst:'Catalizador de Equipo' },
      summary: 'Rutas recomendadas', industry: 'Industrias sugeridas', saved: 'Sesión guardada localmente',
    },
    ru: {
      badge: 'Студия карьерной аналитики', title: 'Лаборатория призвания', subtitle: 'Интерактивный разбор карьерного направления, сильных сторон, стиля работы и подходящих индустрий.',
      privacy: 'Приватность: ответы сохраняются только в браузере.', start: 'Начать лабораторию', resume: 'Продолжить сессию', reset: 'Сбросить',
      practice: 'Открыть тренажёр интервью', back: 'Назад', next: 'Далее', finish: 'К результатам', progress: 'Прогресс',
      modes: { quick: 'Быстрый скан · 8', deep: 'Глубокий профиль · 18', pivot: 'Карьерный поворот · 12', founder: 'Фаундер/оператор · 14' },
      dimensions: ['Автономия','Исполнение','Креативность','Аналитика','Лидерство','Сотрудничество','Риск'],
      archetypes: { architect:'Архитектор систем', operator:'Оператор исполнения', explorer:'Креативный исследователь', catalyst:'Командный катализатор' },
      summary: 'Лучшие направления', industry: 'Рекомендованные индустрии', saved: 'Сессия сохранена локально',
    }
  };
  const t = copy[lang] || copy.en;
  const modes = [
    { id: 'quick', total: 8 }, { id: 'deep', total: 18 }, { id: 'pivot', total: 12 }, { id: 'founder', total: 14 }
  ];
  const banks = [
    { q:['You inherit a messy project. Your first move?','Un proyecto desordenado: primer paso?','Вам дістався хаотичний проєкт. Перша дія?','Вам достался хаотичный проект. Первый шаг?'], a:[['Map dependencies + risks',[2,2,0,2,0,1,0]],['Talk to users and reframe goal',[1,0,1,1,1,2,1]],['Ship fast and iterate',[1,2,1,0,1,0,2]]] },
    { q:['What energizes you most?','Qué te energiza más?','Що вас найбільше заряджає?','Что вас больше всего заряжает?'], a:[['Turning ambiguity into systems',[2,1,1,2,0,0,0]],['Running teams toward outcomes',[0,2,0,1,2,2,1]],['Creating original concepts',[1,0,2,1,0,1,1]]] },
    { q:['Preferred work rhythm?','Ritmo de trabajo preferido?','Бажаний ритм роботи?','Предпочтительный ритм работы?'], a:[['Structured sprints',[1,2,0,1,1,1,0]],['Parallel exploration',[2,0,2,1,0,1,2]],['Client-facing execution',[0,2,1,0,2,2,1]]] },
  ];
  const qSet = Array.from({ length: 48 }, (_, i) => banks[i % banks.length]);
  const KEY='rybezh-calling-lab-v2';
  let state={mode:'quick',total:8,idx:0,scores:Array(7).fill(0),history:[]};
  try{ const saved=JSON.parse(localStorage.getItem(KEY)||'null'); if(saved && Array.isArray(saved.scores)) state={...state,...saved}; }catch{}

  root.insertAdjacentHTML('afterbegin', `<section class="calling-lab" data-calling-lab><header class="calling-lab__head"><p class="eyebrow">${t.badge}</p><h2>${t.title}</h2><p>${t.subtitle}</p><p class="calling-lab__privacy">${t.privacy}</p></header><div class="calling-lab__modes">${modes.map(m=>`<button class="btn secondary" data-mode="${m.id}" data-q="${m.total}">${t.modes[m.id]}</button>`).join('')}</div><div class="calling-lab__stage" data-stage></div></section>`);
  const lab=root.querySelector('[data-calling-lab]'); const stage=lab.querySelector('[data-stage]');
  const save=()=>localStorage.setItem(KEY, JSON.stringify({...state,updatedAt:Date.now()}));

  function archetype(){ const [a,b]=state.scores.map((v,i)=>[i,v]).sort((x,y)=>y[1]-x[1]); return (a[0]===0||a[0]===3)?t.archetypes.architect:(a[0]===1||a[0]===4)?t.archetypes.operator:(a[0]===2)?t.archetypes.explorer:t.archetypes.catalyst; }
  function renderStart(){
    stage.innerHTML=`<div class="calling-lab__controls"><button class="btn" data-start>${t.start}</button><button class="btn secondary" data-resume ${state.idx? '':'disabled'}>${t.resume}</button><button class="btn secondary" data-reset>${t.reset}</button><button class="btn secondary" data-practice>${t.practice}</button></div><p class="calling-lab__saved">${t.saved}</p>`;
    stage.querySelector('[data-start]').onclick=()=>{state.idx=0;state.scores=Array(7).fill(0);state.history=[];renderQuestion();};
    stage.querySelector('[data-resume]').onclick=()=>renderQuestion();
    stage.querySelector('[data-reset]').onclick=()=>{localStorage.removeItem(KEY);state.idx=0;state.scores=Array(7).fill(0);state.history=[];renderStart();};
    stage.querySelector('[data-practice]').onclick=()=>document.querySelector('[data-iv-feed]')?.scrollIntoView({behavior:'smooth'});
  }
  function renderQuestion(){
    const item=qSet[state.idx%qSet.length]; const q=item.q[lang==='es'?1:lang==='uk'?2:lang==='ru'?3:0];
    const pct=Math.round((state.idx/state.total)*100);
    stage.innerHTML=`<div class="calling-lab__progress-meta"><span>${t.progress}</span><strong>${state.idx+1}/${state.total}</strong></div><div class="calling-lab__progress"><div style="width:${pct}%"></div></div><article class="calling-lab__card"><h3>${q}</h3><div class="calling-lab__answers"></div></article><div class="calling-lab__controls"><button class="btn secondary" data-back ${state.idx===0?'disabled':''}>${t.back}</button><button class="btn" data-next disabled>${state.idx===state.total-1?t.finish:t.next}</button></div>`;
    const answers=stage.querySelector('.calling-lab__answers'); let picked=null;
    item.a.forEach((opt,n)=>{ const b=document.createElement('button'); b.className='btn secondary calling-lab__answer'; b.textContent=opt[0]; b.onclick=()=>{picked=n; answers.querySelectorAll('button').forEach(x=>x.classList.remove('is-active')); b.classList.add('is-active'); stage.querySelector('[data-next]').disabled=false;}; answers.appendChild(b);});
    stage.querySelector('[data-back]').onclick=()=>{ if(state.idx>0){state.idx-=1; renderQuestion();}};
    stage.querySelector('[data-next]').onclick=()=>{ if(picked===null)return; const w=item.a[picked][1]; w.forEach((v,i)=>state.scores[i]+=v); state.history[state.idx]=picked; state.idx++; save(); if(state.idx>=state.total) renderResult(); else renderQuestion(); };
  }
  function renderResult(){
    const top=state.scores.map((v,i)=>[t.dimensions[i],v]).sort((a,b)=>b[1]-a[1]);
    const industries=[top[0][0],top[1][0]].join(' · ');
    stage.innerHTML=`<article class="calling-lab__card"><h3>${archetype()}</h3><p><strong>${t.summary}:</strong> ${top.slice(0,3).map(x=>x[0]).join(', ')}</p><p><strong>${t.industry}:</strong> ${industries}</p><div class="calling-lab__bars">${top.map(([k,v])=>`<p><span>${k}</span><b style="width:${Math.min(100,v*6)}%"></b><em>${v}</em></p>`).join('')}</div><div class="calling-lab__controls"><button class="btn" data-restart>${t.start}</button><button class="btn secondary" data-share>Share</button></div></article>`;
    stage.querySelector('[data-restart]').onclick=()=>{state.idx=0;state.scores=Array(7).fill(0);state.history=[];save();renderQuestion();};
    stage.querySelector('[data-share]').onclick=()=>navigator.share?.({title:t.title,text:`${t.title}: ${archetype()}`});
  }

  lab.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{ lab.querySelectorAll('[data-mode]').forEach(x=>x.classList.remove('is-active')); btn.classList.add('is-active'); state.mode=btn.dataset.mode; state.total=Number(btn.dataset.q)||8; save(); });
  lab.querySelector(`[data-mode="${state.mode}"]`)?.classList.add('is-active');
  renderStart();
})();

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
      coachHintPressure: 'Коротші абзаци; явно фіксуйте ризики в кожній відповіді.',
      hintKbd:
        'Підказка: стрілки <kbd>←</kbd> / <kbd>→</kbd> перемикають пакети, коли фокус не в полі вводу.',
      hintTouch: 'Підказка: перемикайте пакети кнопками внизу екрана.'
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
      coachHintPressure: 'Answer in shorter paragraphs; surface risks explicitly.',
      hintKbd: 'Tip: <kbd>←</kbd> / <kbd>→</kbd> switch batches when focus is not in a field.',
      hintTouch: 'Tip: use the buttons at the bottom to switch batches.'
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
      coachHintPressure: 'Responda en párrafos más cortos y nombre riesgos con claridad.',
      hintKbd:
        'Consejo: <kbd>←</kbd> / <kbd>→</kbd> cambian de lote cuando el foco no está en un campo.',
      hintTouch: 'Consejo: cambia de lote con los botones inferiores.'
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
      coachHintPressure: 'Короче абзацы, явно фиксируйте риски.',
      hintKbd:
        'Подсказка: <kbd>←</kbd> / <kbd>→</kbd> переключают пакеты, когда фокус не в поле ввода.',
      hintTouch: 'Подсказка: переключайте пакеты кнопками внизу экрана.'
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

  const hintEl = root.querySelector('[data-iv-hint]');
  function applyPackHint() {
    if (!hintEl) return;
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (coarse) {
      hintEl.textContent = ui.hintTouch;
    } else {
      hintEl.innerHTML = ui.hintKbd;
    }
  }
  applyPackHint();
  const coarseMq = window.matchMedia('(hover: none) and (pointer: coarse)');
  if (typeof coarseMq.addEventListener === 'function') {
    coarseMq.addEventListener('change', applyPackHint);
  } else if (typeof coarseMq.addListener === 'function') {
    coarseMq.addListener(applyPackHint);
  }

  updateDiffSnap();
  lastAnnouncedPage = -1;
  render();
})();
