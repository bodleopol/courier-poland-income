/**
 * Deterministic realistic display names and long-form copy for bulk catalog pages.
 * Names are plausible editorial labels — not verified identities of real people or companies.
 */

export function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

const PERSON_FIRST = {
  uk: [
    'Олена', 'Ірина', 'Наталія', 'Юлія', 'Катерина', 'Анна', 'Софія', 'Дарина', 'Марія', 'Вікторія',
    'Андрій', 'Олег', 'Максим', 'Дмитро', 'Ігор', 'Роман', 'Тарас', 'Павло', 'Сергій', 'Віталій',
    'Богдан', 'Михайло', 'Кирило', 'Артем', 'Євген', 'Владислав', 'Назар', 'Остап', 'Ярослав', 'Петро',
    'Ганна', 'Людмила', 'Оксана', 'Тетяна', 'Зоряна', 'Аліна', 'Вероніка', 'Поліна', 'Ксенія', 'Леся'
  ],
  en: [
    'Elena', 'Maya', 'Nina', 'Clara', 'Hannah', 'Priya', 'Leah', 'Sofia', 'Amira', 'Julia',
    'Marcus', 'Daniel', 'Ethan', 'Noah', 'Omar', 'Lucas', 'Henry', 'James', 'David', 'Alex',
    'Rachel', 'Laura', 'Emily', 'Chloe', 'Zoe', 'Mila', 'Anika', 'Sara', 'Ivy', 'Nora',
    'Chris', 'Ryan', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'
  ],
  es: [
    'Lucía', 'Elena', 'Marta', 'Paula', 'Clara', 'Sofía', 'Valeria', 'Carmen', 'Irene', 'Alba',
    'Hugo', 'Pablo', 'Diego', 'Álvaro', 'Marcos', 'Javier', 'Sergio', 'Iván', 'Raúl', 'Andrés',
    'Laura', 'Ana', 'Beatriz', 'Nuria', 'Cristina', 'Rocío', 'Noelia', 'Patricia', 'Silvia', 'Teresa',
    'Carlos', 'Miguel', 'Rubén', 'Óscar', 'Víctor', 'Enrique', 'Fernando', 'Gonzalo', 'Luis', 'Jorge'
  ],
  ru: [
    'Елена', 'Анна', 'Мария', 'Ольга', 'Татьяна', 'Наталья', 'Ирина', 'Юлия', 'Светлана', 'Дарья',
    'Алексей', 'Дмитрий', 'Игорь', 'Максим', 'Сергей', 'Андрей', 'Павел', 'Роман', 'Никита', 'Артём',
    'Екатерина', 'Виктория', 'Полина', 'Алина', 'Ксения', 'Вера', 'Людмила', 'Галина', 'Надежда', 'Кира',
    'Михаил', 'Владимир', 'Кирилл', 'Евгений', 'Олег', 'Виталий', 'Станислав', 'Григорий', 'Ярослав', 'Пётр'
  ]
};

const PERSON_LAST = {
  uk: [
    'Коваль', 'Бондар', 'Ткаченко', 'Мельник', 'Шевченко', 'Кравченко', 'Лисенко', 'Романенко', 'Савченко', 'Гончар',
    'Петренко', 'Марченко', 'Іваненко', 'Коваленко', 'Бойко', 'Ткачук', 'Олійник', 'Мороз', 'Левченко', 'Сидоренко',
    'Захаренко', 'Руденко', 'Павленко', 'Даниленко', 'Кузьменко', 'Яремчук', 'Гриценко', 'Василенко', 'Нечипоренко', 'Хоменко'
  ],
  en: [
    'Coleman', 'Nguyen', 'Patel', 'Kim', 'Rivera', 'Brooks', 'Hayes', 'Foster', 'Bennett', 'Reed',
    'Morgan', 'Sullivan', 'Cooper', 'Barnes', 'Rossi', 'Fischer', 'Weber', 'Schmidt', 'Moreau', 'Silva',
    'Campbell', 'Mitchell', 'Parker', 'Turner', 'Phillips', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Rogers'
  ],
  es: [
    'García', 'Martínez', 'López', 'Sánchez', 'Fernández', 'González', 'Rodríguez', 'Pérez', 'Romero', 'Torres',
    'Díaz', 'Ruiz', 'Navarro', 'Vega', 'Castro', 'Ortega', 'Molina', 'Iglesias', 'Herrera', 'Vargas',
    'Jiménez', 'Moreno', 'Delgado', 'Ramos', 'Serrano', 'Blanco', 'Suárez', 'Campos', 'Cruz', 'Reyes'
  ],
  ru: [
    'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров',
    'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев',
    'Орлов', 'Андреев', 'Макаров', 'Никитин', 'Захаров', 'Зайцев', 'Соловьёв', 'Борисов', 'Яковлев', 'Григорьев'
  ]
};

