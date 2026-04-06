import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000/index.html')

    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    jobs_children = page.locator('#latestJobs > *')
    print(f"Latest jobs children found: {jobs_children.count()}")

    if jobs_children.count() > 0:
        print(f"First child innerHTML: {jobs_children.nth(0).inner_html()}")

    browser.close()
