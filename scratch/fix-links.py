import os
import re

src_dir = 'src'
html_files = [f for f in os.listdir(src_dir) if f.endswith('.html')]

def fix_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    lang = 'ua'
    if filepath.endswith('-pl.html'): lang = 'pl'
    elif filepath.endswith('-ru.html'): lang = 'ru'

    if lang == 'ua': return

    def repl_href(m):
        quote = m.group(1)
        url = m.group(2)

        # e.g. /vacancies.html?city=warsaw
        match = re.match(r'^(/[\w\-]+)\.html([?#].*)?$', url)
        if match:
            base = match.group(1)
            rest = match.group(2) or ''

            # remove existing lang suffix if any
            base = re.sub(r'-(ru|pl|ua)$', '', base)
            return f'href={quote}{base}-{lang}.html{rest}{quote}'

        return m.group(0)

    new_html = re.sub(r'href=(["\'])(.*?)\1', repl_href, html)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)

for f in html_files:
    fix_links(os.path.join(src_dir, f))
print('Links fixed')
