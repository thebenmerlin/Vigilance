const { chromium } = require('playwright');
const path = require('path');

async function verifyFeature(page) {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000); // Wait for initial render

    // Take screenshot of default layout
    await page.screenshot({ path: '/app/verification/default-layout.png' });

    // Drag the "Active Alerts" stats card from top left to bottom right (rough estimate of coords)
    // We target the drag handle specifically
    const dragHandle = page.locator('.drag-handle').first();
    const box = await dragHandle.boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(800, 800, { steps: 10 }); // Move it to the bottom right
        await page.mouse.up();
    }


    await page.waitForTimeout(1000); // Wait for animation

    // Take screenshot of new layout
    await page.screenshot({ path: '/app/verification/dragged-layout.png' });
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
