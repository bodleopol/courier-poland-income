/**
 * Emits src/career-talent-atlas-data.js — niche weight lattice for Career Talent Atlas.
 * 96 niches × 320 uint16 weights = 30 720 scalar parameters (documented in-game).
 */
import fs from 'fs';
import path from 'path';

const OUT = path.join('src', 'career-talent-atlas-data.js');

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Style vectors (8 traits): analytics, craft, people, systems, novelty, stability, autonomy, pace */
const STYLES = [
  [0.85, 0.55, 0.35, 0.7, 0.6, 0.45, 0.5, 0.65],
  [0.45, 0.75, 0.4, 0.55, 0.55, 0.6, 0.5, 0.45],
  [0.4, 0.45, 0.9, 0.55, 0.45, 0.5, 0.45, 0.5],
  [0.75, 0.5, 0.4, 0.65, 0.7, 0.55, 0.55, 0.5],
  [0.55, 0.5, 0.45, 0.6, 0.65, 0.7, 0.6, 0.45],
  [0.35, 0.65, 0.55, 0.45, 0.6, 0.45, 0.65, 0.55],
  [0.5, 0.45, 0.55, 0.75, 0.45, 0.75, 0.45, 0.4],
  [0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55]
];

const SECTOR_ADJ = [
  [0.9, 0.85, 0.35, 0.85, 0.75, 0.45, 0.55, 0.65],
  [0.85, 0.45, 0.35, 0.75, 0.7, 0.55, 0.5, 0.55],
  [0.55, 0.75, 0.65, 0.55, 0.65, 0.5, 0.6, 0.55],
  [0.75, 0.55, 0.4, 0.85, 0.55, 0.65, 0.45, 0.5],
  [0.45, 0.55, 0.75, 0.5, 0.65, 0.45, 0.65, 0.55],
  [0.55, 0.45, 0.55, 0.8, 0.45, 0.65, 0.45, 0.65],
  [0.85, 0.35, 0.45, 0.7, 0.45, 0.75, 0.4, 0.5],
  [0.7, 0.55, 0.55, 0.65, 0.55, 0.55, 0.5, 0.45],
  [0.55, 0.65, 0.45, 0.65, 0.75, 0.55, 0.55, 0.5],
  [0.4, 0.8, 0.6, 0.45, 0.7, 0.4, 0.65, 0.55],
  [0.45, 0.45, 0.85, 0.55, 0.45, 0.55, 0.45, 0.45],
  [0.65, 0.4, 0.45, 0.55, 0.45, 0.75, 0.4, 0.4]
];

const SECTOR_NAMES = {
  uk: [
    'Програмна інженерія та інфраструктура',
    'Дані, ML та дослідження',
    'Продукт, UX та сервіс-дизайн',
    'Кібербезпека та довіра',
    'DevRel, контент і спільноти',
    'Операції, логістика та ланцюги поставок',
    'Фінтех, облік і ризик-моделі',
    'Health / biotech та регляторика',
    'Клімат, енергетика та промисловий IoT',
    'Медіа, ігри та креативні інструменти',
    'HR, L&D та організаційний розвиток',
    'Політика продукту, право та комплаєнс'
  ],
  en: [
    'Software & infrastructure',
    'Data, ML & research',
    'Product, UX & service design',
    'Cybersecurity & trust',
    'DevRel, content & communities',
    'Operations, logistics & supply chain',
    'Fintech, accounting & risk models',
    'Health / biotech & regulation',
    'Climate, energy & industrial IoT',
    'Media, games & creative tooling',
    'HR, L&D & org development',
    'Product policy, legal & compliance'
  ],
  es: [
    'Ingeniería de software e infraestructura',
    'Datos, ML e investigación',
    'Producto, UX y diseño de servicios',
    'Ciberseguridad y confianza',
    'DevRel, contenido y comunidades',
    'Operaciones, logística y cadena de suministro',
    'Fintech, contabilidad y modelos de riesgo',
    'Salud / biotech y regulación',
    'Clima, energía e IoT industrial',
    'Medios, juegos y herramientas creativas',
    'RR. HH., L&D y desarrollo organizacional',
    'Política de producto, legal y cumplimiento'
  ],
  ru: [
    'Программная инженерия и инфраструктура',
    'Данные, ML и исследования',
    'Продукт, UX и сервис-дизайн',
    'Кибербезопасность и доверие',
    'DevRel, контент и сообщества',
    'Операции, логистика и цепочки поставок',
    'Финтех, учёт и риск-модели',
    'Health / biotech и регуляторика',
    'Климат, энергетика и промышленный IoT',
    'Медиа, игры и креативные инструменты',
    'HR, L&D и развитие организации',
    'Продуктовая политика, право и комплаенс'
  ]
};

