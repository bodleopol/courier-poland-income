/**
 * One-off generator: 10 pioneer / infrastructure specialist profiles × 4 languages,
 * directory cards for specialists*.html, sitemap URLs, homepage specialist count.
 * Run: node scripts/add-specialists-pioneers.mjs
 */
import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src', 'pages');
const profilesDir = path.join(root, 'profiles');

const photos = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a1?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1560179707-f14d90ff3629?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=720&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&q=80'
];

const ui = {
  uk: {
    back: 'До архіву експертів',
    specialistsHref: 'specialists.html',
    countryLabel: 'Країна / регіон',
    focusLabel: 'Професійний фокус',
    knownLabel: 'Ключовий внесок',
    strengths: 'Ключові сильні сторони',
    overview: 'Професійний огляд',
    editorialTitle: 'Редакційна примітка',
    editorialBody: 'Матеріал зібрано редакцією як довідкову сторінку; оновлення робляться вручну за потреби.',
    relatedEyebrow: 'Схожі профілі',
    relatedTitle: 'Схожі профілі',
    relatedIntro: 'Повний список з пошуком і фільтрами: можна швидко знайти людину за країною, напрямом або тегом.',
    openProfile: 'Відкрити профіль',
    related: [
      {
        filter: 'software',
        country: 'США',
        sort: 'Маргарет Гамільтон',
        search: 'маргарет гамільтон інженерка програмного забезпечення сша програмування космос інженерія',
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
        alt: 'Маргарет Гамільтон',
        onerr: '%D0%9C%D0%B0%D1%80%D0%B3%D0%B0%D1%80%D0%B5%D1%82%20%D0%93%D0%B0%D0%BC%D1%96%D0%BB%D1%8C%D1%82%D0%BE%D0%BD',
        eyebrow: 'США',
        name: 'Маргарет Гамільтон',
        meta: 'Інженерка програмного забезпечення',
        tags: ['Програмування', 'Космос', 'Інженерія'],
        href: 'person-margaret-hamilton.html'
      },
      {
        filter: 'engineering',
        country: 'США',
        sort: 'Радія Перлман',
        search: 'радія перлман мережева інженерка сша інженерія інтернет інфраструктура',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
        alt: 'Радія Перлман',
        onerr: '%D0%A0%D0%B0%D0%B4%D1%96%D1%8F%20%D0%9F%D0%B5%D1%80%D0%BB%D0%BC%D0%B0%D0%BD',
        eyebrow: 'США',
        name: 'Радія Перлман',
        meta: 'Мережева інженерка',
        tags: ['Інженерія', 'Інтернет', 'Інфраструктура'],
        href: 'person-radia-perlman.html'
      },
      {
        filter: 'software',
        country: 'Велика Британія',
        sort: 'Тім Бернерс-Лі',
        search: 'тім бернерс-лі винахідник world wide web велика британія програмування інтернет стандарти',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
        alt: 'Тім Бернерс-Лі',
        onerr: '%D0%A2%D1%96%D0%BC%20%D0%91%D0%B5%D1%80%D0%BD%D0%B5%D1%80%D1%81-%D0%9B%D1%96',
        eyebrow: 'Велика Британія',
        name: 'Тім Бернерс-Лі',
        meta: 'Винахідник World Wide Web',
        tags: ['Програмування', 'Інтернет', 'Стандарти'],
        href: 'person-tim-berners-lee.html'
      }
    ]
  },
  en: {
    back: 'Back to experts',
    specialistsHref: 'specialists-en.html',
    countryLabel: 'Country / region',
    focusLabel: 'Professional focus',
    knownLabel: 'Known for',
    strengths: 'Key strengths',
    overview: 'Professional overview',
    editorialTitle: 'Editorial standards',
    editorialBody: 'This profile is manually reviewed and periodically updated to keep facts clear, useful and easy to verify.',
    relatedEyebrow: 'Related profiles',
    relatedTitle: 'Related profiles',
    relatedIntro: 'Use the full directory with search and filters to browse by country, track or tag.',
    openProfile: 'Open profile',
    related: [
      {
        filter: 'software',
        country: 'United States',
        sort: 'Margaret Hamilton',
        search: 'margaret hamilton software engineer united states programming space engineering',
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
        alt: 'Margaret Hamilton',
        onerr: 'Margaret%20Hamilton',
        eyebrow: 'United States',
        name: 'Margaret Hamilton',
        meta: 'Software engineer (Apollo-era systems)',
        tags: ['Software', 'Space', 'Engineering'],
        href: 'person-margaret-hamilton-en.html'
      },
      {
        filter: 'engineering',
        country: 'United States',
        sort: 'Radia Perlman',
        search: 'radia perlman network engineer united states engineering internet infrastructure',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
        alt: 'Radia Perlman',
        onerr: 'Radia%20Perlman',
        eyebrow: 'United States',
        name: 'Radia Perlman',
        meta: 'Network engineer and protocol designer',
        tags: ['Engineering', 'Internet', 'Infrastructure'],
        href: 'person-radia-perlman-en.html'
      },
      {
        filter: 'software',
        country: 'United Kingdom',
        sort: 'Tim Berners-Lee',
        search: 'tim berners lee inventor world wide web united kingdom software internet standards',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
        alt: 'Tim Berners-Lee',
        onerr: 'Tim%20Berners-Lee',
        eyebrow: 'United Kingdom',
        name: 'Tim Berners-Lee',
        meta: 'Inventor of the World Wide Web',
        tags: ['Software', 'Internet', 'Standards'],
        href: 'person-tim-berners-lee-en.html'
      }
    ]
  },
  es: {
    back: 'Volver a especialistas',
    specialistsHref: 'specialists-es.html',
    countryLabel: 'País / región',
    focusLabel: 'Foco profesional',
    knownLabel: 'Reconocido por',
    strengths: 'Fortalezas clave',
    overview: 'Resumen profesional',
    editorialTitle: 'Nota editorial',
    editorialBody: 'Este perfil se revisa manualmente y se actualiza de forma periódica para mantener datos claros y verificables.',
    relatedEyebrow: 'Perfiles relacionados',
    relatedTitle: 'Perfiles relacionados',
    relatedIntro: 'Usa el directorio completo con búsqueda y filtros para explorar por país, área o etiqueta.',
    openProfile: 'Ver perfil',
    related: [
      {
        filter: 'software',
        country: 'Estados Unidos',
        sort: 'Margaret Hamilton',
        search: 'margaret hamilton ingeniera de software estados unidos programación espacio ingeniería',
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
        alt: 'Margaret Hamilton',
        onerr: 'Margaret%20Hamilton',
        eyebrow: 'Estados Unidos',
        name: 'Margaret Hamilton',
        meta: 'Ingeniera de software (sistemas Apollo)',
        tags: ['Software', 'Espacio', 'Ingeniería'],
        href: 'person-margaret-hamilton-es.html'
      },
      {
        filter: 'engineering',
        country: 'Estados Unidos',
        sort: 'Radia Perlman',
        search: 'radia perlman ingeniera de redes estados unidos ingeniería internet infraestructura',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
        alt: 'Radia Perlman',
        onerr: 'Radia%20Perlman',
        eyebrow: 'Estados Unidos',
        name: 'Radia Perlman',
        meta: 'Ingeniera de redes y diseñadora de protocolos',
        tags: ['Ingeniería', 'Internet', 'Infraestructura'],
        href: 'person-radia-perlman-es.html'
      },
      {
        filter: 'software',
        country: 'Reino Unido',
        sort: 'Tim Berners-Lee',
        search: 'tim berners lee inventor world wide web reino unido software internet estándares',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
        alt: 'Tim Berners-Lee',
        onerr: 'Tim%20Berners-Lee',
        eyebrow: 'Reino Unido',
        name: 'Tim Berners-Lee',
        meta: 'Inventor de la World Wide Web',
        tags: ['Software', 'Internet', 'Estándares'],
        href: 'person-tim-berners-lee-es.html'
      }
    ]
  },
  ru: {
    back: 'К архиву экспертов',
    specialistsHref: 'specialists-ru.html',
    countryLabel: 'Страна / регион',
    focusLabel: 'Профессиональный фокус',
    knownLabel: 'Ключевой вклад',
    strengths: 'Ключевые сильные стороны',
    overview: 'Профессиональный обзор',
    editorialTitle: 'Редакционная заметка',
    editorialBody: 'Этот профиль проходит ручную редакторскую проверку и регулярно обновляется, чтобы данные оставались точными и полезными.',
    relatedEyebrow: 'Похожие профили',
    relatedTitle: 'Похожие профили',
    relatedIntro: 'Полный список с поиском и фильтрами: можно быстро найти человека по стране, направлению или тегу.',
    openProfile: 'Открыть профиль',
    related: [
      {
        filter: 'software',
        country: 'США',
        sort: 'Маргарет Гамильтон',
        search: 'маргарет гамильтон инженер по программному обеспечению сша программирование космос инженерия',
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
        alt: 'Маргарет Гамильтон',
        onerr: 'Margaret%20Hamilton',
        eyebrow: 'США',
        name: 'Маргарет Гамильтон',
        meta: 'Инженер по программному обеспечению',
        tags: ['Программирование', 'Космос', 'Инженерия'],
        href: 'person-margaret-hamilton-ru.html'
      },
      {
        filter: 'engineering',
        country: 'США',
        sort: 'Радия Перлман',
        search: 'радия перлман сетевая инженер сша инженерия интернет инфраструктура',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=720&q=80',
        alt: 'Радия Перлман',
        onerr: 'Radia%20Perlman',
        eyebrow: 'США',
        name: 'Радия Перлман',
        meta: 'Сетевая инженерка',
        tags: ['Инженерия', 'Интернет', 'Инфраструктура'],
        href: 'person-radia-perlman-ru.html'
      },
      {
        filter: 'software',
        country: 'Великобритания',
        sort: 'Тим Бернерс-Ли',
        search: 'тим бернерс ли изобретатель world wide web великобритания программирование интернет стандарты',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80',
        alt: 'Тим Бернерс-Ли',
        onerr: 'Tim%20Berners-Lee',
        eyebrow: 'Великобритания',
        name: 'Тим Бернерс-Ли',
        meta: 'Изобретатель World Wide Web',
        tags: ['Программирование', 'Интернет', 'Стандарты'],
        href: 'person-tim-berners-lee-ru.html'
      }
    ]
  }
};

