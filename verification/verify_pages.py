from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/bogdan-tiutenko.html")
    page.wait_for_timeout(500)

    # Take screenshot at the key moment
    page.screenshot(path="verification/screenshots/verification.png")
    page.wait_for_timeout(1000)  # Hold final state for the video

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