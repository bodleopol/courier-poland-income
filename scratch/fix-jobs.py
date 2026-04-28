with open('src/jobs.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("const lang = localStorage.getItem('site_lang') || 'ua';", "const lang = isPlPage() ? 'pl' : (isRuPage() ? 'ru' : 'ua');")

with open('src/jobs.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('jobs.js updated')
