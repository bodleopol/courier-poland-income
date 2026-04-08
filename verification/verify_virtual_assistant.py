from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(500)

    # Open Virtual Assistant
    page.get_by_role("button", name="Open Virtual Assistant").click()
    page.wait_for_timeout(500)

    # User intro message
    page.get_by_placeholder("Напишіть повідомлення...").fill("Мене звати Богдан")
    page.get_by_role("button", name="Send").click()
    page.wait_for_timeout(1000)

    # Help message
    page.get_by_placeholder("Напишіть повідомлення...").fill("Потрібна допомога")
    page.get_by_role("button", name="Send").click()
    page.wait_for_timeout(1000)

    # Main menu selection
    page.get_by_placeholder("Напишіть повідомлення...").fill("1")
    page.get_by_role("button", name="Send").click()
    page.wait_for_timeout(1000)

    # Direct keyword
    page.get_by_placeholder("Напишіть повідомлення...").fill("Де знайти оренда?")
    page.get_by_role("button", name="Send").click()
    page.wait_for_timeout(1000)

    # Fallback message
    page.get_by_placeholder("Напишіть повідомлення...").fill("Щось незрозуміле")
    page.get_by_role("button", name="Send").click()
    page.wait_for_timeout(1000)

    # Wait for the last message to appear
    page.wait_for_timeout(2000)

    # Take screenshot at the key moment
    page.wait_for_timeout(2000)
    # The sandbox timeout issue makes playwright screenshotting flaky, skip screenshot and rely on video.
    # page.screenshot(path="/home/jules/verification/screenshots/verification.png", animations="disabled")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        # Avoid headless mode layout issues by explicitly providing viewport size
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()