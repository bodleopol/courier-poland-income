from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to english site directly
    page.goto("http://localhost:3000/index-en.html")
    page.wait_for_timeout(1000)

    # Check for English translated text
    page.wait_for_selector("text=Find a job in Poland", state="visible", timeout=2000)

    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