const STYLE_NAMES = {
  uk: ['Архітектор рішень', 'Ремісник якості', 'Комунікаційний міст', 'Дослідник невизначеності', 'Операційний стабілізатор', 'Оператор історій', 'Сторож ризику', 'Універсальний мультитул'],
  en: ['Solution architect', 'Quality craftsperson', 'Communication bridge', 'Ambiguity researcher', 'Operational stabiliser', 'Story operator', 'Risk sentinel', 'Generalist multitool'],
  es: ['Arquitecto de soluciones', 'Artesano de calidad', 'Puente de comunicación', 'Investigador de ambigüedad', 'Estabilizador operativo', 'Operador de narrativas', 'Centinela de riesgo', 'Multiherramienta generalista'],
  ru: ['Архитектор решений', 'Ремесленник качества', 'Коммуникационный мост', 'Исследователь неопределённости', 'Операционный стабилизатор', 'Оператор историй', 'Страж риска', 'Универсальный мультитул']
};

const ROLES = {
  uk: [
    ['Platform engineer', 'SRE', 'Runtime performance analyst'],
    ['Analytics engineer', 'Applied scientist', 'Experimentation lead'],
    ['Product manager', 'UX researcher', 'Service designer'],
    ['AppSec engineer', 'Threat hunter', 'Security architect'],
    ['Developer advocate', 'Technical writer', 'Community programs'],
    ['Supply chain analyst', 'Ops excellence lead', 'Routing strategist'],
    ['Quant risk', 'Treasury systems', 'Compliance automation'],
    ['Clinical informatics', 'Regulatory affairs', 'Lab data engineer'],
    ['Grid systems modeller', 'ESG data analyst', 'Controls engineer'],
    ['Realtime graphics engineer', 'Narrative systems designer', 'Tools programmer'],
    ['People analytics', 'L&D curator', 'Org design partner'],
    ['Privacy counsel', 'Policy PM', 'Trust & safety analyst']
  ],
  en: [
    ['Platform engineer', 'SRE', 'Runtime performance analyst'],
    ['Analytics engineer', 'Applied scientist', 'Experimentation lead'],
    ['Product manager', 'UX researcher', 'Service designer'],
    ['AppSec engineer', 'Threat hunter', 'Security architect'],
    ['Developer advocate', 'Technical writer', 'Community programs'],
    ['Supply chain analyst', 'Ops excellence lead', 'Routing strategist'],
    ['Quant risk', 'Treasury systems', 'Compliance automation'],
    ['Clinical informatics', 'Regulatory affairs', 'Lab data engineer'],
    ['Grid systems modeller', 'ESG data analyst', 'Controls engineer'],
    ['Realtime graphics engineer', 'Narrative systems designer', 'Tools programmer'],
    ['People analytics', 'L&D curator', 'Org design partner'],
    ['Privacy counsel', 'Policy PM', 'Trust & safety analyst']
  ],
  es: [
    ['Ingeniero de plataforma', 'SRE', 'Analista de rendimiento'],
    ['Ingeniero de analítica', 'Científico aplicado', 'Líder de experimentación'],
    ['PM de producto', 'Investigador UX', 'Diseñador de servicios'],
    ['Ingeniero AppSec', 'Cazador de amenazas', 'Arquitecto de seguridad'],
    ['Developer advocate', 'Redactor técnico', 'Programas de comunidad'],
    ['Analista de cadena de suministro', 'Líder de excelencia operativa', 'Estratega de rutas'],
    ['Riesgo cuantitativo', 'Tesorería', 'Automatización de cumplimiento'],
    ['Informática clínica', 'Asuntos regulatorios', 'Ingeniero de datos de laboratorio'],
    ['Modelador de redes', 'Analista ESG', 'Ingeniero de control'],
    ['Ingeniero gráfico', 'Diseñador de sistemas narrativos', 'Programador de herramientas'],
    ['People analytics', 'Curador L&D', 'Diseño organizacional'],
    ['Asesor de privacidad', 'PM de políticas', 'Analista de confianza y seguridad']
  ],
  ru: [
    ['Platform engineer', 'SRE', 'Аналитик производительности'],
    ['Analytics engineer', 'Applied scientist', 'Лид экспериментов'],
    ['Product manager', 'UX-исследователь', 'Сервис-дизайнер'],
    ['AppSec-инженер', 'Threat hunter', 'Архитектор безопасности'],
    ['Developer advocate', 'Техписатель', 'Программы сообществ'],
    ['Аналитик цепочки поставок', 'Лид операционного excellence', 'Стратег маршрутизации'],
    ['Количественный риск', 'Казначейские системы', 'Автоматизация комплаенса'],
    ['Клиническая информатика', 'Регуляторика', 'Инженер лабораторных данных'],
    ['Моделист энергосетей', 'ESG-аналитик', 'Инженер АСУ ТП'],
    ['Графический инженер', 'Нарративные системы', 'Инженер инструментов'],
    ['People analytics', 'Куратор L&D', 'Партнёр по оргдизайну'],
    ['Privacy counsel', 'Policy PM', 'Аналитик доверия и безопасности']
  ]
};

