const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');
code = code.replace(
`window.getLang = function() {
  let lang = localStorage.getItem('rybezh_lang');
  if (!lang) {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('uk')) lang = 'ua';
    else if (userLang.startsWith('pl')) lang = 'pl';
    else if (userLang.startsWith('ru')) lang = 'ru';
    else lang = 'en';
    localStorage.setItem('rybezh_lang', lang);
  }
  return lang;
};`,
`window.getLang = function() {
  let lang = localStorage.getItem('rybezh_lang');
  if (!lang) {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('uk')) lang = 'ua';
    else if (userLang.startsWith('pl')) lang = 'pl';
    else if (userLang.startsWith('ru')) lang = 'ru';
    else lang = 'ua';
    localStorage.setItem('rybezh_lang', lang);
  }
  if (!['ua', 'pl', 'ru', 'en'].includes(lang)) {
    lang = 'ua';
  }
  return lang;
};`
);
fs.writeFileSync('src/main.js', code);
