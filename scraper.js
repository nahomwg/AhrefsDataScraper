const fs = require("fs");
const path = require("path");
const { connect } = require("puppeteer-real-browser");
const { scrapeDomain } = require("./scraper/ahrefsScraper");

(async () => {
  const inputPath = path.resolve(__dirname, "./input.json");
  const outputPath = path.resolve(__dirname, "./results.json");

  const inputData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const results = [];

  const { browser, page } = await connect({
    headless: false,
    turnstile: true,
    plugins: [require("puppeteer-extra-plugin-stealth")()],
  });

  for (const { domain } of inputData) {
    try {
      const result = await scrapeDomain(page, domain);
      results.push(result);
    } catch (err) {
      console.error(`Error scraping ${domain}:`, err.message);
      results.push({ domain, error: err.message });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log("Results saved to results.json");

  await browser.close();
})();
