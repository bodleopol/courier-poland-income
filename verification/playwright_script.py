import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Check gallery page
        await page.goto("http://localhost:3000/bogdan-tiutenko.html")

        # Scroll to bottom to ensure image is loaded and visible
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(1) # wait for any lazy loading

        await page.screenshot(path="verification/screenshots/bogdan_gallery_full.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
