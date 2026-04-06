import fs from 'fs';

let content = fs.readFileSync('src/main.js', 'utf-8');

// Replace the fallback call in getTranslationText
content = content.replace("if (lang === 'en') return toEnglishFallbackText(dict.ua || dict.pl || '');", "if (lang === 'en' && dict.en) return dict.en;");

// Remove the toEnglishFallbackText function block entirely
const startFn = content.indexOf('function toEnglishFallbackText(');
if (startFn !== -1) {
  const endFn = content.indexOf('  function toRussianFallbackText(', startFn);
  if (endFn !== -1) {
    content = content.substring(0, startFn) + content.substring(endFn);
  }
}

fs.writeFileSync('src/main.js', content, 'utf-8');
