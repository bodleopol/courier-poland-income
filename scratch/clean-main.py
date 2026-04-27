import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace translations object
js = re.sub(r'const translations = \{[\s\S]*?\n  \};\n', '', js)

# Replace old getLang with simple one
new_lang_logic = """
  function getLang() {
    const p = window.location.pathname;
    if (p.endsWith('-pl.html')) return 'pl';
    if (p.endsWith('-ru.html')) return 'ru';
    return 'ua';
  }
"""

js = re.sub(r"const STORAGE_KEY = 'site_lang';[\s\S]*?function getLang\(\) \{[\s\S]*?\}", new_lang_logic, js)

# Remove other functions
js = re.sub(r'function applyTranslations\([\s\S]*?\n  \}', '', js)
js = re.sub(r'function isPolishPath\([\s\S]*?\n  \}', '', js)
js = re.sub(r'function isRussianPath\([\s\S]*?\n  \}', '', js)
js = re.sub(r'function updateLangButtons\([\s\S]*?\n  \}', '', js)
js = re.sub(r'function setLang\([\s\S]*?\n  \}', '', js)
js = re.sub(r'function initI18n\([\s\S]*?\n  \}', '', js)

js = re.sub(r'if \(!window\.USE_INLINE_I18N\) \{\s*initI18n\(\);\s*\}', '', js)
js = re.sub(r'window\.applyTranslations = applyTranslations;', '', js)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