const weights = [];
const niches = [];

for (let s = 0; s < 12; s += 1) {
  for (let k = 0; k < 8; k += 1) {
    const rnd = mulberry32(10007 + s * 7919 + k * 6997);
    const style = STYLES[k];
    const adj = SECTOR_ADJ[s];
    const slice = [];
    for (let t = 0; t < 8; t += 1) {
      const v = 0.55 * style[t] + 0.4 * adj[t] + rnd() * 0.12;
      slice.push(Math.min(65535, Math.max(0, Math.round(v * 1000))));
    }
    for (let t = 8; t < 320; t += 1) {
      slice.push(Math.floor(rnd() * 65536));
    }
    weights.push(...slice);
    const idx = s * 8 + k;
    niches.push({
      id: `niche-${s}-${k}`,
      sector: s,
      style: k,
      label: { uk: SECTOR_NAMES.uk[s], en: SECTOR_NAMES.en[s], es: SECTOR_NAMES.es[s], ru: SECTOR_NAMES.ru[s] },
      styleLabel: { uk: STYLE_NAMES.uk[k], en: STYLE_NAMES.en[k], es: STYLE_NAMES.es[k], ru: STYLE_NAMES.ru[k] },
      examples: {
        uk: ROLES.uk[s],
        en: ROLES.en[s],
        es: ROLES.es[s],
        ru: ROLES.ru[s]
      },
      baseIndex: idx
    });
  }
}

const traitLabels = {
  uk: ['Аналітика й структура', 'Ремесло й деталь', 'Люди й переговори', 'Системи й надійність', 'Новизна й експерименти', 'Стабільність і процес', 'Автономія й власність', 'Темп і напруга'],
  en: ['Analytics & structure', 'Craft & detail', 'People & negotiation', 'Systems & reliability', 'Novelty & experiments', 'Stability & process', 'Autonomy & ownership', 'Tempo & intensity'],
  es: ['Análisis y estructura', 'Oficio y detalle', 'Personas y negociación', 'Sistemas y fiabilidad', 'Novedad y experimentos', 'Estabilidad y proceso', 'Autonomía y ownership', 'Ritmo e intensidad'],
  ru: ['Аналитика и структура', 'Ремесло и деталь', 'Люди и переговоры', 'Системы и надёжность', 'Новизна и эксперименты', 'Стабильность и процесс', 'Автономия и ownership', 'Темп и интенсивность']
};

const body = `/* AUTO-GENERATED by scripts/emit-career-talent-atlas-data.mjs — niche lattice parameters */
window.CAREER_ATLAS_DATA=${JSON.stringify({
  version: 1,
  nicheDim: 320,
  nicheCount: niches.length,
  paramCount: weights.length,
  weights,
  niches,
  traitLabels
})};
`;

fs.writeFileSync(OUT, body, 'utf8');
console.log(`career-talent-atlas-data: ${niches.length} niches, ${weights.length} weights -> ${OUT}`);
