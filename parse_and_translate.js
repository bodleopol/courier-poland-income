import fs from 'fs';

const content = fs.readFileSync('src/main.js', 'utf-8');

const startIdx = content.indexOf('const translations = {');
const endIdx = content.indexOf('};\n\n  const categoryIcons');
let block = content.substring(startIdx, endIdx);

const lines = block.split('\n');

const manualTranslations = {
  'Актуальні вакансії': 'Current Vacancies',
  'Усі вакансії': 'All Vacancies',
  'Більше': 'More',
  'Менше': 'Less',
  'Шукати': 'Search',
  'Очистити': 'Clear',
  'Так': 'Yes',
  'Ні': 'No',
  // ... let's see what is missing
};

// ... we will use translate-cli
