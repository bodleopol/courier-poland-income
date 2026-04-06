from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Open a sample vacancy
        page.goto("http://localhost:3000/poznan-retail-doradca-klienta-263.html")

        # Take a screenshot to verify button styling
        page.screenshot(path="verification/screenshots/vacancy_cta_button.png", full_page=True)

        browser.close()

verify()
