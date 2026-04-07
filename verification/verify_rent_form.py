from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:3000/rent.html")
    page.wait_for_timeout(500)

    # Scroll to the form
    page.evaluate("document.getElementById('rent-form').scrollIntoView()")
    page.wait_for_timeout(500)

    # Fill out the form
    page.locator("#rentName").fill("Test User Playwright")
    page.wait_for_timeout(500)

    page.locator("#rentPhone").fill("+48 000 111 222")
    page.wait_for_timeout(500)

    page.locator("#rentVehicle").select_option("scooter")
    page.wait_for_timeout(500)

    # Take a screenshot before submit
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(500)

    # Submit
    page.get_by_role("button", name="Відправити заявку").click()
    page.wait_for_timeout(2000)

    # Wait for success message (or at least wait enough time)
    # The submission will fail with fetch error because of test env not having internet access or returning 401/200 depending on CORS and mock but UI will show status.

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

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
