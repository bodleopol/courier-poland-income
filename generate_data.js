import fs from 'fs';

const langs = ['uk', 'en', 'ru', 'es'];

const t = (uk, en, ru, es) => ({ uk, en, ru, es });
const commons = file => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURI(file.replaceAll(' ', '_'))}?width=720`;
const logo = domain => `https://logo.clearbit.com/${domain}`;
const avatar = name => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true`;

const MIN_BIO_LENGTH = 280;

function bioAddition(person, lang) {
  const name = person.name[lang];
  const role = person.role[lang];
  const country = person.country[lang];
  const focus = person.focus[lang];
  const known = person.knownFor[lang];
  if (lang === 'uk') {
    return `Редакційний контекст: ${name} — ${role} (${country}). Відомий внесок: ${known}. Професійний фокус: ${focus}.`;
  }
  if (lang === 'en') {
    return `Editorial context: ${name} — ${role} (${country}). Known for: ${known}. Professional focus: ${focus}.`;
  }
  if (lang === 'ru') {
    return `Редакционный контекст: ${name} — ${role} (${country}). Известен вкладом: ${known}. Профессиональный фокус: ${focus}.`;
  }
  return `Contexto editorial: ${name} — ${role} (${country}). Reconocido por: ${known}. Enfoque profesional: ${focus}.`;
}

function bioTail(lang) {
  if (lang === 'uk') return ' Цей огляд тримає фокус на фактах карʼєри, географії та професійному позиціонуванні.';
  if (lang === 'en') return ' The overview stays concise while anchoring geography, role and contribution.';
  if (lang === 'ru') return ' Обзор остаётся компактным и опирается на географию, роль и вклад.';
  return ' El resumen permanece compacto y ancla geografía, rol y contribución.';
}

function enrichBio(person) {
  const out = {};
  for (const lang of langs) {
    let text = String(person.life[lang] ?? '').trim();
    if (text.length < MIN_BIO_LENGTH) {
      text = `${text} ${bioAddition(person, lang)}`.replace(/\s+/g, ' ').trim();
    }
    if (text.length < MIN_BIO_LENGTH) {
      text = `${text}${bioTail(lang)}`.replace(/\s+/g, ' ').trim();
    }
    out[lang] = text;
  }
  return out;
}

function regionalCountry(hqText, lang) {
  const raw = String(hqText ?? '').trim();
  if (!raw) return '';
  const parts = raw.split(/[,/|]/).map(s => s.trim()).filter(Boolean);
  const last = parts[parts.length - 1] || raw;
  if (lang === 'uk') {
    if (/україна/i.test(last)) return 'Україна';
    if (/united states|usa|сша/i.test(last)) return 'США';
    if (/united kingdom|britain|велика британія|великобританія/i.test(last)) return 'Велика Британія';
    if (/france|франція/i.test(last)) return 'Франція';
    if (/canada|канада/i.test(last)) return 'Канада';
    if (/germany|німеччин/i.test(last)) return 'Німеччина';
    if (/spain|іспанія/i.test(last)) return 'Іспанія';
    if (/польщ/i.test(last)) return 'Польща';
    if (/estonia|естонія/i.test(last)) return 'Естонія';
    if (/latvia|латвія/i.test(last)) return 'Латвія';
    if (/lithuania|литва/i.test(last)) return 'Литва';
    if (/netherlands|нідерланд/i.test(last)) return 'Нідерланди';
    if (/ireland|ірландія/i.test(last)) return 'Ірландія';
    if (/sweden|швеція/i.test(last)) return 'Швеція';
    if (/finland|фінляндія/i.test(last)) return 'Фінляндія';
    if (/india|індія/i.test(last)) return 'Індія';
    if (/china|кита/i.test(last)) return 'Китай';
    if (/japan|японія/i.test(last)) return 'Японія';
    if (/singapore|сінгапур/i.test(last)) return 'Сінгапур';
    if (/israel|ізраїль/i.test(last)) return 'Ізраїль';
    if (/australia|австралія/i.test(last)) return 'Австралія';
    if (/perú|перу/i.test(last)) return 'Перу';
    return last;
  }
  if (lang === 'ru') {
    if (/украин/i.test(last)) return 'Украина';
    if (/united states|usa|сша/i.test(last)) return 'США';
    if (/united kingdom|britain|великобритани/i.test(last)) return 'Великобритания';
    if (/france|франц/i.test(last)) return 'Франция';
    if (/canada|канад/i.test(last)) return 'Канада';
    if (/german/i.test(last)) return 'Германия';
    if (/spain|испани/i.test(last)) return 'Испания';
    if (/poland|польш/i.test(last)) return 'Польша';
    if (/estonia|эстони/i.test(last)) return 'Эстония';
    if (/latvia|латви/i.test(last)) return 'Латвия';
    if (/lithuania|литв/i.test(last)) return 'Литва';
    if (/netherlands|нидерланд/i.test(last)) return 'Нидерланды';
    if (/ireland|ирланд/i.test(last)) return 'Ирландия';
    if (/sweden|швед/i.test(last)) return 'Швеция';
    if (/finland|финлянд/i.test(last)) return 'Финляндия';
    if (/india|инди/i.test(last)) return 'Индия';
    if (/china|кита/i.test(last)) return 'Китай';
    if (/japan|япони/i.test(last)) return 'Япония';
    if (/singapore|сингапур/i.test(last)) return 'Сингапур';
    if (/israel|израил/i.test(last)) return 'Израиль';
    if (/australia|австрал/i.test(last)) return 'Австралия';
    if (/perú|перу/i.test(last)) return 'Перу';
    return last;
  }
  if (lang === 'es') {
    if (/ucrania|україн/i.test(last)) return 'Ucrania';
    if (/united states|usa|estados unidos/i.test(last)) return 'Estados Unidos';
    if (/united kingdom|reino unido/i.test(last)) return 'Reino Unido';
    if (/france|francia/i.test(last)) return 'Francia';
    if (/canada/i.test(last)) return 'Canadá';
    if (/germany|alemania/i.test(last)) return 'Alemania';
    if (/spain|españa/i.test(last)) return 'España';
    if (/poland|polonia/i.test(last)) return 'Polonia';
    if (/estonia/i.test(last)) return 'Estonia';
    if (/latvia|letonia/i.test(last)) return 'Letonia';
    if (/lithuania|lituania/i.test(last)) return 'Lituania';
    if (/netherlands|países bajos/i.test(last)) return 'Países Bajos';
    if (/ireland|irlanda/i.test(last)) return 'Irlanda';
    if (/sweden|suecia/i.test(last)) return 'Suecia';
    if (/finland|finlandia/i.test(last)) return 'Finlandia';
    if (/india/i.test(last)) return 'India';
    if (/china/i.test(last)) return 'China';
    if (/japan|japón/i.test(last)) return 'Japón';
    if (/singapore|singapur/i.test(last)) return 'Singapur';
    if (/israel/i.test(last)) return 'Israel';
    if (/australia/i.test(last)) return 'Australia';
    if (/perú|peru/i.test(last)) return 'Perú';
    return last;
  }
  // en default
  if (/ukrain/i.test(last)) return 'Ukraine';
  if (/united states|\busa\b/i.test(last)) return 'United States';
  if (/united kingdom|\buk\b/i.test(last)) return 'United Kingdom';
  if (/france/i.test(last)) return 'France';
  if (/canada/i.test(last)) return 'Canada';
  if (/germany/i.test(last)) return 'Germany';
  if (/spain/i.test(last)) return 'Spain';
  if (/poland/i.test(last)) return 'Poland';
  if (/estonia/i.test(last)) return 'Estonia';
  if (/latvia/i.test(last)) return 'Latvia';
  if (/lithuania/i.test(last)) return 'Lithuania';
  if (/netherlands/i.test(last)) return 'Netherlands';
  if (/ireland/i.test(last)) return 'Ireland';
  if (/sweden/i.test(last)) return 'Sweden';
  if (/finland/i.test(last)) return 'Finland';
  if (/india/i.test(last)) return 'India';
  if (/china/i.test(last)) return 'China';
  if (/japan/i.test(last)) return 'Japan';
  if (/singapore/i.test(last)) return 'Singapore';
  if (/israel/i.test(last)) return 'Israel';
  if (/australia/i.test(last)) return 'Australia';
  if (/peru/i.test(last)) return 'Peru';
  return last;
}

function enrichStartupSummary(company, details) {
  const minLen = 220;
  const out = {};
  for (const lang of langs) {
    let base = String(company.summary[lang] ?? '').trim();
    const hq = details?.hq?.[lang];
    const market = details?.market?.[lang];
    const notable = details?.notableFor?.[lang];
    const bits = [];
    if (hq) bits.push(hq);
    if (market) bits.push(market);
    if (notable) bits.push(notable);
    let extra = '';
    if (lang === 'uk') extra = bits.length ? ` Додатковий контекст: ${bits.join(' · ')}.` : '';
    else if (lang === 'en') extra = bits.length ? ` Additional context: ${bits.join(' · ')}.` : '';
    else if (lang === 'ru') extra = bits.length ? ` Дополнительный контекст: ${bits.join(' · ')}.` : '';
    else extra = bits.length ? ` Contexto adicional: ${bits.join(' · ')}.` : '';
    let text = `${base}${extra}`.replace(/\s+/g, ' ').trim();
    if (text.length < minLen && notable) {
      text = `${base} ${notable}.${extra}`.replace(/\s+/g, ' ').trim();
    }
    out[lang] = text;
  }
  return out;
}

const specialists = [
  {
    slug: 'ada-lovelace',
    image: commons('Ada_Lovelace_portrait.jpg'),
    name: t('Ада Лавлейс', 'Ada Lovelace', 'Ада Лавлейс', 'Ada Lovelace'),
    role: t('Піонерка програмування', 'Programming pioneer', 'Пионер программирования', 'Pionera de la programación'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('алгоритми, аналітичні машини, математичне моделювання', 'algorithms, analytical engines, mathematical modelling', 'алгоритмы, аналитические машины, математическое моделирование', 'algoritmos, máquinas analíticas y modelado matemático'),
    knownFor: t('перший опис алгоритму для обчислювальної машини Чарльза Беббіджа', 'the first published algorithm for Charles Babbage\'s analytical engine', 'первое опубликованное описание алгоритма для аналитической машины Чарльза Бэббиджа', 'el primer algoritmo publicado para la máquina analítica de Charles Babbage'),
    life: t('Її нотатки поєднали математику з баченням машин, здатних працювати не лише з числами, а й із символами та музикою.', 'Her notes joined mathematics with a broader vision of machines that could work with symbols, music and ideas, not only numbers.', 'Ее заметки соединили математику с представлением о машинах, которые могут работать не только с числами, но и с символами и музыкой.', 'Sus notas unieron matemáticas con una visión de máquinas capaces de trabajar no solo con números, sino también con símbolos y música.'),
    tags: ['software', 'research', 'history']
  },
  {
    slug: 'grace-hopper',
    image: commons('Commodore_Grace_M._Hopper,_USN_(covered).jpg'),
    name: t('Грейс Гоппер', 'Grace Hopper', 'Грейс Хоппер', 'Grace Hopper'),
    role: t('Компʼютерна науковиця та контрадмірал', 'Computer scientist and rear admiral', 'Компьютерный ученый и контр-адмирал', 'Científica informática y contraalmirante'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('компілятори, COBOL, стандарти програмування', 'compilers, COBOL, programming standards', 'компиляторы, COBOL, стандарты программирования', 'compiladores, COBOL y estándares de programación'),
    knownFor: t('популяризацію машинно-незалежних мов програмування', 'popularising machine-independent programming languages', 'популяризацию машинно-независимых языков программирования', 'popularizar lenguajes de programación independientes de la máquina'),
    life: t('Вона працювала на перетині науки, флоту та промисловості, роблячи програмування зрозумілішим для широких команд.', 'She worked across science, the navy and industry, making software development more understandable for large teams.', 'Она работала на стыке науки, флота и индустрии, делая разработку программ понятнее для больших команд.', 'Trabajó entre ciencia, marina e industria, haciendo el desarrollo de software más comprensible para equipos amplios.'),
    tags: ['software', 'operations', 'education']
  },
  {
    slug: 'margaret-hamilton',
    image: commons('Margaret_Hamilton_-_restoration.jpg'),
    name: t('Маргарет Гамільтон', 'Margaret Hamilton', 'Маргарет Гамильтон', 'Margaret Hamilton'),
    role: t('Інженерка програмного забезпечення', 'Software engineer', 'Инженер программного обеспечения', 'Ingeniera de software'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('надійні системи, космічне ПЗ, системна архітектура', 'reliable systems, space software, systems architecture', 'надежные системы, космическое ПО, системная архитектура', 'sistemas fiables, software espacial y arquitectura de sistemas'),
    knownFor: t('керівництво розробкою бортового ПЗ Apollo', 'leading the Apollo flight software effort', 'руководство разработкой бортового ПО Apollo', 'liderar el software de vuelo de Apollo'),
    life: t('Її робота показала, що програмне забезпечення може бути критичною інженерною дисципліною з власними методами контролю ризику.', 'Her work helped define software as a critical engineering discipline with its own methods for managing risk.', 'Ее работа показала, что программное обеспечение является критической инженерной дисциплиной со своими методами управления риском.', 'Su trabajo ayudó a definir el software como disciplina crítica de ingeniería con métodos propios de control de riesgo.'),
    tags: ['software', 'space', 'engineering']
  },
  {
    slug: 'katherine-johnson',
    image: commons('Katherine_Johnson_1983.jpg'),
    name: t('Кетрін Джонсон', 'Katherine Johnson', 'Кэтрин Джонсон', 'Katherine Johnson'),
    role: t('Математикиня NASA', 'NASA mathematician', 'Математик NASA', 'Matemática de NASA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('орбітальна механіка, траєкторії польотів, аналітика місій', 'orbital mechanics, flight trajectories, mission analysis', 'орбитальная механика, траектории полетов, аналитика миссий', 'mecánica orbital, trayectorias de vuelo y análisis de misiones'),
    knownFor: t('розрахунки траєкторій для Mercury та Apollo', 'trajectory calculations for Mercury and Apollo missions', 'расчеты траекторий для миссий Mercury и Apollo', 'cálculos de trayectoria para Mercury y Apollo'),
    life: t('Її точність і спокійна експертиза стали частиною фундаменту ранньої пілотованої космонавтики.', 'Her precision and calm expertise became part of the foundation of early human spaceflight.', 'Ее точность и спокойная экспертиза стали частью фундамента ранней пилотируемой космонавтики.', 'Su precisión y experiencia serena formaron parte de la base de los primeros vuelos espaciales tripulados.'),
    tags: ['science', 'space', 'mathematics']
  },
  {
    slug: 'mae-jemison',
    image: commons('Mae_Jemison_in_Space.jpg'),
    name: t('Мей Джемісон', 'Mae Jemison', 'Мэй Джемисон', 'Mae Jemison'),
    role: t('Астронавтка, лікарка та інженерна лідерка', 'Astronaut, physician and engineering leader', 'Астронавт, врач и инженерный лидер', 'Astronauta, médica y líder de ingeniería'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('космос, медицина, STEM-освіта, технологічні місії', 'space, medicine, STEM education, technology missions', 'космос, медицина, STEM-образование, технологические миссии', 'espacio, medicina, educación STEM y misiones tecnológicas'),
    knownFor: t('першу афроамериканську жінку в космосі', 'becoming the first Black woman in space', 'статус первой афроамериканки в космосе', 'ser la primera mujer afroamericana en el espacio'),
    life: t('Після польоту вона розвивала освітні й технологічні ініціативи, що відкривають науку для ширших спільнот.', 'After her flight she built education and technology initiatives that make science accessible to wider communities.', 'После полета она развивала образовательные и технологические инициативы, открывающие науку для широких сообществ.', 'Tras su vuelo impulsó iniciativas educativas y tecnológicas que acercan la ciencia a comunidades más amplias.'),
    tags: ['space', 'science', 'education']
  },
  {
    slug: 'yuri-gagarin',
    image: commons('Yuri_Gagarin_(1961)_-_Restoration.jpg'),
    name: t('Юрій Гагарін', 'Yuri Gagarin', 'Юрий Гагарин', 'Yuri Gagarin'),
    role: t('Космонавт', 'Cosmonaut', 'Космонавт', 'Cosmonauta'),
    country: t('СРСР', 'Soviet Union', 'СССР', 'Unión Soviética'),
    focus: t('пілотована космонавтика, льотна підготовка, випробування', 'human spaceflight, pilot training, flight testing', 'пилотируемая космонавтика, летная подготовка, испытания', 'vuelos espaciales tripulados, entrenamiento de pilotos y pruebas'),
    knownFor: t('перший політ людини в космос', 'the first human journey into outer space', 'первый полет человека в космос', 'el primer viaje humano al espacio exterior'),
    life: t('Політ “Восток-1” зробив його символом космічної епохи та показав масштаби інженерних команд за кожною місією.', 'The Vostok 1 flight made him a symbol of the space age and revealed the scale of engineering teams behind every mission.', 'Полет «Восток-1» сделал его символом космической эпохи и показал масштаб инженерных команд за каждой миссией.', 'El vuelo Vostok 1 lo convirtió en símbolo de la era espacial y mostró la escala de los equipos de ingeniería detrás de cada misión.'),
    tags: ['space', 'aviation', 'history']
  },
  {
    slug: 'valentina-tereshkova',
    image: commons('RIAN_archive_612748_Valentina_Tereshkova.jpg'),
    name: t('Валентина Терешкова', 'Valentina Tereshkova', 'Валентина Терешкова', 'Valentina Tereshkova'),
    role: t('Космонавтка', 'Cosmonaut', 'Космонавт', 'Cosmonauta'),
    country: t('СРСР', 'Soviet Union', 'СССР', 'Unión Soviética'),
    focus: t('космічні польоти, випробування, громадська діяльність', 'spaceflight, testing, public service', 'космические полеты, испытания, общественная деятельность', 'vuelos espaciales, pruebas y servicio público'),
    knownFor: t('першу жінку в космосі', 'becoming the first woman in space', 'статус первой женщины в космосе', 'ser la primera mujer en el espacio'),
    life: t('Її місія стала історичним прикладом того, як інженерія, підготовка й особиста витривалість змінюють уявлення про можливе.', 'Her mission became a historic example of engineering, training and personal endurance expanding what society considered possible.', 'Ее миссия стала историческим примером того, как инженерия, подготовка и личная выносливость меняют представления о возможном.', 'Su misión fue un ejemplo histórico de cómo ingeniería, entrenamiento y resistencia personal amplían lo posible.'),
    tags: ['space', 'leadership', 'history']
  },
  {
    slug: 'tim-berners-lee',
    image: commons('Sir_Tim_Berners-Lee_(cropped).jpg'),
    name: t('Тім Бернерс-Лі', 'Tim Berners-Lee', 'Тим Бернерс-Ли', 'Tim Berners-Lee'),
    role: t('Винахідник World Wide Web', 'Inventor of the World Wide Web', 'Изобретатель World Wide Web', 'Inventor de la World Wide Web'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('відкритий веб, протоколи, цифрові права', 'open web, protocols, digital rights', 'открытый веб, протоколы, цифровые права', 'web abierta, protocolos y derechos digitales'),
    knownFor: t('створення HTTP, HTML, URL та концепції вебу', 'creating HTTP, HTML, URL concepts and the Web itself', 'создание HTTP, HTML, URL и самой концепции веба', 'crear HTTP, HTML, URL y la web moderna'),
    life: t('Його підхід зробив інтернет платформою для спільних знань, бізнесу, науки та культури.', 'His approach turned the internet into a platform for shared knowledge, business, science and culture.', 'Его подход сделал интернет платформой для знаний, бизнеса, науки и культуры.', 'Su enfoque convirtió internet en una plataforma para conocimiento compartido, negocios, ciencia y cultura.'),
    tags: ['software', 'internet', 'standards']
  },
  {
    slug: 'linus-torvalds',
    image: commons('LinuxCon_Europe_Linus_Torvalds_03_(cropped).jpg'),
    name: t('Лінус Торвальдс', 'Linus Torvalds', 'Линус Торвальдс', 'Linus Torvalds'),
    role: t('Інженер ПЗ, засновник Linux', 'Software engineer, creator of Linux', 'Инженер ПО, создатель Linux', 'Ingeniero de software, creador de Linux'),
    country: t('Фінляндія / США', 'Finland / United States', 'Финляндия / США', 'Finlandia / Estados Unidos'),
    focus: t('ядра ОС, open source, розподілена розробка', 'operating-system kernels, open source, distributed development', 'ядра ОС, open source, распределенная разработка', 'núcleos de sistemas operativos, código abierto y desarrollo distribuido'),
    knownFor: t('Linux та Git', 'Linux and Git', 'Linux и Git', 'Linux y Git'),
    life: t('Його інструменти стали інфраструктурою для серверів, хмарних платформ, мобільних пристроїв і команд розробників.', 'His tools became infrastructure for servers, cloud platforms, mobile devices and software teams.', 'Его инструменты стали инфраструктурой для серверов, облаков, мобильных устройств и команд разработчиков.', 'Sus herramientas se volvieron infraestructura para servidores, nubes, dispositivos móviles y equipos de software.'),
    tags: ['software', 'open-source', 'infrastructure']
  },
  {
    slug: 'guido-van-rossum',
    image: commons('Guido_van_Rossum_OSCON_2006.jpg'),
    name: t('Гвідо ван Россум', 'Guido van Rossum', 'Гвидо ван Россум', 'Guido van Rossum'),
    role: t('Програміст, творець Python', 'Programmer, creator of Python', 'Программист, создатель Python', 'Programador, creador de Python'),
    country: t('Нідерланди / США', 'Netherlands / United States', 'Нидерланды / США', 'Países Bajos / Estados Unidos'),
    focus: t('мови програмування, читабельність коду, спільноти розробників', 'programming languages, code readability, developer communities', 'языки программирования, читаемость кода, сообщества разработчиков', 'lenguajes de programación, legibilidad del código y comunidades de desarrolladores'),
    knownFor: t('створення Python', 'creating Python', 'создание Python', 'crear Python'),
    life: t('Python став мовою для освіти, веброзробки, науки про дані, автоматизації й машинного навчання.', 'Python became a language for education, web development, data science, automation and machine learning.', 'Python стал языком для образования, веб-разработки, науки о данных, автоматизации и машинного обучения.', 'Python se convirtió en lenguaje para educación, web, ciencia de datos, automatización y aprendizaje automático.'),
    tags: ['software', 'language-design', 'education']
  },
  {
    slug: 'radia-perlman',
    image: commons('Radia_Perlman_2009.jpg'),
    name: t('Радія Перлман', 'Radia Perlman', 'Радия Перлман', 'Radia Perlman'),
    role: t('Мережева інженерка', 'Network engineer', 'Сетевой инженер', 'Ingeniera de redes'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('мережеві протоколи, стійкість інфраструктури, безпека', 'network protocols, resilient infrastructure, security', 'сетевые протоколы, устойчивость инфраструктуры, безопасность', 'protocolos de red, infraestructura resiliente y seguridad'),
    knownFor: t('алгоритм Spanning Tree Protocol', 'the Spanning Tree Protocol algorithm', 'алгоритм Spanning Tree Protocol', 'el algoritmo Spanning Tree Protocol'),
    life: t('Її робота допомогла Ethernet-мережам масштабуватися без руйнівних петель і стала базою сучасної мережевої інженерії.', 'Her work helped Ethernet networks scale without destructive loops and became a foundation of modern network engineering.', 'Ее работа помогла Ethernet-сетям масштабироваться без разрушительных петель и стала базой современной сетевой инженерии.', 'Su trabajo permitió escalar redes Ethernet sin bucles destructivos y se volvió base de la ingeniería de redes moderna.'),
    tags: ['engineering', 'internet', 'infrastructure']
  },
  {
    slug: 'fei-fei-li',
    image: commons('Fei-Fei_Li_at_AI_for_Good_2017.jpg'),
    name: t('Фей-Фей Лі', 'Fei-Fei Li', 'Фэй-Фэй Ли', 'Fei-Fei Li'),
    role: t('Дослідниця штучного інтелекту', 'AI researcher', 'Исследовательница ИИ', 'Investigadora de IA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('компʼютерний зір, відповідальний ШІ, освіта', 'computer vision, responsible AI, education', 'компьютерное зрение, ответственный ИИ, образование', 'visión por computador, IA responsable y educación'),
    knownFor: t('ImageNet та розвиток візуального розпізнавання', 'ImageNet and advances in visual recognition', 'ImageNet и развитие визуального распознавания', 'ImageNet y avances en reconocimiento visual'),
    life: t('Вона поєднує фундаментальні дослідження з публічною розмовою про людськоцентричний ШІ.', 'She combines foundational research with public work on human-centred AI.', 'Она сочетает фундаментальные исследования с публичной работой над человекоцентричным ИИ.', 'Combina investigación fundamental con trabajo público sobre IA centrada en las personas.'),
    tags: ['ai', 'research', 'education']
  },
  {
    slug: 'yann-lecun',
    image: commons('Yann_LeCun_-_2018_(cropped).jpg'),
    name: t('Ян Лекун', 'Yann LeCun', 'Ян Лекун', 'Yann LeCun'),
    role: t('Дослідник ШІ, лауреат премії Тюрінга', 'AI researcher, Turing Award laureate', 'Исследователь ИИ, лауреат премии Тьюринга', 'Investigador de IA, premio Turing'),
    country: t('Франція / США', 'France / United States', 'Франция / США', 'Francia / Estados Unidos'),
    focus: t('глибоке навчання, компʼютерний зір, самонавчальні системи', 'deep learning, computer vision, self-supervised systems', 'глубокое обучение, компьютерное зрение, самообучающиеся системы', 'aprendizaje profundo, visión por computador y sistemas autosupervisados'),
    knownFor: t('згорткові нейронні мережі та фундаментальний внесок у deep learning', 'convolutional neural networks and foundational deep-learning work', 'сверточные нейронные сети и фундаментальный вклад в deep learning', 'redes neuronales convolucionales y aportes clave al deep learning'),
    life: t('Його дослідження вплинули на розпізнавання зображень, документообіг, робототехніку та сучасні AI-платформи.', 'His research influenced image recognition, document processing, robotics and modern AI platforms.', 'Его исследования повлияли на распознавание изображений, обработку документов, робототехнику и современные AI-платформы.', 'Su investigación influyó en reconocimiento de imágenes, procesamiento documental, robótica y plataformas modernas de IA.'),
    tags: ['ai', 'research', 'science']
  },
  {
    slug: 'demis-hassabis',
    image: commons('Demis_Hassabis_Royal_Society.jpg'),
    name: t('Деміс Хассабіс', 'Demis Hassabis', 'Демис Хассабис', 'Demis Hassabis'),
    role: t('CEO Google DeepMind, дослідник ШІ', 'CEO of Google DeepMind, AI researcher', 'CEO Google DeepMind, исследователь ИИ', 'CEO de Google DeepMind, investigador de IA'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('штучний інтелект, нейронаука, наукові відкриття', 'artificial intelligence, neuroscience, scientific discovery', 'искусственный интеллект, нейронаука, научные открытия', 'inteligencia artificial, neurociencia y descubrimiento científico'),
    knownFor: t('DeepMind, AlphaGo та AlphaFold', 'DeepMind, AlphaGo and AlphaFold', 'DeepMind, AlphaGo и AlphaFold', 'DeepMind, AlphaGo y AlphaFold'),
    life: t('Він будує команди, які переводять прориви ШІ з лабораторії у складні задачі біології, ігор та науки.', 'He builds teams that move AI breakthroughs from the lab into difficult problems in biology, games and science.', 'Он строит команды, переводящие прорывы ИИ из лаборатории к сложным задачам биологии, игр и науки.', 'Construye equipos que llevan avances de IA del laboratorio a problemas complejos en biología, juegos y ciencia.'),
    tags: ['ai', 'ceo', 'research']
  },
  {
    slug: 'ilya-sutskever',
    image: commons('Ilya_Sutskever_2017.jpg'),
    name: t('Ілля Суцкевер', 'Ilya Sutskever', 'Илья Суцкевер', 'Ilya Sutskever'),
    role: t('Дослідник машинного навчання', 'Machine-learning researcher', 'Исследователь машинного обучения', 'Investigador de aprendizaje automático'),
    country: t('Канада / Ізраїль / США', 'Canada / Israel / United States', 'Канада / Израиль / США', 'Canadá / Israel / Estados Unidos'),
    focus: t('нейронні мережі, великі моделі, безпека ШІ', 'neural networks, large models, AI safety', 'нейронные сети, большие модели, безопасность ИИ', 'redes neuronales, grandes modelos y seguridad de IA'),
    knownFor: t('співзаснування OpenAI та внесок у глибоке навчання', 'co-founding OpenAI and contributing to deep learning', 'соосновательство OpenAI и вклад в глубокое обучение', 'cofundar OpenAI y aportar al aprendizaje profundo'),
    life: t('Його наукова робота стала частиною розвитку моделей, що змінили обробку мови, зору та генеративні системи.', 'His scientific work became part of the model advances that changed language processing, vision and generative systems.', 'Его научная работа стала частью развития моделей, изменивших обработку языка, зрения и генеративные системы.', 'Su trabajo científico formó parte de avances que cambiaron lenguaje, visión y sistemas generativos.'),
    tags: ['ai', 'research', 'startup']
  },
  {
    slug: 'sam-altman',
    image: commons('Sam_Altman_2024.jpg'),
    name: t('Сем Альтман', 'Sam Altman', 'Сэм Альтман', 'Sam Altman'),
    role: t('CEO OpenAI, інвестор', 'CEO of OpenAI, investor', 'CEO OpenAI, инвестор', 'CEO de OpenAI, inversor'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('штучний інтелект, стартапи, технологічна стратегія', 'artificial intelligence, startups, technology strategy', 'искусственный интеллект, стартапы, технологическая стратегия', 'inteligencia artificial, startups y estrategia tecnológica'),
    knownFor: t('керівництво OpenAI та попередню роботу в Y Combinator', 'leading OpenAI and earlier work at Y Combinator', 'руководство OpenAI и прежнюю работу в Y Combinator', 'liderar OpenAI y su trabajo previo en Y Combinator'),
    life: t('Його карʼєра поєднує інкубацію стартапів, інвестиції та управління продуктами, що швидко входять у масове використання.', 'His career combines startup incubation, investing and managing products that quickly enter mainstream use.', 'Его карьера объединяет инкубацию стартапов, инвестиции и управление продуктами, быстро входящими в массовое использование.', 'Su carrera combina incubación de startups, inversión y gestión de productos que entran rápido al uso masivo.'),
    tags: ['ai', 'ceo', 'startup']
  },
  {
    slug: 'elon-musk',
    image: commons('Elon_Musk_Royal_Society.jpg'),
    name: t('Ілон Маск', 'Elon Musk', 'Илон Маск', 'Elon Musk'),
    role: t('Підприємець та CEO', 'Entrepreneur and CEO', 'Предприниматель и CEO', 'Emprendedor y CEO'),
    country: t('ПАР / США', 'South Africa / United States', 'ЮАР / США', 'Sudáfrica / Estados Unidos'),
    focus: t('електромобілі, космос, енергетика, інфраструктура', 'electric vehicles, space, energy, infrastructure', 'электромобили, космос, энергетика, инфраструктура', 'vehículos eléctricos, espacio, energía e infraestructura'),
    knownFor: t('Tesla, SpaceX, Starlink та інші технологічні компанії', 'Tesla, SpaceX, Starlink and other technology companies', 'Tesla, SpaceX, Starlink и другие технологические компании', 'Tesla, SpaceX, Starlink y otras empresas tecnológicas'),
    life: t('Він просуває масштабні інженерні програми, де продукт, виробництво та програмне забезпечення розглядаються як єдина система.', 'He drives large engineering programs where product, manufacturing and software are treated as one system.', 'Он продвигает крупные инженерные программы, где продукт, производство и ПО рассматриваются как единая система.', 'Impulsa programas de ingeniería donde producto, fabricación y software se tratan como un solo sistema.'),
    tags: ['ceo', 'engineering', 'space']
  },
  {
    slug: 'jensen-huang',
    image: commons('Jensen_Huang_2023.jpg'),
    name: t('Дженсен Хуанг', 'Jensen Huang', 'Дженсен Хуанг', 'Jensen Huang'),
    role: t('CEO NVIDIA', 'CEO of NVIDIA', 'CEO NVIDIA', 'CEO de NVIDIA'),
    country: t('Тайвань / США', 'Taiwan / United States', 'Тайвань / США', 'Taiwán / Estados Unidos'),
    focus: t('графічні процесори, AI-обчислення, апаратна інфраструктура', 'GPUs, AI computing, hardware infrastructure', 'графические процессоры, AI-вычисления, аппаратная инфраструктура', 'GPU, cómputo de IA e infraestructura de hardware'),
    knownFor: t('перетворення NVIDIA на ключову платформу для ШІ', 'turning NVIDIA into a key platform for AI computing', 'превращение NVIDIA в ключевую платформу AI-вычислений', 'convertir NVIDIA en plataforma clave para el cómputo de IA'),
    life: t('Його управління поєднує довгострокову ставку на архітектуру чипів із екосистемою розробників.', 'His leadership combines a long-term bet on chip architecture with a developer ecosystem.', 'Его управление сочетает долгосрочную ставку на архитектуру чипов с экосистемой разработчиков.', 'Su liderazgo combina una apuesta de largo plazo por arquitectura de chips con un ecosistema de desarrolladores.'),
    tags: ['ceo', 'hardware', 'ai']
  },
  {
    slug: 'lisa-su',
    image: commons('Lisa_Su_2015.jpg'),
    name: t('Ліза Су', 'Lisa Su', 'Лиза Су', 'Lisa Su'),
    role: t('CEO AMD, інженерка-електронниця', 'CEO of AMD, electrical engineer', 'CEO AMD, инженер-электронщик', 'CEO de AMD, ingeniera eléctrica'),
    country: t('Тайвань / США', 'Taiwan / United States', 'Тайвань / США', 'Taiwán / Estados Unidos'),
    focus: t('напівпровідники, високопродуктивні обчислення, корпоративна стратегія', 'semiconductors, high-performance computing, corporate strategy', 'полупроводники, высокопроизводительные вычисления, корпоративная стратегия', 'semiconductores, computación de alto rendimiento y estrategia corporativa'),
    knownFor: t('поворот AMD до конкурентних процесорних платформ', 'leading AMD\'s turnaround into competitive processor platforms', 'разворот AMD к конкурентным процессорным платформам', 'liderar el giro de AMD hacia plataformas de procesadores competitivas'),
    life: t('Її інженерна дисципліна й фокус на дорожніх картах продуктів стали прикладом технічного CEO.', 'Her engineering discipline and focus on product roadmaps became a model for technical CEOs.', 'Ее инженерная дисциплина и фокус на продуктовых дорожных картах стали примером технического CEO.', 'Su disciplina de ingeniería y foco en hojas de ruta de producto son modelo de liderazgo técnico.'),
    tags: ['ceo', 'hardware', 'operations']
  },
  {
    slug: 'gwynne-shotwell',
    image: commons('Gwynne_Shotwell_at_2018_Commercial_Crew_announcement.jpg'),
    name: t('Ґвінн Шотвелл', 'Gwynne Shotwell', 'Гвинн Шотвелл', 'Gwynne Shotwell'),
    role: t('Президентка та COO SpaceX', 'President and COO of SpaceX', 'Президент и COO SpaceX', 'Presidenta y COO de SpaceX'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('операційне управління, космічні запуски, комерційні контракти', 'operations, space launches, commercial contracts', 'операционное управление, космические запуски, коммерческие контракты', 'operaciones, lanzamientos espaciales y contratos comerciales'),
    knownFor: t('масштабування комерційних запусків SpaceX', 'scaling SpaceX commercial launch operations', 'масштабирование коммерческих запусков SpaceX', 'escalar las operaciones comerciales de lanzamiento de SpaceX'),
    life: t('Вона є прикладом операційного керівника, який перетворює складну інженерію на повторюваний бізнес-процес.', 'She is an example of an operations leader turning complex engineering into a repeatable business process.', 'Она является примером операционного руководителя, превращающего сложную инженерию в повторяемый бизнес-процесс.', 'Es ejemplo de liderazgo operativo que convierte ingeniería compleja en proceso empresarial repetible.'),
    tags: ['coo', 'space', 'operations']
  },
  {
    slug: 'safra-catz',
    image: commons('Safra_Catz_-_World_Economic_Forum_Annual_Meeting_2012.jpg'),
    name: t('Сафра Кац', 'Safra Catz', 'Сафра Кац', 'Safra Catz'),
    role: t('CEO Oracle', 'CEO of Oracle', 'CEO Oracle', 'CEO de Oracle'),
    country: t('Ізраїль / США', 'Israel / United States', 'Израиль / США', 'Israel / Estados Unidos'),
    focus: t('корпоративне ПЗ, фінанси, M&A, операційна ефективність', 'enterprise software, finance, M&A, operational efficiency', 'корпоративное ПО, финансы, M&A, операционная эффективность', 'software empresarial, finanzas, fusiones y eficiencia operativa'),
    knownFor: t('керівництво Oracle у період великих корпоративних угод і хмарної трансформації', 'leading Oracle through major enterprise deals and cloud transformation', 'руководство Oracle в период крупных корпоративных сделок и облачной трансформации', 'liderar Oracle durante grandes acuerdos empresariales y transformación cloud'),
    life: t('Її профіль важливий для розуміння ролі фінансової дисципліни та операцій у великих технологічних компаніях.', 'Her profile is important for understanding the role of financial discipline and operations in large technology companies.', 'Ее профиль важен для понимания роли финансовой дисциплины и операций в крупных технологических компаниях.', 'Su perfil ayuda a entender el papel de disciplina financiera y operaciones en grandes tecnológicas.'),
    tags: ['ceo', 'operations', 'enterprise']
  },
  {
    slug: 'mary-barra',
    image: commons('Mary_Barra_2014.jpg'),
    name: t('Мері Барра', 'Mary Barra', 'Мэри Барра', 'Mary Barra'),
    role: t('CEO General Motors', 'CEO of General Motors', 'CEO General Motors', 'CEO de General Motors'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('автомобільна інженерія, електрифікація, виробничі системи', 'automotive engineering, electrification, manufacturing systems', 'автомобильная инженерия, электрификация, производственные системы', 'ingeniería automotriz, electrificación y sistemas de fabricación'),
    knownFor: t('трансформацію GM у напрямі електромобілів і програмно-керованих авто', 'transforming GM toward electric and software-defined vehicles', 'трансформацию GM в сторону электромобилей и программно-управляемых авто', 'transformar GM hacia vehículos eléctricos y definidos por software'),
    life: t('Її карʼєра від інженерних ролей до CEO демонструє, як операційні знання впливають на стратегічні рішення.', 'Her path from engineering roles to CEO shows how operational knowledge shapes strategic decisions.', 'Ее путь от инженерных ролей до CEO показывает, как операционные знания влияют на стратегию.', 'Su paso de ingeniería a CEO muestra cómo el conocimiento operativo moldea decisiones estratégicas.'),
    tags: ['ceo', 'engineering', 'operations']
  },
  {
    slug: 'satya-nadella',
    image: commons('Satya_Nadella_2023.jpg'),
    name: t('Сатья Наделла', 'Satya Nadella', 'Сатья Наделла', 'Satya Nadella'),
    role: t('CEO Microsoft', 'CEO of Microsoft', 'CEO Microsoft', 'CEO de Microsoft'),
    country: t('Індія / США', 'India / United States', 'Индия / США', 'India / Estados Unidos'),
    focus: t('хмарні сервіси, корпоративне ПЗ, AI-стратегія', 'cloud services, enterprise software, AI strategy', 'облачные сервисы, корпоративное ПО, AI-стратегия', 'servicios cloud, software empresarial y estrategia de IA'),
    knownFor: t('переорієнтацію Microsoft на cloud, open source та AI', 'reorienting Microsoft around cloud, open source and AI', 'переориентацию Microsoft на cloud, open source и AI', 'reorientar Microsoft hacia cloud, código abierto e IA'),
    life: t('Його управління часто розглядають як приклад культурної трансформації великої технологічної організації.', 'His leadership is often studied as an example of cultural transformation in a large technology organisation.', 'Его управление часто изучают как пример культурной трансформации крупной технологической организации.', 'Su liderazgo se estudia como ejemplo de transformación cultural en una gran tecnológica.'),
    tags: ['ceo', 'cloud', 'ai']
  },
  {
    slug: 'katalin-kariko',
    image: commons('Katalin_Kariko_2021_(cropped).jpg'),
    name: t('Каталін Каріко', 'Katalin Kariko', 'Каталин Карико', 'Katalin Kariko'),
    role: t('Біохімікиня, лауреатка Нобелівської премії', 'Biochemist, Nobel laureate', 'Биохимик, лауреат Нобелевской премии', 'Bioquímica, premio Nobel'),
    country: t('Угорщина / США', 'Hungary / United States', 'Венгрия / США', 'Hungría / Estados Unidos'),
    focus: t('мРНК, біотехнології, трансляційна медицина', 'mRNA, biotechnology, translational medicine', 'мРНК, биотехнологии, трансляционная медицина', 'ARNm, biotecnología y medicina traslacional'),
    knownFor: t('фундаментальний внесок у мРНК-вакцини', 'foundational work behind mRNA vaccines', 'фундаментальный вклад в мРНК-вакцины', 'trabajo fundamental detrás de las vacunas de ARNm'),
    life: t('Її наполегливі дослідження показують, як довга наукова лінія може змінити глобальну охорону здоровʼя.', 'Her persistent research shows how a long scientific path can change global public health.', 'Ее настойчивые исследования показывают, как длинная научная линия может изменить глобальное здравоохранение.', 'Su investigación persistente muestra cómo una larga línea científica puede cambiar la salud pública global.'),
    tags: ['science', 'biotech', 'research']
  },
  {
    slug: 'donna-strickland',
    image: commons('Donna_Strickland_EM1B5767_(46122789402)_(cropped).jpg'),
    name: t('Донна Стрікленд', 'Donna Strickland', 'Донна Стрикленд', 'Donna Strickland'),
    role: t('Фізикиня, лауреатка Нобелівської премії', 'Physicist, Nobel laureate', 'Физик, лауреат Нобелевской премии', 'Física, premio Nobel'),
    country: t('Канада', 'Canada', 'Канада', 'Canadá'),
    focus: t('лазерна фізика, надкороткі імпульси, фотоніка', 'laser physics, ultrashort pulses, photonics', 'лазерная физика, ультракороткие импульсы, фотоника', 'física láser, pulsos ultracortos y fotónica'),
    knownFor: t('метод chirped pulse amplification', 'chirped pulse amplification', 'метод усиления чирпированных импульсов', 'la amplificación de pulsos chirped'),
    life: t('Її робота стала основою для потужних лазерів, що використовуються в медицині, промисловості та фундаментальній науці.', 'Her work underpins powerful lasers used in medicine, industry and fundamental science.', 'Ее работа стала основой мощных лазеров для медицины, промышленности и фундаментальной науки.', 'Su trabajo sostiene láseres potentes usados en medicina, industria y ciencia fundamental.'),
    tags: ['science', 'physics', 'research']
  },
  {
    slug: 'charity-majors',
    image: commons('Charity_Majors_2019.jpg'),
    name: t('Черіті Мейджорс', 'Charity Majors', 'Чэрити Мейджорс', 'Charity Majors'),
    role: t('Співзасновниця Honeycomb, інженерка інфраструктури', 'Co-founder of Honeycomb, infrastructure engineer', 'Соосновательница Honeycomb, инженер инфраструктуры', 'Cofundadora de Honeycomb, ingeniera de infraestructura'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('observability, SRE, операційна надійність', 'observability, SRE, operational reliability', 'observability, SRE, операционная надежность', 'observability, SRE y fiabilidad operativa'),
    knownFor: t('практичну популяризацію сучасної спостережуваності систем', 'practical advocacy for modern observability', 'практическую популяризацию современной наблюдаемости систем', 'defensa práctica de la observabilidad moderna'),
    life: t('Її досвід корисний для команд, які будують складні сервіси й хочуть швидко розуміти поведінку production-систем.', 'Her experience is useful for teams building complex services and needing fast insight into production behaviour.', 'Ее опыт полезен командам, строящим сложные сервисы и стремящимся быстро понимать поведение production-систем.', 'Su experiencia ayuda a equipos que construyen servicios complejos y necesitan entender rápido sistemas en producción.'),
    tags: ['engineering', 'startup', 'operations']
  },
  {
    slug: 'claire-hughes-johnson',
    image: commons('Claire_Hughes_Johnson_2017.jpg'),
    name: t('Клер Гʼюз Джонсон', 'Claire Hughes Johnson', 'Клэр Хьюз Джонсон', 'Claire Hughes Johnson'),
    role: t('Операційна директорка та радниця', 'Operations executive and advisor', 'Операционный директор и советник', 'Ejecutiva de operaciones y asesora'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('операційні системи компаній, масштабування команд, менеджмент', 'company operating systems, team scaling, management', 'операционные системы компаний, масштабирование команд, менеджмент', 'sistemas operativos de empresa, escala de equipos y gestión'),
    knownFor: t('масштабування операцій Stripe та роботу з керівними командами', 'scaling Stripe operations and advising leadership teams', 'масштабирование операций Stripe и работу с руководящими командами', 'escalar operaciones en Stripe y asesorar equipos directivos'),
    life: t('Її профіль додає до бази менш публічний, але дуже важливий тип спеціаліста: операційного архітектора зростання.', 'Her profile adds a less public but essential specialist type: the operating architect of growth.', 'Ее профиль добавляет менее публичный, но важный тип специалиста: операционного архитектора роста.', 'Su perfil añade un tipo menos visible pero esencial: la arquitecta operativa del crecimiento.'),
    tags: ['coo', 'operations', 'startup']
  },
  {
    slug: 'sergey-korolev',
    image: commons('Sergei_Korolev.jpg'),
    name: t('Сергій Корольов', 'Sergey Korolev', 'Сергей Королёв', 'Serguéi Koroliov'),
    role: t('Головний конструктор ракетно-космічних систем', 'Chief designer of rocket and space systems', 'Главный конструктор ракетно-космических систем', 'Diseñador jefe de sistemas espaciales y cohetes'),
    country: t('Україна / СРСР', 'Ukraine / Soviet Union', 'Украина / СССР', 'Ucrania / Unión Soviética'),
    focus: t('ракетобудування, системна інженерія, космічні програми', 'rocketry, systems engineering, space programmes', 'ракетостроение, системная инженерия, космические программы', 'cohetería, ingeniería de sistemas y programas espaciales'),
    knownFor: t('організацію запуску першого супутника і перших пілотованих польотів', 'organising the first satellite launch and early crewed flights', 'организацию запуска первого спутника и первых пилотируемых полетов', 'organizar el primer satélite y los primeros vuelos tripulados'),
    life: t('Він уособлює роль системного інженера, який обʼєднує науку, виробництво, ризик і командну координацію.', 'He represents the systems engineer who combines science, manufacturing, risk and team coordination.', 'Он олицетворяет системного инженера, объединяющего науку, производство, риск и командную координацию.', 'Representa al ingeniero de sistemas que une ciencia, fabricación, riesgo y coordinación de equipos.'),
    tags: ['space', 'engineering', 'leadership']
  },
  {
    slug: 'mira-murati',
    image: commons('Mira_Murati_2024.jpg'),
    name: t('Міра Мураті', 'Mira Murati', 'Мира Мураті', 'Mira Murati'),
    role: t('Технологічна керівниця у сфері ШІ', 'AI technology executive', 'Технологический руководитель в сфере ИИ', 'Ejecutiva tecnológica de IA'),
    country: t('Албанія / США', 'Albania / United States', 'Албания / США', 'Albania / Estados Unidos'),
    focus: t('генеративний ШІ, продуктові рішення, research-to-product execution', 'generative AI, product delivery, research-to-product execution', 'генеративный ИИ, продуктовые решения, research-to-product execution', 'IA generativa, entrega de producto y ejecución research-to-product'),
    knownFor: t('керівництво продуктовим розвитком ChatGPT та мультимодальних AI-систем', 'leading product development around ChatGPT and multimodal AI systems', 'руководство продуктовым развитием ChatGPT и мультимодальных AI-систем', 'liderar el desarrollo de producto alrededor de ChatGPT y sistemas multimodales de IA'),
    life: t('Її профіль важливий для сучасного ринку після 2020 року, бо він показує, як AI-дослідження переходять у масові продукти та інструменти для бізнесу й розробників.', 'Her profile matters for the post-2020 market because it shows how AI research becomes mainstream products and tools for businesses and developers.', 'Ее профиль важен для рынка после 2020 года, потому что показывает, как AI-исследования превращаются в массовые продукты и инструменты для бизнеса и разработчиков.', 'Su perfil es clave para el mercado posterior a 2020 porque muestra cómo la investigación en IA se convierte en productos masivos y herramientas para empresas y desarrolladores.'),
    tags: ['ai', 'operations', 'leadership']
  },
  {
    slug: 'dario-amodei',
    image: commons('Dario_Amodei_2023.jpg'),
    name: t('Даріо Амодеї', 'Dario Amodei', 'Дарио Амодеи', 'Dario Amodei'),
    role: t('CEO Anthropic, дослідник ШІ', 'CEO of Anthropic, AI researcher', 'CEO Anthropic, исследователь ИИ', 'CEO de Anthropic, investigador de IA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('AI safety, великі моделі, наукова стратегія', 'AI safety, large models, research strategy', 'AI safety, большие модели, научная стратегия', 'seguridad de IA, grandes modelos y estrategia de investigación'),
    knownFor: t('розвиток Anthropic і фокус на безпечних та керованих AI-моделях', 'building Anthropic and focusing on safe, controllable AI models', 'развитие Anthropic и фокус на безопасных и управляемых AI-моделях', 'desarrollar Anthropic y enfocarse en modelos de IA seguros y controlables'),
    life: t('Після 2020 року його імʼя стало одним із ключових у дискусії про безпеку, масштабування та відповідальне впровадження генеративного ШІ.', 'After 2020 his name became central to the discussion around safety, scaling and responsible deployment of generative AI.', 'После 2020 года его имя стало одним из ключевых в разговоре о безопасности, масштабировании и ответственном внедрении генеративного ИИ.', 'Después de 2020 su nombre se volvió central en la discusión sobre seguridad, escalamiento y despliegue responsable de la IA generativa.'),
    tags: ['ai', 'ceo', 'research']
  },
  {
    slug: 'arthur-mensch',
    image: commons('Arthur_Mensch_2024.jpg'),
    name: t('Артур Менш', 'Arthur Mensch', 'Артур Менш', 'Arthur Mensch'),
    role: t('CEO Mistral AI, інженер машинного навчання', 'CEO of Mistral AI, machine-learning engineer', 'CEO Mistral AI, инженер машинного обучения', 'CEO de Mistral AI, ingeniero de aprendizaje automático'),
    country: t('Франція', 'France', 'Франция', 'Francia'),
    focus: t('європейські AI-моделі, open models, інженерія inference', 'European AI models, open models, inference engineering', 'европейские AI-модели, open models, инженерия inference', 'modelos europeos de IA, open models e ingeniería de inference'),
    knownFor: t('побудову Mistral AI як одного з найпомітніших європейських AI-стартапів після 2023 року', 'building Mistral AI into one of the most visible European AI startups after 2023', 'создание Mistral AI как одного из самых заметных европейских AI-стартапов после 2023 года', 'construir Mistral AI como una de las startups europeas de IA más visibles desde 2023'),
    life: t('Його профіль додає до бази нову хвилю технічних засновників, які швидко формують європейський ринок генеративного ШІ.', 'His profile adds a new wave of technical founders who are rapidly shaping the European generative-AI market.', 'Его профиль добавляет новую волну технических основателей, быстро формирующих европейский рынок генеративного ИИ.', 'Su perfil añade una nueva ola de fundadores técnicos que están moldeando con rapidez el mercado europeo de IA generativa.'),
    tags: ['ai', 'ceo', 'startup']
  },
  {
    slug: 'mustafa-suleyman',
    image: commons('Mustafa_Suleyman_2024.jpg'),
    name: t('Мустафа Сулейман', 'Mustafa Suleyman', 'Мустафа Сулейман', 'Mustafa Suleyman'),
    role: t('CEO Microsoft AI, підприємець у сфері ШІ', 'CEO of Microsoft AI, AI entrepreneur', 'CEO Microsoft AI, предприниматель в сфере ИИ', 'CEO de Microsoft AI, emprendedor de IA'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('AI products, consumer systems, стратегія впровадження', 'AI products, consumer systems, deployment strategy', 'AI products, consumer systems, стратегия внедрения', 'productos de IA, sistemas de consumo y estrategia de despliegue'),
    knownFor: t('DeepMind, Inflection AI та управління новими AI-напрямами у Microsoft', 'DeepMind, Inflection AI and leading new AI directions at Microsoft', 'DeepMind, Inflection AI и руководство новыми AI-направлениями в Microsoft', 'DeepMind, Inflection AI y el liderazgo de nuevas direcciones de IA en Microsoft'),
    life: t('Після 2020 року його роль показує, як AI-підприємці переходять від досліджень до широкого продуктового розгортання у великих технологічних компаніях.', 'After 2020 his role shows how AI entrepreneurs move from research into broad product deployment inside major technology companies.', 'После 2020 года его роль показывает, как AI-предприниматели переходят от исследований к широкому продуктовому внедрению внутри крупных технологических компаний.', 'Después de 2020 su papel muestra cómo los emprendedores de IA pasan de la investigación al despliegue amplio de producto dentro de grandes tecnológicas.'),
    tags: ['ai', 'ceo', 'operations']
  },
  {
    slug: 'sridhar-ramaswamy',
    image: commons('Sridhar_Ramaswamy_2024.jpg'),
    name: t('Шрідхар Рамасвамі', 'Sridhar Ramaswamy', 'Шридхар Рамасвами', 'Sridhar Ramaswamy'),
    role: t('CEO Snowflake, керівник data/AI-платформ', 'CEO of Snowflake, data and AI platform executive', 'CEO Snowflake, руководитель data/AI-платформ', 'CEO de Snowflake, ejecutivo de plataformas de datos e IA'),
    country: t('Індія / США', 'India / United States', 'Индия / США', 'India / Estados Unidos'),
    focus: t('data cloud, AI infrastructure, корпоративні платформи даних', 'data cloud, AI infrastructure, enterprise data platforms', 'data cloud, AI infrastructure, корпоративные платформы данных', 'data cloud, infraestructura de IA y plataformas empresariales de datos'),
    knownFor: t('керівництво Snowflake у фазі активної інтеграції AI у корпоративні data-платформи', 'leading Snowflake through an active phase of AI integration into enterprise data platforms', 'руководство Snowflake в фазе активной интеграции ИИ в корпоративные data-платформы', 'liderar Snowflake en una etapa de integración activa de IA en plataformas empresariales de datos'),
    life: t('Його профіль додає до бази сегмент сучасних керівників, які після 2020 року будують фундамент для data та AI-інфраструктури в enterprise-середовищі.', 'His profile adds the segment of modern leaders who after 2020 are building the data and AI infrastructure foundation for enterprise environments.', 'Его профиль добавляет сегмент современных руководителей, которые после 2020 года строят фундамент data- и AI-инфраструктуры для enterprise-среды.', 'Su perfil añade el segmento de líderes modernos que, después de 2020, construyen la base de infraestructura de datos e IA para entornos enterprise.'),
    tags: ['ceo', 'cloud', 'ai']
  },
  {
    slug: 'thomas-dohmke',
    image: commons('Thomas_Dohmke_2023.jpg'),
    name: t('Томас Домке', 'Thomas Dohmke', 'Томас Домке', 'Thomas Dohmke'),
    role: t('CEO GitHub, лідер developer platform', 'CEO of GitHub, developer platform leader', 'CEO GitHub, лидер developer platform', 'CEO de GitHub, líder de plataforma para desarrolladores'),
    country: t('Німеччина / США', 'Germany / United States', 'Германия / США', 'Alemania / Estados Unidos'),
    focus: t('developer tools, Copilot, collaborative software platforms', 'developer tools, Copilot, collaborative software platforms', 'developer tools, Copilot, collaborative software platforms', 'herramientas para desarrolladores, Copilot y plataformas colaborativas de software'),
    knownFor: t('розвиток GitHub у добу Copilot і AI-assisted software development', 'leading GitHub in the Copilot era of AI-assisted software development', 'развитие GitHub в эпоху Copilot и AI-assisted software development', 'liderar GitHub en la era de Copilot y del desarrollo asistido por IA'),
    life: t('Після 2020 року його роль стала показовою для нового покоління платформ, де AI безпосередньо змінює щоденну роботу програмістів.', 'After 2020 his role became a strong example of the new platform generation where AI directly changes the daily work of software engineers.', 'После 2020 года его роль стала показательной для нового поколения платформ, где ИИ напрямую меняет ежедневную работу программистов.', 'Después de 2020 su papel se volvió un ejemplo claro de la nueva generación de plataformas donde la IA cambia directamente el trabajo diario de los programadores.'),
    tags: ['software', 'ceo', 'ai']
  },
  {
    slug: 'jay-graber',
    image: commons('Jay_Graber_2024.jpg'),
    name: t('Джей Грейбер', 'Jay Graber', 'Джей Грейбер', 'Jay Graber'),
    role: t('CEO Bluesky, product та protocol leader', 'CEO of Bluesky, product and protocol leader', 'CEO Bluesky, product и protocol leader', 'CEO de Bluesky, líder de producto y protocolo'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('децентралізовані соціальні мережі, протоколи, продуктова стратегія', 'decentralised social platforms, protocols, product strategy', 'децентрализованные социальные платформы, протоколы, продуктовая стратегия', 'plataformas sociales descentralizadas, protocolos y estrategia de producto'),
    knownFor: t('розвиток Bluesky як нової соціальної платформи на базі відкритого протоколу після 2020 року', 'building Bluesky as a new social platform on an open protocol after 2020', 'развитие Bluesky как новой социальной платформы на базе открытого протокола после 2020 года', 'desarrollar Bluesky como una nueva plataforma social basada en un protocolo abierto después de 2020'),
    life: t('Її профіль показує сучасний зріз product leadership у мережевих продуктах, де важливі і архітектура платформи, і довіра користувачів.', 'Her profile shows a modern slice of product leadership in networked products where platform architecture and user trust matter equally.', 'Ее профиль показывает современный срез product leadership в сетевых продуктах, где одинаково важны архитектура платформы и доверие пользователей.', 'Su perfil muestra una visión moderna del liderazgo de producto en servicios de red, donde importan tanto la arquitectura de plataforma como la confianza de los usuarios.'),
    tags: ['software', 'ceo', 'design']
  },
  {
    slug: 'lina-khan',
    image: commons('Lina_Khan_2022.jpg'),
    name: t('Ліна Хан', 'Lina Khan', 'Лина Хан', 'Lina Khan'),
    role: t('Голова FTC, регуляторка цифрових платформ', 'FTC chair, digital-platform regulator', 'Глава FTC, регулятор цифровых платформ', 'Presidenta de la FTC y reguladora de plataformas digitales'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('регулювання Big Tech, конкуренція, цифрові ринки', 'Big Tech regulation, competition, digital markets', 'регулирование Big Tech, конкуренция, цифровые рынки', 'regulación de Big Tech, competencia y mercados digitales'),
    knownFor: t('помітну роль у регуляторній дискусії навколо великих технологічних платформ після 2020 року', 'a visible role in the post-2020 regulatory debate around major technology platforms', 'заметную роль в регуляторной дискуссии вокруг крупных технологических платформ после 2020 года', 'un papel visible en el debate regulatorio posterior a 2020 sobre las grandes plataformas tecnológicas'),
    life: t('Її профіль додає до бази не лише засновників і CEO, а й тих, хто формує правила гри для цифрової економіки нового циклу.', 'Her profile adds not only founders and CEOs but also the people shaping the rules of the new-cycle digital economy.', 'Ее профиль добавляет в базу не только основателей и CEO, но и тех, кто формирует правила игры для цифровой экономики нового цикла.', 'Su perfil añade a la base no solo fundadores y CEOs, sino también a quienes están definiendo las reglas de la nueva economía digital.'),
    tags: ['operations', 'leadership', 'technology']
  },
  {
    slug: 'jeff-dean',
    image: commons('JeffDean2019.jpg'),
    name: t('Джефф Дін', 'Jeff Dean', 'Джефф Дин', 'Jeff Dean'),
    role: t('SVP Google Research та Google DeepMind, інженер систем ШІ', 'SVP Google Research and Google DeepMind, AI systems engineer', 'SVP Google Research и Google DeepMind, инженер AI-систем', 'SVP de Google Research y Google DeepMind, ingeniero de sistemas de IA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('великі моделі, інфраструктура навчання, масштабовані системи ML', 'large models, training infrastructure, scalable ML systems', 'большие модели, инфраструктура обучения, масштабируемые ML-системы', 'grandes modelos, infraestructura de entrenamiento y sistemas ML escalables'),
    knownFor: t('архітектуру та інженерію TensorFlow, MapReduce та ключових Google AI-систем', 'architecture and engineering behind TensorFlow, MapReduce and core Google AI systems', 'архитектуру и инженерию TensorFlow, MapReduce и ключевых Google AI-систем', 'la arquitectura e ingeniería detrás de TensorFlow, MapReduce y sistemas centrales de IA en Google'),
    life: t('Його профіль показує шар технічного лідерства в Big Tech, де дослідження і продакшн-інфраструктура зводяться в одному карʼєрному треку.', 'His profile illustrates technical leadership in Big Tech where research and production infrastructure live in one career thread.', 'Его профиль показывает слой технического лидерства в Big Tech, где исследования и production-инфраструктура идут в одной карьерной линии.', 'Su perfil muestra liderazgo técnico en Big Tech donde investigación e infraestructura de producción comparten el mismo hilo profesional.'),
    tags: ['ai', 'software', 'engineering']
  },
  {
    slug: 'sundar-pichai',
    image: commons('Sundar_Pichai_(cropped).jpg'),
    name: t('Сундар Пічаї', 'Sundar Pichai', 'Сундар Пичаи', 'Sundar Pichai'),
    role: t('CEO Alphabet та Google', 'CEO of Alphabet and Google', 'CEO Alphabet и Google', 'CEO de Alphabet y Google'),
    country: t('Індія / США', 'India / United States', 'Индия / США', 'India / Estados Unidos'),
    focus: t('стратегія продуктів, хмара, пошук, Android та AI-платформи', 'product strategy, cloud, search, Android and AI platforms', 'стратегия продуктов, облако, поиск, Android и AI-платформы', 'estrategia de producto, cloud, búsqueda, Android y plataformas de IA'),
    knownFor: t('керівництво Google в епоху хмарних сервісів і інтеграції AI у продукти мільярдної аудиторії', 'leading Google through the cloud era and embedding AI into products used by billions', 'руководство Google в эпоху облачных сервисов и встраивание ИИ в продукты для миллиардной аудитории', 'liderar Google en la era cloud e integrar IA en productos usados por miles de millones de personas'),
    life: t('Його шлях часто наводять як приклад інженерного CEO з глибоким розумінням платформ і екосистем.', 'His path is often cited as an example of a platform-minded CEO with deep ecosystem judgement.', 'Его путь часто приводят как пример инженерного CEO с глубоким пониманием платформ и экосистем.', 'Su trayectoria suele citarse como ejemplo de un CEO con mentalidad de plataforma y juicio de ecosistema.'),
    tags: ['ceo', 'cloud', 'ai']
  },
  {
    slug: 'sergey-brin',
    image: commons('Sergey_Brin_Moscow_September_2015.jpg'),
    name: t('Сергій Брін', 'Sergey Brin', 'Сергей Брин', 'Sergey Brin'),
    role: t('Співзасновник Google, технологічний підприємець', 'Google co-founder, technology entrepreneur', 'Сооснователь Google, технологический предприниматель', 'Cofundador de Google, emprendedor tecnológico'),
    country: t('СРСР / США', 'Soviet Union / United States', 'СССР / США', 'URSS / Estados Unidos'),
    focus: t('пошукові системи, масштаб інтернет-сервісів, deep-tech інвестиції', 'search systems, scaling internet services, deep-tech investing', 'поисковые системы, масштаб интернет-сервисов, deep-tech инвестиции', 'sistemas de búsqueda, escala de servicios de internet e inversión deep tech'),
    knownFor: t('співстворення Google та формування культури data-driven продуктів', 'co-creating Google and shaping a data-driven product culture', 'сооснование Google и формирование культуры data-driven продуктов', 'cofundar Google y moldear una cultura de producto basada en datos'),
    life: t('Його профіль доповнює каталог ранніх архітекторів сучасного вебу та рекламних платформ.', 'His profile complements the catalogue with one of the architects of the modern web and ad platforms.', 'Его профиль дополняет каталог ранними архитекторами современного веба и рекламных платформ.', 'Su perfil complementa el catálogo como uno de los arquitectos de la web moderna y las plataformas publicitarias.'),
    tags: ['software', 'leadership', 'startup']
  },
  {
    slug: 'larry-page',
    image: commons('Larry_Page_in_the_European_Parliament,_17_June_2009.jpg'),
    name: t('Ларрі Пейдж', 'Larry Page', 'Ларри Пейдж', 'Larry Page'),
    role: t('Співзасновник Google, інженер-підприємець', 'Google co-founder, engineer-entrepreneur', 'Сооснователь Google, инженер-предприниматель', 'Cofundador de Google, ingeniero emprendedor'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('алгоритми пошуку, інженерія великих розподілених систем', 'search algorithms, engineering of large distributed systems', 'алгоритмы поиска, инженерия больших распределенных систем', 'algoritmos de búsqueda e ingeniería de sistemas distribuidos a gran escala'),
    knownFor: t('PageRank та перетворення пошуку на глобальну технологічну платформу', 'PageRank and turning search into a global technology platform', 'PageRank и превращение поиска в глобальную технологическую платформу', 'PageRank y convertir la búsqueda en una plataforma tecnológica global'),
    life: t('Його історія нагадує, що масштаб Big Tech починається з конкретної інженерної ідеї та рішучої ітерації.', 'His story reminds us that Big Tech scale starts from a concrete engineering idea and relentless iteration.', 'Его история напоминает, что масштаб Big Tech начинается с конкретной инженерной идеи и настойчивой итерации.', 'Su historia recuerda que la escala Big Tech nace de una idea de ingeniería concreta y una iteración implacable.'),
    tags: ['software', 'engineering', 'startup']
  },
  {
    slug: 'andy-jassy',
    image: commons('Andy_Jassy_keynote_image_(cropped).jpg'),
    name: t('Енді Джассі', 'Andy Jassy', 'Энди Джасси', 'Andy Jassy'),
    role: t('Президент та CEO Amazon', 'President and CEO of Amazon', 'Президент и CEO Amazon', 'Presidente y CEO de Amazon'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('хмарна інфраструктура, e-commerce, операційна масштабованість', 'cloud infrastructure, e-commerce, operational scale', 'облачная инфраструктура, e-commerce, операционная масштабируемость', 'infraestructura cloud, comercio electrónico y escala operativa'),
    knownFor: t('побудову AWS як двигуна хмарних сервісів і розширення екосистеми Amazon', 'building AWS as the cloud-services engine and expanding the Amazon ecosystem', 'построение AWS как двигателя облачных сервисов и расширение экосистемы Amazon', 'construir AWS como motor de servicios cloud y ampliar el ecosistema de Amazon'),
    life: t('Його карʼєра ілюструє, як інфраструктурний продукт може стати окремим світовим шаром для індустрії.', 'His career shows how an infrastructure product can become its own global layer for the industry.', 'Его карьера показывает, как инфраструктурный продукт может стать отдельным глобальным слоем для индустрии.', 'Su carrera muestra cómo un producto de infraestructura puede volverse una capa global para la industria.'),
    tags: ['ceo', 'cloud', 'operations']
  },
  {
    slug: 'adam-selipsky',
    image: commons('Adam_Selipsky_-_AWS_re_Invent_2021_-_Database_Keynote_(cropped).jpg'),
    name: t('Адам Селіпскі', 'Adam Selipsky', 'Адам Селипски', 'Adam Selipsky'),
    role: t('Колишній CEO Amazon Web Services (AWS)', 'Former CEO of Amazon Web Services (AWS)', 'Бывший CEO Amazon Web Services (AWS)', 'Ex CEO de Amazon Web Services (AWS)'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('хмарні сервіси для підприємств, go-to-market, масштабування AWS', 'enterprise cloud services, go-to-market, scaling AWS', 'облачные сервисы для предприятий, go-to-market, масштабирование AWS', 'servicios cloud enterprise, go-to-market y escalamiento de AWS'),
    knownFor: t('керівництво клієнтським розширенням AWS та поєднання інфраструктури з практиками підприємств', 'leading AWS customer expansion and pairing infrastructure with enterprise practice', 'руководство расширением клиентской базы AWS и сочетание инфраструктуры с enterprise-практиками', 'liderar la expansión de clientes de AWS y alinear infraestructura con prácticas empresariales'),
    life: t('Цей профіль підкреслює операційний шар хмарного бізнесу: не лише технічні регіони, а й масштабований GTM.', 'This profile highlights the operational side of cloud: not only technical regions but scalable go-to-market motion.', 'Этот профиль подчеркивает операционный слой облачного бизнеса: не только технические регионы, но и масштабируемый GTM.', 'Este perfil enfatiza la capa operativa de la nube: no solo regiones técnicas sino un GTM escalable.'),
    tags: ['ceo', 'cloud', 'enterprise']
  },
  {
    slug: 'werner-vogels',
    image: commons('Werner_Vogels.jpg'),
    name: t('Вернер Фогельс', 'Werner Vogels', 'Вернер Фогельс', 'Werner Vogels'),
    role: t('CTO та віце-президент Amazon', 'CTO and vice president of Amazon', 'CTO и вице-президент Amazon', 'CTO y vicepresidente de Amazon'),
    country: t('Нідерланди / США', 'Netherlands / United States', 'Нидерланды / США', 'Países Bajos / Estados Unidos'),
    focus: t('розподілені системи, надійність, архітектура хмарних сервісів', 'distributed systems, reliability, cloud service architecture', 'распределенные системы, надежность, архитектура облачных сервисов', 'sistemas distribuidos, fiabilidad y arquitectura de servicios cloud'),
    knownFor: t('архітектурні принципи та практики, що сформували культуру AWS', 'architectural principles and practices that shaped the AWS culture', 'архитектурные принципы и практики, сформировавшие культуру AWS', 'principios y prácticas arquitectónicas que moldearon la cultura de AWS'),
    life: t('Для інженерних команд його імʼя асоціюється з дисципліною масштабованих систем у продакшені.', 'For engineering teams his name is tied to discipline around scalable systems in production.', 'Для инженерных команд его имя связано с дисциплиной масштабируемых систем в продакшене.', 'Para equipos de ingeniería su nombre evoca disciplina en sistemas escalables en producción.'),
    tags: ['engineering', 'cloud', 'operations']
  },
  {
    slug: 'kevin-scott',
    image: commons('Kevin_Scott_Microsoft.jpg'),
    name: t('Кевін Скотт', 'Kevin Scott', 'Кевин Скотт', 'Kevin Scott'),
    role: t('CTO Microsoft, лідер інженерних платформ', 'CTO of Microsoft, engineering platforms leader', 'CTO Microsoft, лидер инженерных платформ', 'CTO de Microsoft, líder de plataformas de ingeniería'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('AI-платформи, інженерна культура, масштабування R&D', 'AI platforms, engineering culture, scaling R&D', 'AI-платформы, инженерная культура, масштабирование R&D', 'plataformas de IA, cultura de ingeniería y escalamiento de I+D'),
    knownFor: t('єднання довгострокової AI-стратегії Microsoft із практикою розробників і підприємств', 'connecting Microsoft\'s long-term AI strategy with developer and enterprise practice', 'связь долгосрочной AI-стратегии Microsoft с практикой разработчиков и предприятий', 'conectar la estrategia de IA a largo plazo de Microsoft con prácticas de desarrolladores y empresas'),
    life: t('Його роль показує, як CTO у великій компанії координує продуктові лінії, партнерства й відкриті інструменти.', 'His role shows how a CTO at a large company aligns product lines, partnerships and open tooling.', 'Его роль показывает, как CTO в большой компании выравнивает продуктовые линии, партнерства и открытые инструменты.', 'Su papel muestra cómo un CTO alinea líneas de producto, alianzas y herramientas abiertas en una gran empresa.'),
    tags: ['ai', 'software', 'engineering']
  },
  {
    slug: 'scott-guthrie',
    image: commons('Scott_Guthrie_(cropped).jpg'),
    name: t('Скотт Гатрі', 'Scott Guthrie', 'Скотт Гатри', 'Scott Guthrie'),
    role: t('EVP Cloud + AI Group, Microsoft', 'EVP Cloud + AI Group, Microsoft', 'EVP Cloud + AI Group, Microsoft', 'EVP Cloud + AI Group, Microsoft'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('Azure, хмарні сервіси для підприємств, developer tooling', 'Azure, enterprise cloud services, developer tooling', 'Azure, облачные сервисы для предприятий, developer tooling', 'Azure, servicios cloud empresariales y herramientas para desarrolladores'),
    knownFor: t('розбудову Azure як конкурентної хмарної платформи та екосистеми .NET', 'building Azure as a competitive cloud platform and the .NET ecosystem', 'развитие Azure как конкурентной облачной платформы и экосистемы .NET', 'impulsar Azure como plataforma cloud competitiva y la comunidad .NET'),
    life: t('Інженерні команди часто звертаються до його профілю як до прикладу поєднання платформи й спільноти розробників.', 'Engineering teams often reference his profile as an example of blending platform and developer community.', 'Инженерные команды часто ссылаются на его профиль как на пример сочетания платформы и сообщества разработчиков.', 'Los equipos de ingeniería citan su perfil como ejemplo de combinar plataforma y comunidad de desarrolladores.'),
    tags: ['cloud', 'software', 'enterprise']
  },
  {
    slug: 'larry-ellison',
    image: commons('Larry_Ellison_on_stage.jpg'),
    name: t('Ларрі Еллісон', 'Larry Ellison', 'Ларри Эллисон', 'Larry Ellison'),
    role: t('Співзасновник та головний технологічний офіцер Oracle', 'Oracle co-founder and chief technology officer', 'Сооснователь и CTO Oracle', 'Cofundador y CTO de Oracle'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('корпоративні бази даних, хмарна трансформація, інженерія ПЗ', 'enterprise databases, cloud transformation, software engineering', 'корпоративные базы данных, облачная трансформация, инженерия ПО', 'bases de datos empresariales, transformación cloud e ingeniería de software'),
    knownFor: t('формування ринку реляційних БД для бізнесу та масштабування Oracle у хмару', 'shaping the enterprise relational database market and scaling Oracle toward cloud', 'формирование рынка реляционных БД для бизнеса и масштабирование Oracle к облаку', 'moldear el mercado de bases relacionales enterprise y escalar Oracle hacia la nube'),
    life: t('Його профіль допомагає зрозуміти довгу історію enterprise-software як інженерної та комерційної дисципліни.', 'His profile helps explain the long arc of enterprise software as both engineering and commercial discipline.', 'Его профиль помогает понять долгую историю enterprise-software как инженерной и коммерческой дисциплины.', 'Su perfil ayuda a entender el arco largo del software enterprise como disciplina técnica y comercial.'),
    tags: ['ceo', 'enterprise', 'cloud']
  },
  {
    slug: 'clara-shih',
    image: commons('Clara_Shih_(cropped).jpg'),
    name: t('Клара Ших', 'Clara Shih', 'Клара Ших', 'Clara Shih'),
    role: t('CEO Salesforce AI', 'CEO of Salesforce AI', 'CEO Salesforce AI', 'CEO de Salesforce AI'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('AI для CRM, корпоративні застосування моделей, продуктова стратегія', 'AI for CRM, enterprise model applications, product strategy', 'AI для CRM, корпоративные применения моделей, продуктовая стратегия', 'IA para CRM, aplicaciones empresariales de modelos y estrategia de producto'),
    knownFor: t('інтеграцію генеративного AI у Salesforce та роботу з підприємницькими workflow', 'integrating generative AI into Salesforce and enterprise workflows', 'интеграцию генеративного ИИ в Salesforce и корпоративные workflow', 'integrar IA generativa en Salesforce y flujos de trabajo empresariales'),
    life: t('Вона представляє покоління продуктових лідерів, які поєднують класичний SaaS із новою хвилею моделей.', 'She represents product leaders blending classic SaaS with the new wave of models.', 'Она представляет поколение продуктовых лидеров, соединяющих классический SaaS с новой волной моделей.', 'Representa a líderes de producto que combinan SaaS clásico con la nueva ola de modelos.'),
    tags: ['ai', 'enterprise', 'leadership']
  },
  {
    slug: 'greg-brockman',
    image: commons('Greg_Brockman_OpenAI_DevDay_(cropped).jpg'),
    name: t('Грег Брокман', 'Greg Brockman', 'Грег Брокман', 'Greg Brockman'),
    role: t('Президент та співзасновник OpenAI', 'President and co-founder of OpenAI', 'Президент и сооснователь OpenAI', 'Presidente y cofundador de OpenAI'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('інженерія великих моделей, API-платформи, операційне масштабування AI', 'large-model engineering, API platforms, operational AI scale', 'инженерия больших моделей, API-платформы, операционное масштабирование ИИ', 'ingeniería de grandes modelos, plataformas API y escala operativa de IA'),
    knownFor: t('співстворення інженерної бази OpenAI та екосистеми для розробників', 'co-building OpenAI\'s engineering foundation and developer ecosystem', 'сооснование инженерной базы OpenAI и экосистемы для разработчиков', 'cofundar la base de ingeniería de OpenAI y el ecosistema para desarrolladores'),
    life: t('Його профіль корисний для розуміння, як дослідницька організація перетворюється на масштабну продуктово-інженерну структуру.', 'His profile helps explain how a research organisation becomes a large product-engineering organisation.', 'Его профиль полезен для понимания, как исследовательская организация превращается в крупную продуктово-инженерную структуру.', 'Su perfil ayuda a explicar cómo una organización de investigación se convierte en una gran estructura de producto e ingeniería.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'mark-zuckerberg',
    image: commons('Mark_Zuckerberg_F8_2018_Keynote_(cropped).jpg'),
    name: t('Марк Цукерберг', 'Mark Zuckerberg', 'Марк Цукерберг', 'Mark Zuckerberg'),
    role: t('Співзасновник та CEO Meta', 'Co-founder and CEO of Meta', 'Сооснователь и CEO Meta', 'Cofundador y CEO de Meta'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('соціальні платформи, рекламні системи, інвестиції в VR та AI', 'social platforms, advertising systems, VR and AI investment', 'социальные платформы, рекламные системы, инвестиции в VR и ИИ', 'plataformas sociales, publicidad e inversión en RV e IA'),
    knownFor: t('Facebook / Meta як глобальну мережу та центр інженерних масштабів у споживчому інтернеті', 'Facebook / Meta as a global network and engineering centre for consumer internet scale', 'Facebook / Meta как глобальную сеть и инженерный центр масштаба потребительского интернета', 'Facebook / Meta como red global y centro de ingeniería a escala de internet para consumo'),
    life: t('Його карʼєра ілюструє поєднання продуктового бачення та постійних інфраструктурних викликів у соціальних мережах.', 'His career illustrates product vision paired with persistent infrastructure challenges in social networks.', 'Его карьера иллюстрирует сочетание продуктового видения и постоянных инфраструктурных вызовов в социальных сетях.', 'Su carrera ilustra visión de producto junto a retos persistentes de infraestructura en redes sociales.'),
    tags: ['ceo', 'software', 'ai']
  },
  {
    slug: 'stewart-butterfield',
    image: commons('Stewart_Butterfield_-_TechCrunch_Disrupt_SF_2019_-_Day_2_(48687869896)_(cropped).jpg'),
    name: t('Стюарт Баттерфілд', 'Stewart Butterfield', 'Стюарт Баттерфилд', 'Stewart Butterfield'),
    role: t('Співзасновник Slack та Flickr, продуктовий підприємець', 'Co-founder of Slack and Flickr, product entrepreneur', 'Сооснователь Slack и Flickr, продуктовый предприниматель', 'Cofundador de Slack y Flickr, emprendedor de producto'),
    country: t('Канада / США', 'Canada / United States', 'Канада / США', 'Canadá / Estados Unidos'),
    focus: t('комунікаційні продукти для команд, SaaS-UX, enterprise collaboration', 'team communication products, SaaS UX, enterprise collaboration', 'коммуникационные продукты для команд, SaaS UX, enterprise collaboration', 'productos de comunicación para equipos, UX SaaS y colaboración enterprise'),
    knownFor: t('перехід від споживчого фото-сервісу до корпоративного чату Slack', 'moving from a consumer photo product to enterprise chat with Slack', 'переход от потребительского фото-сервиса к корпоративному чату Slack', 'pasar de un producto de fotos para consumo al chat empresarial Slack'),
    life: t('Цей профіль показує тип засновника, який декілька разів знаходить продуктовий fit у різних доменах.', 'This profile shows a founder who repeatedly finds product-market fit across domains.', 'Этот профиль показывает основателя, который несколько раз находит product-market fit в разных доменах.', 'Este perfil muestra a un fundador que encuentra encaje producto-mercado en varios dominios.'),
    tags: ['ceo', 'software', 'startup']
  },
  {
    slug: 'guillermo-rauch',
    image: commons('Guillermo_Rauch.jpg'),
    name: t('Гільєрмо Рауч', 'Guillermo Rauch', 'Гильермо Рауч', 'Guillermo Rauch'),
    role: t('CEO Vercel, інженер open-source', 'CEO of Vercel, open-source engineer', 'CEO Vercel, open-source инженер', 'CEO de Vercel, ingeniero open source'),
    country: t('Аргентина / США', 'Argentina / United States', 'Аргентина / США', 'Argentina / Estados Unidos'),
    focus: t('frontend cloud, Next.js, developer experience', 'frontend cloud, Next.js, developer experience', 'frontend cloud, Next.js, developer experience', 'frontend cloud, Next.js y developer experience'),
    knownFor: t('створення Next.js та розвиток modern web deployment платформи Vercel', 'creating Next.js and growing Vercel as a modern web deployment platform', 'создание Next.js и развитие Vercel как платформы современного web deployment', 'crear Next.js y hacer crecer Vercel como plataforma de despliegue web moderno'),
    life: t('Його профіль додає до бази незалежні стартапи інструментів для розробників поза межами гігантських корпорацій.', 'His profile adds independent developer-tool startups outside the giant corporate umbrella.', 'Его профиль добавляет независимые стартапы инструментов для разработчиков вне гигантских корпораций.', 'Su perfil añade startups independientes de herramientas para desarrolladores fuera del paraguas corporativo gigante.'),
    tags: ['software', 'startup', 'engineering']
  },
  {
    slug: 'emad-mostaque',
    image: avatar('Emad Mostaque'),
    name: t('Емад Мостак', 'Emad Mostaque', 'Эмад Мостак', 'Emad Mostaque'),
    role: t('Співзасновник Stability AI (історичний контекст)', 'Co-founder of Stability AI (historical context)', 'Сооснователь Stability AI (исторический контекст)', 'Cofundador de Stability AI (contexto histórico)'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('відкриті моделі зображень, спільнота дослідників, генеративний ШІ', 'open image models, researcher community, generative AI', 'открытые модели изображений, сообщество исследователей, генеративный ИИ', 'modelos de imagen abiertos, comunidad investigadora e IA generativa'),
    knownFor: t('хвилю Stable Diffusion як відкритої альтернативи у генеративних зображеннях', 'the Stable Diffusion wave as an open alternative in generative imaging', 'волну Stable Diffusion как открытую альтернативу в генеративных изображениях', 'la ola Stable Diffusion como alternativa abierta en imagen generativa'),
    life: t('Редакційно його профіль включено як маркер нової хвилі відкритих моделей і спільнот навколо них.', 'Editorially his profile marks the new wave of open models and the communities around them.', 'Редакционно его профиль включен как маркер новой волны открытых моделей и сообществ вокруг них.', 'Editorialmente su perfil marca la nueva ola de modelos abiertos y las comunidades en torno a ellos.'),
    tags: ['ai', 'startup', 'research']
  },
  {
    slug: 'john-collison',
    image: commons('John_Collison_Web_Summit_2018_-_Day_3_(45687496374)_(cropped).jpg'),
    name: t('Джон Коллісон', 'John Collison', 'Джон Коллисон', 'John Collison'),
    role: t('Співзасновник та президент Stripe', 'Co-founder and president of Stripe', 'Сооснователь и президент Stripe', 'Cofundador y presidente de Stripe'),
    country: t('Ірландія / США', 'Ireland / United States', 'Ирландия / США', 'Irlanda / Estados Unidos'),
    focus: t('фінтех-операції, міжнародне масштабування, продуктова інфраструктура', 'fintech operations, international scaling, product infrastructure', 'финтех-операции, международное масштабирование, продуктовая инфраструктура', 'operaciones fintech, escala internacional e infraestructura de producto'),
    knownFor: t('побудову Stripe разом із братом як глобального шару платежів для інтернету', 'building Stripe with his brother as a global payments layer for the internet', 'построение Stripe вместе с братом как глобального платежного слоя для интернета', 'construir Stripe junto a su hermano como capa global de pagos para internet'),
    life: t('Цей профіль доповнює Patrick Collison як приклад співпраці співзасновників у глибоко технічному фінтехі.', 'This profile complements Patrick Collison as an example of sibling co-founders in deep technical fintech.', 'Этот профиль дополняет Patrick Collison как пример sibling co-founders в глубоком техническом финтехе.', 'Este perfil complementa a Patrick Collison como ejemplo de cofundadores hermanos en fintech profundamente técnico.'),
    tags: ['ceo', 'fintech', 'startup']
  },
  {
    slug: 'daniel-ek',
    image: commons('Daniel_Ek_(cropped).jpg'),
    name: t('Даніель Ек', 'Daniel Ek', 'Даниэль Эк', 'Daniel Ek'),
    role: t('Співзасновник та CEO Spotify', 'Co-founder and CEO of Spotify', 'Сооснователь и CEO Spotify', 'Cofundador y CEO de Spotify'),
    country: t('Швеція', 'Sweden', 'Швеция', 'Suecia'),
    focus: t('стрімінг аудіо, рекомендаційні системи, глобальні медіа-платформи', 'audio streaming, recommendation systems, global media platforms', 'стриминг аудио, рекомендательные системы, глобальные медиа-платформы', 'streaming de audio, sistemas de recomendación y plataformas mediáticas globales'),
    knownFor: t('перетворення Spotify на референсний стрімінговий продукт нового покоління', 'turning Spotify into a reference streaming product for a new generation', 'превращение Spotify в референсный стриминговый продукт нового поколения', 'convertir Spotify en un producto de streaming de referencia para una nueva generación'),
    life: t('Його карʼєра показує перетин музики, даних і масштабованої інженерії в споживчому інтернеті.', 'His career shows the intersection of music, data and scalable engineering in consumer internet.', 'Его карьера показывает пересечение музыки, данных и масштабируемой инженерии в потребительском интернете.', 'Su carrera muestra la intersección de música, datos e ingeniería escalable en internet de consumo.'),
    tags: ['ceo', 'software', 'startup']
  },
  {
    slug: 'patrick-brown',
    image: avatar('Patrick Brown'),
    name: t('Патрік Браун', 'Patrick Brown', 'Патрик Браун', 'Patrick Brown'),
    role: t('Співзасновник та CEO Impossible Foods', 'Co-founder and CEO of Impossible Foods', 'Сооснователь и CEO Impossible Foods', 'Cofundador y CEO de Impossible Foods'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('foodtech, біотех інгредієнтів, сталість та масштаб виробництва', 'foodtech, ingredient biotech, sustainability and manufacturing scale', 'foodtech, биотех ингредиентов, устойчивость и масштаб производства', 'foodtech, biotecnología de ingredientes, sostenibilidad y escala industrial'),
    knownFor: t('розробку рослинного «heme» та масовий retail для альтернативного білка', 'plant-based heme innovation and retail scale for alternative protein', 'разработку растительного heme и массовый retail для альтернативного белка', 'innovación en heme vegetal y escala retail para proteína alternativa'),
    life: t('Його профіль розширює каталог стартапами глибокої науки в харчовій індустрії.', 'His profile expands the catalogue with deep-science startups in food.', 'Его профиль расширяет каталог стартапами глубокой науки в пищевой индустрии.', 'Su perfil amplía el catálogo con startups de ciencia profunda en alimentación.'),
    tags: ['biotech', 'startup', 'science']
  },
  {
    slug: 'eric-vishria',
    image: avatar('Eric Vishria'),
    name: t('Ерік Вішрія', 'Eric Vishria', 'Эрик Вишрия', 'Eric Vishria'),
    role: t('Інвестор та операційний партнер Benchmark', 'Investor and operating partner at Benchmark', 'Инвестор и операционный партнер Benchmark', 'Inversor y socio operativo en Benchmark'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('B2B SaaS, хмарні продукти, перехід стартапів у фазу масштабу', 'B2B SaaS, cloud products, guiding startups into scale-up phase', 'B2B SaaS, облачные продукты, переход стартапов в фазу масштаба', 'B2B SaaS, productos cloud y guiar startups a fase de escala'),
    knownFor: t('досвід операційного партнера у венчурному фонді з сильним B2B-фокусом', 'experience as an operating partner in a leading B2B venture firm', 'опыт операционного партнера в венчурном фонде с сильным B2B-фокусом', 'experiencia como socio operativo en una firma de venture con fuerte foco B2B'),
    life: t('Його профіль додає маловідомий шар каталогу — інвестори та операційні партнери, які формують стартапи зсередини.', 'His profile adds a less visible layer: investors and operating partners shaping startups from the inside.', 'Его профиль добавляет менее видимый слой — инвесторы и операционные партнеры, формирующие стартапы изнутри.', 'Su perfil añade una capa menos visible: inversores y socios operativos que moldean startups desde dentro.'),
    tags: ['startup', 'operations', 'leadership']
  },
  {
    slug: 'patrick-collison',
    image: commons('Patrick_Collison_Web_Summit_2018.jpg'),
    name: t('Патрік Коллісон', 'Patrick Collison', 'Патрик Коллисон', 'Patrick Collison'),
    role: t('Співзасновник та CEO Stripe', 'Co-founder and CEO of Stripe', 'Сооснователь и CEO Stripe', 'Cofundador y CEO de Stripe'),
    country: t('Ірландія / США', 'Ireland / United States', 'Ирландия / США', 'Irlanda / Estados Unidos'),
    focus: t('фінтех, платіжна інфраструктура, стартап-екосистеми', 'fintech, payments infrastructure, startup ecosystems', 'финтех, платежная инфраструктура, стартап-экосистемы', 'fintech, infraestructura de pagos y ecosistemas startup'),
    knownFor: t('створення Stripe як платформи для інтернет-платежів', 'building Stripe as an internet payments platform', 'создание Stripe как платформы интернет-платежей', 'construir Stripe como plataforma de pagos en internet'),
    life: t('Його робота цікава операційним командам, бо Stripe поєднує API-дизайн, комплаєнс і глобальну фінансову інфраструктуру.', 'His work matters to operations teams because Stripe combines API design, compliance and global financial infrastructure.', 'Его работа важна операционным командам: Stripe объединяет API-дизайн, комплаенс и глобальную финансовую инфраструктуру.', 'Su trabajo importa a equipos operativos porque Stripe combina diseño de API, cumplimiento e infraestructura financiera global.'),
    tags: ['ceo', 'fintech', 'startup']
  },
  {
    slug: 'melanie-perkins',
    image: commons('Melanie_Perkins_at_TechCrunch_Disrupt_SF_2019.jpg'),
    name: t('Мелані Перкінс', 'Melanie Perkins', 'Мелани Перкинс', 'Melanie Perkins'),
    role: t('Співзасновниця та CEO Canva', 'Co-founder and CEO of Canva', 'Соосновательница и CEO Canva', 'Cofundadora y CEO de Canva'),
    country: t('Австралія', 'Australia', 'Австралия', 'Australia'),
    focus: t('дизайн-платформи, продуктова стратегія, глобальне масштабування', 'design platforms, product strategy, global scaling', 'дизайн-платформы, продуктовая стратегия, глобальное масштабирование', 'plataformas de diseño, estrategia de producto y escala global'),
    knownFor: t('перетворення Canva на масову платформу дизайну', 'turning Canva into a mainstream design platform', 'превращение Canva в массовую платформу дизайна', 'convertir Canva en una plataforma masiva de diseño'),
    life: t('Її шлях показує, як простий користувацький досвід може відкрити професійні інструменти для мільйонів людей.', 'Her path shows how simple user experience can open professional tools to millions of people.', 'Ее путь показывает, как простой пользовательский опыт открывает профессиональные инструменты миллионам людей.', 'Su trayectoria muestra cómo una experiencia simple abre herramientas profesionales a millones de personas.'),
    tags: ['ceo', 'design', 'startup']
  }
];


const bohdanProfile = {
  slug: 'bohdan-tiutenko',
  image: 'assets/images/bohdan-tiutenko-img0018.jpg',
  featured: true,
  name: t('Богдан Тютенко', 'Bohdan Tiutenko', 'Богдан Тютенко', 'Bohdan Tiutenko'),
  role: t('Директор операцій та менеджер логістики Foodtech', 'Operations Director and Foodtech Logistics Manager', 'Директор по операциям и менеджер логистики Foodtech', 'Director de Operaciones y Gerente de Logística Foodtech'),
  country: t('Україна / Перу', 'Ukraine / Peru', 'Украина / Перу', 'Ucrania / Perú'),
  focus: t('Foodtech, last-mile logistics, P&L, флот +150 курʼєрів, Power BI, SQL, Excel, Kommo CRM', 'Foodtech, last-mile logistics, P&L, 150+ courier fleets, Power BI, SQL, Excel and Kommo CRM', 'Foodtech, last-mile logistics, P&L, флот +150 курьеров, Power BI, SQL, Excel, Kommo CRM', 'Foodtech, logística de última milla, P&L, flotas de +150 repartidores, Power BI, SQL, Excel y Kommo CRM'),
  knownFor: t('масштабування last-mile операцій, контроль P&L і data-driven оптимізацію витрат до 20%', 'scaling last-mile operations, P&L ownership and data-driven cost optimisation up to 20%', 'масштабирование last-mile операций, контроль P&L и data-driven оптимизацию затрат до 20%', 'escalar operaciones de última milla, ownership de P&L y optimización de costos basada en datos hasta un 20%'),
  life: t(
    'Порядок із хаосу: як досвід виживання формує бізнес-лідерів. Спеціальний матеріал від команди Rybezh. У сучасному корпоративному світі слово «криза» звучить щодня, але для Богдана Тютенка, який керує операційними процесами у Лімі (Перу), це насамперед керована система рішень. До 2014 року Богдан навчався у Донецькому національному технічному університеті, поєднуючи інтерес до програмування, математики та бойових мистецтв. Після початку війни на сході України він пройшов жорсткий конкурсний відбір до ГУР: психологічні, математичні та фізичні етапи, які із сотень кандидатів подолали лише близько 80 людей. Подальший досвід, описаний у його автобіографічній книзі «Хаос і надія: Донбасс 2014», сформував ключову управлінську звичку: діяти на випередження, швидко оцінювати ризики та брати відповідальність у критичний момент. Найсильніші уроки Богдан отримав у період «Південного котла», коли власними очима бачив, як руйнуються ланцюги постачання і як помилки в координації коштують надто дорого. Саме тоді він зробив висновок, який згодом став основою його менеджменту: жодна стратегія не працює без бездоганної логістики, прозорих даних і чітких SOPs. У цивільній карʼєрі він переніс цей підхід у foodtech та last-mile operations. У Rocket (2018–2021) Богдан керував City Operations під час масштабування, вів флот 150+ курʼєрів, запроваджував контроль метрик через Power BI та Excel і підтримував середній час доставки до 35 хвилин. У Лімі, працюючи з dark kitchens і Yango, він посилив data-аналітику: оптимізація FIFO знизила втрати на 18%, а системна оптимізація процесів і витрат дала до 20% економії при зростанні операційної стабільності. Колеги відзначають його спокій під час Tier 2/3 інцидентів: замість емоційної реакції — SQL-аналіз, ізоляція першопричини, швидке відновлення сервісу та утримання SLA на рівні 99.9%. Сьогодні Богдан Тютенко — кандидат на роль директора, який поєднує кризову стійкість, дисципліну виконання, P&L ownership і здатність перетворювати хаос у керовану систему. Для компаній, що шукають лідера для періодів турбулентності, його історія є практичним доказом компетентності.',
    'Bohdan Tiutenko is an operations leader in Foodtech and last-mile logistics with 5+ years of experience across Ukraine and Peru. His management style was shaped by technical thinking, sport and crisis-tested responsibility: before his business career, he studied programming, trained in martial arts and passed a competitive selection process for a Ukrainian intelligence unit, where only a limited group was selected from several hundred candidates. That background gave him practical discipline, fast situational analysis, self-control and team coordination under uncertainty. At Rocket, he managed City Operations during aggressive delivery-platform scaling, grew a fleet of 150+ couriers, owned P&L, introduced SOPs and Power BI / Excel dashboards, and kept average delivery time under 35 minutes. In Lima, he worked with dark kitchens, FIFO/PEPS inventory control, production and dispatch workflows, reducing operational waste by 18% and increasing order-processing capacity by 25%. At Yango, he improved data visibility by 40%, contributed to a 12% SLA improvement and maintained 99.9% service continuity. For senior roles, his value is the combination of P&L ownership, data analytics, crisis management, team building and hands-on logistics execution. Education: computer systems and network maintenance technician; engineering studies in Donetsk were interrupted by the war. Languages: Ukrainian and Russian native, Spanish C1, English B2.',
    'Богдан Тютенко — операционный руководитель в Foodtech и last-mile логистике с опытом более 5 лет в Украине и Перу. Его управленческий стиль сформировался на пересечении технического мышления, спорта и опыта ответственности в кризисных условиях: до бизнес-карьеры он учился на программировании, занимался боевыми искусствами и прошел конкурсный отбор в разведывательное подразделение, где из нескольких сотен кандидатов выбрали ограниченную группу. Этот этап дал ему практику дисциплины, быстрого анализа ситуации, самоконтроля и командной координации в условиях неопределенности. В Rocket он управлял City Operations в период активного масштабирования платформы доставки, развивал флот более 150 курьеров, отвечал за P&L, внедрял SOPs и dashboards в Power BI и Excel, удерживая среднее время доставки ниже 35 минут. В Лиме он работал с dark kitchens, FIFO/PEPS, производством и dispatch-процессами, снижая операционные потери на 18% и повышая пропускную способность заказов на 25%. В Yango он улучшил видимость данных на 40%, способствовал росту SLA на 12% и поддерживал непрерывность сервиса 99.9%. Для директорских ролей его ценность — сочетание P&L ownership, data analytics, кризисного менеджмента, построения команд и практической логистики. Образование: техник по обслуживанию систем и компьютерных сетей; инженерное обучение в Донецке было прервано войной. Языки: украинский и русский — родные, испанский — C1, английский — B2.',
    'Bohdan Tiutenko es un líder de operaciones en Foodtech y logística de última milla con más de 5 años de experiencia entre Ucrania y Perú. Su estilo de gestión se formó entre pensamiento técnico, deporte y responsabilidad probada en crisis: antes de su carrera empresarial estudió programación, practicó artes marciales y superó un proceso competitivo de selección para una unidad de inteligencia ucraniana, donde solo un grupo limitado fue elegido entre varios cientos de candidatos. Esa etapa le aportó disciplina práctica, análisis rápido de situaciones, autocontrol y coordinación de equipos bajo incertidumbre. En Rocket gestionó City Operations durante una etapa de expansión agresiva de la plataforma de delivery, escaló una flota de +150 repartidores, asumió P&L, implementó SOPs y dashboards en Power BI / Excel, manteniendo el tiempo promedio de entrega por debajo de 35 minutos. En Lima trabajó con dark kitchens, control PEPS/FIFO, producción y despacho, reduciendo mermas operativas en 18% y aumentando la capacidad de procesamiento de órdenes en 25%. En Yango mejoró la visibilidad de datos en 40%, contribuyó a una mejora de SLA del 12% y mantuvo continuidad de servicio al 99.9%. Para roles directivos, su valor combina ownership de P&L, data analytics, gestión de crisis, construcción de equipos y ejecución logística práctica. Educación: técnico en mantenimiento de sistemas y redes informáticas; estudios de ingeniería en Donetsk interrumpidos por la guerra. Idiomas: ucraniano y ruso nativos, español C1, inglés B2.'
  ),
  tags: ['operations', 'leadership', 'logistics', 'analytics', 'foodtech', 'resilience', 'ukraine'],
  gallery: [
    {
      image: 'assets/images/bohdan-tiutenko-img0018.jpg',
      title: t('Професійний портрет', 'Professional portrait', 'Профессиональный портрет', 'Retrato profesional'),
      caption: t('Фото для рекрутингового профілю та професійної презентації.', 'Image for a recruiting profile and professional presentation.', 'Изображение для рекрутингового профиля и профессиональной презентации.', 'Imagen para perfil de reclutamiento y presentación profesional.')
    },
    {
      image: 'assets/images/1777671624758~3.png',
      title: t('Операційний досвід', 'Operations experience', 'Операционный опыт', 'Experiencia operativa'),
      caption: t('Фокус на дисципліні, координації задач і стабільній роботі команди.', 'Focus on discipline, task coordination and stable team execution.', 'Фокус на дисциплине, координации задач и стабильной работе команды.', 'Enfoque en disciplina, coordinación de tareas y ejecución estable del equipo.')
    },
    {
      image: 'assets/images/IMG_0018.jpg',
      title: t('Командна взаємодія', 'Team collaboration', 'Командное взаимодействие', 'Colaboración de equipo'),
      caption: t('Підхід до роботи з людьми: чіткість, спокій і відповідальність.', 'Approach to people: clarity, calmness and responsibility.', 'Подход к работе с людьми: ясность, спокойствие и ответственность.', 'Trabajo con personas: claridad, calma y responsabilidad.')
    },
    {
      image: 'assets/images/Polish_20260102_233010540.jpg',
      title: t('Мотоподорож у пустелі', 'Desert motorcycle ride', 'Мотопоездка в пустыне', 'Ruta en moto por el desierto'),
      caption: t('Особистий кадр про витримку, контроль і спокій у складних умовах.', 'A personal image about endurance, control and calmness in demanding conditions.', 'Личный кадр о выдержке, контроле и спокойствии в сложных условиях.', 'Imagen personal sobre resistencia, control y calma en condiciones exigentes.')
    },
    {
      image: 'assets/images/EDrop_1775166765355.png',
      title: t('Пауза біля океану', 'Ocean pause', 'Пауза у океана', 'Pausa junto al océano'),
      caption: t('Кадр про відновлення, внутрішній баланс і здатність тримати фокус поза робочим шумом.', 'A personal image about recovery, inner balance and the ability to keep focus away from work noise.', 'Кадр о восстановлении, внутреннем балансе и способности сохранять фокус вне рабочего шума.', 'Imagen sobre recuperación, equilibrio interior y capacidad de mantener el foco lejos del ruido laboral.')
    },
    {
      image: 'assets/images/IMG_2361~2.jpg',
      title: t('Портрет у мистецькому просторі', 'Portrait in an art space', 'Портрет в художественном пространстве', 'Retrato en un espacio artístico'),
      caption: t('Спокійний професійний образ у середовищі, де поєднуються культура, уважність і характер.', 'A calm professional portrait in a setting that connects culture, attention and character.', 'Спокойный профессиональный образ в среде, где соединяются культура, внимательность и характер.', 'Retrato profesional sereno en un entorno que une cultura, atención y carácter.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-edrop.png',
      title: t('На воді з собакою', 'On the water with a dog', 'На воде с собакой', 'En el agua con un perro'),
      caption: t('Особистий кадр про турботу, довіру і спокій у простих моментах поза роботою.', 'A personal image about care, trust and calm in simple moments outside work.', 'Личный кадр о заботе, доверии и спокойствии в простых моментах вне работы.', 'Imagen personal sobre cuidado, confianza y calma en momentos sencillos fuera del trabajo.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-painting.jpg',
      title: t('«Camine sobre la muerte, pero en mis manos queda vida»', '“Camine sobre la muerte, pero en mis manos queda vida”', '«Camine sobre la muerte, pero en mis manos queda vida»', '“Camine sobre la muerte, pero en mis manos queda vida”'),
      caption: t('Портрет, створений художницею, враженою історією життя Богдана.', 'Portrait created by an artist moved by Bohdan’s life story.', 'Портрет, созданный художницей, впечатленной историей жизни Богдана.', 'Retrato creado por una artista conmovida por la historia de vida de Bohdan.')
    }
  ],
  highlights: {
    uk: ['P&L ownership і зниження операційних витрат до 20%', 'Масштабування last-mile флоту понад 150 курʼєрів', 'Конкурсний відбір до розвідки, дисципліна і командна координація', 'Power BI, SQL, Excel, Kommo CRM, SOPs і KPI/OKR управління', 'Покращення SLA на 12% і безперервність сервісу 99.9%'],
    en: ['P&L ownership and operating-cost reduction up to 20%', 'Scaling last-mile fleets of 150+ couriers', 'Competitive intelligence-unit selection, discipline and team coordination', 'Power BI, SQL, Excel, Kommo CRM, SOPs and KPI/OKR management', '12% SLA improvement and 99.9% service continuity'],
    ru: ['P&L ownership и снижение операционных затрат до 20%', 'Масштабирование last-mile флота более 150 курьеров', 'Конкурсный отбор в разведку, дисциплина и командная координация', 'Power BI, SQL, Excel, Kommo CRM, SOPs и управление KPI/OKR', 'Улучшение SLA на 12% и непрерывность сервиса 99.9%'],
    es: ['Ownership de P&L y reducción de costos operativos hasta 20%', 'Escalamiento de flotas last-mile de +150 repartidores', 'Selección competitiva en inteligencia, disciplina y coordinación de equipo', 'Power BI, SQL, Excel, Kommo CRM, SOPs y gestión KPI/OKR', 'Mejora de SLA del 12% y continuidad de servicio al 99.9%']
  }
};

const selectedSpecialistSlugs = [
  'arthur-mensch',
  'charity-majors',
  'claire-hughes-johnson',
  'dario-amodei',
  'demis-hassabis',
  'donna-strickland',
  'elon-musk',
  'fei-fei-li',
  'guido-van-rossum',
  'gwynne-shotwell',
  'ilya-sutskever',
  'jensen-huang',
  'jay-graber',
  'katalin-kariko',
  'lina-khan',
  'linus-torvalds',
  'lisa-su',
  'margaret-hamilton',
  'mary-barra',
  'melanie-perkins',
  'mira-murati',
  'mustafa-suleyman',
  'patrick-collison',
  'radia-perlman',
  'safra-catz',
  'sam-altman',
  'sridhar-ramaswamy',
  'satya-nadella',
  'thomas-dohmke',
  'tim-berners-lee',
  'yann-lecun',
  'jeff-dean',
  'sundar-pichai',
  'sergey-brin',
  'larry-page',
  'andy-jassy',
  'adam-selipsky',
  'werner-vogels',
  'kevin-scott',
  'scott-guthrie',
  'larry-ellison',
  'clara-shih',
  'greg-brockman',
  'mark-zuckerberg',
  'stewart-butterfield',
  'guillermo-rauch',
  'emad-mostaque',
  'john-collison',
  'daniel-ek',
  'patrick-brown',
  'patrick-collison',
  'melanie-perkins'
];

const specialistEnhancements = {
  'mira-murati': {
    highlights: {
      uk: ['Запуск мультимодальних AI-продуктів для масового ринку', 'Поєднання research, product delivery і швидкої ітерації', 'Роль технологічного керівника в генеративному AI-циклі'],
      en: ['Launching multimodal AI products for mass adoption', 'Combining research, product delivery and fast iteration', 'A technology-executive role inside the generative-AI cycle'],
      ru: ['Запуск мультимодальных AI-продуктов для массового рынка', 'Сочетание research, product delivery и быстрой итерации', 'Роль технологического руководителя в цикле генеративного ИИ'],
      es: ['Lanzamiento de productos multimodales de IA para adopción masiva', 'Combinación de research, entrega de producto e iteración rápida', 'Un rol ejecutivo tecnológico dentro del ciclo de IA generativa']
    }
  },
  'dario-amodei': {
    highlights: {
      uk: ['Фокус на AI safety і керованості моделей', 'Будівництво нової дослідницької компанії після 2020 року', 'Вплив на дискусію про масштабування генеративного ШІ'],
      en: ['A strong focus on AI safety and model controllability', 'Building a new research company after 2020', 'Influencing the discussion around scaling generative AI'],
      ru: ['Фокус на AI safety и управляемости моделей', 'Построение новой исследовательской компании после 2020 года', 'Влияние на дискуссию о масштабировании генеративного ИИ'],
      es: ['Foco en seguridad de IA y controlabilidad de modelos', 'Construcción de una nueva empresa de investigación después de 2020', 'Influencia en el debate sobre el escalamiento de la IA generativa']
    }
  },
  'arthur-mensch': {
    highlights: {
      uk: ['Представник нової хвилі європейських AI-засновників', 'Ставка на open models і європейський ринок', 'Швидке масштабування AI-компанії після 2023 року'],
      en: ['Part of the new wave of European AI founders', 'A bet on open models and the European market', 'Fast scaling of an AI company after 2023'],
      ru: ['Представитель новой волны европейских AI-основателей', 'Ставка на open models и европейский рынок', 'Быстрое масштабирование AI-компании после 2023 года'],
      es: ['Parte de la nueva ola de fundadores europeos de IA', 'Apuesta por open models y el mercado europeo', 'Escalamiento rápido de una compañía de IA después de 2023']
    }
  },
  'mustafa-suleyman': {
    highlights: {
      uk: ['Перехід від AI-лабораторій до масового продуктового впровадження', 'Досвід у DeepMind, Inflection AI та Microsoft AI', 'Фокус на споживчих AI-продуктах і стратегії запуску'],
      en: ['A bridge from AI labs into mass product deployment', 'Experience across DeepMind, Inflection AI and Microsoft AI', 'A focus on consumer AI products and deployment strategy'],
      ru: ['Переход от AI-лабораторий к массовому продуктовому внедрению', 'Опыт в DeepMind, Inflection AI и Microsoft AI', 'Фокус на потребительских AI-продуктах и стратегии запуска'],
      es: ['Un puente entre laboratorios de IA y despliegue masivo de producto', 'Experiencia en DeepMind, Inflection AI y Microsoft AI', 'Foco en productos de IA para consumo y estrategia de despliegue']
    }
  },
  'sridhar-ramaswamy': {
    highlights: {
      uk: ['Data cloud і AI як інфраструктурний шар підприємств', 'Керівництво платформою у фазі AI-інтеграції', 'Сильний enterprise-контекст після 2020 року'],
      en: ['Data cloud and AI as enterprise infrastructure', 'Leading a platform through AI integration', 'A strong enterprise context after 2020'],
      ru: ['Data cloud и AI как инфраструктурный слой предприятий', 'Управление платформой в фазе AI-интеграции', 'Сильный enterprise-контекст после 2020 года'],
      es: ['Data cloud e IA como capa de infraestructura empresarial', 'Liderar una plataforma en fase de integración de IA', 'Fuerte contexto enterprise después de 2020']
    }
  },
  'thomas-dohmke': {
    highlights: {
      uk: ['Лідер платформи розробників у добу Copilot', 'Фокус на AI-assisted software development', 'Приклад зміни щоденних інженерних workflow після 2020 року'],
      en: ['A developer-platform leader in the Copilot era', 'A focus on AI-assisted software development', 'An example of daily engineering workflow change after 2020'],
      ru: ['Лидер developer-платформы в эпоху Copilot', 'Фокус на AI-assisted software development', 'Пример изменения ежедневных инженерных workflow после 2020 года'],
      es: ['Un líder de plataforma para desarrolladores en la era Copilot', 'Foco en desarrollo asistido por IA', 'Ejemplo del cambio en workflows de ingeniería después de 2020']
    }
  },
  'jay-graber': {
    highlights: {
      uk: ['Відкриті протоколи як продуктова стратегія', 'Лідерство у новому циклі соціальних платформ', 'Поєднання архітектури мережі та довіри користувачів'],
      en: ['Open protocols as product strategy', 'Leadership in a new cycle of social platforms', 'Combining network architecture with user trust'],
      ru: ['Открытые протоколы как продуктовая стратегия', 'Лидерство в новом цикле социальных платформ', 'Сочетание архитектуры сети и доверия пользователей'],
      es: ['Protocolos abiertos como estrategia de producto', 'Liderazgo en un nuevo ciclo de plataformas sociales', 'Combinación de arquitectura de red y confianza del usuario']
    }
  },
  'lina-khan': {
    highlights: {
      uk: ['Регуляторний вплив на цифрові ринки після 2020 року', 'Публічна роль у дискусії про Big Tech', 'Додає до бази перспективу правил, а не тільки продуктів'],
      en: ['Regulatory influence on digital markets after 2020', 'A visible public role in the Big Tech debate', 'Adds the perspective of rules, not only products'],
      ru: ['Регуляторное влияние на цифровые рынки после 2020 года', 'Публичная роль в дискуссии о Big Tech', 'Добавляет перспективу правил, а не только продуктов'],
      es: ['Influencia regulatoria sobre mercados digitales después de 2020', 'Un papel público visible en el debate sobre Big Tech', 'Añade la perspectiva de reglas, no solo de productos']
    }
  }
};

const curatedSpecialists = [
  bohdanProfile,
  ...specialists.filter(person => selectedSpecialistSlugs.includes(person.slug))
].map(person => ({ ...person, ...(specialistEnhancements[person.slug] || {}) }));

const tagLabels = {
  software: t('Програмування', 'Software', 'Программирование', 'Software'),
  research: t('Дослідження', 'Research', 'Исследования', 'Investigación'),
  history: t('Історія технологій', 'Technology history', 'История технологий', 'Historia tecnológica'),
  operations: t('Операції', 'Operations', 'Операции', 'Operaciones'),
  education: t('Освіта', 'Education', 'Образование', 'Educación'),
  space: t('Космос', 'Space', 'Космос', 'Espacio'),
  engineering: t('Інженерія', 'Engineering', 'Инженерия', 'Ingeniería'),
  science: t('Наука', 'Science', 'Наука', 'Ciencia'),
  mathematics: t('Математика', 'Mathematics', 'Математика', 'Matemáticas'),
  aviation: t('Авіація', 'Aviation', 'Авиация', 'Aviación'),
  leadership: t('Лідерство', 'Leadership', 'Лидерство', 'Liderazgo'),
  internet: t('Інтернет', 'Internet', 'Интернет', 'Internet'),
  standards: t('Стандарти', 'Standards', 'Стандарты', 'Estándares'),
  'open-source': t('Open source', 'Open source', 'Open source', 'Código abierto'),
  infrastructure: t('Інфраструктура', 'Infrastructure', 'Инфраструктура', 'Infraestructura'),
  'language-design': t('Дизайн мов', 'Language design', 'Дизайн языков', 'Diseño de lenguajes'),
  ai: t('Штучний інтелект', 'Artificial intelligence', 'Искусственный интеллект', 'Inteligencia artificial'),
  ceo: t('CEO', 'CEO', 'CEO', 'CEO'),
  startup: t('Стартапи', 'Startups', 'Стартапы', 'Startups'),
  hardware: t('Апаратне забезпечення', 'Hardware', 'Аппаратное обеспечение', 'Hardware'),
  coo: t('COO', 'COO', 'COO', 'COO'),
  enterprise: t('Корпоративне ПЗ', 'Enterprise software', 'Корпоративное ПО', 'Software empresarial'),
  cloud: t('Хмарні технології', 'Cloud', 'Облачные технологии', 'Cloud'),
  biotech: t('Біотехнології', 'Biotech', 'Биотехнологии', 'Biotecnología'),
  physics: t('Фізика', 'Physics', 'Физика', 'Física'),
  fintech: t('Фінтех', 'Fintech', 'Финтех', 'Fintech'),
  design: t('Дизайн', 'Design', 'Дизайн', 'Diseño'),
  resilience: t('Стійкість', 'Resilience', 'Устойчивость', 'Resiliencia'),
  ukraine: t('Україна', 'Ukraine', 'Украина', 'Ucrania'),
  technology: t('Технології', 'Technology', 'Технологии', 'Tecnología'),
  logistics: t('Логістика', 'Logistics', 'Логистика', 'Logística'),
  analytics: t('Аналітика даних', 'Data analytics', 'Аналитика данных', 'Analítica de datos'),
  foodtech: t('Foodtech', 'Foodtech', 'Foodtech', 'Foodtech')
};

const startups = [
  {
    slug: 'openai',
    image: logo('openai.com'),
    name: 'OpenAI',
    founded: '2015',
    category: t('Лабораторія ШІ та продуктова компанія', 'AI lab and product company', 'Лаборатория ИИ и продуктовая компания', 'Laboratorio de IA y empresa de producto'),
    summary: t('Розробляє моделі та продукти штучного інтелекту, що використовуються у бізнесі, освіті, розробці ПЗ і творчих процесах.', 'Develops AI models and products used in business, education, software development and creative workflows.', 'Разрабатывает модели и продукты ИИ для бизнеса, образования, разработки ПО и творческих процессов.', 'Desarrolla modelos y productos de IA usados en negocios, educación, software y procesos creativos.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'deepmind',
    image: logo('deepmind.google'),
    name: 'Google DeepMind',
    founded: '2010',
    category: t('Дослідницька компанія ШІ', 'AI research company', 'Исследовательская компания ИИ', 'Empresa de investigación en IA'),
    summary: t('Працює над фундаментальними системами ШІ, науковими задачами та продуктами Google.', 'Works on foundational AI systems, scientific challenges and Google products.', 'Работает над фундаментальными системами ИИ, научными задачами и продуктами Google.', 'Trabaja en sistemas fundamentales de IA, retos científicos y productos de Google.'),
    tags: ['ai', 'research', 'science']
  },
  {
    slug: 'stripe',
    image: logo('stripe.com'),
    name: 'Stripe',
    founded: '2010',
    category: t('Фінтех-інфраструктура', 'Fintech infrastructure', 'Финтех-инфраструктура', 'Infraestructura fintech'),
    summary: t('Будує API та фінансову інфраструктуру для онлайн-платежів, billing, податків і глобальних операцій.', 'Builds APIs and financial infrastructure for online payments, billing, tax and global operations.', 'Строит API и финансовую инфраструктуру для онлайн-платежей, биллинга, налогов и глобальных операций.', 'Construye APIs e infraestructura financiera para pagos online, billing, impuestos y operaciones globales.'),
    tags: ['fintech', 'software', 'operations']
  },
  {
    slug: 'spacex',
    image: logo('spacex.com'),
    name: 'SpaceX',
    founded: '2002',
    category: t('Космічна інженерія', 'Space engineering', 'Космическая инженерия', 'Ingeniería espacial'),
    summary: t('Створює ракети, супутникову інфраструктуру та комерційні сервіси запусків із фокусом на повторне використання.', 'Builds rockets, satellite infrastructure and commercial launch services with a focus on reuse.', 'Создает ракеты, спутниковую инфраструктуру и коммерческие запуски с фокусом на повторное использование.', 'Construye cohetes, infraestructura satelital y lanzamientos comerciales con foco en reutilización.'),
    tags: ['space', 'engineering', 'operations']
  },
  {
    slug: 'canva',
    image: logo('canva.com'),
    name: 'Canva',
    founded: '2013',
    category: t('Платформа дизайну', 'Design platform', 'Дизайн-платформа', 'Plataforma de diseño'),
    summary: t('Дає командам і приватним користувачам прості інструменти для презентацій, брендингу, відео та маркетингових матеріалів.', 'Gives teams and individuals simple tools for presentations, branding, video and marketing assets.', 'Дает командам и пользователям простые инструменты для презентаций, брендинга, видео и маркетинга.', 'Ofrece herramientas simples para presentaciones, marca, video y materiales de marketing.'),
    tags: ['design', 'software', 'startup']
  },
  {
    slug: 'hugging-face',
    image: logo('huggingface.co'),
    name: 'Hugging Face',
    founded: '2016',
    category: t('Open-source платформа ШІ', 'Open-source AI platform', 'Open-source платформа ИИ', 'Plataforma open-source de IA'),
    summary: t('Підтримує спільноту моделей, датасетів і інструментів для машинного навчання.', 'Supports a community of models, datasets and tools for machine learning.', 'Поддерживает сообщество моделей, датасетов и инструментов машинного обучения.', 'Sostiene una comunidad de modelos, datos y herramientas de aprendizaje automático.'),
    tags: ['ai', 'open-source', 'startup']
  },
  {
    slug: 'figma',
    image: logo('figma.com'),
    name: 'Figma',
    founded: '2012',
    category: t('Спільний дизайн у браузері', 'Collaborative browser-based design', 'Совместный дизайн в браузере', 'Diseño colaborativo en navegador'),
    summary: t('Перенесла дизайн інтерфейсів у хмару, де продукт, дизайн і розробка працюють над одним джерелом правди.', 'Moved interface design into the cloud so product, design and engineering teams share one source of truth.', 'Перенесла дизайн интерфейсов в облако, где продукт, дизайн и разработка работают с единым источником правды.', 'Llevó el diseño de interfaces a la nube para alinear producto, diseño e ingeniería.'),
    tags: ['design', 'software', 'startup']
  },
  {
    slug: 'notion',
    image: logo('notion.so'),
    name: 'Notion',
    founded: '2013',
    category: t('Продуктивність і знання', 'Productivity and knowledge', 'Продуктивность и знания', 'Productividad y conocimiento'),
    summary: t('Обʼєднує документи, бази даних, wiki та робочі процеси для команд різного масштабу.', 'Combines documents, databases, wikis and workflows for teams of many sizes.', 'Объединяет документы, базы данных, wiki и рабочие процессы для команд разного масштаба.', 'Combina documentos, bases de datos, wikis y flujos para equipos de distintos tamaños.'),
    tags: ['software', 'operations', 'startup']
  },
  {
    slug: 'anthropic',
    image: logo('anthropic.com'),
    name: 'Anthropic',
    founded: '2021',
    category: t('AI safety та моделі', 'AI safety and models', 'AI safety и модели', 'Seguridad de IA y modelos'),
    summary: t('Розробляє асистентів і дослідження безпеки, орієнтовані на контрольовані та корисні AI-системи.', 'Develops assistants and safety research focused on controllable and useful AI systems.', 'Разрабатывает ассистентов и исследования безопасности для контролируемых и полезных AI-систем.', 'Desarrolla asistentes e investigación de seguridad para sistemas de IA útiles y controlables.'),
    tags: ['ai', 'research', 'startup']
  },
  {
    slug: 'mistral-ai',
    image: logo('mistral.ai'),
    name: 'Mistral AI',
    founded: '2023',
    category: t('Європейські AI-моделі', 'European AI models', 'Европейские AI-модели', 'Modelos europeos de IA'),
    summary: t('Будує відкриті та комерційні моделі ШІ, посилюючи європейську AI-екосистему.', 'Builds open and commercial AI models, strengthening the European AI ecosystem.', 'Строит открытые и коммерческие модели ИИ, усиливая европейскую AI-экосистему.', 'Construye modelos abiertos y comerciales, fortaleciendo el ecosistema europeo de IA.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'databricks',
    image: logo('databricks.com'),
    name: 'Databricks',
    founded: '2013',
    category: t('Платформа даних та AI', 'Data and AI platform', 'Платформа данных и AI', 'Plataforma de datos e IA'),
    summary: t('Поєднує lakehouse-архітектуру, аналітику, ML та управління даними для підприємств.', 'Combines lakehouse architecture, analytics, ML and data governance for enterprises.', 'Объединяет lakehouse-архитектуру, аналитику, ML и управление данными для предприятий.', 'Combina arquitectura lakehouse, analítica, ML y gobierno de datos para empresas.'),
    tags: ['ai', 'cloud', 'enterprise']
  },
  {
    slug: 'grammarly',
    image: logo('grammarly.com'),
    name: 'Grammarly',
    founded: '2009',
    category: t('AI для письма', 'AI writing assistance', 'AI для письма', 'IA para escritura'),
    summary: t('Українсько-заснована компанія, що допомагає писати точніше, зрозуміліше й професійніше.', 'A Ukrainian-founded company helping people write more clearly, accurately and professionally.', 'Компания с украинскими корнями, помогающая писать точнее, понятнее и профессиональнее.', 'Empresa fundada por ucranianos que ayuda a escribir con claridad, precisión y profesionalismo.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'preply',
    image: logo('preply.com'),
    name: 'Preply',
    founded: '2012',
    category: t('EdTech-маркетплейс', 'EdTech marketplace', 'EdTech-маркетплейс', 'Marketplace EdTech'),
    summary: t('Платформа з українським корінням для онлайн-навчання мов із викладачами по всьому світу.', 'A Ukrainian-rooted platform for online language learning with tutors around the world.', 'Платформа с украинскими корнями для онлайн-изучения языков с преподавателями по всему миру.', 'Plataforma con raíces ucranianas para aprender idiomas online con tutores de todo el mundo.'),
    tags: ['education', 'software', 'startup']
  },
  {
    slug: 'gitlab',
    image: logo('gitlab.com'),
    name: 'GitLab',
    founded: '2011',
    category: t('DevOps-платформа', 'DevOps platform', 'DevOps-платформа', 'Plataforma DevOps'),
    summary: t('Надає інструменти для репозиторіїв, CI/CD, безпеки та спільної розробки програмного забезпечення.', 'Provides tools for repositories, CI/CD, security and collaborative software development.', 'Предоставляет инструменты для репозиториев, CI/CD, безопасности и совместной разработки ПО.', 'Ofrece repositorios, CI/CD, seguridad y desarrollo colaborativo de software.'),
    tags: ['software', 'open-source', 'operations']
  },
  {
    slug: 'scale-ai',
    image: logo('scale.com'),
    name: 'Scale AI',
    founded: '2016',
    category: t('Дані для AI', 'Data for AI', 'Данные для AI', 'Datos para IA'),
    summary: t('Підтримує підготовку даних і evaluation-процеси для компаній, що створюють AI-системи.', 'Supports data preparation and evaluation workflows for companies building AI systems.', 'Поддерживает подготовку данных и evaluation-процессы для компаний, создающих AI-системы.', 'Apoya preparación de datos y evaluación para empresas que crean sistemas de IA.'),
    tags: ['ai', 'operations', 'startup']
  },
  {
    slug: 'cursor',
    image: logo('cursor.com'),
    name: 'Cursor',
    founded: '2023',
    category: t('AI-інструменти для розробників', 'AI tooling for developers', 'AI-инструменты для разработчиков', 'Herramientas de IA para desarrolladores'),
    summary: t('Створює редактор і робочі процеси для інженерних команд, які поєднують coding assistants, codebase search та автоматизацію.', 'Builds an editor and workflows for engineering teams that combine coding assistants, codebase search and automation.', 'Создает редактор и процессы для инженерных команд, объединяя coding assistants, поиск по codebase и автоматизацию.', 'Crea un editor y flujos para equipos de ingeniería que combinan asistentes de código, búsqueda y automatización.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'vercel',
    image: logo('vercel.com'),
    name: 'Vercel',
    founded: '2015',
    category: t('Хмарна платформа для фронтенду', 'Cloud platform for frontend teams', 'Облачная платформа для фронтенд-команд', 'Plataforma cloud para equipos frontend'),
    summary: t('Підтримує розгортання, edge-інфраструктуру та продуктову швидкість для сучасних вебкоманд.', 'Supports deployment, edge infrastructure and product velocity for modern web teams.', 'Поддерживает деплой, edge-инфраструктуру и скорость продуктовых веб-команд.', 'Impulsa despliegue, edge infrastructure y velocidad de producto para equipos web modernos.'),
    tags: ['cloud', 'software', 'startup']
  },
  {
    slug: 'elevenlabs',
    image: logo('elevenlabs.io'),
    name: 'ElevenLabs',
    founded: '2022',
    category: t('Генеративний voice AI', 'Generative voice AI', 'Генеративный voice AI', 'IA generativa de voz'),
    summary: t('Розвиває синтез мовлення, voice agents і мультимовні аудіопродукти для медіа, освіти та бізнесу.', 'Develops speech synthesis, voice agents and multilingual audio products for media, education and business.', 'Развивает синтез речи, voice agents и мультиязычные аудиопродукты для медиа, образования и бизнеса.', 'Desarrolla síntesis de voz, voice agents y productos de audio multilingües para medios, educación y empresas.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'revolut',
    image: logo('revolut.com'),
    name: 'Revolut',
    founded: '2015',
    category: t('Глобальний фінтех-сервіс', 'Global fintech platform', 'Глобальная финтех-платформа', 'Plataforma fintech global'),
    summary: t('Поєднує банкінг, карткові продукти, бізнес-рахунки та міжнародні фінансові операції в одному застосунку.', 'Combines banking, cards, business accounts and international financial operations in one app.', 'Объединяет банкинг, карты, бизнес-счета и международные финансовые операции в одном приложении.', 'Combina banca, tarjetas, cuentas de negocio y operaciones financieras globales en una sola app.'),
    tags: ['fintech', 'operations', 'startup']
  },
  {
    slug: 'ajax-systems',
    image: logo('ajax.systems'),
    name: 'Ajax Systems',
    founded: '2011',
    category: t('Український hardware та security tech', 'Ukrainian hardware and security tech', 'Украинский hardware и security tech', 'Hardware y security tech ucraniano'),
    summary: t('Розробляє охоронні системи, сенсори та звʼязкову інфраструктуру для домівок і бізнесу на глобальному ринку.', 'Builds security systems, sensors and communications infrastructure for homes and businesses worldwide.', 'Разрабатывает системы безопасности, сенсоры и коммуникационную инфраструктуру для домов и бизнеса по всему миру.', 'Desarrolla sistemas de seguridad, sensores e infraestructura de comunicación para hogares y empresas a nivel global.'),
    tags: ['hardware', 'engineering', 'startup']
  },
  {
    slug: 'perplexity',
    image: logo('perplexity.ai'),
    name: 'Perplexity',
    founded: '2022',
    category: t('Пошуковий AI-продукт', 'AI search product', 'AI-поисковый продукт', 'Producto de búsqueda con IA'),
    summary: t('Розвиває AI-пошук і відповіді з вебджерелами, поєднуючи LLM, retrieval та швидкий продуктовий інтерфейс.', 'Builds AI-native search and answer experiences by combining LLMs, retrieval and a fast product interface.', 'Развивает AI-поиск и ответы с веб-источниками, сочетая LLM, retrieval и быстрый продуктовый интерфейс.', 'Desarrolla búsqueda y respuestas con IA combinando LLM, retrieval y una interfaz de producto rápida.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'runway',
    image: logo('runwayml.com'),
    name: 'Runway',
    founded: '2018',
    category: t('Генеративне відео та креативні AI-інструменти', 'Generative video and creative AI tools', 'Генеративное видео и креативные AI-инструменты', 'Video generativo y herramientas creativas de IA'),
    summary: t('Створює продукти для генеративного відео, медіавиробництва та креативних workflow нового покоління.', 'Builds products for generative video, media production and next-generation creative workflows.', 'Создает продукты для генеративного видео, медиа-производства и креативных workflow нового поколения.', 'Construye productos para video generativo, producción multimedia y flujos creativos de nueva generación.'),
    tags: ['ai', 'design', 'startup']
  },
  {
    slug: 'midjourney',
    image: logo('midjourney.com'),
    name: 'Midjourney',
    founded: '2022',
    category: t('Генеративне зображення', 'Generative imaging company', 'Генеративные изображения', 'Empresa de imagen generativa'),
    summary: t('Розвиває AI-системи для генерації зображень, які стали частиною сучасних дизайн- і візуальних workflow.', 'Builds image-generation AI systems that became part of modern design and visual workflows.', 'Развивает AI-системы генерации изображений, ставшие частью современных дизайн- и визуальных workflow.', 'Desarrolla sistemas de generación de imágenes por IA que ya forman parte de flujos modernos de diseño y visuales.'),
    tags: ['ai', 'design', 'startup']
  },
  {
    slug: 'cohere',
    image: logo('cohere.com'),
    name: 'Cohere',
    founded: '2019',
    category: t('Enterprise LLM-платформа', 'Enterprise LLM platform', 'Enterprise LLM-платформа', 'Plataforma empresarial de LLM'),
    summary: t('Працює над мовними моделями та enterprise AI-рішеннями для пошуку, автоматизації й knowledge workflows.', 'Develops language models and enterprise AI products for search, automation and knowledge workflows.', 'Работает над языковыми моделями и enterprise AI-решениями для поиска, автоматизации и knowledge workflows.', 'Desarrolla modelos de lenguaje y productos de IA empresarial para búsqueda, automatización y workflows de conocimiento.'),
    tags: ['ai', 'enterprise', 'startup']
  },
  {
    slug: 'adept',
    image: logo('adept.ai'),
    name: 'Adept',
    founded: '2022',
    category: t('AI agents для software workflows', 'AI agents for software workflows', 'AI agents для software workflows', 'Agentes de IA para flujos de software'),
    summary: t('Будує агентні AI-системи для дій у програмних інтерфейсах і автоматизації knowledge work.', 'Builds agentic AI systems for acting inside software interfaces and automating knowledge work.', 'Строит агентные AI-системы для действий внутри программных интерфейсов и автоматизации knowledge work.', 'Construye sistemas de IA agentica para actuar dentro de interfaces de software y automatizar trabajo intelectual.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'poolside',
    image: logo('poolside.ai'),
    name: 'Poolside',
    founded: '2023',
    category: t('AI для розробників', 'AI for software developers', 'AI для разработчиков', 'IA para desarrolladores'),
    summary: t('Фокусується на foundation-моделях і продуктах для software engineering команд та code generation workflows.', 'Focuses on foundation models and products for software engineering teams and code-generation workflows.', 'Фокусируется на foundation-моделях и продуктах для software engineering команд и code generation workflows.', 'Se enfoca en modelos fundacionales y productos para equipos de ingeniería de software y flujos de generación de código.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'harvey',
    image: logo('harvey.ai'),
    name: 'Harvey',
    founded: '2022',
    category: t('Legal AI-платформа', 'Legal AI platform', 'Legal AI-платформа', 'Plataforma legal con IA'),
    summary: t('Створює AI-інструменти для юридичних команд, документного аналізу та професійних knowledge workflows.', 'Builds AI tools for legal teams, document analysis and professional knowledge workflows.', 'Создает AI-инструменты для юридических команд, анализа документов и профессиональных knowledge workflows.', 'Construye herramientas de IA para equipos legales, análisis documental y workflows profesionales de conocimiento.'),
    tags: ['ai', 'enterprise', 'startup']
  },
  {
    slug: 'character-ai',
    image: logo('character.ai'),
    name: 'Character.AI',
    founded: '2021',
    category: t('AI-платформа персонажів і розмовних агентів', 'AI character and conversational platform', 'AI-платформа персонажей и разговорных агентов', 'Plataforma de personajes y agentes conversacionales con IA'),
    summary: t('Розвиває споживчі AI-продукти навколо персоналізованих персонажів, chat experience та довгої взаємодії.', 'Builds consumer AI products around personalised characters, chat experiences and long-session engagement.', 'Развивает потребительские AI-продукты вокруг персонализированных персонажей, chat experience и длительного взаимодействия.', 'Desarrolla productos de IA para consumo alrededor de personajes personalizados, experiencias de chat e interacción prolongada.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'moonpay',
    image: logo('moonpay.com'),
    name: 'MoonPay',
    founded: '2019',
    category: t('Крипто- та фінтех-інфраструктура', 'Crypto and fintech infrastructure', 'Крипто- и финтех-инфраструктура', 'Infraestructura crypto y fintech'),
    summary: t('Будує платіжну та onboarding-інфраструктуру для цифрових активів, wallets і глобальних payment flows.', 'Builds payment and onboarding infrastructure for digital assets, wallets and global payment flows.', 'Строит платежную и onboarding-инфраструктуру для цифровых активов, wallets и глобальных payment flows.', 'Construye infraestructura de pagos y onboarding para activos digitales, wallets y flujos globales de pago.'),
    tags: ['fintech', 'software', 'startup']
  },
  {
    slug: 'glean',
    image: logo('glean.com'),
    name: 'Glean',
    founded: '2019',
    category: t('Enterprise-пошук і knowledge AI', 'Enterprise search and knowledge AI', 'Enterprise-поиск и knowledge AI', 'Búsqueda enterprise y knowledge AI'),
    summary: t('Створює корпоративний пошук і knowledge layer поверх документів, SaaS-даних та внутрішніх робочих процесів.', 'Builds enterprise search and a knowledge layer across documents, SaaS data and internal workflows.', 'Создает корпоративный поиск и knowledge layer поверх документов, SaaS-данных и внутренних workflow.', 'Construye búsqueda enterprise y una capa de conocimiento sobre documentos, datos SaaS y flujos internos.'),
    tags: ['ai', 'enterprise', 'startup']
  },
  {
    slug: 'sierra',
    image: logo('sierra.ai'),
    name: 'Sierra',
    founded: '2023',
    category: t('Customer AI-платформа', 'Customer AI platform', 'Customer AI-платформа', 'Plataforma de Customer AI'),
    summary: t('Будує AI-системи для customer experience, підтримки клієнтів і conversational workflows на рівні enterprise.', 'Builds AI systems for customer experience, support operations and enterprise conversational workflows.', 'Строит AI-системы для customer experience, поддержки клиентов и enterprise conversational workflows.', 'Construye sistemas de IA para customer experience, soporte y flujos conversacionales a nivel enterprise.'),
    tags: ['ai', 'enterprise', 'startup']
  },
  {
    slug: 'suno',
    image: logo('suno.com'),
    name: 'Suno',
    founded: '2022',
    category: t('Генеративна музика', 'Generative music platform', 'Генеративная музыка', 'Plataforma de música generativa'),
    summary: t('Розвиває генеративні музичні моделі й продукти для створення аудіо, пісень і нових creative workflows.', 'Develops generative music models and products for creating audio, songs and new creative workflows.', 'Развивает генеративные музыкальные модели и продукты для создания аудио, песен и новых creative workflows.', 'Desarrolla modelos de música generativa y productos para crear audio, canciones y nuevos flujos creativos.'),
    tags: ['ai', 'design', 'startup']
  },
  {
    slug: 'temporal',
    image: logo('temporal.io'),
    name: 'Temporal',
    founded: '2019',
    category: t('Workflow orchestration platform', 'Workflow orchestration platform', 'Платформа orchestration workflow', 'Plataforma de orquestación de workflows'),
    summary: t('Створює інфраструктуру для надійних distributed workflows, backend orchestration і стійких сервісних процесів.', 'Builds infrastructure for reliable distributed workflows, backend orchestration and resilient service processes.', 'Создает инфраструктуру для надежных distributed workflows, backend orchestration и устойчивых сервисных процессов.', 'Construye infraestructura para workflows distribuidos fiables, orquestación backend y procesos de servicio resilientes.'),
    tags: ['software', 'cloud', 'startup']
  },
  {
    slug: 'microsoft',
    image: logo('microsoft.com'),
    name: 'Microsoft',
    founded: '1975',
    category: t('Платформа хмарних та корпоративних сервісів', 'Cloud and enterprise platform', 'Платформа облачных и корпоративных сервисов', 'Plataforma cloud y corporativa'),
    summary: t('Azure, Microsoft 365, Windows та AI-сервіси для підприємств і розробників по всьому світу.', 'Azure, Microsoft 365, Windows and AI services for enterprises and developers worldwide.', 'Azure, Microsoft 365, Windows и AI-сервисы для предприятий и разработчиков по всему миру.', 'Azure, Microsoft 365, Windows y servicios de IA para empresas y desarrolladores en todo el mundo.'),
    tags: ['cloud', 'software', 'enterprise']
  },
  {
    slug: 'google-cloud',
    image: logo('cloud.google.com'),
    name: 'Google Cloud',
    founded: '2008',
    category: t('Хмарна платформа та інфраструктура даних', 'Cloud platform and data infrastructure', 'Облачная платформа и инфраструктура данных', 'Plataforma cloud e infraestructura de datos'),
    summary: t('GCP поєднує compute, дані, ML та корпоративні сервіси з екосистемою Google.', 'GCP combines compute, data, ML and enterprise services within Google\'s ecosystem.', 'GCP объединяет compute, данные, ML и корпоративные сервисы в экосистеме Google.', 'GCP combina cómputo, datos, ML y servicios empresariales dentro del ecosistema de Google.'),
    tags: ['cloud', 'ai', 'enterprise']
  },
  {
    slug: 'amazon-web-services',
    image: logo('aws.amazon.com'),
    name: 'Amazon Web Services',
    founded: '2006',
    category: t('Хмарна інфраструктура', 'Cloud infrastructure', 'Облачная инфраструктура', 'Infraestructura cloud'),
    summary: t('Широкий каталог IaaS та PaaS: compute, сховища, мережі, бази даних та AI-сервіси.', 'A broad IaaS/PaaS catalogue spanning compute, storage, networking, databases and AI services.', 'Широкий каталог IaaS и PaaS: compute, хранилища, сети, базы данных и AI-сервисы.', 'Catálogo amplio de IaaS/PaaS con cómputo, almacenamiento, redes, bases de datos y servicios de IA.'),
    tags: ['cloud', 'operations', 'enterprise']
  },
  {
    slug: 'meta',
    image: logo('meta.com'),
    name: 'Meta',
    founded: '2004',
    category: t('Соціальні платформи та метавсесвіт', 'Social platforms and metaverse', 'Социальные платформы и метавселенная', 'Plataformas sociales y metaverso'),
    summary: t('Сімейство продуктів Facebook, Instagram, WhatsApp та інвестиції в VR і AI інфраструктуру.', 'Product family spanning Facebook, Instagram, WhatsApp plus VR and AI infrastructure investments.', 'Семейство продуктов Facebook, Instagram, WhatsApp и инвестиции в VR и AI-инфраструктуру.', 'Familia de productos Facebook, Instagram, WhatsApp más inversiones en infraestructura de RV e IA.'),
    tags: ['software', 'ai', 'operations']
  },
  {
    slug: 'oracle-cloud',
    image: logo('oracle.com'),
    name: 'Oracle Cloud',
    founded: '2012',
    category: t('Хмарні бази даних та корпоративні застосування', 'Cloud databases and enterprise applications', 'Облачные базы данных и корпоративные приложения', 'Bases de datos cloud y aplicaciones empresariales'),
    summary: t('Корпоративні SaaS, бази даних та інфраструктура для місійно-критичних систем.', 'Enterprise SaaS, databases and infrastructure for mission-critical systems.', 'Корпоративные SaaS, базы данных и инфраструктура для mission-critical систем.', 'SaaS empresarial, bases de datos e infraestructura para sistemas críticos.'),
    tags: ['cloud', 'enterprise', 'software']
  },
  {
    slug: 'snowflake',
    image: logo('snowflake.com'),
    name: 'Snowflake',
    founded: '2012',
    category: t('Платформа даних у хмарі', 'Cloud data platform', 'Облачная платформа данных', 'Plataforma de datos en la nube'),
    summary: t('Сервіс даних для аналітики, обміну даними та інтеграції AI workloads enterprise-середовищ.', 'Data platform for analytics, data sharing and AI workloads in enterprise environments.', 'Платформа данных для аналитики, обмена данными и AI workloads в enterprise-среде.', 'Plataforma de datos para analítica, intercambio de datos y cargas de IA en entornos enterprise.'),
    tags: ['cloud', 'ai', 'enterprise']
  },
  {
    slug: 'salesforce',
    image: logo('salesforce.com'),
    name: 'Salesforce',
    founded: '1999',
    category: t('CRM та корпоративні хмарні застосування', 'CRM and enterprise cloud applications', 'CRM и корпоративные облачные приложения', 'CRM y aplicaciones cloud empresariales'),
    summary: t('Хмарний CRM та платформа для продажів, сервісу й маркетингу з екосистемою AppExchange.', 'Cloud CRM and platform for sales, service and marketing with an AppExchange ecosystem.', 'Облачный CRM и платформа для продаж, сервиса и маркетинга с экосистемой AppExchange.', 'CRM cloud y plataforma para ventas, servicio y marketing con ecosistema AppExchange.'),
    tags: ['enterprise', 'software', 'operations']
  },
  {
    slug: 'palantir',
    image: logo('palantir.com'),
    name: 'Palantir',
    founded: '2003',
    category: t('Платформа даних та аналітики', 'Data analytics platform', 'Платформа данных и аналитики', 'Plataforma de datos y analítica'),
    summary: t('Спеціалізовані рішення для інтеграції даних та операційних систем для організацій та державних замовників.', 'Specialised data integration and operational software for organisations and government customers.', 'Специализированная интеграция данных и операционные системы для организаций и госсектора.', 'Integración de datos y software operativo especializado para organizaciones y sector público.'),
    tags: ['software', 'enterprise', 'operations']
  },
  {
    slug: 'datadog',
    image: logo('datadoghq.com'),
    name: 'Datadog',
    founded: '2010',
    category: t('Observability та моніторинг', 'Observability and monitoring', 'Observability и мониторинг', 'Observabilidad y monitorización'),
    summary: t('Метрики, логи, трейси та security-сигнали для хмарних і контейнерних середовищ.', 'Metrics, logs, traces and security signals for cloud and container environments.', 'Метрики, логи, трейсы и security-сигналы для облачных и контейнерных сред.', 'Métricas, logs, trazas y señales de seguridad para entornos cloud y contenedores.'),
    tags: ['software', 'cloud', 'operations']
  },
  {
    slug: 'mongodb',
    image: logo('mongodb.com'),
    name: 'MongoDB',
    founded: '2007',
    category: t('База даних та data-платформа', 'Database and data platform', 'База данных и data-платформа', 'Base de datos y plataforma de datos'),
    summary: t('Документно-орієнтована база та Atlas як повністю керований хмарний сервіс даних.', 'Document-oriented database plus Atlas as a managed cloud data service.', 'Документо-ориентированная база и Atlas как управляемый облачный сервис данных.', 'Base orientada a documentos más Atlas como servicio de datos gestionado en la nube.'),
    tags: ['software', 'cloud', 'enterprise']
  },
  {
    slug: 'supabase',
    image: logo('supabase.com'),
    name: 'Supabase',
    founded: '2020',
    category: t('Open-source Firebase-альтернатива', 'Open-source Firebase alternative', 'Open-source альтернатива Firebase', 'Alternativa open-source a Firebase'),
    summary: t('Postgres, auth і realtime APIs як developer-first backend для стартапів та indie-команд.', 'Postgres, auth and realtime APIs as a developer-first backend for startups and indie teams.', 'Postgres, auth и realtime APIs как developer-first backend для стартапов и indie-команд.', 'Postgres, auth y APIs realtime como backend developer-first para startups y equipos indie.'),
    tags: ['software', 'open-source', 'startup']
  },
  {
    slug: 'posthog',
    image: logo('posthog.com'),
    name: 'PostHog',
    founded: '2020',
    category: t('Product analytics open-source', 'Open-source product analytics', 'Product analytics open-source', 'Product analytics open source'),
    summary: t('Інструменти для продуктової аналітики та експериментів з відкритим кодом для інженерних команд.', 'Open-source analytics and experimentation tooling for engineering-led product teams.', 'Открытые инструменты продуктовой аналитики и экспериментов для инженерных команд.', 'Análisis de producto y experimentación open source para equipos liderados por ingeniería.'),
    tags: ['software', 'open-source', 'startup']
  },
  {
    slug: 'linear',
    image: logo('linear.app'),
    name: 'Linear',
    founded: '2019',
    category: t('Інструмент керування продуктом', 'Product delivery workflow tool', 'Инструмент управления продуктом', 'Herramienta de delivery de producto'),
    summary: t('Швидкий issue tracker та roadmap-платформа для сучасних software-команд.', 'Fast issue tracking and roadmap workflows for modern software teams.', 'Быстрый issue tracker и roadmap-платформа для современных software-команд.', 'Issue tracking rápido y workflows de roadmap para equipos de software modernos.'),
    tags: ['software', 'design', 'startup']
  },
  {
    slug: 'retool',
    image: logo('retool.com'),
    name: 'Retool',
    founded: '2017',
    category: t('Internal tools платформа', 'Internal tools platform', 'Платформа internal tools', 'Plataforma de internal tools'),
    summary: t('Дозволяє швидко будувати внутрішні адмін-панелі й операційні інструменти поверх API.', 'Helps teams ship internal admin panels and operational tools quickly on top of APIs.', 'Позволяет быстро создавать внутренние админки и операционные инструменты поверх API.', 'Permite lanzar paneles internos y herramientas operativas rápidamente sobre APIs.'),
    tags: ['software', 'enterprise', 'startup']
  },
  {
    slug: 'zapier',
    image: logo('zapier.com'),
    name: 'Zapier',
    founded: '2011',
    category: t('Автоматизація workflow між SaaS', 'Workflow automation between SaaS apps', 'Автоматизация workflow между SaaS', 'Automatización de workflows entre SaaS'),
    summary: t('Безкодові інтеграції між тисячами застосунків для маркетингу, продажів та операцій.', 'No-code integrations across thousands of apps for marketing, sales and operations.', 'No-code интеграции между тысячами приложений для маркетинга, продаж и операций.', 'Integraciones no-code entre miles de apps para marketing, ventas y operaciones.'),
    tags: ['software', 'operations', 'startup']
  }
];

const startupDetails = {
  anthropic: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Дослідницька лабораторія та модельна компанія', 'Research lab and model company', 'Исследовательская лаборатория и модельная компания', 'Laboratorio de investigación y compañía de modelos'),
    market: t('AI assistants, model APIs, enterprise adoption', 'AI assistants, model APIs, enterprise adoption', 'AI assistants, model APIs, enterprise adoption', 'Asistentes de IA, APIs de modelos y adopción enterprise'),
    notableFor: t('Claude, constitutional AI і безпечне масштабування моделей', 'Claude, constitutional AI and safer model scaling', 'Claude, constitutional AI и безопасное масштабирование моделей', 'Claude, constitutional AI y escalamiento más seguro de modelos'),
    signals: t(
      ['Сильний фокус на model safety', 'Окремий бренд для enterprise AI', 'Швидке зростання серед корпоративних клієнтів'],
      ['A visible focus on model safety', 'A distinct brand in enterprise AI', 'Fast traction with enterprise customers'],
      ['Сильный фокус на model safety', 'Отдельный бренд в enterprise AI', 'Быстрый рост среди корпоративных клиентов'],
      ['Foco visible en model safety', 'Marca diferenciada en enterprise AI', 'Rápida tracción con clientes corporativos']
    )
  },
  'mistral-ai': {
    hq: t('Париж, Франція', 'Paris, France', 'Париж, Франция', 'París, Francia'),
    model: t('AI startup з відкритими та комерційними моделями', 'AI startup with open and commercial models', 'AI startup с открытыми и коммерческими моделями', 'Startup de IA con modelos abiertos y comerciales'),
    market: t('Open models, European AI, inference products', 'Open models, European AI, inference products', 'Open models, European AI, inference products', 'Open models, IA europea y productos de inference'),
    notableFor: t('Одна з найпомітніших європейських AI-компаній нового циклу', 'One of the most visible European AI companies of the new cycle', 'Одна из самых заметных европейских AI-компаний нового цикла', 'Una de las compañías europeas de IA más visibles del nuevo ciclo'),
    signals: t(
      ['Позиціонується як європейська AI-альтернатива', 'Працює з open models', 'Швидко вийшла в центр AI-ринку після 2023 року'],
      ['Positioned as a European AI alternative', 'Works with open models', 'Reached the center of the AI market quickly after 2023'],
      ['Позиционируется как европейская AI-альтернатива', 'Работает с open models', 'Быстро вышла в центр AI-рынка после 2023 года'],
      ['Se posiciona como alternativa europea de IA', 'Trabaja con open models', 'Llegó rápido al centro del mercado de IA tras 2023']
    )
  },
  cursor: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Developer tool startup', 'Developer tool startup', 'Developer tool startup', 'Startup de herramientas para desarrolladores'),
    market: t('AI coding, codebase navigation, engineering workflows', 'AI coding, codebase navigation, engineering workflows', 'AI coding, codebase navigation, engineering workflows', 'Codificación con IA, navegación del codebase y workflows de ingeniería'),
    notableFor: t('Поєднання AI-асистента, codebase search і редактора для розробників', 'Combining an AI assistant, codebase search and an editor for developers', 'Сочетание AI-ассистента, codebase search и редактора для разработчиков', 'Combinar asistente de IA, búsqueda en el codebase y editor para desarrolladores'),
    signals: t(
      ['Сильний фокус на продуктивності інженерів', 'Орієнтація на командні workflow', 'Продукт нової хвилі AI-native developer tools'],
      ['A strong focus on engineering productivity', 'Built around team workflows', 'Part of the new wave of AI-native developer tools'],
      ['Сильный фокус на продуктивности инженеров', 'Ориентация на командные workflow', 'Часть новой волны AI-native developer tools'],
      ['Fuerte foco en productividad de ingeniería', 'Orientado a workflows de equipo', 'Parte de la nueva ola de developer tools AI-native']
    )
  },
  elevenlabs: {
    hq: t('Лондон / Нью-Йорк', 'London / New York', 'Лондон / Нью-Йорк', 'Londres / Nueva York'),
    model: t('Voice AI startup', 'Voice AI startup', 'Voice AI startup', 'Startup de voice AI'),
    market: t('Speech synthesis, voice agents, audio products', 'Speech synthesis, voice agents, audio products', 'Speech synthesis, voice agents, audio products', 'Síntesis de voz, voice agents y productos de audio'),
    notableFor: t('Різке зростання в сегменті генеративного аудіо', 'Rapid growth in generative audio', 'Резкий рост в сегменте генеративного аудио', 'Crecimiento rápido en audio generativo'),
    signals: t(
      ['Мультимовний voice stack', 'Продукти для медіа і бізнесу', 'Видимий бренд у voice AI після 2022 року'],
      ['A multilingual voice stack', 'Products for media and business teams', 'A visible brand in voice AI after 2022'],
      ['Мультиязычный voice stack', 'Продукты для медиа и бизнеса', 'Заметный бренд в voice AI после 2022 года'],
      ['Stack de voz multilingüe', 'Productos para medios y empresas', 'Marca visible en voice AI desde 2022']
    )
  },
  perplexity: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('AI search startup', 'AI search startup', 'AI search startup', 'Startup de búsqueda con IA'),
    market: t('Search, retrieval, assistants, web answers', 'Search, retrieval, assistants, web answers', 'Search, retrieval, assistants, web answers', 'Búsqueda, retrieval, asistentes y respuestas web'),
    notableFor: t('Один із найпомітніших AI search-продуктів нового циклу', 'One of the most visible AI search products of the new cycle', 'Один из самых заметных AI search-продуктов нового цикла', 'Uno de los productos de AI search más visibles del nuevo ciclo'),
    signals: t(
      ['Фокус на швидких відповідях із джерелами', 'Сильний consumer AI brand', 'Швидкий ріст після 2022 року'],
      ['A focus on fast source-linked answers', 'A strong consumer AI brand', 'Fast growth after 2022'],
      ['Фокус на быстрых ответах с источниками', 'Сильный consumer AI brand', 'Быстрый рост после 2022 года'],
      ['Foco en respuestas rápidas con fuentes', 'Marca fuerte de consumer AI', 'Crecimiento rápido desde 2022']
    )
  },
  runway: {
    hq: t('Нью-Йорк, США', 'New York, United States', 'Нью-Йорк, США', 'Nueva York, Estados Unidos'),
    model: t('Creative AI company', 'Creative AI company', 'Creative AI company', 'Compañía de IA creativa'),
    market: t('Video generation, media production, creator tools', 'Video generation, media production, creator tools', 'Video generation, media production, creator tools', 'Generación de video, producción multimedia y creator tools'),
    notableFor: t('Генеративне відео як окремий продуктовий сегмент', 'Turning generative video into a standalone product segment', 'Генеративное видео как отдельный продуктовый сегмент', 'Convertir el video generativo en un segmento de producto propio'),
    signals: t(
      ['Орієнтація на creative teams', 'AI-відео як центральний продукт', 'Сильна присутність у креативному ринку після 2018 року'],
      ['Built for creative teams', 'AI video as the core product', 'A strong presence in the creative market after 2018'],
      ['Ориентация на creative teams', 'AI-видео как центральный продукт', 'Сильное присутствие на креативном рынке после 2018 года'],
      ['Orientada a equipos creativos', 'Video con IA como producto central', 'Fuerte presencia en el mercado creativo desde 2018']
    )
  },
  midjourney: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Generative imaging company', 'Generative imaging company', 'Generative imaging company', 'Compañía de imagen generativa'),
    market: t('Image generation, visual workflows, design exploration', 'Image generation, visual workflows, design exploration', 'Image generation, visual workflows, design exploration', 'Generación de imágenes, flujos visuales y exploración de diseño'),
    notableFor: t('Один із найсильніших брендів у генеративних зображеннях', 'One of the strongest brands in generative imaging', 'Один из самых сильных брендов в генеративных изображениях', 'Una de las marcas más fuertes en imagen generativa'),
    signals: t(
      ['Сильне adoption серед дизайнерів', 'Висока впізнаваність бренду', 'Продуктова ніша сформувалася після 2022 року'],
      ['Strong adoption among designers', 'High brand recognition', 'The product niche solidified after 2022'],
      ['Сильное adoption среди дизайнеров', 'Высокая узнаваемость бренда', 'Продуктовая ниша сформировалась после 2022 года'],
      ['Fuerte adopción entre diseñadores', 'Alta recordación de marca', 'El nicho se consolidó después de 2022']
    )
  },
  cohere: {
    hq: t('Торонто, Канада', 'Toronto, Canada', 'Торонто, Канада', 'Toronto, Canadá'),
    model: t('Enterprise AI company', 'Enterprise AI company', 'Enterprise AI company', 'Compañía de IA empresarial'),
    market: t('Enterprise LLMs, knowledge workflows, model APIs', 'Enterprise LLMs, knowledge workflows, model APIs', 'Enterprise LLMs, knowledge workflows, model APIs', 'LLMs enterprise, knowledge workflows y APIs de modelos'),
    notableFor: t('Фокус на B2B-рішенні для мовних моделей', 'A strong B2B focus for language-model deployment', 'Фокус на B2B-решении для языковых моделей', 'Foco fuerte en despliegue B2B de modelos de lenguaje'),
    signals: t(
      ['Орієнтація на корпоративний ринок', 'Сильна позиція в enterprise LLM-сегменті', 'Пост-2019 AI-компанія з інфраструктурним фокусом'],
      ['Built for enterprise customers', 'A strong place in the enterprise LLM segment', 'A post-2019 AI company with infrastructure focus'],
      ['Ориентация на корпоративный рынок', 'Сильная позиция в enterprise LLM-сегменте', 'Пост-2019 AI-компания с инфраструктурным фокусом'],
      ['Orientada a clientes enterprise', 'Posición fuerte en el segmento enterprise LLM', 'Compañía de IA post-2019 con foco de infraestructura']
    )
  },
  adept: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Agentic AI startup', 'Agentic AI startup', 'Agentic AI startup', 'Startup de IA agentica'),
    market: t('Software agents, UI actions, workflow automation', 'Software agents, UI actions, workflow automation', 'Software agents, UI actions, workflow automation', 'Agentes de software, acciones en UI y automatización de workflows'),
    notableFor: t('Ставка на агентні системи, що діють у програмному середовищі', 'A bet on agents that act inside software environments', 'Ставка на агентные системы, действующие внутри программной среды', 'Apuesta por agentes que actúan dentro de entornos de software'),
    signals: t(
      ['Фокус на software actions', 'Чіткий agentic AI narrative', 'Продуктовий сегмент нового циклу після 2022 року'],
      ['Focused on software actions', 'A clear agentic-AI narrative', 'Part of a product segment that emerged after 2022'],
      ['Фокус на software actions', 'Четкий agentic AI narrative', 'Часть продуктового сегмента, возникшего после 2022 года'],
      ['Foco en acciones dentro del software', 'Narrativa clara de IA agentica', 'Parte de un segmento surgido después de 2022']
    )
  },
  poolside: {
    hq: t('США / Франція', 'United States / France', 'США / Франция', 'Estados Unidos / Francia'),
    model: t('Developer AI company', 'Developer AI company', 'Developer AI company', 'Compañía de IA para desarrolladores'),
    market: t('Code generation, developer tools, foundation models', 'Code generation, developer tools, foundation models', 'Code generation, developer tools, foundation models', 'Generación de código, developer tools y modelos fundacionales'),
    notableFor: t('Новий гравець у сегменті AI для software engineering', 'A new entrant in AI for software engineering', 'Новый игрок в сегменте AI для software engineering', 'Un nuevo actor en IA para software engineering'),
    signals: t(
      ['Ставка на core developer workflows', 'Модельний фокус для code generation', 'Видимий AI-devtools сегмент після 2023 року'],
      ['A bet on core developer workflows', 'Model-centric work for code generation', 'Part of the visible AI devtools segment after 2023'],
      ['Ставка на core developer workflows', 'Модельный фокус для code generation', 'Часть заметного AI devtools-сегмента после 2023 года'],
      ['Apuesta por workflows centrales de desarrolladores', 'Foco de modelos para code generation', 'Parte del segmento visible de AI devtools desde 2023']
    )
  },
  harvey: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Vertical AI startup', 'Vertical AI startup', 'Vertical AI startup', 'Startup de IA vertical'),
    market: t('Legal tech, professional services, document analysis', 'Legal tech, professional services, document analysis', 'Legal tech, professional services, document analysis', 'Legal tech, servicios profesionales y análisis documental'),
    notableFor: t('Один із найпомітніших vertical AI-продуктів нового циклу', 'One of the most visible vertical-AI products of the new cycle', 'Один из самых заметных vertical AI-продуктов нового цикла', 'Uno de los productos de IA vertical más visibles del nuevo ciclo'),
    signals: t(
      ['Чіткий юридичний use case', 'Сильний B2B AI narrative', 'Показує рух AI у vertical software'],
      ['A clear legal use case', 'A strong B2B AI narrative', 'Shows how AI is moving into vertical software'],
      ['Четкий юридический use case', 'Сильный B2B AI narrative', 'Показывает движение ИИ в vertical software'],
      ['Caso de uso legal claro', 'Narrativa fuerte de IA B2B', 'Muestra cómo la IA entra en software vertical']
    )
  },
  'character-ai': {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Consumer AI startup', 'Consumer AI startup', 'Consumer AI startup', 'Startup de IA para consumo'),
    market: t('Conversational AI, consumer engagement, characters', 'Conversational AI, consumer engagement, characters', 'Conversational AI, consumer engagement, characters', 'IA conversacional, engagement de consumo y personajes'),
    notableFor: t('Виводить AI-персонажів у масовий споживчий продукт', 'Bringing AI characters into a mass consumer product', 'Выводит AI-персонажей в массовый потребительский продукт', 'Lleva personajes de IA a un producto masivo de consumo'),
    signals: t(
      ['Consumer AI як окремий сегмент', 'Фокус на довгій взаємодії', 'Впізнавана ніша серед AI-продуктів після 2021 року'],
      ['Consumer AI as a standalone segment', 'A focus on long-form interaction', 'A recognisable niche among post-2021 AI products'],
      ['Consumer AI как отдельный сегмент', 'Фокус на долгом взаимодействии', 'Узнаваемая ниша среди AI-продуктов после 2021 года'],
      ['Consumer AI como segmento propio', 'Foco en interacción prolongada', 'Un nicho reconocible entre productos de IA después de 2021']
    )
  },
  moonpay: {
    hq: t('Лондон / Маямі', 'London / Miami', 'Лондон / Майами', 'Londres / Miami'),
    model: t('Fintech infrastructure startup', 'Fintech infrastructure startup', 'Fintech infrastructure startup', 'Startup de infraestructura fintech'),
    market: t('Payments, crypto onboarding, digital assets', 'Payments, crypto onboarding, digital assets', 'Payments, crypto onboarding, digital assets', 'Pagos, crypto onboarding y activos digitales'),
    notableFor: t('Платіжний шар для цифрових активів і wallets', 'A payment layer for digital assets and wallets', 'Платежный слой для цифровых активов и wallets', 'Una capa de pagos para activos digitales y wallets'),
    signals: t(
      ['Комбінація fintech і web3 onboarding', 'Інфраструктурний продукт для партнерських команд', 'Видимий гравець хвилі після 2019 року'],
      ['A mix of fintech and web3 onboarding', 'Infrastructure for partner ecosystems', 'A visible player of the post-2019 wave'],
      ['Комбинация fintech и web3 onboarding', 'Инфраструктурный продукт для партнерских экосистем', 'Заметный игрок волны после 2019 года'],
      ['Combinación de fintech y web3 onboarding', 'Infraestructura para ecosistemas de socios', 'Actor visible de la ola posterior a 2019']
    )
  },
  glean: {
    hq: t('Пало-Альто, США', 'Palo Alto, United States', 'Пало-Альто, США', 'Palo Alto, Estados Unidos'),
    model: t('Enterprise search startup', 'Enterprise search startup', 'Enterprise search startup', 'Startup de búsqueda enterprise'),
    market: t('Internal search, knowledge access, enterprise productivity', 'Internal search, knowledge access, enterprise productivity', 'Internal search, knowledge access, enterprise productivity', 'Búsqueda interna, acceso al conocimiento y productividad enterprise'),
    notableFor: t('Пошук як knowledge layer для корпоративних команд', 'Search as a knowledge layer for enterprise teams', 'Поиск как knowledge layer для корпоративных команд', 'Búsqueda como capa de conocimiento para equipos enterprise'),
    signals: t(
      ['Сильний enterprise use case', 'Працює поверх SaaS-інструментів', 'Релевантність зросла разом із knowledge AI-попитом'],
      ['A strong enterprise use case', 'Works across SaaS systems', 'Its relevance rose with demand for knowledge AI'],
      ['Сильный enterprise use case', 'Работает поверх SaaS-систем', 'Актуальность выросла вместе со спросом на knowledge AI'],
      ['Caso de uso enterprise sólido', 'Opera sobre sistemas SaaS', 'Su relevancia creció junto a la demanda de knowledge AI']
    )
  },
  sierra: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Customer AI startup', 'Customer AI startup', 'Customer AI startup', 'Startup de Customer AI'),
    market: t('Customer support, service operations, conversational AI', 'Customer support, service operations, conversational AI', 'Customer support, service operations, conversational AI', 'Soporte al cliente, operaciones de servicio e IA conversacional'),
    notableFor: t('Новий клас AI-сервісу для customer operations', 'A new class of AI service for customer operations', 'Новый класс AI-сервиса для customer operations', 'Una nueva clase de servicio de IA para customer operations'),
    signals: t(
      ['Фокус на customer-facing workflows', 'Сильний enterprise service narrative', 'Частина нової хвилі agentic support products'],
      ['Focused on customer-facing workflows', 'A strong enterprise service narrative', 'Part of the new wave of agentic support products'],
      ['Фокус на customer-facing workflows', 'Сильный enterprise service narrative', 'Часть новой волны agentic support products'],
      ['Foco en workflows orientados al cliente', 'Narrativa fuerte de servicio enterprise', 'Parte de la nueva ola de productos agentic de soporte']
    )
  },
  suno: {
    hq: t('США', 'United States', 'США', 'Estados Unidos'),
    model: t('Generative audio startup', 'Generative audio startup', 'Generative audio startup', 'Startup de audio generativo'),
    market: t('Music generation, audio creation, creator tools', 'Music generation, audio creation, creator tools', 'Music generation, audio creation, creator tools', 'Generación musical, creación de audio y creator tools'),
    notableFor: t('Музика як окремий сегмент генеративного AI', 'Music as a standalone generative-AI segment', 'Музыка как отдельный сегмент генеративного ИИ', 'La música como segmento propio de IA generativa'),
    signals: t(
      ['Швидко сформувала нову категорію', 'Сильна creative AI-присутність', 'Показує розширення AI за межі тексту й коду'],
      ['Helped define a new category quickly', 'A strong creative-AI presence', 'Shows AI expanding beyond text and code'],
      ['Быстро сформировала новую категорию', 'Сильное присутствие в creative AI', 'Показывает расширение ИИ за пределы текста и кода'],
      ['Ayudó a definir una nueva categoría con rapidez', 'Fuerte presencia en creative AI', 'Muestra a la IA expandiéndose más allá de texto y código']
    )
  },
  temporal: {
    hq: t('Сіетл, США', 'Seattle, United States', 'Сиэтл, США', 'Seattle, Estados Unidos'),
    model: t('Infrastructure software startup', 'Infrastructure software startup', 'Infrastructure software startup', 'Startup de software de infraestructura'),
    market: t('Distributed systems, workflow orchestration, backend reliability', 'Distributed systems, workflow orchestration, backend reliability', 'Distributed systems, workflow orchestration, backend reliability', 'Sistemas distribuidos, orquestación de workflows y fiabilidad backend'),
    notableFor: t('Інфраструктурний підхід до довгоживучих workflow і backend orchestration', 'An infrastructure-first approach to long-running workflows and backend orchestration', 'Инфраструктурный подход к долгоживущим workflow и backend orchestration', 'Un enfoque de infraestructura para workflows de larga duración y orquestación backend'),
    signals: t(
      ['Сильний інженерний use case', 'Орієнтація на reliability і backend teams', 'Показує попит на глибоку інфраструктуру після 2019 року'],
      ['A strong engineering use case', 'Built for reliability and backend teams', 'Shows demand for deep infrastructure after 2019'],
      ['Сильный инженерный use case', 'Ориентация на reliability и backend teams', 'Показывает спрос на глубокую инфраструктуру после 2019 года'],
      ['Caso de uso de ingeniería fuerte', 'Orientado a reliability y equipos backend', 'Muestra demanda por infraestructura profunda después de 2019']
    )
  },
  openai: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('AI-лабораторія та продуктова компанія', 'AI research lab and product company', 'AI-лаборатория и продуктовая компания', 'Laboratorio de IA y empresa de producto'),
    market: t('LLM, API, chat, enterprise adoption', 'LLM, API, chat, enterprise adoption', 'LLM, API, чат, корпоративное внедрение', 'LLM, API, chat y adopción enterprise'),
    notableFor: t('ChatGPT та екосистема моделей для розробників і бізнесу', 'ChatGPT and a broad model ecosystem for developers and enterprises', 'ChatGPT и широкая экосистема моделей для разработчиков и бизнеса', 'ChatGPT y un ecosistema amplio de modelos para desarrolladores y empresas'),
    signals: t(
      ['Дослідницький корінь і масовий продуктовий вплив', 'Сильний developer та enterprise API-layer', 'Центральний гравець хвилі foundation-моделей'],
      ['Research roots with mainstream product impact', 'Strong developer and enterprise API tier', 'A central player in the foundation-model wave'],
      ['Исследовательские корни и массовое продуктовое влияние', 'Сильный developer и enterprise API-слой', 'Центральный игрок волны foundation-моделей'],
      ['Raíces de investigación con impacto masivo en producto', 'Fuerte capa API para desarrolladores y enterprise', 'Actor central en la ola de modelos fundacionales']
    )
  },
  deepmind: {
    hq: t('Лондон, Велика Британія', 'London, United Kingdom', 'Лондон, Великобритания', 'Londres, Reino Unido'),
    model: t('AI-дослідження в складі Google', 'AI research inside Google', 'Исследования ИИ внутри Google', 'Investigación en IA dentro de Google'),
    market: t('Foundation research, science, Google products', 'Foundation research, science, Google products', 'Фундаментальные исследования, наука, продукты Google', 'Investigación fundamental, ciencia y productos Google'),
    notableFor: t('AlphaFold, AlphaGo та фундаментальні AI-системи', 'AlphaFold, AlphaGo and foundational AI systems', 'AlphaFold, AlphaGo и фундаментальные AI-системы', 'AlphaFold, AlphaGo y sistemas de IA fundamentales'),
    signals: t(
      ['Сильний звʼязок із науковими задачами', 'Інтеграція з інфраструктурою Google', 'Видима AI-дослідницька база у Великій Британії'],
      ['Strong ties to scientific challenges', 'Integrated with Google-scale infrastructure', 'A visible UK-based AI research hub'],
      ['Сильная связь с научными задачами', 'Интеграция с инфраструктурой Google', 'Заметная база AI-исследований в Великобритании'],
      ['Vínculos fuertes con retos científicos', 'Integración con infraestructura a escala Google', 'Centro visible de investigación en IA en el Reino Unido']
    )
  },
  stripe: {
    hq: t('Дублін / Сан-Франциско', 'Dublin / San Francisco', 'Дублин / Сан-Франциско', 'Dublín / San Francisco'),
    model: t('Глобальна платіжна інфраструктура', 'Global payments infrastructure', 'Глобальная платежная инфраструктура', 'Infraestructura global de pagos'),
    market: t('Payments API, billing, tax, financial infrastructure', 'Payments API, billing, tax, financial infrastructure', 'Payments API, биллинг, налоги, финансовая инфраструктура', 'API de pagos, billing, impuestos e infraestructura financiera'),
    notableFor: t('Developer-centric платіжні API, що сформували інтернет-комерцію', 'Developer-centric payment APIs that shaped internet commerce', 'Developer-centric платежные API, повлиявшие на интернет-коммерцию', 'API de pagos centrados en desarrolladores que marcaron el comercio online'),
    signals: t(
      ['Платіжний шар для SaaS і маркетплейсів', 'Сильний фокус на документації та інтеграції', 'Інфраструктурний продукт із глобальним охопленням'],
      ['Payments layer for SaaS and marketplaces', 'Strong docs and integration culture', 'Infrastructure product with global footprint'],
      ['Платежный слой для SaaS и маркетплейсов', 'Сильная документация и интеграции', 'Инфраструктурный продукт с глобальным охватом'],
      ['Capa de pagos para SaaS y marketplaces', 'Fuerte cultura de docs e integración', 'Producto de infraestructura con alcance global']
    )
  },
  spacex: {
    hq: t('Хоторн, США', 'Hawthorne, United States', 'Хоторн, США', 'Hawthorne, Estados Unidos'),
    model: t('Космічна інженерія та запуски', 'Space engineering and launch services', 'Космическая инженерия и запуски', 'Ingeniería espacial y servicios de lanzamiento'),
    market: t('Launch, Starlink, reusable rockets', 'Launch, Starlink, reusable rockets', 'Запуски, Starlink, многоразовые ракеты', 'Lanzamientos, Starlink y cohetes reutilizables'),
    notableFor: t('Повторне використання ступенів і комерційні запуски', 'Reusable stages and commercial launch cadence', 'Многоразовые ступени и коммерческий темп запусков', 'Etapas reutilizables y cadencia de lanzamientos comerciales'),
    signals: t(
      ['Інтеграція виробництва та інженерії', 'Starlink як масштабна інфраструктурна мережа', 'Вплив на вартість доступу до орбіти'],
      ['Tight integration of manufacturing and engineering', 'Starlink as large-scale infrastructure', 'Impact on cost to reach orbit'],
      ['Интеграция производства и инженерии', 'Starlink как крупная инфраструктурная сеть', 'Влияние на стоимость выхода на орбиту'],
      ['Integración estrecha de manufactura e ingeniería', 'Starlink como infraestructura a gran escala', 'Impacto en el coste de acceso a órbita']
    )
  },
  canva: {
    hq: t('Сідней, Австралія', 'Sydney, Australia', 'Сидней, Австралия', 'Sídney, Australia'),
    model: t('Платформа дизайну для команд', 'Design platform for teams', 'Дизайн-платформа для команд', 'Plataforma de diseño para equipos'),
    market: t('Templates, brand, video, marketing teams', 'Templates, brand, video, marketing teams', 'Шаблоны, бренд, видео, маркетинговые команды', 'Plantillas, marca, vídeo y equipos de marketing'),
    notableFor: t('Масовий продукт дизайну з глибокою локалізацією', 'Mass-market design product with broad localization', 'Массовый продукт дизайна с широкой локализацией', 'Producto de diseño de masas con fuerte localización'),
    signals: t(
      ['Простий UX для не-дизайнерів', 'Швидке масштабування між країнами', 'Перетин продуктивності й маркетингу'],
      ['Simple UX for non-designers', 'Fast international scaling', 'Spanning productivity and marketing'],
      ['Простой UX для не-дизайнеров', 'Быстрое международное масштабирование', 'Пересечение продуктивности и маркетинга'],
      ['UX simple para no diseñadores', 'Escalado internacional rápido', 'Cruza productividad y marketing']
    )
  },
  'hugging-face': {
    hq: t('Нью-Йорк / Париж', 'New York / Paris', 'Нью-Йорк / Париж', 'Nueva York / París'),
    model: t('Спільнота open-source ML', 'Open-source ML community hub', 'Сообщество open-source ML', 'Hub comunitario de ML open-source'),
    market: t('Models hub, datasets, transformers ecosystem', 'Models hub, datasets, transformers ecosystem', 'Хаб моделей, датасеты, экосистема transformers', 'Hub de modelos, datasets y ecosistema transformers'),
    notableFor: t('Центральний репозиторій моделей для ML-спільноти', 'Central model hub for the ML community', 'Центральный репозиторий моделей для ML-сообщества', 'Repositorio central de modelos para la comunidad ML'),
    signals: t(
      ['Відкриті моделі та колаборація', 'Інтеграція з провідними фреймворками', 'Міст між дослідженням і продуктом'],
      ['Open models and collaboration', 'Integration with major frameworks', 'Bridge between research and product'],
      ['Открытые модели и коллаборация', 'Интеграция с ключевыми фреймворками', 'Мост между исследованием и продуктом'],
      ['Modelos abiertos y colaboración', 'Integración con frameworks principales', 'Puente entre investigación y producto']
    )
  },
  figma: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Спільний дизайн у хмарі', 'Collaborative design in the cloud', 'Совместный дизайн в облаке', 'Diseño colaborativo en la nube'),
    market: t('UI design, design systems, dev handoff', 'UI design, design systems, dev handoff', 'UI-дизайн, дизайн-системы, handoff разработке', 'UI, sistemas de diseño y handoff a desarrollo'),
    notableFor: t('Мультиплеєр-дизайн як стандарт для продуктових команд', 'Multiplayer design as a standard for product teams', 'Мультиплеер-дизайн как стандарт для продуктовых команд', 'Diseño multijugador como estándar para equipos de producto'),
    signals: t(
      ['Ключовий інструмент для веб і мобільних команд', 'Інтеграція з інженерним workflow', 'Висока частка у enterprise design ops'],
      ['Core tool for web and mobile teams', 'Embedded in engineering workflows', 'Strong presence in enterprise design ops'],
      ['Ключевой инструмент для web и mobile команд', 'Встроенность в инженерные процессы', 'Сильная доля в enterprise design ops'],
      ['Herramienta central para equipos web y móvil', 'Integrada en flujos de ingeniería', 'Fuerte presencia en design ops enterprise']
    )
  },
  notion: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Workspace для документів і баз даних', 'Workspace for docs and databases', 'Workspace для документов и баз данных', 'Workspace para documentos y bases de datos'),
    market: t('Knowledge base, wiki, team productivity', 'Knowledge base, wiki, team productivity', 'Knowledge base, wiki, командная продуктивность', 'Base de conocimiento, wiki y productividad de equipo'),
    notableFor: t('Гнучкі бази даних у документному середовищі', 'Flexible databases inside a doc-like workspace', 'Гибкие базы данных в документной среде', 'Bases de datos flexibles dentro de un workspace tipo doc'),
    signals: t(
      ['Популярність серед стартапів і knowledge teams', 'Швидкий цикл продуктових функцій', 'Конкуренція з класичними wiki та docs'],
      ['Popular with startups and knowledge teams', 'Fast product iteration cycle', 'Competes with classic wikis and docs'],
      ['Популярность среди стартапов и knowledge-команд', 'Быстрый цикл продуктовых функций', 'Конкуренция с классическими wiki и docs'],
      ['Popular entre startups y equipos de conocimiento', 'Iteración rápida de producto', 'Compite con wikis y docs clásicos']
    )
  },
  databricks: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Lakehouse та AI-платформа даних', 'Lakehouse and data AI platform', 'Lakehouse и data AI-платформа', 'Lakehouse y plataforma de datos e IA'),
    market: t('Data engineering, ML, analytics, governance', 'Data engineering, ML, analytics, governance', 'Data engineering, ML, аналитика, governance', 'Data engineering, ML, analítica y gobierno de datos'),
    notableFor: t('Lakehouse-архітектура як міст між сховищами даних і ML', 'Lakehouse architecture bridging warehouses and ML', 'Lakehouse-архитектура как мост между хранилищами и ML', 'Arquitectura lakehouse entre almacenes y ML'),
    signals: t(
      ['Сильний enterprise сегмент', 'Інтеграція з Spark та хмарними екосистемами', 'Центральний шар для data + AI команд'],
      ['Strong enterprise adoption', 'Spark and cloud ecosystem integration', 'Central layer for data and AI teams'],
      ['Сильный enterprise-сегмент', 'Интеграция со Spark и облачными экосистемами', 'Центральный слой для data и AI команд'],
      ['Fuerte adopción enterprise', 'Integración con Spark y ecosistemas cloud', 'Capa central para equipos de datos e IA']
    )
  },
  grammarly: {
    hq: t('Київ / Сан-Франциско', 'Kyiv / San Francisco', 'Киев / Сан-Франциско', 'Kyiv / San Francisco'),
    model: t('AI-assistant для письма', 'AI assistant for writing', 'AI-ассистент для письма', 'Asistente de IA para escritura'),
    market: t('Writing assistance, communication, productivity', 'Writing assistance, communication, productivity', 'Помощь в письме, коммуникации, продуктивность', 'Asistencia de escritura, comunicación y productividad'),
    notableFor: t('Глобальний продукт із українським корінням у сегменті writing AI', 'Global product with Ukrainian roots in writing AI', 'Глобальный продукт с украинскими корнями в writing AI', 'Producto global con raíces ucranianas en IA de escritura'),
    signals: t(
      ['Глибока інтеграція в браузер і робочі процеси', 'Фокус на ясність і тон комунікації', 'Широка база користувачів'],
      ['Deep integration into browsers and workflows', 'Focus on clarity and tone', 'Large global user base'],
      ['Глубокая интеграция в браузер и workflow', 'Фокус на ясность и тон', 'Широкая база пользователей'],
      ['Integración profunda en navegadores y flujos', 'Foco en claridad y tono', 'Gran base de usuarios global']
    )
  },
  preply: {
    hq: t('Барселона / Київ', 'Barcelona / Kyiv', 'Барселона / Киев', 'Barcelona / Kyiv'),
    model: t('Маркетплейс онлайн-репетиторів', 'Online tutoring marketplace', 'Маркетплейс онлайн-репетиторов', 'Marketplace de tutoría online'),
    market: t('Language learning, marketplace, EdTech', 'Language learning, marketplace, EdTech', 'Изучение языков, маркетплейс, EdTech', 'Aprendizaje de idiomas, marketplace y EdTech'),
    notableFor: t('Глобальний двосторонній маркетплейс для мовної освіти', 'Global two-sided marketplace for language education', 'Глобальный двусторонний маркетплейс языкового обучения', 'Marketplace global bidireccional para idiomas'),
    signals: t(
      ['Масштабування між країнами та часовими поясами', 'Баланс між tutor supply і learner demand', 'Сильний фокус на якості уроків'],
      ['Cross-border scaling across time zones', 'Balances tutor supply and learner demand', 'Quality-focused lesson experience'],
      ['Масштабирование между странами и часовыми поясами', 'Баланс supply репетиторов и спроса', 'Фокус на качестве уроков'],
      ['Escalado cross-border', 'Equilibrio oferta-demanda de tutores', 'Experiencia de calidad en lecciones']
    )
  },
  gitlab: {
    hq: t('Сан-Франциско / Амстердам', 'San Francisco / Amsterdam', 'Сан-Франциско / Амстердам', 'San Francisco / Ámsterdam'),
    model: t('DevOps-платформа з відкритим кодом', 'Open-core DevOps platform', 'Open-core DevOps-платформа', 'Plataforma DevOps open-core'),
    market: t('Git, CI/CD, security scanning, collaboration', 'Git, CI/CD, security scanning, collaboration', 'Git, CI/CD, security, коллаборация', 'Git, CI/CD, seguridad y colaboración'),
    notableFor: t('Повний цикл DevOps в одному застосунку', 'Full DevOps lifecycle in one application', 'Полный цикл DevOps в одном приложении', 'Ciclo DevOps completo en una sola aplicación'),
    signals: t(
      ['Сильна спільнота open source', 'Широке використання в enterprise', 'Remote-first культура продукту'],
      ['Strong open-source community', 'Broad enterprise adoption', 'Remote-first product culture'],
      ['Сильное open-source сообщество', 'Широкое enterprise-использование', 'Remote-first культура продукта'],
      ['Comunidad open source fuerte', 'Amplia adopción enterprise', 'Cultura de producto remote-first']
    )
  },
  'scale-ai': {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Дані та анотація для AI', 'Data and labeling for AI', 'Данные и разметка для AI', 'Datos y etiquetado para IA'),
    market: t('Training data, evaluation, AI operations', 'Training data, evaluation, AI operations', 'Обучающие данные, evaluation, AI ops', 'Datos de entrenamiento, evaluación y ops de IA'),
    notableFor: t('Інфраструктура підготовки даних для моделей нового покоління', 'Data preparation infrastructure for modern models', 'Инфраструктура подготовки данных для современных моделей', 'Infraestructura de datos para modelos modernos'),
    signals: t(
      ['Тісний звʼязок із defence та enterprise AI', 'Масштаб анотаційних операцій', 'Ключовий шар для training pipelines'],
      ['Close ties to defence and enterprise AI', 'Large-scale labeling operations', 'Key layer for training pipelines'],
      ['Связь с defence и enterprise AI', 'Масштаб операций разметки', 'Ключевой слой для training pipelines'],
      ['Vínculos con defensa e IA enterprise', 'Operaciones de etiquetado a gran escala', 'Capa clave para pipelines de entrenamiento']
    )
  },
  vercel: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Edge та frontend cloud', 'Edge and frontend cloud', 'Edge и frontend cloud', 'Cloud edge y frontend'),
    market: t('Next.js ecosystem, serverless, edge delivery', 'Next.js ecosystem, serverless, edge delivery', 'Экосистема Next.js, serverless, edge', 'Ecosistema Next.js, serverless y edge'),
    notableFor: t('Швидке розгортання frontend і developer experience для сучасного вебу', 'Fast frontend deployment and DX for the modern web', 'Быстрый деплой frontend и DX для современного веба', 'Despliegue rápido de frontend y DX para la web moderna'),
    signals: t(
      ['Тісна інтеграція з Next.js', 'Edge delivery як конкурентна перевага', 'Популярність серед modern web-команд'],
      ['Tight Next.js integration', 'Edge delivery as a differentiator', 'Popular with modern web teams'],
      ['Тесная интеграция с Next.js', 'Edge delivery как преимущество', 'Популярность среди современных web-команд'],
      ['Integración fuerte con Next.js', 'Edge delivery como diferencial', 'Popular entre equipos web modernos']
    )
  },
  revolut: {
    hq: t('Лондон, Велика Британія', 'London, United Kingdom', 'Лондон, Великобритания', 'Londres, Reino Unido'),
    model: t('Необанк і фінтех-суперап', 'Neobank and fintech super-app', 'Необанк и финтех-суперап', 'Neobanco y super-app fintech'),
    market: t('Cards, FX, business accounts, global banking', 'Cards, FX, business accounts, global banking', 'Карты, FX, бизнес-счета, глобальный банкинг', 'Tarjetas, FX, cuentas business y banca global'),
    notableFor: t('Швидке міжнародне масштабування фінтех-продуктів', 'Fast international scaling of fintech features', 'Быстрое международное масштабирование финтех-функций', 'Escalado internacional rápido de funciones fintech'),
    signals: t(
      ['Сильний mobile-first UX', 'Глобальні ліцензії та комплаєнс', 'Розширення від споживача до бізнесу'],
      ['Strong mobile-first UX', 'Global licensing and compliance', 'Expansion from consumer to business'],
      ['Сильный mobile-first UX', 'Глобальные лицензии и комплаенс', 'Расширение от consumer к бизнесу'],
      ['UX mobile-first fuerte', 'Licencias y cumplimiento global', 'Expansión de consumidor a negocio']
    )
  },
  'ajax-systems': {
    hq: t('Київ, Україна', 'Kyiv, Ukraine', 'Киев, Украина', 'Kyiv, Ucrania'),
    model: t('Wireless security та smart home hardware', 'Wireless security and smart-home hardware', 'Wireless security и smart-home hardware', 'Hardware de seguridad inalámbrica y hogar inteligente'),
    market: t('Intrusion sensors, hubs, global retail', 'Intrusion sensors, hubs, global retail', 'Датчики, хабы, глобальный ритейл', 'Sensores, hubs y retail global'),
    notableFor: t('Український hardware-бренд із міжнародною мережею партнерів', 'Ukrainian hardware brand with international partner network', 'Украинский hardware-бренд с международной сетью партнеров', 'Marca hardware ucraniana con red internacional de socios'),
    signals: t(
      ['Фокус на wireless reliability', 'Роздрібні та B2B канали', 'Приклад hardware scale-up з України'],
      ['Focus on wireless reliability', 'Retail and B2B channels', 'Example of hardware scale-up from Ukraine'],
      ['Фокус на wireless reliability', 'Розничные и B2B каналы', 'Пример hardware scale-up из Украины'],
      ['Foco en fiabilidad wireless', 'Canales retail y B2B', 'Ejemplo de hardware scale-up desde Ucrania']
    )
  },
  microsoft: {
    hq: t('Редмонд, США', 'Redmond, United States', 'Редмонд, США', 'Redmond, Estados Unidos'),
    model: t('Платформа Azure та корпоративний софт', 'Azure platform and enterprise software', 'Платформа Azure и корпоративное ПО', 'Plataforma Azure y software empresarial'),
    market: t('Azure, Microsoft 365, Windows, AI Copilot', 'Azure, Microsoft 365, Windows, AI Copilot', 'Azure, Microsoft 365, Windows, AI Copilot', 'Azure, Microsoft 365, Windows y Copilot'),
    notableFor: t('Інтеграція AI-послуг у корпоративні та developer екосистеми', 'Integrating AI services across enterprise and developer ecosystems', 'Интеграция AI-сервисов в корпоративные и developer экосистемы', 'Integrar servicios de IA en ecosistemas empresariales y de desarrolladores'),
    signals: t(
      ['Широкий enterprise-каталог сервісів', 'Сильний акцент на партнерства й marketplace', 'Швидка інтеграція моделей у productivity suite'],
      ['Broad enterprise service catalogue', 'Strong partner and marketplace motion', 'Fast model integration into productivity suites'],
      ['Широкий enterprise-каталог сервисов', 'Сильный партнерский marketplace', 'Быстрая интеграция моделей в productivity suite'],
      ['Catálogo amplio de servicios enterprise', 'Fuerte movimiento de socios y marketplace', 'Integración rápida de modelos en suites de productividad']
    )
  },
  'google-cloud': {
    hq: t('Маунтін-Вью, США', 'Mountain View, United States', 'Маунтин-Вью, США', 'Mountain View, Estados Unidos'),
    model: t('Хмарна платформа GCP', 'GCP cloud platform', 'Облачная платформа GCP', 'Plataforma cloud GCP'),
    market: t('Compute, data, ML APIs, enterprise workloads', 'Compute, data, ML APIs, enterprise workloads', 'Compute, data, ML APIs, enterprise workloads', 'Compute, datos, APIs de ML y cargas enterprise'),
    notableFor: t('Поєднання інфраструктури Google з AI-сервісами для підприємств', 'Google-scale infrastructure paired with enterprise AI services', 'Инфраструктура масштаба Google и enterprise AI-сервисы', 'Infraestructura a escala Google con servicios de IA empresarial'),
    signals: t(
      ['Інтеграція з екосистемою Google Workspace та даними', 'Datacenter footprint для AI inference та ML ops', 'Широкий набір managed сервісів для даних'],
      ['Integration with Workspace and data estates', 'Datacenter footprint for inference and ML ops', 'Broad managed data stack'],
      ['Интеграция с Workspace и данными', 'Footprint для inference и ML ops', 'Широкий managed стек данных'],
      ['Integración con Workspace y estates de datos', 'Footprint para inferencia y ML ops', 'Stack gestionado amplio para datos']
    )
  },
  'amazon-web-services': {
    hq: t('Сіетл, США', 'Seattle, United States', 'Сиэтл, США', 'Seattle, Estados Unidos'),
    model: t('Глобальна хмарна інфраструктура AWS', 'Global AWS cloud infrastructure', 'Глобальная облачная инфраструктура AWS', 'Infraestructura cloud global de AWS'),
    market: t('IaaS, PaaS, regions, edge', 'IaaS, PaaS, regions, edge', 'IaaS, PaaS, регионы, edge', 'IaaS, PaaS, regiones y edge'),
    notableFor: t('Найширший каталог сервісів хмарної інфраструктури для індустрії', 'The broadest catalogue of cloud primitives shaping modern engineering', 'Самый широкий каталог облачных примитивов для индустрии', 'El catálogo más amplio de primitivas cloud que moldea la ingeniería moderna'),
    signals: t(
      ['Лідерство за регіонами та службами даних', 'Партнерська екосистема ISV', 'Орієнтація на reliability та масштаб'],
      ['Leadership in regions and data services', 'Large ISV partner ecosystem', 'Reliability-first scaling mindset'],
      ['Лидерство по регионам и data-сервисам', 'Экосистема ISV-партнеров', 'Фокус на reliability и масштабе'],
      ['Liderazgo en regiones y servicios de datos', 'Gran ecosistema ISV', 'Mentalidad de fiabilidad y escala']
    )
  },
  meta: {
    hq: t('Менло-Парк, США', 'Menlo Park, United States', 'Менло-Парк, США', 'Menlo Park, Estados Unidos'),
    model: t('Сімейство споживчих платформ і Reality Labs', 'Consumer platforms family and Reality Labs', 'Семейство потребительских платформ и Reality Labs', 'Familia de plataformas de consumo y Reality Labs'),
    market: t('Social graphs, ads infrastructure, VR', 'Social graphs, ads infrastructure, VR', 'Social graphs, ads infrastructure, VR', 'Grafos sociales, publicidad e infraestructura RV'),
    notableFor: t('Масштаб інженерних систем для мільярдів користувачів', 'Engineering systems operated at multi-billion-user scale', 'Инженерные системы масштаба миллиардов пользователей', 'Sistemas de ingeniería para miles de millones de usuarios'),
    signals: t(
      ['Один із найбільших інтернет-рекламних стеків', 'Інвестиції в Llama та відкриті моделі', 'VR як довгострокова ставка на апаратуру'],
      ['One of the largest internet ad stacks', 'Investment in Llama and open models', 'VR as long-term hardware bet'],
      ['Один из крупнейших интернет-рекламных стеков', 'Инвестиции в Llama и open models', 'VR как долгосрочная ставка на железо'],
      ['Uno de los stacks publicitarios más grandes', 'Inversión en Llama y modelos abiertos', 'RV como apuesta de hardware a largo plazo']
    )
  },
  'oracle-cloud': {
    hq: t('Остін / Редвуд-Шорс, США', 'Austin / Redwood Shores, United States', 'Остин / Редвуд-Шорс, США', 'Austin / Redwood Shores, Estados Unidos'),
    model: t('Корпоративні бази даних та SaaS', 'Enterprise databases and SaaS', 'Корпоративные базы данных и SaaS', 'Bases de datos y SaaS empresarial'),
    market: t('Database cloud, ERP, mission-critical workloads', 'Database cloud, ERP, mission-critical workloads', 'Database cloud, ERP, mission-critical workloads', 'Database cloud, ERP y cargas críticas'),
    notableFor: t('Традиція enterprise БД та перехід до повністю керованих хмарних сервісів', 'Enterprise database heritage shifting toward managed cloud services', 'Наследие enterprise БД и переход к managed cloud', 'Herencia de bases enterprise y salto a servicios cloud gestionados'),
    signals: t(
      ['Фокус на місійно-критичні системи', 'Глибокі інтеграції з IT організаціями', 'Конкуренція в сегменті data platforms'],
      ['Focus on mission-critical systems', 'Deep integration with IT organisations', 'Competitive data-platform positioning'],
      ['Фокус на mission-critical системы', 'Глубокая интеграция с IT-организациями', 'Конкуренция в data platforms'],
      ['Enfoque en sistemas críticos', 'Integración profunda con TI', 'Posicionamiento competitivo en data platforms']
    )
  },
  snowflake: {
    hq: t('Бозман, США', 'Bozeman, United States', 'Бозман, США', 'Bozeman, Estados Unidos'),
    model: t('Cloud data platform', 'Cloud data platform', 'Облачная data-платформа', 'Plataforma de datos en la nube'),
    market: t('Analytics, sharing, AI workloads', 'Analytics, sharing, AI workloads', 'Analytics, sharing, AI workloads', 'Analítica, intercambio y cargas de IA'),
    notableFor: t('Архітектура data sharing між організаціями в одному cloud-сервісі', 'Data-sharing architecture connecting organisations within one platform', 'Архитектура data sharing между организациями', 'Arquitectura de intercambio de datos entre organizaciones'),
    signals: t(
      ['Популярність серед enterprise data команд', 'Еластичне масштабування compute', 'Розширення до AI та apps у каталозі даних'],
      ['Popular with enterprise data teams', 'Elastic compute scaling', 'Expansion toward AI and apps on shared data'],
      ['Популярность среди enterprise data-команд', 'Эластичное масштабирование compute', 'Расширение к AI и приложениям'],
      ['Popular entre equipos de datos enterprise', 'Escala elástica de cómputo', 'Expansión hacia IA y apps sobre datos']
    )
  },
  salesforce: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('CRM та enterprise хмарні застосування', 'CRM and enterprise cloud apps', 'CRM и корпоративные облачные приложения', 'CRM y aplicaciones cloud empresariales'),
    market: t('Sales, service, marketing clouds', 'Sales, service, marketing clouds', 'Sales, service, marketing clouds', 'Sales, service y marketing cloud'),
    notableFor: t('AppExchange як маркетплейс розширень для enterprise workflow', 'AppExchange marketplace extending enterprise workflows', 'AppExchange как маркетплейс расширений для enterprise', 'Marketplace AppExchange para extender flujos enterprise'),
    signals: t(
      ['Глибока інтеграція з корпоративними процесами', 'Сильний partner channel', 'Додавання AI-layer до CRM даних'],
      ['Deep tie-in to enterprise processes', 'Strong partner channel', 'Adding AI layers over CRM data'],
      ['Глубокая связь с enterprise-процессами', 'Сильный партнерский канал', 'AI-слой поверх CRM-данных'],
      ['Integración profunda con procesos enterprise', 'Canal de socios fuerte', 'Capas de IA sobre datos CRM']
    )
  },
  palantir: {
    hq: t('Денвер / Лондон', 'Denver / London', 'Денвер / Лондон', 'Denver / Londres'),
    model: t('Платформа інтеграції даних для організацій', 'Data integration platform for organisations', 'Платформа интеграции данных для организаций', 'Plataforma de integración de datos para organizaciones'),
    market: t('Government, defence, commercial analytics', 'Government, defence, commercial analytics', 'Government, defence, commercial analytics', 'Gobierno, defensa y analítica comercial'),
    notableFor: t('Спеціалізовані рішення для складних операційних даних', 'Specialised tooling for complex operational data estates', 'Специализированные решения для операционных данных', 'Herramientas especializadas para datos operativos complejos'),
    signals: t(
      ['Фокус на інтеграцію багатьох джерел', 'Сильний enterprise sales motion', 'Дискусії щодо етики даних і прозорості'],
      ['Focus on multi-source integration', 'Heavy enterprise sales motion', 'Public debate on data ethics and transparency'],
      ['Фокус на интеграцию источников', 'Сильный enterprise sales', 'Публичные дискуссии об этике данных'],
      ['Foco en integración multifuente', 'Movimiento enterprise fuerte', 'Debate público sobre ética de datos']
    )
  },
  datadog: {
    hq: t('Нью-Йорк, США', 'New York, United States', 'Нью-Йорк, США', 'Nueva York, Estados Unidos'),
    model: t('Observability SaaS', 'Observability SaaS', 'Observability SaaS', 'SaaS de observabilidad'),
    market: t('Metrics, logs, traces, security', 'Metrics, logs, traces, security', 'Metrics, logs, traces, security', 'Métricas, logs, trazas y seguridad'),
    notableFor: t('Єдиний екран для інженерних команд щодо продакшен-систем', 'Single pane for engineering teams monitoring production systems', 'Единый экран для команд, мониторящих продакшен', 'Panel único para equipos que monitorizan producción'),
    signals: t(
      ['Високий enterprise adoption у SaaS-команд', 'Розширення в security та cloud cost insights', 'Орієнтація на developer-first продаж'],
      ['High adoption among SaaS-native teams', 'Expansion into security and cost insights', 'Developer-first go-to-market'],
      ['Высокое adoption среди SaaS-команд', 'Расширение в security и cost insights', 'Developer-first GTM'],
      ['Alta adopción en equipos SaaS', 'Expansión a seguridad y costes', 'GTM developer-first']
    )
  },
  mongodb: {
    hq: t('Нью-Йорк, США', 'New York, United States', 'Нью-Йорк, США', 'Nueva York, Estados Unidos'),
    model: t('Документна база та Atlas cloud', 'Document database and Atlas cloud', 'Документная база и Atlas cloud', 'Base documental y Atlas cloud'),
    market: t('Developer data platform, search, analytics', 'Developer data platform, search, analytics', 'Developer data platform, search, analytics', 'Plataforma de datos para desarrolladores, búsqueda y analítica'),
    notableFor: t('Atlas як повністю керований сервіс навколо MongoDB', 'Atlas as the managed service wrapping MongoDB', 'Atlas как managed-сервис вокруг MongoDB', 'Atlas como servicio gestionado alrededor de MongoDB'),
    signals: t(
      ['Популярність у стартапів і enterprise', 'Гнучка модель документів для швидких продуктів', 'Розширення до search та analytics workloads'],
      ['Popular across startups and enterprises', 'Flexible document model for fast products', 'Expansion into search and analytics workloads'],
      ['Популярность у стартапов и enterprise', 'Гибкая документная модель', 'Расширение к search и analytics'],
      ['Popular en startups y enterprise', 'Modelo documental flexible', 'Expansión a búsqueda y analítica']
    )
  },
  supabase: {
    hq: t('Сингапур / віддалена команда', 'Singapore / remote-first team', 'Сингапур / удаленная команда', 'Singapur / equipo remote-first'),
    model: t('Open-source Firebase-альтернатива на Postgres', 'Open-source Firebase alternative on Postgres', 'Open-source альтернатива Firebase на Postgres', 'Alternativa open-source a Firebase sobre Postgres'),
    market: t('Auth, Postgres, realtime APIs', 'Auth, Postgres, realtime APIs', 'Auth, Postgres, realtime APIs', 'Auth, Postgres y APIs en tiempo real'),
    notableFor: t('Швидкий backend для indie hackers і продуктових MVP', 'Fast backend layer for indie hackers and MVP teams', 'Быстрый backend для indie hackers и MVP-команд', 'Backend rápido para indie hackers y equipos MVP'),
    signals: t(
      ['Сильна спільнота open source', 'Фокус на developer experience', 'Конкуренція з класичним Firebase'],
      ['Strong open-source community', 'Developer-experience focus', 'Competes directly with Firebase-class offerings'],
      ['Сильное open-source сообщество', 'Фокус на DX', 'Конкуренция с Firebase-классом'],
      ['Comunidad open source fuerte', 'Foco en DX', 'Compite con ofertas tipo Firebase']
    )
  },
  posthog: {
    hq: t('Лондон / віддалено', 'London / remote', 'Лондон / удаленно', 'Londres / remoto'),
    model: t('Product analytics open-source', 'Open-source product analytics', 'Product analytics open-source', 'Product analytics open source'),
    market: t('Product analytics, experimentation, session replay', 'Product analytics, experimentation, session replay', 'Product analytics, experimentation, session replay', 'Analítica de producto, experimentación y replay de sesiones'),
    notableFor: t('Self-host та cloud варіанти для інженерних команд', 'Self-host and cloud deployment paths for engineering-led teams', 'Self-host и cloud для инженерных команд', 'Rutas self-host y cloud para equipos liderados por ingeniería'),
    signals: t(
      ['Відкритий код як конкурентна перевага', 'Фокус на продуктові експерименти', 'Зростання разом із modern SaaS стеком'],
      ['Open source as differentiation', 'Experimentation-focused roadmap', 'Growth alongside modern SaaS stacks'],
      ['Open source как дифференциатор', 'Фокус на эксперименты', 'Рост вместе со стеком SaaS'],
      ['Open source como diferenciador', 'Hoja de ruta centrada en experimentación', 'Crece junto al stack SaaS moderno']
    )
  },
  linear: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Issue tracking для продуктових команд', 'Issue tracking for product engineering teams', 'Issue tracking для продуктовых команд', 'Issue tracking para equipos de producto'),
    market: t('Roadmaps, cycles, integrations', 'Roadmaps, cycles, integrations', 'Roadmaps, cycles, integrations', 'Roadmaps, ciclos e integraciones'),
    notableFor: t('Швидкий UX як конкурентна перевага над класичними трекерами', 'Speed and UX as differentiation versus legacy trackers', 'Скорость и UX как преимущество над legacy-трекерами', 'Velocidad y UX frente a trackers legacy'),
    signals: t(
      ['Сильний бренд серед startup-команд', 'Інтеграції з GitHub та дизайн-інструментами', 'Фокус на keyboard-first workflow'],
      ['Strong brand among startup teams', 'Integrations with GitHub and design tools', 'Keyboard-first workflow culture'],
      ['Сильный бренд среди стартап-команд', 'Интеграции с GitHub и дизайном', 'Культура keyboard-first'],
      ['Marca fuerte en startups', 'Integraciones con GitHub y diseño', 'Cultura keyboard-first']
    )
  },
  retool: {
    hq: t('Сан-Франциско, США', 'San Francisco, United States', 'Сан-Франциско, США', 'San Francisco, Estados Unidos'),
    model: t('Internal tools builder', 'Internal tools builder', 'Конструктор internal tools', 'Constructor de internal tools'),
    market: t('Admin panels, ops dashboards, workflows', 'Admin panels, ops dashboards, workflows', 'Admin panels, ops dashboards, workflows', 'Paneles admin, dashboards operativos y workflows'),
    notableFor: t('Швидке створення внутрішніх інструментів поверх API та баз даних', 'Rapid assembly of internal tools atop APIs and databases', 'Быстрая сборка internal tools поверх API и БД', 'Montaje rápido de herramientas internas sobre APIs y bases de datos'),
    signals: t(
      ['Популярність у fintech та ops-командах', 'Баланс між no-code та engineer control', 'Розширення до mobile та automation'],
      ['Popular with fintech and ops teams', 'Balances no-code speed with engineer control', 'Expansion toward mobile and automation'],
      ['Популярность у fintech и ops', 'Баланс no-code и контроля инженера', 'Расширение к mobile и автоматизации'],
      ['Popular en fintech y ops', 'Equilibra no-code y control de ingeniería', 'Expansión a móvil y automatización']
    )
  },
  zapier: {
    hq: t('Роллі / віддалено', 'Remote-first', 'Remote-first', 'Remote-first'),
    model: t('Автоматизація SaaS-інтеграцій', 'SaaS workflow automation', 'Автоматизация SaaS-интеграций', 'Automatización de workflows SaaS'),
    market: t('No-code automation, enterprise plans', 'No-code automation, enterprise plans', 'No-code automation, enterprise plans', 'Automatización no-code y planes enterprise'),
    notableFor: t('Каталог із тисячами конекторів між SaaS-додатками', 'A catalogue of thousands of connectors across SaaS apps', 'Каталог тысяч коннекторов между SaaS', 'Catálogo de miles de conectores entre apps SaaS'),
    signals: t(
      ['Масовий self-serve growth', 'Enterprise функції для централізованого керування', 'Конкуренція з native автоматизаціями SaaS'],
      ['Large self-serve growth motion', 'Enterprise controls for central IT', 'Competes with native SaaS automations'],
      ['Массовый self-serve рост', 'Enterprise-контроль для IT', 'Конкуренция с native автоматизациями'],
      ['Gran crecimiento self-serve', 'Controles enterprise para TI', 'Compite con automatizaciones nativas']
    )
  }
};

const specialistOutput = curatedSpecialists.map(person => {
  const tags = {};
  for (const lang of langs) {
    tags[lang] = person.tags.map(tag => tagLabels[tag]?.[lang] || tag);
  }

  const bio = enrichBio(person);

  return {
    slug: person.slug,
    image: person.image,
    name: person.name,
    role: person.role,
    country: person.country,
    focus: person.focus,
    knownFor: person.knownFor,
    bio,
    tags,
    featured: Boolean(person.featured),
    gallery: person.gallery || [],
    highlights: person.highlights || null
  };
});

const startupOutput = startups.map(company => {
  const tags = {};
  for (const lang of langs) {
    tags[lang] = company.tags.map(tag => tagLabels[tag]?.[lang] || tag);
  }
  const details = startupDetails[company.slug] || {};
  const hqCountry = {};
  for (const lang of langs) {
    hqCountry[lang] = regionalCountry(details.hq?.[lang], lang);
  }
  const summary = enrichStartupSummary(company, details);
  return { ...company, ...details, summary, tags, hqCountry };
});

fs.writeFileSync('src/specialists.json', `${JSON.stringify(specialistOutput, null, 2)}\n`);
fs.writeFileSync('src/startups.json', `${JSON.stringify(startupOutput, null, 2)}\n`);
console.log(`Generated ${specialistOutput.length} specialist profiles and ${startupOutput.length} startup records.`);