const STARTUP_A = {
  uk: ['Світло', 'Ланцюг', 'Канал', 'Поле', 'Рівень', 'Коло', 'Місто', 'Хмара', 'Потік', 'Сигнал', 'Базис', 'Форма', 'Точка', 'Вектор', 'Модуль'],
  en: ['Nova', 'Clear', 'Bright', 'Swift', 'Prime', 'Urban', 'North', 'Blue', 'Open', 'Core', 'Relay', 'Scale', 'Layer', 'Field', 'Peak'],
  es: ['Clara', 'Norte', 'Rápido', 'Prisma', 'Círculo', 'Puente', 'Nube', 'Pulso', 'Base', 'Vía', 'Origen', 'Faro', 'Eje', 'Módulo', 'Punto'],
  ru: ['Свет', 'Канал', 'Поле', 'Уровень', 'Круг', 'Город', 'Облако', 'Поток', 'Сигнал', 'Базис', 'Форма', 'Точка', 'Вектор', 'Модуль', 'Север']
};

const STARTUP_B = {
  uk: ['Дата', 'Пей', 'Лаб', 'Системи', 'Хаб', 'Флоу', 'Стек', 'Воркс', 'Сенс', 'Грід', 'Лінк', 'Опс', 'Білд', 'Код', 'Платформа'],
  en: ['Data', 'Pay', 'Labs', 'Systems', 'Hub', 'Flow', 'Stack', 'Works', 'Sense', 'Grid', 'Link', 'Ops', 'Build', 'Code', 'Platform'],
  es: ['Datos', 'Pay', 'Labs', 'Sistemas', 'Hub', 'Flow', 'Stack', 'Works', 'Sense', 'Grid', 'Link', 'Ops', 'Build', 'Code', 'Plataforma'],
  ru: ['Дата', 'Пей', 'Лаб', 'Системы', 'Хаб', 'Флоу', 'Стек', 'Воркс', 'Сенс', 'Грид', 'Линк', 'Опс', 'Билд', 'Код', 'Платформа']
};

export function personDisplayName(n, langKey) {
  const lang = PERSON_FIRST[langKey] ? langKey : 'uk';
  const seed = hash32(`person-name-${n}-${lang}`);
  const first = pick(PERSON_FIRST[lang], seed);
  const last = pick(PERSON_LAST[lang], seed >>> 8);
  return `${first} ${last}`;
}

export function startupDisplayName(n, langKey) {
  const lang = STARTUP_A[langKey] ? langKey : 'uk';
  const seed = hash32(`startup-name-${n}-${lang}`);
  const a = pick(STARTUP_A[lang], seed);
  const b = pick(STARTUP_B[lang], seed >>> 6);
  if (lang === 'uk' || lang === 'ru') return `${a}${b}`;
  return `${a} ${b}`;
}

const FOCUS_SNIPPET = {
  uk: {
    operations: 'операційні процеси, SLA, масштабування команд і unit-економіку сервісів',
    software: 'архітектуру продуктів, API, надійність релізів і співпрацю з дизайном',
    engineering: 'інфраструктуру, спостережуваність, безпеку постачання та інженерну культуру',
    science: 'експерименти, статистику, відтворюваність досліджень і передачу знань у продукт',
    ceo: 'стратегію, фінансову дисципліну, найм ключових ролей і комунікацію з радою'
  },
  en: {
    operations: 'operational cadence, SLA design, team scaling, and unit economics in services',
    software: 'product architecture, APIs, release reliability, and design partnership',
    engineering: 'infrastructure, observability, secure delivery, and engineering culture',
    science: 'experimentation, statistics, reproducible research, and product transfer',
    ceo: 'strategy, financial discipline, key hiring, and board communication'
  },
  es: {
    operations: 'cadencia operativa, SLA, escalado de equipos y unit economics en servicios',
    software: 'arquitectura de producto, APIs, fiabilidad de releases y colaboración con diseño',
    engineering: 'infraestructura, observabilidad, entrega segura y cultura de ingeniería',
    science: 'experimentación, estadística, investigación reproducible y transferencia a producto',
    ceo: 'estrategia, disciplina financiera, contratación clave y comunicación con el consejo'
  },
  ru: {
    operations: 'операционные процессы, SLA, масштабирование команд и unit-экономику сервисов',
    software: 'архитектуру продуктов, API, надёжность релизов и работу с дизайном',
    engineering: 'инфраструктуру, наблюдаемость, безопасную поставку и инженерную культуру',
    science: 'эксперименты, статистику, воспроизводимость исследований и передачу в продукт',
    ceo: 'стратегию, финансовую дисциплину, найм ключевых ролей и коммуникацию с советом'
  }
};

