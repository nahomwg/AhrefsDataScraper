const fs = require("fs");
const path = require("path");
const { connect } = require("puppeteer-real-browser");
const { scrapeDomain } = require("./scraper/ahrefsScraper");

(async () => {
  // Set input and output paths
  const inputPath = path.resolve(__dirname, "./input.json");
  const outputPath = path.resolve(__dirname, "./results.json");

  // Read input domains
  const inputData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const results = [];

  // Launch browser with anti-bot features enabled
  const { browser, page } = await connect({
    headless: false,
    turnstile: true, // Enable Turnstile CAPTCHA support
    plugins: [require("puppeteer-extra-plugin-stealth")()],
  });

  // Loop through all domains and scrape them
  for (const { domain } of inputData) {
    try {
      const result = await scrapeDomain(page, domain);
      results.push(result);
    } catch (err) {
      console.error(`Error scraping ${domain}:`, err.message);
      results.push({ domain, error: err.message });
    }
  }

  // Write all results to output file
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log("Results saved to results.json");

  // Close browser
  await browser.close();
})();
