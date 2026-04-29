from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        # Visit the Bogdan page
        page.goto('http://localhost:5000/bogdan-tiutenko.html')
        page.wait_for_load_state('networkidle')
        # Take a screenshot
        page.screenshot(path='screenshot.png', full_page=True)
        browser.close()

if __name__ == '__main__':
    run()