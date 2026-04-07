from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)

    # Check for AdSense meta tag and script tag on index.html
    page.screenshot(path="verification/screenshots/index.png")

    # Go to vacancies
    page.goto("http://localhost:3000/vacancies.html")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/vacancies.png")

    # Go to a vacancy
    page.goto("http://localhost:3000/gdansk-logistics-kierowca-ci-gnika-siodlowego-18.html")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/vacancy.png")

    # Check Ads.txt
    page.goto("http://localhost:3000/Ads.txt")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/ads_txt.png")

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
            context.close()  # MUST close context to save the video
            browser.close()
