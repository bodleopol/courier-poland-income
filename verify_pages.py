from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/about.html")
    page.wait_for_timeout(2000)

    # Take screenshot at the key moment
    page.screenshot(path="verification/screenshots/about.png")
    page.wait_for_timeout(1000)

    page.goto("http://localhost:3000/company.html")
    page.wait_for_timeout(2000)

    # Take screenshot at the key moment
    page.screenshot(path="verification/screenshots/company.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()