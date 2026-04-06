import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 720},
            record_video_dir="/home/jules/verification/videos"
        )
        page = await context.new_page()

        await page.goto('http://localhost:3000/index-en.html', wait_until='networkidle')
        await page.screenshot(path='/home/jules/verification/screenshots/index-en-translated.png')

        await context.close()
        await browser.close()

asyncio.run(run())
