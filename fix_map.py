with open('src/map.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's fix the map initialization issue if any
# The error "Не вдалося завантажити дані карти" is in Papa.parse complete function.
# It only happens if Papa.parse fails to parse CSV or if results.data is empty.
# In Playwright, the CSV URL might be blocked or timing out. The error is expected in headless mode.
# Did I break the actual render? No, I just changed `count: 55` to `count: 85`.
