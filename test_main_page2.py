import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000/index.html')

    # Wait for the network AND wait for at least one div in latestJobs or a timeout
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    categories = page.locator('#categoryGrid > a')
    print(f"Categories found: {categories.count()}")

    jobs = page.locator('#latestJobs > div')
    print(f"Latest jobs found: {jobs.count()}")

    browser.close()
