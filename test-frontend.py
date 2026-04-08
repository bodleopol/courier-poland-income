from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('verification/screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Test Ukrainian (default)
    context_ua = browser.new_context()
    page_ua = context_ua.new_page()
    page_ua.goto('http://localhost:3000/quiz.html')
    page_ua.wait_for_selector('.industry-card')
    page_ua.screenshot(path='verification/screenshots/quiz_ua.png')

    # Click an industry to test questions UI
    page_ua.click('.industry-card:first-child')
    page_ua.wait_for_selector('.option-btn')
    page_ua.screenshot(path='verification/screenshots/quiz_question_ua.png')
    context_ua.close()

    # Test English
    context_en = browser.new_context()
    page_en = context_en.new_page()
    page_en.goto('http://localhost:3000/quiz-en.html')
    page_en.wait_for_selector('.industry-card')
    page_en.screenshot(path='verification/screenshots/quiz_en.png')

    # Click an industry to test questions UI
    page_en.click('.industry-card:first-child')
    page_en.wait_for_selector('.option-btn')
    page_en.screenshot(path='verification/screenshots/quiz_question_en.png')
    context_en.close()

    browser.close()

print("Playwright screenshots generated successfully.")