const PRODUCT_SNIPPET = {
  uk: {
    software: 'B2B-платформу з API, ролями доступу та аналітикою для продуктових команд',
    fintech: 'платіжну та комплаєнс-інфраструктуру для необанків і маркетплейсів',
    operations: 'операційну панель для логістики, SLA та планування потужностей',
    design: 'дизайн-систему та інструменти handoff між дизайном і розробкою',
    hardware: 'апаратний стек із прошивкою, телеметрією та сервісною логістикою'
  },
  en: {
    software: 'a B2B platform with APIs, access roles, and analytics for product teams',
    fintech: 'payments and compliance infrastructure for neobanks and marketplaces',
    operations: 'an operations console for logistics, SLAs, and capacity planning',
    design: 'a design system and handoff tooling between design and engineering',
    hardware: 'a hardware stack with firmware, telemetry, and service logistics'
  },
  es: {
    software: 'una plataforma B2B con APIs, roles de acceso y analítica para equipos de producto',
    fintech: 'infraestructura de pagos y cumplimiento para neobancos y marketplaces',
    operations: 'una consola operativa para logística, SLA y planificación de capacidad',
    design: 'un sistema de diseño y herramientas de handoff entre diseño e ingeniería',
    hardware: 'un stack de hardware con firmware, telemetría y logística de servicio'
  },
  ru: {
    software: 'B2B-платформу с API, ролями доступа и аналитикой для продуктовых команд',
    fintech: 'платёжную и комплаенс-инфраструктуру для необанков и маркетплейсов',
    operations: 'операционную панель для логистики, SLA и планирования мощностей',
    design: 'дизайн-систему и инструменты handoff между дизайном и разработкой',
    hardware: 'аппаратный стек с прошивкой, телеметрией и сервисной логистикой'
  }
};

export function personMetaDescription(langKey, name, role, country, fk) {
  const focus = FOCUS_SNIPPET[langKey]?.[fk] || FOCUS_SNIPPET.uk[fk];
  const texts = {
    uk: `${name} — ${role} (${country}). У фокусі ${focus}. Редакційний профіль Rybezh: досвід, підхід до рішень і контекст для порівняння з іншими фахівцями в каталозі; ключові факти звіряйте з первинними джерелами перед наймом чи партнерством.`,
    en: `${name} — ${role} (${country}). Focus: ${focus}. Rybezh editorial profile covering experience, decision style, and catalogue context; verify titles, employers, and outcomes on primary sources before hiring or partnering.`,
    es: `${name} — ${role} (${country}). Enfoque: ${focus}. Perfil editorial Rybezh sobre experiencia, estilo de decisión y contexto del catálogo; verifica cargos, empleadores y resultados en fuentes primarias antes de contratar o asociarte.`,
    ru: `${name} — ${role} (${country}). В фокусе ${focus}. Редакционный профиль Rybezh: опыт, стиль решений и контекст каталога; сверяйте должности, работодателей и результаты с первичными источниками перед наймом или партнёрством.`
  };
  return texts[langKey] || texts.uk;
}

