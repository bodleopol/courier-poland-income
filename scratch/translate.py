import os
import json
import re
import glob

with open('translations.json', 'r', encoding='utf-8') as f:
    translations = json.load(f)

src_dir = 'src'
html_files = glob.glob(os.path.join(src_dir, '*.html'))

base_files = [f for f in html_files if not f.endswith('-ru.html') and not f.endswith('-pl.html') and not f.endswith('-ua.html') and not f.endswith('-en.html') and not os.path.basename(f) == 'article-template.html']

def rewrite_links(html_str, lang):
    if lang == 'ua':
        return html_str

    def repl_href(m):
        quote = m.group(1)
        url = m.group(2)

        # Match something like /vacancies.html or /vacancies.html?city=warsaw
        match = re.match(r'^(/[\w\-]+)\.html([?#].*)?$', url)
        if match:
            base = match.group(1)
            rest = match.group(2) or ''
            base = re.sub(r'-(ru|pl|ua|en)$', '', base)
            return f'href={quote}{base}-{lang}.html{rest}{quote}'

        if url == '/':
            return f'href={quote}/index-{lang}.html{quote}'

        return m.group(0)

    html_str = re.sub(r'href=(["\'])(.*?)\1', repl_href, html_str)

    # Rewrite the language switcher
    lang_links = f'''<div class="header-lang">
          <a href="/index.html" class="lang-btn">UA</a>
          <a href="/index-pl.html" class="lang-btn">PL</a>
          <a href="/index-ru.html" class="lang-btn">RU</a>
          <a href="/index-en.html" class="lang-btn">EN</a>
        </div>'''

    html_str = re.sub(r'<div class="header-lang">.*?</div>', lang_links, html_str, flags=re.DOTALL)

    lang_links_mobile = f'''<div class="mobile-lang">
        <a href="/index.html" class="lang-btn">UA</a>
        <a href="/index-pl.html" class="lang-btn">PL</a>
        <a href="/index-ru.html" class="lang-btn">RU</a>
        <a href="/index-en.html" class="lang-btn">EN</a>
      </div>'''
    html_str = re.sub(r'<div class="mobile-lang">.*?</div>', lang_links_mobile, html_str, flags=re.DOTALL)

    return html_str

def process_html(filepath, lang):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Apply links rewrite
    html = rewrite_links(html, lang)

    # Replace texts
    def repl_text(m):
        full_tag = m.group(1)
        key = m.group(2)
        content = m.group(3)
        close_tag = m.group(4)

        t = translations.get(key, {})
        text = t.get(lang, t.get('ua', key))
        if not isinstance(text, str):
            text = str(text)

        # Remove data-i18n attributes
        clean_tag = re.sub(r'\s*data-i18n="[^"]+"', '', full_tag)

        return f"{clean_tag}{text}{close_tag}"

    # Match <tag data-i18n="key">content</tag>
    html = re.sub(r'(<[^>]*?data-i18n="([^"]+)"[^>]*>)(.*?)(</[a-zA-Z0-9]+>)', repl_text, html, flags=re.DOTALL)

    # Replace placeholders
    def repl_placeholder(m):
        full_tag = m.group(1)
        key = m.group(2)

        t = translations.get(key, {})
        text = t.get(lang, t.get('ua', key))
        if not isinstance(text, str):
            text = str(text)

        # Replace placeholder="..."
        if 'placeholder="' in full_tag:
            clean_tag = re.sub(r'placeholder="[^"]*"', f'placeholder="{text}"', full_tag)
        else:
            clean_tag = full_tag.replace('>', f' placeholder="{text}">')

        # Remove data-i18n attributes
        clean_tag = re.sub(r'\s*data-i18n="[^"]+"', '', clean_tag)
        clean_tag = re.sub(r'\s*data-i18n-attr="[^"]+"', '', clean_tag)

        return clean_tag

    html = re.sub(r'(<[^>]*?data-i18n="([^"]+)"[^>]*?data-i18n-attr="placeholder"[^>]*>)', repl_placeholder, html)
    html = re.sub(r'(<[^>]*?data-i18n-attr="placeholder"[^>]*?data-i18n="([^"]+)"[^>]*>)', repl_placeholder, html)

    # Cleanup any remaining data-i18n attributes
    html = re.sub(r'\s*data-i18n="[^"]+"', '', html)
    html = re.sub(r'\s*data-i18n-attr="[^"]+"', '', html)

    return html

for base_file in base_files:
    print(f"Processing {base_file}...")

    en_html = process_html(base_file, 'en')
    pl_html = process_html(base_file, 'pl')
    ru_html = process_html(base_file, 'ru')
    ua_html = process_html(base_file, 'ua')

    base_name = os.path.basename(base_file).replace('.html', '')

    with open(os.path.join(src_dir, f'{base_name}-en.html'), 'w', encoding='utf-8') as f:
        f.write(en_html)
    with open(os.path.join(src_dir, f'{base_name}-pl.html'), 'w', encoding='utf-8') as f:
        f.write(pl_html)
    with open(os.path.join(src_dir, f'{base_name}-ru.html'), 'w', encoding='utf-8') as f:
        f.write(ru_html)
    with open(base_file, 'w', encoding='utf-8') as f:
        f.write(ua_html)

print("Done generating language specific pages.")
