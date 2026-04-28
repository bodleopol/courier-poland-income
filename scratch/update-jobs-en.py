with open('src/jobs.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("function isRuPage() {\n    return window.location.pathname.endsWith('-ru.html');\n  }", "function isRuPage() {\n    return window.location.pathname.endsWith('-ru.html');\n  }\n  function isEnPage() {\n    return window.location.pathname.endsWith('-en.html');\n  }")

js = js.replace("if (lang === 'pl') return item[`${base}_pl`] || item[base] || '';\n    if (lang === 'ru') return item[`${base}_ru`] || item[base] || '';", "if (lang === 'pl') return item[`${base}_pl`] || item[base] || '';\n    if (lang === 'ru') return item[`${base}_ru`] || item[base] || '';\n    if (lang === 'en') return item[`${base}_en`] || item[base] || '';")

js = js.replace("if (isRuPage()) return '/vacancies-ru.html';", "if (isRuPage()) return '/vacancies-ru.html';\n    if (isEnPage()) return '/vacancies-en.html';")

js = js.replace("if (isRuPage()) return `/${slug}-ru.html`;", "if (isRuPage()) return `/${slug}-ru.html`;\n    if (isEnPage()) return `/${slug}-en.html`;")

js = js.replace("if (base.endsWith('-ru')) return base.slice(0, -3);", "if (base.endsWith('-ru')) return base.slice(0, -3);\n      if (base.endsWith('-en')) return base.slice(0, -3);")

js = js.replace("if (lang === 'ru') {\n      if (score >= 80) return 'Стабильная и безопасная вакансия по отзывам.';\n      if (score >= 60) return 'Условия в целом хорошие, но стоит уточнить детали.';\n      return 'Повышенный риск — проверьте условия перед стартом.';\n    }", "if (lang === 'ru') {\n      if (score >= 80) return 'Стабильная и безопасная вакансия по отзывам.';\n      if (score >= 60) return 'Условия в целом хорошие, но стоит уточнить детали.';\n      return 'Повышенный риск — проверьте условия перед стартом.';\n    }\n    if (lang === 'en') {\n      if (score >= 80) return 'Stable and safe vacancy according to reviews.';\n      if (score >= 60) return 'Conditions are generally OK, but worth clarifying details.';\n      return 'Increased risk — check conditions before starting.';\n    }")

js = js.replace("const lang = isPlPage() ? 'pl' : (isRuPage() ? 'ru' : 'ua');", "const lang = isPlPage() ? 'pl' : (isRuPage() ? 'ru' : (isEnPage() ? 'en' : 'ua'));")

with open('src/jobs.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('jobs.js updated for EN')
