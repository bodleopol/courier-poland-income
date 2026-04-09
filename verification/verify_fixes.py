from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/vacancies.html")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/vacancies_page.png")

    # Click on the first job link to open a generated job page
    page.locator(".job-card a").first.click()
    page.wait_for_timeout(1500)

    page.screenshot(path="verification/screenshots/job_page_top.png", full_page=False)

    # Scroll down to see the new H2/H3 structure
    page.mouse.wheel(0, 800)
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/job_page_middle.png", full_page=False)

    # Scroll down to see the Rybezh Proof heading
    page.mouse.wheel(0, 800)
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/job_page_proof.png", full_page=False)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos",
            viewport={'width': 1280, 'height': 900}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