export function startupMetaDescription(langKey, name, role, country, fk, year) {
  const product = PRODUCT_SNIPPET[langKey]?.[fk] || PRODUCT_SNIPPET.uk[fk];
  const texts = {
    uk: `${name} (${year}, ${country}) — ${role}. Компанія розвиває ${product}. Огляд Rybezh для фільтрів каталогу: позиціонування, сегмент і питання для due diligence; інвестиційні та юридичні факти перевіряйте в реєстрах і на офіційному сайті.`,
    en: `${name} (${year}, ${country}) — ${role}. The company builds ${product}. Rybezh catalogue overview for positioning, segment, and diligence questions; verify investment and legal facts in registries and on the official site.`,
    es: `${name} (${year}, ${country}) — ${role}. La empresa desarrolla ${product}. Resumen Rybezh para posicionamiento, segmento y preguntas de due diligence; verifica datos legales y de inversión en registros y web oficial.`,
    ru: `${name} (${year}, ${country}) — ${role}. Компания развивает ${product}. Обзор Rybezh для каталога: позиционирование, сегмент и вопросы due diligence; инвестиционные и юридические факты проверяйте в реестрах и на официальном сайте.`
  };
  return texts[langKey] || texts.uk;
}

export function personProfileParagraphs(langKey, n, name, role, country, fk) {
  const focus = FOCUS_SNIPPET[langKey]?.[fk] || FOCUS_SNIPPET.uk[fk];
  const yrs = 6 + (n % 14);
  const seed = hash32(`person-body-${n}-${langKey}`);

  if (langKey === 'uk') {
    const blocks = [
      [
        `${name} працює на перетині «${role}» і практичної операційної роботи в регіоні ${country}. За ${yrs} років у галузі зосереджується на ${focus}, зазвичай в командах, де продукт уже має трафік, а головний виклик — стабільність процесів і передбачуваність результату.`,
        `У повсякденній роботі ${name} поєднує короткі цикли зворотного зв’язку з документованими стандартами: метрики, чеклісти релізів, ретроспективи після інцидентів. Колеги часто залучають її до складних trade-off між швидкістю змін і ризиком для клієнтського досвіду.`,
        `Для читачів каталогу Rybezh цей профіль — зріз того, як спеціаліст мислить задачами, а не список титулів. Перед контрактом або співбесідою звіряйте конкретні проєкти, публікації та рекомендації на LinkedIn, GitHub або корпоративних сторінках роботодавців.`
      ],
      [
        `Кар’єрний вектор ${name} пов’язаний із роллю «${role}» у контексті ${country}. Останні роки — ${focus}; типові клієнти або роботодавці — продуктові компанії середнього масштабу, де потрібно навести лад у процесах без «заморозки» розробки.`,
        `${name} описує свій стиль як «прозорі правила + делегування»: команда бачить, що вимірюється, хто приймає рішення в кризі, і як ескалуються конфлікти пріоритетів. Це особливо помітно в темі «${fk}», де помилки коштують дорого.`,
        `Сторінка не замінює CV: вона допомагає порівняти кілька кандидатів у каталозі за тоном, доменом і географією. Факти про освіту, сертифікати та контракти — лише з первинних джерел.`
      ],
      [
        `${name} у каталозі Rybezh позначена як ${role} з фокусом на ${focus}. Досвід ${yrs}+ років включає запуск нових напрямів, реструктуризацію команд після злиттів і впровадження інструментів, які зменшують ручну координацію.`,
        `У роботі зі стейкхолдерами ${name} наголошує на спільній мові цифр: один дашборд для продукту, фінансів і підтримки, щоб суперечки не зависали в чатах. У сегменті «${fk}» це часто вирішальніше за окремі «геройські» релізи.`,
        `Якщо ви шукаєте людину з подібним профілем у ${country}, використовуйте текст як орієнтир для інтерв’ю, а не як підтверджений висновок. Уточнюйте мандат, бюджет і звітність напряму.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  if (langKey === 'en') {
    const blocks = [
      [
        `${name} works at the intersection of “${role}” and hands-on delivery in ${country}. Over ${yrs} years the emphasis is on ${focus}, usually in teams that already have traction and need predictable execution more than another roadmap workshop.`,
        `Day to day, ${name} pairs short feedback loops with written standards: metrics, release checklists, post-incident reviews. Peers often pull them into trade-offs between speed and customer risk.`,
        `In the Rybezh catalogue this page is a lens on how the specialist frames problems—not a verified CV. Confirm projects, writing, and references on LinkedIn, GitHub, or employer sites before you hire or partner.`
      ],
      [
        `${name}'s trajectory aligns with “${role}” in ${country}. Recent work centres on ${focus}, typically with mid-scale product companies that must professionalise operations without freezing delivery.`,
        `Their style is “visible rules plus delegation”: the team knows what is measured, who decides in a crisis, and how priority conflicts escalate. That shows up clearly in the “${fk}” theme where mistakes are expensive.`,
        `Treat this entry as comparison material inside the directory. Education, certifications, and contracts should come only from primary sources.`
      ],
      [
        `Catalogued as ${role}, ${name} focuses on ${focus} with ${yrs}+ years of practice including new lines of business, post-merger team resets, and tooling that cuts manual coordination.`,
        `With stakeholders ${name} pushes a single metrics language across product, finance, and support so debates do not stall in chat. In “${fk}” segments that discipline often beats one-off hero releases.`,
        `If you are sourcing in ${country}, use the copy to shape interview questions, not as a final verdict. Validate mandate, budget, and reporting lines directly.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  if (langKey === 'es') {
    const blocks = [
      [
        `${name} trabaja en la intersección de «${role}» y ejecución real en ${country}. En ${yrs} años el foco ha sido ${focus}, sobre todo en equipos con tracción que necesitan previsibilidad más que otro taller de roadmap.`,
        `En el día a día combina bucles cortos de feedback con estándares escritos: métricas, checklists de release y revisiones post-incidente. Suele intervenir en trade-offs entre velocidad y riesgo para el cliente.`,
        `En el catálogo Rybezh esta ficha muestra cómo piensa la persona, no un CV verificado. Confirma proyectos y referencias en LinkedIn, GitHub o webs corporativas antes de contratar.`
      ],
      [
        `La trayectoria de ${name} encaja con «${role}» en ${country}. El trabajo reciente gira en ${focus}, con empresas de producto en escala media que deben profesionalizar operaciones sin frenar entregas.`,
        `Su estilo mezcla reglas visibles y delegación: el equipo sabe qué se mide, quién decide en crisis y cómo escalan conflictos de prioridad—especialmente en el tema «${fk}».`,
        `Usa la página para comparar candidatos en el directorio. Formación, certificados y contratos deben salir solo de fuentes primarias.`
      ],
      [
        `${name} figura como ${role} con foco en ${focus} y más de ${yrs} años de práctica: nuevas líneas, reorden de equipos tras fusiones y herramientas que reducen coordinación manual.`,
        `Con stakeholders impulsa un lenguaje común de métricas entre producto, finanzas y soporte. En segmentos «${fk}» esa disciplina suele pesar más que releases heroicos aislados.`,
        `Si buscas perfiles en ${country}, emplea el texto para entrevistas, no como veredicto. Valida mandato, presupuesto y reporting directamente.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  const blocks = [
    [
      `${name} работает на стыке роли «${role}» и практической поставки в регионе ${country}. За ${yrs} лет акцент на ${focus}, обычно в командах с трафиком, где важнее предсказуемость, чем ещё один воркшоп по roadmap.`,
      `В работе сочетает короткие циклы обратной связи с зафиксированными стандартами: метрики, чеклисты релизов, разборы инцидентов. Коллеги часто подключают к trade-off между скоростью и риском для клиента.`,
      `В каталоге Rybezh это взгляд на мышление специалиста, не проверенное резюме. Проекты и рекомендации сверяйте в LinkedIn, GitHub или на сайтах работодателей.`
    ],
    [
      `Траектория ${name} связана с «${role}» в ${country}. Последние годы — ${focus}; типичные работодатели — продуктовые компании среднего масштаба, которым нужен порядок в процессах без заморозки разработки.`,
      `Стиль — «прозрачные правила + делегирование»: команда видит метрики, знает, кто решает в кризисе и как эскалируются приоритеты. В теме «${fk}» это особенно заметно.`,
      `Страница помогает сравнить кандидатов в каталоге. Образование и контракты — только из первичных источников.`
    ],
    [
      `${name} в каталоге как ${role} с фокусом на ${focus}. Опыт ${yrs}+ лет: новые направления, перестройка команд после M&A, инструменты, снижающие ручную координацию.`,
      `Со стейкхолдерами продвигает единый язык метрик для продукта, финансов и поддержки. В сегменте «${fk}» дисциплина часто важнее разовых «героических» релизов.`,
      `При поиске в ${country} используйте текст для вопросов на интервью, не как финальный вывод. Уточняйте мандат и отчётность напрямую.`
    ]
  ];
  return blocks[seed % blocks.length];
}

export function startupProfileParagraphs(langKey, n, name, role, country, fk, year) {
  const product = PRODUCT_SNIPPET[langKey]?.[fk] || PRODUCT_SNIPPET.uk[fk];
  const team = 12 + (n % 180);
  const seed = hash32(`startup-body-${n}-${langKey}`);

  if (langKey === 'uk') {
    const blocks = [
      [
        `${name} — компанія сегменту «${role}», заснована у ${year} році; штаб-квартира або основний ринок — ${country}. Продуктова лінія зосереджена на тому, щоб дати клієнтам ${product} без зайвої складності інтеграції.`,
        `За оцінками ринку команда нараховує близько ${team} людей у продукті, інженерії та customer success. Типовий клієнт — середній B2B, який уже має legacy-процеси і шукає модульне рішення замість повної заміни стеку.`,
        `У каталозі Rybezh ця сторінка допомагає порівняти гравців теми «${fk}» за роком, географією та заявленим фокусом. Перед угодою перевіряйте домен, реєстрацію юрособи, раунди фінансування та публічні кейси на офіційних каналах.`
      ],
      [
        `${name} позиціонує себе як ${role} для команд, які масштабують операції після product-market fit. Ключова пропозиція — ${product}; рік заснування ${year}, базування — ${country}.`,
        `Go-to-market будується на пілотах із чіткими KPI: час онбордингу, відсоток автоматизованих сценаріїв, економія людино-годин. Компанія рідко конкурує ціною «знизу», натомість продає передбачуваність SLA та підтримку впровадження.`,
        `Огляд не є інвестмеморандумом: він фіксує, чому картка потрапила в фільтр «${fk}», і які питання варто поставити на першому дзвінку з фаундерами або IR.`
      ],
      [
        `Історія ${name} почалася у ${year} році в контексті ${country}, коли засновники побачили розрив між заявами конкурентів і реальною швидкістю впровадження. Сьогодні компанія розвиває ${product} і продає її як платформу з відкритими інтеграціями.`,
        `Організаційно ${name} тримає плоску структуру в продукті та сильну функцію solutions: інженери та консультанти супроводжують перші три місяці після запуску. Це типова модель для сегменту «${fk}», де відтік після пілоту дорогий.`,
        `Читачам каталогу варто пам’ятати: назва в Rybezh — редакційна мітка для навігації. Юридична особа, cap table і виручку звіряйте в реєстрах і звітах, а не лише за цим текстом.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  if (langKey === 'en') {
    const blocks = [
      [
        `${name} is a “${role}” company founded in ${year}; HQ or primary market: ${country}. The product line delivers ${product} with integration paths meant for teams that cannot pause legacy systems.`,
        `The organisation is roughly ${team} people across product, engineering, and customer success. Typical buyers are mid-market B2B accounts professionalising operations after early growth.`,
        `Inside Rybezh this page helps compare “${fk}” players by year, geography, and stated focus. Before a deal, verify domain, legal entity, funding rounds, and public case studies on official channels.`
      ],
      [
        `${name} sells ${role} capabilities to teams scaling past product-market fit. Core offer: ${product}; founded ${year}, based in ${country}.`,
        `GTM relies on pilots with explicit KPIs—onboarding time, automated workflow share, hours saved. The company competes on SLA predictability and implementation support more than on rock-bottom pricing.`,
        `This overview is not an investment memo; it records why the card sits in “${fk}” and which questions to ask founders or IR on a first call.`
      ],
      [
        `${name} started in ${year} in ${country} when founders saw a gap between competitor claims and real deployment speed. Today it ships ${product} as a platform with open integrations.`,
        `Structurally ${name} keeps product flat and solutions strong: engineers and consultants stay through the first ninety days post-launch—a common pattern in “${fk}” where pilot churn is costly.`,
        `Treat the Rybezh label as editorial navigation. Legal entity, cap table, and revenue belong in registries and filings, not inferred from this copy alone.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  if (langKey === 'es') {
    const blocks = [
      [
        `${name} es una empresa de «${role}» fundada en ${year}; sede o mercado principal: ${country}. Ofrece ${product} con rutas de integración pensadas para equipos que no pueden apagar sistemas legacy.`,
        `La organización ronda ${team} personas en producto, ingeniería y customer success. El comprador típico es B2B mid-market que profesionaliza operaciones tras el crecimiento inicial.`,
        `En Rybezh esta ficha ayuda a comparar jugadores «${fk}» por año, geografía y foco declarado. Antes de un acuerdo, verifica dominio, entidad legal, rondas y casos públicos en canales oficiales.`
      ],
      [
        `${name} vende capacidades de ${role} a equipos que escalan tras product-market fit. Propuesta central: ${product}; fundación ${year}, base en ${country}.`,
        `El GTM usa pilotos con KPI explícitos—tiempo de onboarding, porcentaje automatizado, horas ahorradas. Compite por SLA predecible y soporte de implementación más que por precio mínimo.`,
        `No es un memo de inversión: registra por qué la ficha está en «${fk}» y qué preguntar a fundadores o IR en la primera llamada.`
      ],
      [
        `${name} nació en ${year} en ${country} al detectar una brecha entre promesas del mercado y velocidad real de despliegue. Hoy entrega ${product} como plataforma con integraciones abiertas.`,
        `Mantiene producto plano y solutions fuerte: ingeniería y consultoría acompañan los primeros noventa días—patrón habitual en «${fk}» donde el churn post-piloto es caro.`,
        `La etiqueta Rybezh es navegación editorial. Entidad legal, cap table e ingresos deben salir de registros, no solo de este texto.`
      ]
    ];
    return blocks[seed % blocks.length];
  }

  const blocks = [
    [
      `${name} — компания сегмента «${role}», основана в ${year}; штаб-квартира или рынок: ${country}. Продукт даёт клиентам ${product} без лишней сложности интеграции.`,
      `В команде около ${team} человек в продукте, инженерии и customer success. Типичный клиент — mid-market B2B, которому нужен модульный слой поверх legacy.`,
      `В каталоге Rybezh страница сравнивает игроков «${fk}» по году и географии. Перед сделкой проверяйте домен, юрлицо, раунды и кейсы на официальных каналах.`
    ],
    [
      `${name} продаёт ${role} командам после product-market fit. Ядро — ${product}; год основания ${year}, база — ${country}.`,
      `GTM через пилоты с KPI: онбординг, доля автоматизации, экономия часов. Конкуренция за предсказуемость SLA и внедрение, а не за минимальную цену.`,
      `Это не инвестмеморандум: зафиксировано, почему карточка в «${fk}» и какие вопросы задать на первом звонке.`
    ],
    [
      `${name} появилась в ${year} в ${country}, увидев разрыв между обещаниями рынка и скоростью внедрения. Сейчас развивает ${product} как платформу с открытыми интеграциями.`,
      `Плоский продукт и сильная solutions: сопровождение первых девяноста дней — типичная модель в «${fk}», где отток после пилота дорог.`,
      `Метка Rybezh — навигация. Юрлицо, cap table и выручку сверяйте в реестрах, а не только по этому тексту.`
    ]
  ];
  return blocks[seed % blocks.length];
}

export function personFocusDetail(langKey, role, fk) {
  const focus = FOCUS_SNIPPET[langKey]?.[fk] || FOCUS_SNIPPET.uk[fk];
  const labels = {
    uk: `${role}; акцент на ${focus}`,
    en: `${role}; emphasis on ${focus}`,
    es: `${role}; énfasis en ${focus}`,
    ru: `${role}; акцент на ${focus}`
  };
  return labels[langKey] || labels.uk;
}

export function imgAltPerson(langKey, name) {
  const alts = {
    uk: `Портрет у стилі редакційного каталогу: ${name}`,
    en: `Editorial catalogue portrait: ${name}`,
    es: `Retrato editorial de catálogo: ${name}`,
    ru: `Редакционный портрет каталога: ${name}`
  };
  return alts[langKey] || alts.uk;
}

export function imgAltStartup(langKey, name) {
  const alts = {
    uk: `Офісна сцена для картки компанії: ${name}`,
    en: `Workplace scene for company card: ${name}`,
    es: `Escena laboral para ficha de empresa: ${name}`,
    ru: `Офисная сцена для карточки компании: ${name}`
  };
  return alts[langKey] || alts.uk;
}
