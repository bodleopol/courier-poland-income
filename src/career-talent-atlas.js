(function () {
  'use strict';

  const DATA = typeof window !== 'undefined' ? window.CAREER_ATLAS_DATA : null;

  const PATHS = {
    uk: [
      'Інженерія рішень: рамки, компроміси й акуратна декомпозиція складних систем.',
      'Глибока спеціалізація з опорою на вимірювані артефакти.',
      'Міст між командами: узгодження очікувань і швидкі цикли зворотного звʼязку.',
      'Дослідницький шлях: гіпотези, прототипи й контрольовані експерименти.',
      'Операційна опора: процеси, метрики, поступове зниження хаосу.',
      'Нарратив і пояснення: переклад складного для різних аудиторій.',
      'Ризик-рамки: межі, аудит, безпека рішень під невизначеність.',
      'Універсальний мандат: широкий спектр задач із чіткими пріоритетами.'
    ],
    en: [
      'Solution engineering: trade-offs, guardrails, and careful decomposition of complex systems.',
      'Deep craft with measurable artefacts as the north star.',
      'Bridge-building across teams: expectations, feedback loops, clarity.',
      'Research-led: hypotheses, prototypes, controlled experiments.',
      'Operational backbone: metrics, process, gradual entropy reduction.',
      'Narrative craft: translating complexity for different audiences.',
      'Risk framing: guardrails, audit, safe decisions under uncertainty.',
      'Generalist mandate: wide surface area with ruthless prioritisation.'
    ],
    es: [
      'Ingeniería de solución: compensaciones, límites y descomposición cuidadosa de sistemas complejos.',
      'Especialización profunda con artefactos medibles como norte.',
      'Puente entre equipos: expectativas, feedback y claridad.',
      'Ruta de investigación: hipótesis, prototipos y experimentos controlados.',
      'Columna operativa: métricas, proceso y reducción gradual del caos.',
      'Narrativa: traducir la complejidad para distintas audiencias.',
      'Encuadre de riesgos: límites, auditoría, decisiones seguras bajo incertidumbre.',
      'Mandato generalista: amplia superficie con priorización estricta.'
    ],
    ru: [
      'Инженерия решений: компромиссы, ограждения и аккуратная декомпозиция сложных систем.',
      'Глубокая специализация и измеримые артефакты как ориентир.',
      'Мост между командами: ожидания, обратная связь, ясность.',
      'Исследовательский путь: гипотезы, прототипы, контролируемые эксперименты.',
      'Операционный каркас: метрики, процесс, снижение энтропии.',
      'Нарратив: перевод сложного для разных аудиторий.',
      'Риск-рамки: границы, аудит, безопасные решения при неопределённости.',
      'Универсальный мандат: широкий охват с жёсткой приоритизацией.'
    ]
  };

  /** Ten dilemmas: trait deltas for option A / B (8 dims each). */
  const DILEMMAS = [
    { A: [0.07, 0.02, -0.02, 0.04, 0.02, 0.05, -0.01, 0.01], B: [-0.02, 0.03, 0.05, -0.01, 0.04, -0.02, 0.05, 0.02] },
    { A: [-0.01, 0.06, 0.04, -0.02, 0.02, 0.01, 0.02, -0.02], B: [0.06, -0.01, -0.02, 0.06, 0.03, 0.04, -0.02, 0.03] },
    { A: [0.04, 0.02, 0.06, 0.01, -0.02, 0.02, -0.03, -0.01], B: [0.02, 0.05, -0.02, 0.02, 0.05, 0.03, 0.04, 0.04] },
    { A: [0.03, 0.04, -0.02, 0.05, 0.04, 0.03, 0.02, 0.05], B: [-0.02, 0.02, 0.06, -0.01, 0.02, -0.02, 0.05, -0.03] },
    { A: [-0.02, 0.06, 0.02, 0.03, 0.04, -0.03, 0.03, 0.02], B: [0.05, -0.02, 0.03, 0.05, -0.01, 0.06, -0.01, 0.01] },
    { A: [0.02, 0.03, 0.05, 0.02, 0.03, -0.02, 0.04, -0.02], B: [0.04, 0.04, -0.02, 0.05, 0.02, 0.05, -0.01, 0.06] },
    { A: [0.05, -0.01, 0.03, 0.04, 0.06, 0.02, 0.03, 0.04], B: [-0.02, 0.05, 0.04, -0.01, 0.02, 0.04, 0.05, -0.02] },
    { A: [0.03, 0.05, 0.04, 0.03, 0.02, 0.04, 0.02, 0.03], B: [0.04, -0.02, 0.02, 0.06, 0.05, 0.03, -0.02, 0.05] },
    { A: [0.02, 0.04, 0.03, 0.05, 0.05, 0.02, 0.04, 0.06], B: [0.05, 0.02, -0.01, 0.04, -0.02, 0.05, 0.03, -0.01] },
    { A: [0.04, 0.06, 0.02, 0.03, 0.03, 0.05, 0.02, 0.02], B: [0.02, 0.02, 0.05, 0.04, 0.04, 0.03, 0.05, 0.05] }
  ];

  const COPY = {
    uk: {
      kicker: 'Карʼєрний атлас · Rybezh',
      start: 'Почати тест',
      again: 'Пройти знову',
      stepCards: 'Крок 1 — питання та сценарії',
      stepQuiz: 'Крок 2 — калібрування',
      stepResult: 'Ваш результат Calling Lab',
      cardProgress: 'Картка',
      of: 'з',
      pickHint: 'Оберіть варіант, який ближче до вашого природного стилю — тут немає оцінки «правильно».',
      quizHint: 'Поставте слайдер: що відчувається ближче до вас сьогодні (не «назавжди»).',
      resultHint: 'Нижче — орієнтири, а не вердикт. Перехрестіть із власним досвідом і ринком.',
      paramLine: 'Параметри моделі',
      paramDetail: 'вагових коефіцієнтів у нішевій сітці (96 ніш × 320 вимірів).',
      topNiches: 'Топ-ніші збігу',
      pathTitle: 'Шлях і стиль',
      talentTitle: 'Вектор талантів',
      rolesTitle: 'Приклади ролей у ніші',
      copySummary: 'Копіювати короткий підсумок',
      copied: 'Скопійовано',
      disclosure: 'Приватність: відповіді зберігаються лише локально у браузері. Це інструмент рефлексії та навігації карʼєри, не медична/психологічна діагностика.',
      cards: [
        { A: 'Спочатку виміряти й структурувати, потім діяти.', B: 'Спочатку швидкий прототип, потім уточнення.' },
        { A: 'Глибоко опанувати один стек.', B: 'Тримати широкий периметр технологій.' },
        { A: 'Публічно вести зустрічі й узгодження.', B: 'Працювати «у двигуні» без зайвого шуму.' },
        { A: 'Жорсткі дедлайни й чіткі обмеження.', B: 'Плавні пріоритети й простір на перегляд.' },
        { A: 'Більше автономії й власних рішень.', B: 'Більше рамок, ревʼю й спільної відповідальності.' },
        { A: 'Оптимізація існуючого продукту.', B: 'Пошук нового продуктового сегмента.' },
        { A: 'Документувати й стандартизувати.', B: 'Імпровізувати й адаптуватися в реальному часі.' },
        { A: 'Тісніше з користувачами та стейкхолдерами.', B: 'Тісніше з кодом, даними чи інфраструктурою.' },
        { A: 'Великі команди й узгоджені ритуали.', B: 'Малі команди й короткі цикли.' },
        { A: 'Передбачуваний ритм і баланс.', B: 'Високий темп і стислі вікна.' }
      ]
    },
    en: {
      kicker: 'Career Talent Atlas · Rybezh',
      start: 'Start test',
      again: 'Run again',
      stepCards: 'Step 1 — decision cards',
      stepQuiz: 'Step 2 — calibration',
      stepResult: 'Your profile',
      cardProgress: 'Card',
      of: 'of',
      pickHint: 'Pick what feels closer to your natural style—there is no “correct” grade.',
      quizHint: 'Adjust sliders for how it feels today, not “forever”.',
      resultHint: 'These are compass headings, not verdicts—cross-check with experience and market reality.',
      paramLine: 'Model parameters',
      paramDetail: 'scalar weights in the niche lattice (96 niches × 320 dimensions).',
      topNiches: 'Top matching niches',
      pathTitle: 'Path & posture',
      talentTitle: 'Talent vector',
      rolesTitle: 'Example roles in this niche',
      copySummary: 'Copy short summary',
      copied: 'Copied',
      disclosure: 'Privacy: answers are stored only in your browser. This is a reflection and career-navigation tool, not a medical or psychological diagnosis.',
      cards: [
        { A: 'Measure and frame first, then execute.', B: 'Ship a fast prototype, then refine.' },
        { A: 'Go deep on one stack.', B: 'Keep a wide technology perimeter.' },
        { A: 'Lead meetings and alignment in public.', B: 'Work in the engine room with minimal noise.' },
        { A: 'Hard deadlines and crisp constraints.', B: 'Fluid priorities with room to revisit.' },
        { A: 'More autonomy and personal calls.', B: 'More guardrails, review, shared ownership.' },
        { A: 'Optimise an existing product surface.', B: 'Hunt for a new product wedge.' },
        { A: 'Document and standardise.', B: 'Improvise and adapt live.' },
        { A: 'Closer to users and stakeholders.', B: 'Closer to code, data, or infrastructure.' },
        { A: 'Larger teams with coordinated rituals.', B: 'Small teams with tight loops.' },
        { A: 'Predictable cadence and balance.', B: 'High tempo and compressed windows.' }
      ]
    },
    es: {
      kicker: 'Atlas de talento profesional · Rybezh',
      start: 'Iniciar test',
      again: 'Repetir',
      stepCards: 'Paso 1 — tarjetas de decisión',
      stepQuiz: 'Paso 2 — calibración',
      stepResult: 'Tu perfil',
      cardProgress: 'Tarjeta',
      of: 'de',
      pickHint: 'Elige lo que se acerque a tu estilo natural; no hay calificación “correcta”.',
      quizHint: 'Ajusta los sliders para cómo te sientes hoy, no “para siempre”.',
      resultHint: 'Son brújulas, no veredictos: contrasta con tu experiencia y el mercado.',
      paramLine: 'Parámetros del modelo',
      paramDetail: 'pesos escalares en la malla de nichos (96 nichos × 320 dimensiones).',
      topNiches: 'Nichos con mayor afinidad',
      pathTitle: 'Ruta y postura',
      talentTitle: 'Vector de talento',
      rolesTitle: 'Roles de ejemplo en el nicho',
      copySummary: 'Copiar resumen breve',
      copied: 'Copiado',
      disclosure: 'Privacidad: las respuestas se guardan solo en tu navegador. Es una herramienta de reflexión y orientación profesional, no un diagnóstico psicológico o médico.',
      cards: [
        { A: 'Medir y encuadrar primero, luego ejecutar.', B: 'Lanzar prototipo rápido y luego refinar.' },
        { A: 'Profundizar en un stack.', B: 'Mantener un perímetro tecnológico amplio.' },
        { A: 'Liderar reuniones y alineación en público.', B: 'Trabajar en la sala de máquinas con poco ruido.' },
        { A: 'Plazos duros y restricciones claras.', B: 'Prioridades fluidas con margen de revisión.' },
        { A: 'Más autonomía y decisiones propias.', B: 'Más barandas, revisión y propiedad compartida.' },
        { A: 'Optimizar un producto existente.', B: 'Buscar una nueva cuña de producto.' },
        { A: 'Documentar y estandarizar.', B: 'Improvisar y adaptar en vivo.' },
        { A: 'Más cerca de usuarios y stakeholders.', B: 'Más cerca de código, datos o infraestructura.' },
        { A: 'Equipos grandes con rituales coordinados.', B: 'Equipos pequeños con ciclos cortos.' },
        { A: 'Ritmo predecible y equilibrio.', B: 'Alto ritmo y ventanas comprimidas.' }
      ]
    },
    ru: {
      kicker: 'Карьерный атлас талантов · Rybezh',
      start: 'Начать тест',
      again: 'Пройти снова',
      stepCards: 'Шаг 1 — карточки выбора',
      stepQuiz: 'Шаг 2 — калибровка',
      stepResult: 'Ваш профиль',
      cardProgress: 'Карточка',
      of: 'из',
      pickHint: 'Выберите вариант ближе к вашему стилю — «правильного» ответа нет.',
      quizHint: 'Слайдеры отражают ощущения сегодня, не «навсегда».',
      resultHint: 'Ниже — ориентиры, а не приговор; сверяйте с опытом и рынком.',
      paramLine: 'Параметры модели',
      paramDetail: 'весовых коэффициентов в нишевой решётке (96 ниш × 320 измерений).',
      topNiches: 'Топ совпадений по нишам',
      pathTitle: 'Путь и стиль',
      talentTitle: 'Вектор талантов',
      rolesTitle: 'Примеры ролей в нише',
      copySummary: 'Копировать краткое резюме',
      copied: 'Скопировано',
      disclosure: 'Приватность: ответы хранятся только локально в браузере. Это инструмент рефлексии и карьерной навигации, а не медицинская или психологическая диагностика.',
      cards: [
        { A: 'Сначала измерить и структурировать, потом действовать.', B: 'Сначала быстрый прототип, потом уточнение.' },
        { A: 'Глубоко в один стек.', B: 'Широкий периметр технологий.' },
        { A: 'Публично вести встречи и согласование.', B: 'Работа «в машинном отделении» без лишнего шума.' },
        { A: 'Жёсткие дедлайны и чёткие ограничения.', B: 'Гибкие приоритеты с пространством пересмотра.' },
        { A: 'Больше автономии и личных решений.', B: 'Больше рамок, ревью и общей ответственности.' },
        { A: 'Оптимизировать существующий продукт.', B: 'Искать новый продуктовый заход.' },
        { A: 'Документировать и стандартизировать.', B: 'Импровизировать и адаптироваться на лету.' },
        { A: 'Ближе к пользователям и стейкхолдерам.', B: 'Ближе к коду, данным или инфраструктуре.' },
        { A: 'Крупные команды и согласованные ритуалы.', B: 'Малые команды и короткие циклы.' },
        { A: 'Предсказуемый ритм и баланс.', B: 'Высокий темп и сжатые окна.' }
      ]
    }
  };

  function detectLang() {
    const h = document.documentElement.getAttribute('lang') || 'uk';
    if (h === 'en' || h === 'es' || h === 'ru') return h;
    return 'uk';
  }

  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }

  function normalize(vec) {
    const s = Math.sqrt(vec.reduce((a, v) => a + v * v, 0)) || 1;
    return vec.map((v) => v / s);
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a += 0x6d2b79f5;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function nicheScore(user8, nicheIndex) {
    if (!DATA) return 0;
    const base = nicheIndex * DATA.nicheDim;
    let dot = 0;
    let nu = 0;
    for (let t = 0; t < 8; t += 1) {
      const w = DATA.weights[base + t] / 1000;
      dot += user8[t] * w;
      nu += 1;
    }
    const rnd = mulberry32(90210 + nicheIndex * 17);
    let micro = 0;
    for (let t = 8; t < 32; t += 1) {
      micro += DATA.weights[base + t] * rnd();
    }
    return dot + micro * 1e-7;
  }

  function rankNiches(user8) {
    if (!DATA) return [];
    const scores = [];
    for (let i = 0; i < DATA.nicheCount; i += 1) {
      scores.push({ i, s: nicheScore(user8, i) });
    }
    scores.sort((a, b) => b.s - a.s);
    return scores;
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount(root) {
    const lang = detectLang();
    const S = COPY[lang] || COPY.uk;
    const traitLabels = (DATA && DATA.traitLabels && DATA.traitLabels[lang]) || DATA.traitLabels.uk;

    let phase = 'splash';
    let cardIdx = 0;
    const trait = [0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55];
    const sliders = [];

    const panel = el('div', 'talas-panel');
    root.appendChild(panel);

    function renderTraitBars(vec) {
      const wrap = el('div', 'talas-bars');
      for (let i = 0; i < 8; i += 1) {
        const row = el('div', 'talas-bar');
        const lab = el('span', 'talas-bar__label', traitLabels[i]);
        const track = el('div', 'talas-bar__track');
        const fill = el('span', 'talas-bar__fill');
        fill.style.width = `${Math.round(vec[i] * 100)}%`;
        track.appendChild(fill);
        row.appendChild(lab);
        row.appendChild(track);
        wrap.appendChild(row);
      }
      return wrap;
    }

    function finalUser() {
      return normalize(trait.map(clamp01));
    }

    function renderSplash() {
      panel.innerHTML = '';
      const box = el('div', 'talas-card talas-card--splash');
      box.appendChild(el('p', 'talas-eyebrow', S.kicker));
      const p = el('p', 'talas-lede');
      p.textContent =
        lang === 'uk'
          ? 'Динамічна сесія: картки рішень, калібрування слайдерами та зіставлення з великою нішевою моделлю.'
          : lang === 'en'
            ? 'A dynamic session: decision cards, slider calibration, and matching against a large niche lattice.'
            : lang === 'es'
              ? 'Sesión dinámica: tarjetas, calibración con sliders y cruce con una malla grande de nichos.'
              : 'Динамическая сессия: карточки, калибровка слайдерами и сопоставление с большой нишевой моделью.';
      box.appendChild(p);
      const meta = el('p', 'talas-meta');
      if (DATA) {
        meta.innerHTML = `<strong>${DATA.paramCount.toLocaleString(lang)}</strong> ${S.paramDetail}`;
      }
      box.appendChild(meta);
      const d = el('p', 'talas-disclosure', S.disclosure);
      box.appendChild(d);
      const btn = el('button', 'btn talas-primary', S.start);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        phase = 'cards';
        cardIdx = 0;
        for (let i = 0; i < 8; i += 1) trait[i] = 0.55;
        render();
      });
      box.appendChild(btn);
      panel.appendChild(box);
    }

    function renderCards() {
      panel.innerHTML = '';
      const head = el('div', 'talas-step-head');
      head.innerHTML = `<span class="talas-badge">${S.stepCards}</span><h2 class="talas-h2">${S.cardProgress} ${cardIdx + 1} ${S.of} ${DILEMMAS.length}</h2><p class="talas-muted">${S.pickHint}</p>`;
      panel.appendChild(head);

      const card = el('div', 'talas-choice-grid');
      const row = DILEMMAS[cardIdx];
      const text = S.cards[cardIdx];
      const mkBtn = (side, delta) => {
        const b = el('button', `talas-choice talas-choice--${side.toLowerCase()}`, `<span class="talas-choice__side">${side}</span><span class="talas-choice__txt">${text[side]}</span>`);
        b.type = 'button';
        b.addEventListener('click', () => {
          for (let i = 0; i < 8; i += 1) {
            trait[i] = clamp01(trait[i] + delta[i]);
          }
          cardIdx += 1;
          if (cardIdx >= DILEMMAS.length) {
            phase = 'quiz';
          }
          render();
        });
        return b;
      };
      card.appendChild(mkBtn('A', row.A));
      card.appendChild(mkBtn('B', row.B));
      panel.appendChild(card);

      const prog = el('div', 'talas-progress');
      for (let i = 0; i < DILEMMAS.length; i += 1) {
        const dot = el('span', i <= cardIdx ? 'talas-dot talas-dot--on' : 'talas-dot');
        prog.appendChild(dot);
      }
      panel.appendChild(prog);
    }

    function renderQuiz() {
      panel.innerHTML = '';
      const head = el('div', 'talas-step-head');
      head.innerHTML = `<span class="talas-badge">${S.stepQuiz}</span><h2 class="talas-h2">${S.talentTitle}</h2><p class="talas-muted">${S.quizHint}</p>`;
      panel.appendChild(head);

      const grid = el('div', 'talas-sliders');
      sliders.length = 0;
      for (let i = 0; i < 8; i += 1) {
        const row = el('div', 'talas-slider-row');
        const lab = el('label', 'talas-slider-label', traitLabels[i]);
        lab.setAttribute('for', `talas-s-${i}`);
        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = '100';
        input.value = String(Math.round(trait[i] * 100));
        input.id = `talas-s-${i}`;
        input.className = 'talas-range';
        input.addEventListener('input', () => {
          trait[i] = clamp01(Number(input.value) / 100);
        });
        sliders.push(input);
        row.appendChild(lab);
        row.appendChild(input);
        grid.appendChild(row);
      }
      panel.appendChild(grid);

      const go = el('button', 'btn talas-primary', lang === 'uk' ? 'Побудувати профіль' : lang === 'en' ? 'Build profile' : lang === 'es' ? 'Generar perfil' : 'Собрать профиль');
      go.type = 'button';
      go.addEventListener('click', () => {
        sliders.forEach((inp, i) => {
          trait[i] = clamp01(Number(inp.value) / 100);
        });
        phase = 'result';
        render();
      });
      panel.appendChild(go);
    }

    function renderResult() {
      panel.innerHTML = '';
      const u = finalUser();
      const ranked = rankNiches(u);
      const top = ranked.slice(0, 5);

      const head = el('div', 'talas-step-head');
      head.innerHTML = `<span class="talas-badge">${S.stepResult}</span><h2 class="talas-h2">${S.topNiches}</h2><p class="talas-muted">${S.resultHint}</p>`;
      panel.appendChild(head);

      const stats = el('div', 'talas-stats');
      if (DATA) {
        stats.innerHTML = `<div class="talas-stat"><span class="talas-stat__n">${DATA.paramCount.toLocaleString(lang)}</span><span class="talas-stat__l">${S.paramLine}</span></div><div class="talas-stat"><span class="talas-stat__n">${DATA.nicheCount}</span><span class="talas-stat__l">${lang === 'uk' ? 'ніш' : lang === 'en' ? 'niches' : lang === 'es' ? 'nichos' : 'ниш'}</span></div><div class="talas-stat"><span class="talas-stat__n">${DATA.nicheDim}</span><span class="talas-stat__l">${lang === 'uk' ? 'вимірів / ніша' : lang === 'en' ? 'dims / niche' : lang === 'es' ? 'dims / nicho' : 'изм. / ниша'}</span></div>`;
      }
      panel.appendChild(stats);

      panel.appendChild(el('h3', 'talas-h3', S.talentTitle));
      panel.appendChild(renderTraitBars(u));

      const best = top[0];
      const niche = DATA.niches[best.i];
      const pathIdx = Math.min(niche.style, (PATHS[lang] || PATHS.uk).length - 1);
      panel.appendChild(el('h3', 'talas-h3', S.pathTitle));
      const pathCard = el('div', 'talas-path-card');
      pathCard.innerHTML = `<p class="talas-path-card__style">${niche.styleLabel[lang]}</p><p class="talas-path-card__sector">${niche.label[lang]}</p><p class="talas-path-card__body">${PATHS[lang][pathIdx]}</p>`;
      panel.appendChild(pathCard);

      panel.appendChild(el('h3', 'talas-h3', S.topNiches));
      const list = el('div', 'talas-niche-list');
      top.forEach((r, idx) => {
        const n = DATA.niches[r.i];
        const card = el('article', 'talas-niche-card');
        card.innerHTML = `<header><span class="talas-rank">#${idx + 1}</span><h4>${n.styleLabel[lang]}</h4><p class="talas-niche-card__sub">${n.label[lang]}</p></header><section><p class="talas-mini">${S.rolesTitle}</p><ul>${n.examples[lang].map((x) => `<li>${x}</li>`).join('')}</ul></section>`;
        list.appendChild(card);
      });
      panel.appendChild(list);

      const actions = el('div', 'talas-actions');
      const copyBtn = el('button', 'btn secondary', S.copySummary);
      copyBtn.type = 'button';
      copyBtn.addEventListener('click', async () => {
        const lines = [
          niche.styleLabel[lang],
          niche.label[lang],
          ...n.examples[lang],
          PATHS[lang][pathIdx],
          `${S.paramLine}: ${DATA.paramCount}`
        ];
        const text = lines.join('\n');
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = S.copied;
          setTimeout(() => {
            copyBtn.textContent = S.copySummary;
          }, 2000);
        } catch {
          copyBtn.textContent = '—';
        }
      });
      const again = el('button', 'btn talas-primary', S.again);
      again.type = 'button';
      again.addEventListener('click', () => {
        phase = 'splash';
        render();
      });
      actions.appendChild(copyBtn);
      actions.appendChild(again);
      panel.appendChild(actions);
    }

    function render() {
      if (!DATA) {
        panel.innerHTML = '<p class="talas-error">Data bundle missing. Rebuild the site.</p>';
        return;
      }
      if (phase === 'splash') renderSplash();
      else if (phase === 'cards') renderCards();
      else if (phase === 'quiz') renderQuiz();
      else if (phase === 'result') renderResult();
    }

    render();
  }

  document.querySelectorAll('[data-career-talent-atlas]').forEach((root) => {
    mount(root);
  });
})();
