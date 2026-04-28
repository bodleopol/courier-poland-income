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
    if (p.endsWith('-en.html')) return 'en';
    return 'ua';
  }
"""

js = re.sub(r"const STORAGE_KEY = 'site_lang';[\s\S]*?function getLang\(\) \{[\s\S]*?\}", new_lang_logic, js)

# Remove everything between getLang and initCookieBanner
js = re.sub(r'function toUaPath\([\s\S]*?function initCookieBanner', 'function initCookieBanner', js)

js = re.sub(r'if \(!window\.USE_INLINE_I18N\) \{\s*initI18n\(\);\s*\}', '', js)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('main.js cleaned again!')