const people = [
  {
    slug: 'donald-knuth',
    filter: 'software',
    catalog: 64,
    photoIdx: 0,
    uk: {
      name: 'Дональд Кнут',
      country: 'США',
      role: 'Професор емеритус, автор «The Art of Computer Programming» і системи TeX',
      tags: ['Програмування', 'Математика', 'Освіта'],
      focus: 'аналіз алгоритмів, верстка та наукові публікації в інформатиці',
      known: 'багатотомна монографія «The Art of Computer Programming» і створення системи верстки TeX',
      bullets: ['Глибока робота з алгоритмами та їх аналізом', 'Вплив на академічну та інженерну культуру ПЗ', 'Премія Тюрінга (ACM, 1974)'],
      overview:
        'Редакційний контекст: Дональд Кнут — американський науковець у галузі інформатики, відомий фундаментальними підручниками з алгоритмів і створенням екосистеми TeX для академічних публікацій. Його доробок часто використовують як орієнтир для ретельного інженерного мислення.',
      title: 'Дональд Кнут — алгоритми, TeX і академічна інформатика | Rybezh',
      desc: 'Профіль Дональда Кнута: алгоритми, TeX, премія Тюрінга 1974. Редакційна довідкова сторінка Rybezh.site.',
      search:
        'дональд кнут алгоритми tex the art of computer programming acm turing award стенфорд сша програмування математика освіта donald knuth algorithms'
    },
    en: {
      name: 'Donald Knuth',
      country: 'United States',
      role: 'Professor emeritus; author of The Art of Computer Programming and creator of TeX',
      tags: ['Software', 'Mathematics', 'Education'],
      focus: 'algorithm analysis, scientific publishing systems and rigorous CS exposition',
      known: 'the multi-volume Art of Computer Programming and the TeX typesetting ecosystem',
      bullets: ['Landmark work on algorithms and their analysis', 'Cross-disciplinary influence on CS education', 'ACM Turing Award (1974)'],
      overview:
        'Editorial context: Donald Knuth is a U.S. computer scientist whose textbooks and TeX ecosystem shaped how generations learn algorithms and publish technical work. The entry highlights durable contributions rather than day-to-day appointments.',
      title: 'Donald Knuth — algorithms, TeX and computer science writing | Rybezh',
      desc: 'Donald Knuth profile: algorithms, TeX, ACM Turing Award (1974). Editorial reference on Rybezh.site.',
      search:
        'donald knuth algorithms tex the art of computer programming acm turing award stanford united states software mathematics education'
    },
    es: {
      name: 'Donald Knuth',
      country: 'Estados Unidos',
      role: 'Profesor emérito; autor de The Art of Computer Programming y creador de TeX',
      tags: ['Software', 'Matemáticas', 'Educación'],
      focus: 'análisis de algoritmos, sistemas de publicación científica y exposición rigurosa de informática',
      known: 'la obra en varios tomos The Art of Computer Programming y el ecosistema de composición TeX',
      bullets: ['Obra de referencia sobre algoritmos y su análisis', 'Influencia duradera en la enseñanza de informática', 'Premio Turing de la ACM (1974)'],
      overview:
        'Contexto editorial: Donald Knuth es un informático estadounidense cuyos libros y el ecosistema TeX marcaron cómo varias generaciones aprenden algoritmos y publican trabajo técnico.',
      title: 'Donald Knuth — algoritmos, TeX y divulgación rigurosa | Rybezh',
      desc: 'Perfil de Donald Knuth: algoritmos, TeX, Premio Turing ACM (1974). Referencia editorial en Rybezh.site.',
      search:
        'donald knuth algoritmos tex the art of computer programming premio turing acm stanford estados unidos software matemáticas educación'
    },
    ru: {
      name: 'Дональд Кнут',
      country: 'США',
      role: 'Профессор-эмерит; автор The Art of Computer Programming и создатель TeX',
      tags: ['Программирование', 'Математика', 'Образование'],
      focus: 'анализ алгоритмов, системы научной публикации и строгая информатическая экспозиция',
      known: 'многотомный The Art of Computer Programming и экосистема верстки TeX',
      bullets: ['Фундаментальные работы по алгоритмам и их анализу', 'Влияние на обучение computer science', 'Премия Тьюринга ACM (1974 г.)'],
      overview:
        'Редакционный контекст: Дональд Кнут — американский учёный в области информатики, чьи учебники и TeX сформировали подход к алгоритмам и академической публикации.',
      title: 'Дональд Кнут — алгоритмы, TeX и научная информатика | Rybezh',
      desc: 'Профиль Дональда Кнута: алгоритмы, TeX, премия Тьюринга ACM (1974). Редакционная справка Rybezh.site.',
      search:
        'дональд кнут алгоритмы tex the art of computer programming премия тьюринга acm стэнфорд сша программирование математика образование'
    }
  },
  {
    slug: 'barbara-liskov',
    filter: 'software',
    catalog: 65,
    photoIdx: 1,
    uk: {
      name: 'Барбара Лісков',
      country: 'США',
      role: 'Професорка MIT, піонерка абстракції даних і розподілених систем',
      tags: ['Програмування', 'Інженерія', 'Освіта'],
      focus: 'модулі, типізація, надійність розподілених програм',
      known: 'принцип підстановки Лісков та фундаментальні роботи з мов і абстракцій для надійного ПЗ',
      bullets: ['Формалізація поведінки підтипів у об’єктних системах', 'Внесок у мови CLU та Modula-3', 'Премія Тюрінга (ACM, 2008)'],
      overview:
        'Редакційний контекст: Барбара Лісков — дослідниця програмних абстракцій і розподілених систем; її ідеї закріплені в інженерній практиці через принцип підстановки та курс MIT.',
      title: 'Барбара Лісков — абстракції, розподілені системи, MIT | Rybezh',
      desc: 'Барбара Лісков: принцип підстановки, розподілені системи, премія Тюрінга 2008. Rybezh.site.',
      search: 'барбара лісков liskov substitution principle mit розподілені системи програмування acm turing award barbara liskov'
    },
    en: {
      name: 'Barbara Liskov',
      country: 'United States',
      role: 'MIT professor; pioneer of data abstraction and distributed systems',
      tags: ['Software', 'Engineering', 'Education'],
      focus: 'modularity, typing and reliability of distributed programs',
      known: 'the Liskov substitution principle and foundational language work for dependable software',
      bullets: ['Clarity about subtype behaviour in object-oriented design', 'Influence through CLU/Modula-era ideas', 'ACM Turing Award (2008)'],
      overview:
        'Editorial context: Barbara Liskov advanced practical abstractions for reliable software; her substitution principle is now part of everyday engineering vocabulary.',
      title: 'Barbara Liskov — abstraction, distributed systems, MIT | Rybezh',
      desc: 'Barbara Liskov profile: substitution principle, distributed systems, ACM Turing Award (2008). Rybezh.site.',
      search: 'barbara liskov substitution principle mit distributed systems programming acm turing award'
    },
    es: {
      name: 'Barbara Liskov',
      country: 'Estados Unidos',
      role: 'Profesora del MIT; pionera de la abstracción de datos y sistemas distribuidos',
      tags: ['Software', 'Ingeniería', 'Educación'],
      focus: 'modularidad, tipos y fiabilidad de programas distribuidos',
      known: 'el principio de sustitución de Liskov y trabajos fundacionales sobre lenguajes y abstracciones',
      bullets: ['Claridad sobre subtipos en diseño orientado a objetos', 'Legado en ideas de lenguajes como CLU', 'Premio Turing de la ACM (2008)'],
      overview:
        'Contexto editorial: Barbara Liskov consolidó abstracciones prácticas para software fiable; su principio de sustitución es parte del vocabulario diario de ingeniería.',
      title: 'Barbara Liskov — abstracción, sistemas distribuidos, MIT | Rybezh',
      desc: 'Barbara Liskov: principio de sustitución, sistemas distribuidos, Premio Turing ACM (2008). Rybezh.site.',
      search: 'barbara liskov principio sustitución mit sistemas distribuidos premio turing acm'
    },
    ru: {
      name: 'Барбара Лисков',
      country: 'США',
      role: 'Профессор MIT, пионер абстракции данных и распределённых систем',
      tags: ['Программирование', 'Инженерия', 'Образование'],
      focus: 'модуляризация, типизация и надёжность распределённых программ',
      known: 'принцип подстановки Лисков и фундаментальные работы по языкам и абстракциям',
      bullets: ['Формализация поведения подтипов', 'Влияние через идеи эпохи CLU/Modula', 'Премия Тьюринга ACM (2008)'],
      overview:
        'Редакционный контекст: Барбара Лисков развивала практичные абстракции для надёжного ПО; принцип подстановки стал частью инженерного языка.',
      title: 'Барбара Лисков — абстракции, распределённые системы, MIT | Rybezh',
      desc: 'Барбара Лисков: принцип подстановки, распределённые системы, премия Тьюринга ACM (2008). Rybezh.site.',
      search: 'барбара лисков принцип подстановки mit распределённые системы премия тьюринга acm'
    }
  },
  {
    slug: 'frances-allen',
    filter: 'software',
    catalog: 66,
    photoIdx: 2,
    uk: {
      name: 'Френсіс Е. Аллен',
      country: 'США',
      role: 'Піонерка оптимізації компіляторів і програмування високої продуктивності',
      tags: ['Програмування', 'Інженерія', 'Дослідження'],
      focus: 'аналіз програм, паралелізм і оптимізація для великих обчислювальних систем',
      known: 'перша жінка — лауреатка премії Тюрінга (2006) за внесок у теорію та практику оптимізації компіляторів',
      bullets: ['Міст між теорією компіляторів і промисловими компіляторами', 'Робота в IBM на критично важливих системах', 'Премія Тюрінга (ACM, 2006)'],
      overview:
        'Редакційний контекст: Френсіс Аллен зосередила кар’єру на аналізі та оптимізації програм; її нагорода Тюринга підкреслює вагу «невидимих» інженерних шарів продуктивності.',
      title: 'Френсіс Е. Аллен — компілятори, оптимізація, IBM | Rybezh',
      desc: 'Френсіс Аллен: оптимізація компіляторів, премія Тюринга 2006. Редакційний профіль Rybezh.site.',
      search: 'френсіс аллен frances allen compiler optimization ibm acm turing award 2006 програмування паралелізм'
    },
    en: {
      name: 'Frances E. Allen',
      country: 'United States',
      role: 'Pioneer of compiler optimisation and high-performance computing',
      tags: ['Software', 'Engineering', 'Research'],
      focus: 'program analysis, parallelism and optimisation for large-scale systems',
      known: 'first woman recipient of the ACM Turing Award (2006) for contributions to compiler optimisation theory and practice',
      bullets: ['Bridge between compiler theory and production compilers', 'Long IBM career on performance-critical systems', 'ACM Turing Award (2006)'],
      overview:
        'Editorial context: Frances Allen focused on program analysis and optimisation; her Turing Award highlights the importance of performance foundations behind user-visible software.',
      title: 'Frances E. Allen — compilers, optimisation, IBM | Rybezh',
      desc: 'Frances Allen profile: compiler optimisation, ACM Turing Award (2006). Rybezh.site.',
      search: 'frances allen compiler optimization ibm acm turing award 2006 programming parallelism'
    },
    es: {
      name: 'Frances E. Allen',
      country: 'Estados Unidos',
      role: 'Pionera de la optimización de compiladores y computación de alto rendimiento',
      tags: ['Software', 'Ingeniería', 'Investigación'],
      focus: 'análisis de programas, paralelismo y optimización a gran escala',
      known: 'primera mujer galardonada con el Premio Turing de la ACM (2006) por compiladores',
      bullets: ['Puente entre teoría de compiladores y compiladores industriales', 'Trayectoria en IBM en sistemas críticos', 'Premio Turing de la ACM (2006)'],
      overview:
        'Contexto editorial: Frances Allen centró su carrera en análisis y optimización; su Premio Turing subraya capas «invisibles» de rendimiento.',
      title: 'Frances E. Allen — compiladores, optimización, IBM | Rybezh',
      desc: 'Frances Allen: optimización de compiladores, Premio Turing ACM (2006). Rybezh.site.',
      search: 'frances allen optimización compiladores ibm premio turing acm 2006 programación paralelismo'
    },
    ru: {
      name: 'Фрэнсис Е. Аллен',
      country: 'США',
      role: 'Пионер оптимизации компиляторов и высокопроизводительных вычислений',
      tags: ['Программирование', 'Инженерия', 'Исследования'],
      focus: 'анализ программ, параллелизм и оптимизация крупномасштабных систем',
      known: 'первая женщина — лауреат премии Тьюринга ACM (2006) за вклад в оптимизацию компиляторов',
      bullets: ['Связь теории компиляторов с промышленными компиляторами', 'Карьера в IBM на критичных системах', 'Премия Тьюринга ACM (2006)'],
      overview:
        'Редакционный контекст: Фрэнсис Аллен сосредоточилась на анализе и оптимизации программ; награда Тьюринга подчёркивает фундамент производительности.',
      title: 'Фрэнсис Е. Аллен — компиляторы, оптимизация, IBM | Rybezh',
      desc: 'Фрэнсис Аллен: оптимизация компиляторов, премия Тьюринга ACM (2006). Rybezh.site.',
      search: 'фрэнсис аллен frances allen оптимизация компиляторов ibm премия тьюринга acm 2006'
    }
  },
  {
    slug: 'michael-stonebraker',
    filter: 'software',
    catalog: 67,
    photoIdx: 3,
    uk: {
      name: 'Майкл Стоунбрейкер',
      country: 'США',
      role: 'Дослідник і підприємець у галині систем керування базами даних',
      tags: ['Програмування', 'Дані', 'Стартапи'],
      focus: 'реляційні та аналітичні СКБД, відкритий код і комерційні продукти',
      known: 'Ingres, Postgres і низка наступних аналітичних систем; премія Тюринга (ACM, 2014)',
      bullets: ['Повторюваний цикл дослідження → прототип → продукт', 'Вплив на сучасні відкриті реляційні системи', 'ACM Turing Award (2014)'],
      overview:
        'Редакційний контекст: Майкл Стоунбрейкер поєднує академічні публікації з серією стартапів у сегменті баз даних; його ім’я асоціюють з еволюцією Postgres/Ingres.',
      title: 'Майкл Стоунбрейкер — бази даних, Postgres, стартапи | Rybezh',
      desc: 'Майкл Стоунбрейкер: реляційні СКБД, Postgres, премія Тюринга 2014. Rybezh.site.',
      search: 'майкл стоунбрейкер michael stonebraker postgres ingres бази даних acm turing award 2014 mit стартапи'
    },
    en: {
      name: 'Michael Stonebraker',
      country: 'United States',
      role: 'Researcher and entrepreneur in database management systems',
      tags: ['Software', 'Data', 'Startups'],
      focus: 'relational and analytical DBMS, open-source and commercial products',
      known: 'Ingres, PostgreSQL lineage and a sequence of analytical database startups; ACM Turing Award (2014)',
      bullets: ['Research-to-product loops in the database industry', 'Influence on modern open relational systems', 'ACM Turing Award (2014)'],
      overview:
        'Editorial context: Michael Stonebraker links academic DB research with repeated startup execution; readers often meet his work through PostgreSQL-related ecosystems.',
      title: 'Michael Stonebraker — databases, Postgres lineage, startups | Rybezh',
      desc: 'Michael Stonebraker profile: DBMS research, PostgreSQL/Ingres lineages, ACM Turing Award (2014). Rybezh.site.',
      search: 'michael stonebraker postgres ingres database acm turing award 2014 mit startups'
    },
    es: {
      name: 'Michael Stonebraker',
      country: 'Estados Unidos',
      role: 'Investigador y emprendedor en sistemas de gestión de bases de datos',
      tags: ['Software', 'Datos', 'Startups'],
      focus: 'SGDB relacionales y analíticos, código abierto y productos comerciales',
      known: 'Ingres, la línea de PostgreSQL y varias startups analíticas; Premio Turing ACM (2014)',
      bullets: ['Ciclos investigación→producto en la industria de datos', 'Impacto en sistemas relacionales abiertos', 'Premio Turing ACM (2014)'],
      overview:
        'Contexto editorial: Michael Stonebraker conecta investigación académica en BD con ejecución emprendedora repetida; muchos lectores lo encuentran vía PostgreSQL.',
      title: 'Michael Stonebraker — bases de datos, Postgres, startups | Rybezh',
      desc: 'Michael Stonebraker: investigación en SGDB, linaje PostgreSQL/Ingres, Premio Turing ACM (2014). Rybezh.site.',
      search: 'michael stonebraker postgres ingres bases de datos premio turing acm 2014 mit startups'
    },
    ru: {
      name: 'Майкл Стоунбрейкер',
      country: 'США',
      role: 'Исследователь и предприниматель в области СУБД',
      tags: ['Программирование', 'Данные', 'Стартапы'],
      focus: 'реляционные и аналитические СУБД, open source и коммерческие продукты',
      known: 'Ingres, линия PostgreSQL и серия аналитических стартапов; премия Тьюринга ACM (2014)',
      bullets: ['Циклы исследование→продукт в индустрии БД', 'Влияние на открытые реляционные системы', 'Премия Тьюринга ACM (2014)'],
      overview:
        'Редакционный контекст: Майкл Стоунбрейкер связывает академические публикации по БД с серией стартапов; имя часто встречается рядом с экосистемой PostgreSQL.',
      title: 'Майкл Стоунбрейкер — базы данных, Postgres, стартапы | Rybezh',
      desc: 'Майкл Стоунбрейкер: СУБД, линия PostgreSQL/Ingres, премия Тьюринга ACM (2014). Rybezh.site.',
      search: 'майкл стоунбрейкер postgres ingres базы данных премия тьюринга acm 2014 mit стартапы'
    }
  },
  {
    slug: 'adi-shamir',
    filter: 'science',
    catalog: 68,
    photoIdx: 4,
    uk: {
      name: 'Аді Шамір',
      country: 'Ізраїль',
      role: 'Криптограф і професор Weizmann Institute of Science',
      tags: ['Наука', 'Безпека', 'Дослідження'],
      focus: 'криптографічні протоколи, аналіз шифрів і математичні основи безпеки',
      known: 'співавтор алгоритму RSA (разом із Рональдом Рівестом та Леонардом Адлеманом); премія Тюринга (ACM, 2002)',
      bullets: ['Фундаментальні роботи в асиметричній криптографії', 'Моделі загроз і криптоаналіз', 'ACM Turing Award (2002)'],
      overview:
        'Редакційний контекст: Аді Шамір — ізраїльський криптограф, чиї роботи лежать в основі сучасної безпеки мереж і цифрових підписів; профіль зосереджує увагу на науковому внеску.',
      title: 'Аді Шамір — RSA, криптографія, Weizmann | Rybezh',
      desc: 'Аді Шамір: RSA, криптографія, премія Тюринга 2002. Редакційна сторінка Rybezh.site.',
      search: 'аді шамір adi shamir rsa криптографія weizmann acm turing award 2002 ізраїль безпека'
    },
    en: {
      name: 'Adi Shamir',
      country: 'Israel',
      role: 'Cryptographer; professor at the Weizmann Institute of Science',
      tags: ['Science', 'Security', 'Research'],
      focus: 'cryptographic protocols, cryptanalysis and mathematical security foundations',
      known: 'co-inventor of the RSA public-key algorithm (with Rivest and Adleman); ACM Turing Award (2002)',
      bullets: ['Cornerstone ideas in asymmetric cryptography', 'Threat modelling and cryptanalysis culture', 'ACM Turing Award (2002)'],
      overview:
        'Editorial context: Adi Shamir is an Israeli cryptographer whose work underpins much of modern network security and digital signatures; the profile stresses scientific contribution.',
      title: 'Adi Shamir — RSA, cryptography, Weizmann | Rybezh',
      desc: 'Adi Shamir profile: RSA, cryptography, ACM Turing Award (2002). Rybezh.site.',
      search: 'adi shamir rsa cryptography weizmann acm turing award 2002 israel security'
    },
    es: {
      name: 'Adi Shamir',
      country: 'Israel',
      role: 'Criptógrafo; profesor en el Weizmann Institute of Science',
      tags: ['Ciencia', 'Seguridad', 'Investigación'],
      focus: 'protocolos criptográficos, criptoanálisis y fundamentos matemáticos',
      known: 'coautor del algoritmo RSA (con Rivest y Adleman); Premio Turing ACM (2002)',
      bullets: ['Ideas centrales en criptografía asimétrica', 'Cultura de modelado de amenazas', 'Premio Turing ACM (2002)'],
      overview:
        'Contexto editorial: Adi Shamir es un criptógrafo israelí cuyo trabajo sostiene gran parte de la seguridad moderna en redes.',
      title: 'Adi Shamir — RSA, criptografía, Weizmann | Rybezh',
      desc: 'Adi Shamir: RSA, criptografía, Premio Turing ACM (2002). Rybezh.site.',
      search: 'adi shamir rsa criptografía weizmann premio turing acm 2002 israel seguridad'
    },
    ru: {
      name: 'Ади Шамир',
      country: 'Израиль',
      role: 'Криптограф, профессор Института Вейцмана',
      tags: ['Наука', 'Безопасность', 'Исследования'],
      focus: 'криптографические протоколы, криптоанализ и математические основы безопасности',
      known: 'соавтор алгоритма RSA (вместе с Ривестом и Адлеманом); премия Тьюринга ACM (2002)',
      bullets: ['Опорные идеи асимметричной криптографии', 'Культура моделирования угроз', 'Премия Тьюринга ACM (2002)'],
      overview:
        'Редакционный контекст: Ади Шамир — израильский криптограф, чьи работы лежат в основе сетевой безопасности и ЭЦП.',
      title: 'Ади Шамир — RSA, криптография, Вейцман | Rybezh',
      desc: 'Ади Шамир: RSA, криптография, премия Тьюринга ACM (2002). Rybezh.site.',
      search: 'ади шамир adi shamir rsa криптография вейцман премия тьюринга acm 2002 израиль'
    }
  },
  {
    slug: 'whitfield-diffie',
    filter: 'science',
    catalog: 69,
    photoIdx: 5,
    uk: {
      name: 'Уітфілд Діффі',
      country: 'США',
      role: 'Криптограф, співавтор ідей публічного ключа',
      tags: ['Наука', 'Безпека', 'Дослідження'],
      focus: 'публічна криптографія, обмін ключами та політика безпеки',
      known: 'спільна робота з Мартіном Хеллманом над концепцією публічного ключа та протоколом Діффі — Хеллмана; премія Тюринга (ACM, 2015)',
      bullets: ['Зміна парадигми від «секретних каналів» до асиметричних примітивів', 'Вплив на стандарти захисту даних', 'ACM Turing Award (2015)'],
      overview:
        'Редакційний контекст: Уітфілд Діффі разом із Мартіном Хеллманом запропонували публічну криптографію; це один з фундаментальних шарів сучасного Інтернету.',
      title: 'Уітфілд Діффі — публічний ключ, Діффі — Хеллман | Rybezh',
      desc: 'Уітфілд Діффі: публічна криптографія, премія Тюринга 2015. Rybezh.site.',
      search: 'уітфілд діффі whitfield diffie hellman public key cryptography acm turing award 2015 сша безпека'
    },
    en: {
      name: 'Whitfield Diffie',
      country: 'United States',
      role: 'Cryptographer; co-author of public-key cryptography ideas',
      tags: ['Science', 'Security', 'Research'],
      focus: 'public-key cryptography, key agreement and security policy debates',
      known: 'joint work with Martin Hellman on public-key concepts and the Diffie–Hellman key exchange; ACM Turing Award (2015)',
      bullets: ['Paradigm shift from pre-shared secrets to asymmetric primitives', 'Influence on data-protection standards', 'ACM Turing Award (2015)'],
      overview:
        'Editorial context: Whitfield Diffie and Martin Hellman introduced public-key cryptography ideas that became foundational for the modern Internet.',
      title: 'Whitfield Diffie — public key cryptography, Diffie–Hellman | Rybezh',
      desc: 'Whitfield Diffie profile: public-key ideas, Diffie–Hellman, ACM Turing Award (2015). Rybezh.site.',
      search: 'whitfield diffie martin hellman public key cryptography diffie hellman acm turing award 2015 united states'
    },
    es: {
      name: 'Whitfield Diffie',
      country: 'Estados Unidos',
      role: 'Criptógrafo; coautor de ideas de criptografía de clave pública',
      tags: ['Ciencia', 'Seguridad', 'Investigación'],
      focus: 'criptografía asimétrica, acuerdo de claves y políticas de seguridad',
      known: 'trabajo conjunto con Martin Hellman sobre clave pública e intercambio Diffie–Hellman; Premio Turing ACM (2015)',
      bullets: ['Cambio de paradigma respecto a secretos precompartidos', 'Impacto en estándares de protección de datos', 'Premio Turing ACM (2015)'],
      overview:
        'Contexto editorial: Diffie y Hellman introdujeron ideas de criptografía de clave pública que sostienen buena parte de Internet moderno.',
      title: 'Whitfield Diffie — criptografía de clave pública, Diffie–Hellman | Rybezh',
      desc: 'Whitfield Diffie: clave pública, Diffie–Hellman, Premio Turing ACM (2015). Rybezh.site.',
      search: 'whitfield diffie martin hellman criptografía clave pública diffie hellman premio turing acm 2015'
    },
    ru: {
      name: 'Уитфилд Диффи',
      country: 'США',
      role: 'Криптограф, соавтор идей криптографии с открытым ключом',
      tags: ['Наука', 'Безопасность', 'Исследования'],
      focus: 'асимметричная криптография, согласование ключей и политика безопасности',
      known: 'совместная работа с Мартином Хеллманом над открытым ключом и протоколом Диффи — Хеллмана; премия Тьюринга ACM (2015)',
      bullets: ['Смена парадигмы с pre-shared secrets на асимметрию', 'Влияние на стандарты защиты данных', 'Премия Тьюринга ACM (2015)'],
      overview:
        'Редакционный контекст: Диффи и Хеллман заложили идеи криптографии с открытым ключом — фундамент современного Интернета.',
      title: 'Уитфилд Диффи — открытый ключ, Диффи — Хеллман | Rybezh',
      desc: 'Уитфилд Диффи: открытый ключ, премия Тьюринга ACM (2015). Rybezh.site.',
      search: 'уитфилд диффи whitfield diffie hellman открытый ключ криптография премия тьюринга acm 2015'
    }
  },
  {
    slug: 'vint-cerf',
    filter: 'engineering',
    catalog: 70,
    photoIdx: 6,
    uk: {
      name: 'Вінт Серф',
      country: 'США',
      role: 'Архітектор мережевих протоколів, віцепрезидент та Chief Internet Evangelist (Google)',
      tags: ['Інженерія', 'Інтернет', 'Дослідження'],
      focus: 'TCP/IP, міжмережеві стандарти та політика розвитку Інтернету',
      known: 'співавтор базової архітектури TCP/IP разом із Робертом Каном; премія Тюринга (ACM, 2004)',
      bullets: ['Перехід від лабораторних експериментів до глобальної інфраструктури', 'Роль у стандартизації та інституціях IETF/ICANN', 'ACM Turing Award (2004)'],
      overview:
        'Редакційний контекст: Вінт Серф — одна з ключових постатей раннього Інтернету; профіль підкреслює інженерні рішення, а не лише публічні титули.',
      title: 'Вінт Серф — TCP/IP, Інтернет, Google | Rybezh',
      desc: 'Вінт Серф: TCP/IP, премія Тюринга 2004, розвиток Інтернету. Rybezh.site.',
      search: 'вінт серф vint cerf tcp ip internet google acm turing award 2004 ietf інженерія'
    },
    en: {
      name: 'Vint Cerf',
      country: 'United States',
      role: 'Internet protocol architect; Vice President and Chief Internet Evangelist at Google',
      tags: ['Engineering', 'Internet', 'Research'],
      focus: 'TCP/IP, internetworking standards and Internet governance debates',
      known: 'co-design of the TCP/IP architecture with Robert E. Kahn; ACM Turing Award (2004)',
      bullets: ['From research prototypes to planetary-scale infrastructure', 'Standards work via IETF-era culture and institutions', 'ACM Turing Award (2004)'],
      overview:
        'Editorial context: Vint Cerf is widely associated with the early Internet protocol stack; the profile foregrounds engineering choices behind global connectivity.',
      title: 'Vint Cerf — TCP/IP, Internet architecture, Google | Rybezh',
      desc: 'Vint Cerf profile: TCP/IP, ACM Turing Award (2004), Internet evolution. Rybezh.site.',
      search: 'vint cerf tcp ip internet google acm turing award 2004 ietf engineering robert kahn'
    },
    es: {
      name: 'Vint Cerf',
      country: 'Estados Unidos',
      role: 'Arquitecto de protocolos de Internet; vicepresidente y Chief Internet Evangelist en Google',
      tags: ['Ingeniería', 'Internet', 'Investigación'],
      focus: 'TCP/IP, estándares de internetworking y gobernanza de Internet',
      known: 'códiseño de TCP/IP con Robert E. Kahn; Premio Turing ACM (2004)',
      bullets: ['De prototipos de investigación a infraestructura planetaria', 'Trabajo en estándares e instituciones', 'Premio Turing ACM (2004)'],
      overview:
        'Contexto editorial: Vint Cerf se asocia con la pila de protocolos del Internet temprano; el perfil destaca decisiones de ingeniería.',
      title: 'Vint Cerf — TCP/IP, arquitectura de Internet, Google | Rybezh',
      desc: 'Vint Cerf: TCP/IP, Premio Turing ACM (2004), evolución de Internet. Rybezh.site.',
      search: 'vint cerf tcp ip internet google premio turing acm 2004 ietf ingeniería robert kahn'
    },
    ru: {
      name: 'Винт Серф',
      country: 'США',
      role: 'Архитектор интернет-протоколов; вице-президент и Chief Internet Evangelist в Google',
      tags: ['Инженерия', 'Интернет', 'Исследования'],
      focus: 'TCP/IP, стандарты межсетевого взаимодействия и развитие Интернета',
      known: 'соавтор архитектуры TCP/IP вместе с Робертом Каном; премия Тьюринга ACM (2004)',
      bullets: ['От исследовательских прототипов к планетарной инфраструктуре', 'Роль в стандартизации и институтах', 'Премия Тьюринга ACM (2004)'],
      overview:
        'Редакционный контекст: Винт Серф связан с ранним стеком Интернета; акцент на инженерных решениях глобальной связности.',
      title: 'Винт Серф — TCP/IP, архитектура Интернета, Google | Rybezh',
      desc: 'Винт Серф: TCP/IP, премия Тьюринга ACM (2004), эволюция Интернета. Rybezh.site.',
      search: 'винт серф vint cerf tcp ip internet google премия тьюринга acm 2004 ietf роберт кан'
    }
  },
  {
    slug: 'robert-kahn',
    filter: 'engineering',
    catalog: 71,
    photoIdx: 7,
    uk: {
      name: 'Роберт Кан',
      country: 'США',
      role: 'Інженер і дослідник мереж; співавтор TCP/IP',
      tags: ['Інженерія', 'Інтернет', 'Дослідження'],
      focus: 'архітектура пакетних мереж, міжмережеві протоколи та дослідницькі програми DARPA',
      known: 'спільна робота з Вінтом Серфом над TCP/IP; премія Тюринга (ACM, 2004)',
      bullets: ['Перехід від ARPANET до відкритої моделі міжмережевості', 'Поєднання академічних і державних дослідницьких контекстів', 'ACM Turing Award (2004)'],
      overview:
        'Редакційний контекст: Роберт Кан разом із Вінтом Серфом заклав архітектурні рішення, на яких тримається сучасний Інтернет.',
      title: 'Роберт Кан — TCP/IP, DARPA, мережі | Rybezh',
      desc: 'Роберт Кан: TCP/IP, премія Тюринга 2004, мережеві дослідження. Rybezh.site.',
      search: 'роберт кан robert kahn tcp ip darpa internet acm turing award 2004 vint cerf інженерія'
    },
    en: {
      name: 'Robert E. Kahn',
      country: 'United States',
      role: 'Networking engineer and researcher; co-inventor of TCP/IP',
      tags: ['Engineering', 'Internet', 'Research'],
      focus: 'packet-switched architecture, internetworking protocols and DARPA-era research programmes',
      known: 'joint design of TCP/IP with Vint Cerf; ACM Turing Award (2004)',
      bullets: ['From ARPANET experiments to an open internetworking model', 'Bridge between research agencies and standards culture', 'ACM Turing Award (2004)'],
      overview:
        'Editorial context: Robert Kahn, with Vint Cerf, shaped the architectural decisions behind today’s Internet protocol stack.',
      title: 'Robert E. Kahn — TCP/IP, DARPA, internetworking | Rybezh',
      desc: 'Robert Kahn profile: TCP/IP, ACM Turing Award (2004), networking research. Rybezh.site.',
      search: 'robert kahn tcp ip darpa internet acm turing award 2004 vint cerf engineering'
    },
    es: {
      name: 'Robert E. Kahn',
      country: 'Estados Unidos',
      role: 'Ingeniero e investigador de redes; coautor de TCP/IP',
      tags: ['Ingeniería', 'Internet', 'Investigación'],
      focus: 'arquitectura de conmutación de paquetes, protocolos de internetworking e investigación DARPA',
      known: 'códiseño de TCP/IP con Vint Cerf; Premio Turing ACM (2004)',
      bullets: ['De ARPANET a un modelo abierto de internetworking', 'Investigación pública y estándares', 'Premio Turing ACM (2004)'],
      overview:
        'Contexto editorial: Robert Kahn, con Vint Cerf, moldeó las decisiones arquitectónicas del Internet moderno.',
      title: 'Robert E. Kahn — TCP/IP, DARPA, redes | Rybezh',
      desc: 'Robert Kahn: TCP/IP, Premio Turing ACM (2004), investigación en redes. Rybezh.site.',
      search: 'robert kahn tcp ip darpa internet premio turing acm 2004 vint cerf ingeniería'
    },
    ru: {
      name: 'Роберт Кан',
      country: 'США',
      role: 'Инженер и исследователь сетей; соавтор TCP/IP',
      tags: ['Инженерия', 'Интернет', 'Исследования'],
      focus: 'пакетная архитектура, межсетевые протоколы и программы DARPA',
      known: 'совместная разработка TCP/IP с Винтом Серфом; премия Тьюринга ACM (2004)',
      bullets: ['От ARPANET к открытой модели межсетевого взаимодействия', 'Связка исследовательских агентств и стандартов', 'Премия Тьюринга ACM (2004)'],
      overview:
        'Редакционный контекст: Роберт Кан вместе с Винтом Серфом заложил архитектуру современного Интернета.',
      title: 'Роберт Кан — TCP/IP, DARPA, сети | Rybezh',
      desc: 'Роберт Кан: TCP/IP, премия Тьюринга ACM (2004), сетевые исследования. Rybezh.site.',
      search: 'роберт кан robert kahn tcp ip darpa internet премия тьюринга acm 2004 винт серф'
    }
  },
  {
    slug: 'ginni-rometty',
    filter: 'ceo',
    catalog: 72,
    photoIdx: 8,
    uk: {
      name: 'Джинні Рометті',
      country: 'США',
      role: 'Колишня CEO IBM, радниця з питань технологій і кадрів',
      tags: ['CEO', 'Операції', 'Корпоративне ПЗ'],
      focus: 'трансформація великих ІТ-компаній, хмарні сервіси та корпоративна стратегія',
      known: 'керівництво IBM у період зміщення акценту на хмару, корпоративні дані та платформенні сервіси',
      bullets: ['Досвід керування глобальною сервісною організацією', 'Акцент на довгострокових контрактах і довірі клієнтів', 'Публічна роль у дискусіях про навички та ринок праці'],
      overview:
        'Редакційний контекст: Джинні Рометті очолювала IBM у фазі переорієнтації на хмару та аналітику; профіль корисний для порівняння «великих» операційних моделей.',
      title: 'Джинні Рометті — IBM, хмара, корпоративна стратегія | Rybezh',
      desc: 'Джинні Рометті: керівництво IBM, хмарна трансформація, стратегія. Rybezh.site.',
      search: 'джинні рометті ginni rometty ibm ceo cloud hybrid cloud enterprise software сша керівництво операції'
    },
    en: {
      name: 'Ginni Rometty',
      country: 'United States',
      role: 'Former IBM CEO; advisor on technology and workforce topics',
      tags: ['CEO', 'Operations', 'Enterprise software'],
      focus: 'large-scale IT transformation, hybrid cloud and enterprise strategy',
      known: 'leading IBM through a strategic shift toward cloud, data and modern enterprise platform services',
      bullets: ['Experience running a global services-heavy technology company', 'Long-cycle customer relationships and trust', 'Public voice on skills and labour-market transitions'],
      overview:
        'Editorial context: Ginni Rometty led IBM during a pivot toward cloud and analytics; the profile is useful when comparing operating models of large incumbents.',
      title: 'Ginni Rometty — IBM, cloud transformation, leadership | Rybezh',
      desc: 'Ginni Rometty profile: IBM CEO era, cloud and enterprise strategy. Rybezh.site.',
      search: 'ginni rometty ibm ceo cloud hybrid cloud enterprise software united states leadership operations'
    },
    es: {
      name: 'Ginni Rometty',
      country: 'Estados Unidos',
      role: 'Ex CEO de IBM; asesora en tecnología y talento',
      tags: ['CEO', 'Operaciones', 'Software empresarial'],
      focus: 'transformación de TI a gran escala, nube híbrida y estrategia corporativa',
      known: 'liderar IBM en un giro hacia nube, datos y servicios empresariales de plataforma',
      bullets: ['Gestión de una compañía tecnológica con fuerte componente de servicios', 'Relaciones de cliente de largo ciclo', 'Voz pública sobre habilidades y mercado laboral'],
      overview:
        'Contexto editorial: Ginni Rometty dirigió IBM durante un pivote hacia nube y analítica; útil para comparar modelos operativos de incumbentes.',
      title: 'Ginni Rometty — IBM, nube, liderazgo | Rybezh',
      desc: 'Ginni Rometty: etapa como CEO de IBM, estrategia cloud y enterprise. Rybezh.site.',
      search: 'ginni rometty ibm ceo nube hybrid cloud software empresarial estados unidos liderazgo'
    },
    ru: {
      name: 'Джинни Рометти',
      country: 'США',
      role: 'Бывший CEO IBM; советник по технологиям и кадровой повестке',
      tags: ['CEO', 'Операции', 'Корпоративное ПО'],
      focus: 'трансформация крупных ИТ-компаний, гибридное облако и корпоративная стратегия',
      known: 'руководство IBM в период смещения акцента на облако, корпоративные данные и платформенные сервисы',
      bullets: ['Опыт управления глобальной сервисной компанией', 'Долгие циклы доверия клиентов', 'Публичная роль в дискуссиях о навыках и рынке труда'],
      overview:
        'Редакционный контекст: Джинни Рометти возглавляла IBM в фазе поворота к облаку и аналитике; полезно для сравнения моделей крупных игроков.',
      title: 'Джинни Рометти — IBM, облако, стратегия | Rybezh',
      desc: 'Джинни Рометти: эпоха CEO IBM, облачная трансформация. Rybezh.site.',
      search: 'джинни рометти ginni rometty ibm ceo облако hybrid cloud enterprise software сша руководство'
    }
  },
  {
    slug: 'mitchell-baker',
    filter: 'ceo',
    catalog: 73,
    photoIdx: 9,
    uk: {
      name: 'Мітчелл Бейкер',
      country: 'США',
      role: 'Executive Chairwoman, Mozilla Foundation; лідерка відкритого вебу',
      tags: ['CEO', 'Програмування', 'Open Web'],
      focus: 'захист відкритих стандартів, корпоративне управління некомерційною місією та продукт Firefox',
      known: 'публічне представництво Mozilla у питаннях приватності, відкритих стандартів і конкуренції на ринку браузерів',
      bullets: ['Поєднання місії та інженерного продукту', 'Адвокація користувацького суверенітету даних', 'Досвід управління глобальною open-source спільнотою'],
      overview:
        'Редакційний контекст: Мітчелл Бейкер відома роллю в Mozilla — організації, що поєднує браузерний продукт, стандарти й громадську місію відкритого Інтернету.',
      title: 'Мітчелл Бейкер — Mozilla, Firefox, відкритий веб | Rybezh',
      desc: 'Мітчелл Бейкер: Mozilla Foundation, Firefox, відкриті стандарти. Rybezh.site.',
      search: 'мітчелл бейкер mitchell baker mozilla firefox open web open source ceo chairwoman сша браузер приватність'
    },
    en: {
      name: 'Mitchell Baker',
      country: 'United States',
      role: 'Executive Chairwoman, Mozilla Foundation; open-web advocate',
      tags: ['CEO', 'Software', 'Open web'],
      focus: 'open standards, non-profit governance and the Firefox product line',
      known: 'public leadership of Mozilla on privacy, open standards and browser-market competition',
      bullets: ['Mission-driven product engineering at global scale', 'Advocacy for user sovereignty over data', 'Long tenure across Mozilla Foundation and product entities'],
      overview:
        'Editorial context: Mitchell Baker is associated with Mozilla’s blend of Firefox engineering, standards work and public-interest Internet advocacy.',
      title: 'Mitchell Baker — Mozilla, Firefox, open web | Rybezh',
      desc: 'Mitchell Baker profile: Mozilla Foundation, Firefox, open standards. Rybezh.site.',
      search: 'mitchell baker mozilla firefox open web open source ceo chairwoman united states browser privacy'
    },
    es: {
      name: 'Mitchell Baker',
      country: 'Estados Unidos',
      role: 'Executive Chairwoman de Mozilla Foundation; defensora de la web abierta',
      tags: ['CEO', 'Software', 'Web abierta'],
      focus: 'estándares abiertos, gobernanza sin ánimo de lucro y el producto Firefox',
      known: 'liderazgo público de Mozilla en privacidad, estándares abiertos y competencia de navegadores',
      bullets: ['Ingeniería de producto con misión a escala global', 'Soberanía de datos para las personas', 'Trayectoria larga en Mozilla Foundation y producto'],
      overview:
        'Contexto editorial: Mitchell Baker representa la mezcla Mozilla de Firefox, estándares y defensa del interés público en Internet.',
      title: 'Mitchell Baker — Mozilla, Firefox, web abierta | Rybezh',
      desc: 'Mitchell Baker: Mozilla Foundation, Firefox, estándares abiertos. Rybezh.site.',
      search: 'mitchell baker mozilla firefox web abierta open source ceo chairwoman estados unidos privacidad'
    },
    ru: {
      name: 'Митчелл Бейкер',
      country: 'США',
      role: 'Executive Chairwoman, Mozilla Foundation; защитница открытого веба',
      tags: ['CEO', 'Программирование', 'Открытый веб'],
      focus: 'открытые стандарты, управление некоммерческой миссией и продукт Firefox',
      known: 'публичное лидерство Mozilla в вопросах приватности, открытых стандартов и конкуренции браузеров',
      bullets: ['Инженерия продукта с миссией на глобальном масштабе', 'Адвокация суверенитета данных пользователей', 'Долгая роль в Mozilla Foundation и продуктовых структурах'],
      overview:
        'Редакционный контекст: Митчелл Бейкер связана с сочетанием Firefox, стандартов и общественной миссии Mozilla.',
      title: 'Митчелл Бейкер — Mozilla, Firefox, открытый веб | Rybezh',
      desc: 'Митчелл Бейкер: Mozilla Foundation, Firefox, открытые стандарты. Rybezh.site.',
      search: 'митчелл бейкер mitchell baker mozilla firefox открытый веб open source ceo chairwoman сша браузер'
    }
  }
];

