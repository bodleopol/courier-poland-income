import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to localhost:3000")

    errors = []

    page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}"))
    page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))

    page.goto('http://localhost:3000')
    page.wait_for_timeout(2000)

    print("All Console Logs:")
    for err in errors:
        print(err)

    browser.close()
