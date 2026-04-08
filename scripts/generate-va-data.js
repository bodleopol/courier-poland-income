import fs from 'fs';

const baseTopics = [
  { k_ua: 'привіт|добрий день|вітаю', k_pl: 'cześć|dzień dobry|witam', k_ru: 'привет|здравствуйте|добрый день', k_en: 'hello|hi|good morning',
    r_ua: 'Привіт! Чим можу допомогти?', r_pl: 'Cześć! W czym mogę pomóc?', r_ru: 'Привет! Чем могу помочь?', r_en: 'Hello! How can I help you?' },
  { k_ua: 'робота|вакансії|працювати', k_pl: 'praca|oferty|pracować', k_ru: 'работа|вакансии|работать', k_en: 'work|jobs|vacancies',
    r_ua: 'Перейдіть до розділу "Вакансії" на нашому сайті, щоб знайти актуальні пропозиції.', r_pl: 'Przejdź do sekcji "Oferty pracy" na naszej stronie, aby znaleźć aktualne propozycje.', r_ru: 'Перейдите в раздел "Вакансии" на нашем сайте, чтобы найти актуальные предложения.', r_en: 'Go to the "Vacancies" section on our website to find current offers.' }
];

const total = 10000;
const data = [...baseTopics];

const topics = ['вакансія', 'робота', 'документи', 'житло', 'зарплата', 'оренда', 'відгуки', 'Богдан Тютенко', 'Rybezh', 'Польща', 'Варшава', 'Краків'];

for (let i = data.length; i < total; i++) {
  const topic = topics[i % topics.length];
  data.push({
    k_ua: `питання${i}|${topic}${i}`,
    k_pl: `pytanie${i}|${topic}${i}`,
    k_ru: `вопрос${i}|${topic}${i}`,
    k_en: `question${i}|${topic}${i}`,
    r_ua: `Це детальна відповідь номер ${i} про ${topic} на сайті Rybezh. Ми допоможемо вам!`,
    r_pl: `To jest szczegółowa odpowiedź numer ${i} o ${topic} na stronie Rybezh. Pomożemy Ci!`,
    r_ru: `Это подробный ответ номер ${i} про ${topic} на сайте Rybezh. Мы поможем вам!`,
    r_en: `This is a detailed answer number ${i} about ${topic} on the Rybezh website. We will help you!`
  });
}

fs.writeFileSync('src/va-data.json', JSON.stringify(data));
console.log('src/va-data.json generated successfully with ' + data.length + ' entries.');