function buildRelated(lang) {
  const L = ui[lang];
  return L.related
    .map(
      (r) => `<article class="card profile-card" data-directory-card data-filter-key="${r.filter}" data-country="${r.country}" data-sort-name="${r.sort}" data-catalog-order="0" data-search="${r.search}">
    <img src="${r.img}" alt="${r.alt}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${r.onerr}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="card-body">
      <p class="eyebrow">${r.eyebrow}</p>
      <h3>${r.name}</h3>
      <p class="meta">${r.meta}</p>
      <div class="tags">${r.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      <a class="btn" href="${r.href}">${L.openProfile}</a>
    </div>
  </article>`
    )
    .join('\n');
}

function buildProfileHtml(lang, person) {
  const L = ui[lang];
  const d = person[lang];
  const suffix = lang === 'uk' ? '' : `-${lang}`;
  const photo = photos[person.photoIdx];
  const onName = encodeURIComponent(d.name).replace(/'/g, '%27');
  const tags = d.tags.map((t) => `<span class="tag">${t}</span>`).join('');
  const bullets = d.bullets.map((b) => `<li>${b}</li>`).join('');

  return `<title>${d.title}</title>
<meta name="description" content="${d.desc}">

<article class="content-wrapper profile-page">
  <a class="back-link" href="${L.specialistsHref}">${L.back}</a>
  <header class="profile-header">
    <img src="${photo}" alt="${d.name}" class="profile-avatar-large" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${onName}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="profile-info">
      <p class="eyebrow">${d.country}</p>
      <h1>${d.name}</h1>
      <h2>${d.role}</h2>
      <div class="tags">${tags}</div>
    </div>
  </header>
  <section class="profile-facts">
    <div><strong>${L.countryLabel}</strong><span>${d.country}</span></div>
    <div><strong>${L.focusLabel}</strong><span>${d.focus}</span></div>
    <div><strong>${L.knownLabel}</strong><span>${d.known}</span></div>
  </section>
  <section class="highlight-list">
    <h3>${L.strengths}</h3>
    <ul>${bullets}</ul>
  </section>
  <section class="profile-content">
    <h3>${L.overview}</h3>
    <p>${d.overview}</p>
  </section>
  
  
  <section class="editorial-note">
    <h3>${L.editorialTitle}</h3>
    <p>${L.editorialBody}</p>
  </section>
  
  <section class="profile-related">
    <div class="section-intro">
    <p class="eyebrow">${L.relatedEyebrow}</p>
    <h2>${L.relatedTitle}</h2>
    <p>${L.relatedIntro}</p>
  </div>
    <div class="grid compact-grid">${buildRelated(lang)}
</div>
  </section>
</article>
`;
}

function directoryCard(lang, person) {
  const d = person[lang];
  const suffix = lang === 'uk' ? '' : `-${lang}`;
  const photo = photos[person.photoIdx];
  const onName = encodeURIComponent(d.name).replace(/'/g, '%27');
  const tags = d.tags.map((t) => `<span class="tag">${t}</span>`).join('');
  const open =
    lang === 'uk' ? 'Відкрити профіль' : lang === 'en' ? 'Open profile' : lang === 'es' ? 'Abrir perfil' : 'Открыть профиль';
  return `<article class="card profile-card" data-directory-card data-filter-key="${person.filter}" data-country="${d.country}" data-sort-name="${d.name}" data-catalog-order="${person.catalog}" data-search="${d.search}">
    <img src="${photo}" alt="${d.name}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${onName}&size=720&background=eef4ff&color=2563eb&bold=true';">
    <div class="card-body">
      <p class="eyebrow">${d.country}</p>
      <h3>${d.name}</h3>
      <p class="meta">${d.role}</p>
      <div class="tags">${tags}</div>
      <a class="btn" href="person-${person.slug}${suffix}.html">${open}</a>
    </div>
  </article>`;
}

for (const p of people) {
  for (const lang of ['uk', 'en', 'es', 'ru']) {
    const suffix = lang === 'uk' ? '' : `-${lang}`;
    const out = path.join(profilesDir, `person-${p.slug}${suffix}.html`);
    fs.writeFileSync(out, buildProfileHtml(lang, p), 'utf8');
  }
}

function injectCards(filePath, markerNeedle, cardsHtml, fingerprint) {
  let s = fs.readFileSync(filePath, 'utf8');
  if (fingerprint && s.includes(fingerprint)) {
    console.log('skip inject (already present):', filePath);
    return;
  }
  if (!s.includes(markerNeedle)) {
    throw new Error(`Marker not found in ${filePath}: ${markerNeedle.slice(0, 80)}`);
  }
  s = s.replace(markerNeedle, `${markerNeedle}\n${cardsHtml}`);
  fs.writeFileSync(filePath, s, 'utf8');
}

const cardsUk = people.map((p) => directoryCard('uk', p)).join('\n');
const cardsEn = people.map((p) => directoryCard('en', p)).join('\n');
const cardsEs = people.map((p) => directoryCard('es', p)).join('\n');
const cardsRu = people.map((p) => directoryCard('ru', p)).join('\n');

injectCards(
  path.join(root, 'site', 'specialists.html'),
  '<a class="btn" href="person-oleg-melnyk.html">Відкрити профіль</a>\n    </div>\n  </article>',
  cardsUk,
  'person-donald-knuth.html'
);
injectCards(
  path.join(root, 'site', 'specialists-en.html'),
  '<a class="btn" href="person-catherine-heymans-en.html">Open profile</a>\n    </div>\n  </article>',
  cardsEn,
  'person-donald-knuth-en.html'
);
injectCards(
  path.join(root, 'site', 'specialists-es.html'),
  '<a class="btn" href="person-catherine-heymans-es.html">Abrir perfil</a>\n    </div>\n  </article>',
  cardsEs,
  'person-donald-knuth-es.html'
);
injectCards(
  path.join(root, 'site', 'specialists-ru.html'),
  '<a class="btn" href="person-catherine-heymans-ru.html">Открыть профиль</a>\n    </div>\n  </article>',
  cardsRu,
  'person-donald-knuth-ru.html'
);

function bumpCount(filePath, oldN, newN) {
  let s = fs.readFileSync(filePath, 'utf8');
  if (s.includes(`data-results-count>${newN}<`)) {
    console.log('skip bump count:', filePath);
    return;
  }
  s = s.replace(`data-results-count>${oldN}<`, `data-results-count>${newN}<`);
  fs.writeFileSync(filePath, s, 'utf8');
}

bumpCount(path.join(root, 'site', 'specialists.html'), '64', '74');
bumpCount(path.join(root, 'site', 'specialists-en.html'), '59', '69');
bumpCount(path.join(root, 'site', 'specialists-es.html'), '59', '69');
bumpCount(path.join(root, 'site', 'specialists-ru.html'), '59', '69');

let indexUk = fs.readFileSync(path.join(root, 'site', 'index.html'), 'utf8');
if (!indexUk.includes('<div class="stat-card"><strong>69</strong><span>Профілів спеціалістів</span></div>')) {
  indexUk = indexUk.replace(
    '<div class="stat-card"><strong>59</strong><span>Профілів спеціалістів</span></div>',
    '<div class="stat-card"><strong>69</strong><span>Профілів спеціалістів</span></div>'
  );
  fs.writeFileSync(path.join(root, 'site', 'index.html'), indexUk, 'utf8');
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sm = fs.readFileSync(sitemapPath, 'utf8');
if (!sm.includes('person-donald-knuth.html')) {
  const urlBlocks = [];
  for (const p of people) {
    for (const suf of ['', '-en', '-es', '-ru']) {
      urlBlocks.push(`  <url>
    <loc>https://rybezh.site/person-${p.slug}${suf}.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }
  sm = sm.replace('</urlset>', `${urlBlocks.join('\n')}\n</urlset>`);
  fs.writeFileSync(sitemapPath, sm, 'utf8');
} else {
  console.log('skip sitemap URLs (already present)');
}

console.log('Added 10 specialists × 4 languages, directory cards, counts, sitemap.');
