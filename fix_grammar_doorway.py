import re
import os

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Safely remove redundant phrases that look like AI doorways
    content = re.sub(r'Відмінна можливість для українців в Польщі! ', '', content)
    content = re.sub(r'Шукаєте роботу в Європі\? ', '', content)

    # Some very safe grammar fixes
    # Use word boundaries
    content = re.sub(r'\bприймати участь\b', 'брати участь', content)
    content = re.sub(r'\bПриймати участь\b', 'Брати участь', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Fixed grammar in {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.html', '.json', '.js', '.md')):
            clean_file(os.path.join(root, file))
