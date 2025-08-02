const { connect } = require("puppeteer-real-browser");

async function testAhrefs() {
  const { browser, page } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
    plugins: [require("puppeteer-extra-plugin-stealth")()],
  });

  console.log("🚀 Navigating to Ahrefs...");
  await page.goto("https://ahrefs.com/backlink-checker", {
    waitUntil: "load", // ensure the page is fully loaded
    timeout: 60000,
  });

  // Step 1: Wait for input field
  const inputSelector = 'input[placeholder="Enter domain or URL"]';
  await page.waitForSelector(inputSelector, { visible: true });

  // Step 2: Type the domain
  await page.type(inputSelector, "notion.so", { delay: 120 });

  // Step 3: Press Enter (instead of clicking the button)
  await new Promise((resolve) => setTimeout(resolve, 500)); // tiny delay
  await page.keyboard.press("Enter");
  console.log("⌨️ Pressed Enter to submit");

  // Step 4: Wait for CAPTCHA or result
  await new Promise((resolve) => setTimeout(resolve, 15000)); // wait for CAPTCHA to trigger

  // Screenshot for visual inspection
  await page.screenshot({ path: "ahrefs-after-enter.png", fullPage: true });
  console.log("✅ Screenshot saved as ahrefs-after-enter.png");

  // Keep browser open for manual inspection
  // await browser.close();
}

testAhrefs();
