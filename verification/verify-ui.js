const { chromium } = require('playwright');
const path = require('path');

async function verifyFeature(page) {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000); // Wait for initial render and data

    // Take screenshot of the dark mode UI with IST times
    await page.screenshot({ path: '/app/verification/dark-ui.png' });
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        recordVideo: { dir: '/app/verification/video' },
        viewport: { width: 1280, height: 1024 }
    });
    const page = await context.newPage();

    try {
        await verifyFeature(page);
    } finally {
        await context.close();
        await browser.close();
    }
}

run();
