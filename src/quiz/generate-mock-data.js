import fs from 'fs';
import path from 'path';

// Define core industries with translations
const industries = [
  { id: 'construction', ua: 'Будівництво', pl: 'Budownictwo', ru: 'Строительство', en: 'Construction' },
  { id: 'logistics', ua: 'Логістика і Транспорт', pl: 'Logistyka i Transport', ru: 'Логистика и Транспорт', en: 'Logistics and Transport' },
  { id: 'medical', ua: 'Медицина і Догляд', pl: 'Medycyna i Opieka', ru: 'Медицина и Уход', en: 'Medicine and Care' },
  { id: 'it', ua: 'IT і Програмування', pl: 'IT i Programowanie', ru: 'IT и Программирование', en: 'IT and Programming' },
  { id: 'agriculture', ua: 'Сільське господарство', pl: 'Rolnictwo', ru: 'Сельское хозяйство', en: 'Agriculture' },
  { id: 'horeca', ua: 'Сфера обслуговування (HoReCa)', pl: 'Gastronomia i Hotelarstwo (HoReCa)', ru: 'Сфера обслуживания (HoReCa)', en: 'Hospitality (HoReCa)' },
  { id: 'manufacturing', ua: 'Виробництво', pl: 'Produkcja', ru: 'Производство', en: 'Manufacturing' },
  { id: 'retail', ua: 'Торгівля', pl: 'Handel', ru: 'Торговля', en: 'Retail' },
  { id: 'education', ua: 'Освіта', pl: 'Edukacja', ru: 'Образование', en: 'Education' }
];

// Multilingual word pools to simulate parameters for candidate assessment
const pools = {
  ua: {
    w1: ["безпеки", "якості", "швидкості", "продуктивності", "ефективності", "надійності"],
    w2: ["процесів", "завдань", "операцій", "проєктів", "систем", "комунікацій"],
    w3: ["критичних ситуаціях", "стандартних умовах", "командній роботі", "самостійному виконанні", "стресових умовах"],
    actions: ["Оптимізувати", "Проаналізувати", "Делегувати", "Проігнорувати", "Ескалювати"]
  },
  pl: {
    w1: ["bezpieczeństwa", "jakości", "szybkości", "wydajności", "efektywności", "niezawodności"],
    w2: ["procesów", "zadań", "operacji", "projektów", "systemów", "komunikacji"],
    w3: ["sytuacjach krytycznych", "warunkach standardowych", "pracy zespołowej", "samodzielnym wykonaniu", "warunkach stresowych"],
    actions: ["Zoptymalizować", "Przeanalizować", "Delegować", "Zignorować", "Eskalować"]
  },
  ru: {
    w1: ["безопасности", "качества", "скорости", "производительности", "эффективности", "надежности"],
    w2: ["процессов", "задач", "операций", "проектов", "систем", "коммуникаций"],
    w3: ["критических ситуациях", "стандартных условиях", "командной работе", "самостоятельном выполнении", "стрессовых условиях"],
    actions: ["Оптимизировать", "Проанализировать", "Делегировать", "Проигнорировать", "Эскалировать"]
  },
  en: {
    w1: ["security", "quality", "speed", "productivity", "efficiency", "reliability"],
    w2: ["processes", "tasks", "operations", "projects", "systems", "communications"],
    w3: ["critical situations", "standard conditions", "teamwork", "independent execution", "stressful conditions"],
    actions: ["Optimize", "Analyze", "Delegate", "Ignore", "Escalate"]
  }
};

const templates = [
  {
    ua: "Як ви забезпечуєте високий рівень {w1} {w2} в {w3}?",
    pl: "Jak zapewniasz wysoki poziom {w1} {w2} w {w3}?",
    ru: "Как вы обеспечиваете высокий уровень {w1} {w2} в {w3}?",
    en: "How do you ensure a high level of {w1} in {w2} during {w3}?"
  },
  {
    ua: "Яка ваша перша дія при виявленні порушення {w1} {w2}?",
    pl: "Jakie jest twoje pierwsze działanie po wykryciu naruszenia {w1} {w2}?",
    ru: "Каково ваше первое действие при обнаружении нарушения {w1} {w2}?",
    en: "What is your first action upon detecting a violation of {w1} in {w2}?"
  },
  {
    ua: "Який підхід найкраще підходить для покращення {w1} при {w3}?",
    pl: "Jakie podejście jest najlepsze do poprawy {w1} w {w3}?",
    ru: "Какой подход лучше всего подходит для улучшения {w1} при {w3}?",
    en: "What approach is best suited for improving {w1} during {w3}?"
  }
];

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function generateQuestionSet(industry, templateIndex, paramIndices) {
  const tpl = templates[templateIndex];
  const { i1, i2, i3, a1, a2, a3, a4 } = paramIndices;

  const q = { industry_id: industry.id };

  // Set industry names
  q.industry_ua = industry.ua;
  q.industry_pl = industry.pl;
  q.industry_ru = industry.ru;
  q.industry_en = industry.en;

  const langs = ['ua', 'pl', 'ru', 'en'];

  langs.forEach(lang => {
    const p = pools[lang];
    const text = tpl[lang]
      .replace('{w1}', p.w1[i1])
      .replace('{w2}', p.w2[i2])
      .replace('{w3}', p.w3[i3]);

    q[`question_${lang}`] = text;

    // Generate options based on actions
    q[`option_a_${lang}`] = `${p.actions[a1]} (${p.w2[i2]})`;
    q[`option_b_${lang}`] = `${p.actions[a2]} (${p.w2[i2]})`;
    q[`option_c_${lang}`] = `${p.actions[a3]} (${p.w2[i2]})`;
    q[`option_d_${lang}`] = `${p.actions[a4]} (${p.w2[i2]})`;
  });

  // Randomize correct option
  const optionsArray = ['A', 'B', 'C', 'D'];
  q.correct_option = optionsArray[getRandomIndex(4)];

  return q;
}

const allQuestions = [];
const totalQuestionsNeeded = 10000;

for (let i = 0; i < totalQuestionsNeeded; i++) {
  const industry = industries[i % industries.length];
  const templateIndex = i % templates.length;

  // Generate consistent random indices for this question across all languages
  const paramIndices = {
    i1: getRandomIndex(pools.ua.w1.length),
    i2: getRandomIndex(pools.ua.w2.length),
    i3: getRandomIndex(pools.ua.w3.length),
    a1: getRandomIndex(pools.ua.actions.length),
    a2: getRandomIndex(pools.ua.actions.length),
    a3: getRandomIndex(pools.ua.actions.length),
    a4: getRandomIndex(pools.ua.actions.length)
  };

  const q = generateQuestionSet(industry, templateIndex, paramIndices);
  allQuestions.push(q);
}

const outputPath = path.join(process.cwd(), 'src', 'quiz-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf8');

console.log(`✅ Generated ${allQuestions.length} multilingual candidate assessment questions.`);
console.log(`✅ Output saved to ${outputPath}`);
