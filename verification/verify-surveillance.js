const { chromium } = require('playwright');

async function verifyFeature(page) {
    // Go to the main dashboard (since login might redirect)
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(2000);

    // Assuming we bypass login or manually navigate to the Surveillance component
    // If there is an RBAC login, we'd need to fill it, but since we are in demo mode,
    // we can just directly visit the surveillance route if the router allows it,
    // or we'll click the Surveillance sidebar link.

    // Let's try navigating to the surveillance page
    await page.goto('http://localhost:5173/surveillance');
    await page.waitForTimeout(4000); // Wait 4s to capture the video loop

    // Take screenshot of surveillance layout
    await page.screenshot({ path: '/app/verification/surveillance-layout.png' });
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