const { parseNumber, parsePercentage, getTextContent } = require("../utils/helper");

async function scrapeDomain(page, domain) {
  console.log(`Scraping: ${domain}`);

  // Navigate to Ahrefs Backlink Checker
  await page.goto("https://ahrefs.com/backlink-checker", {
    waitUntil: "load",
    timeout: 60000,
  });

  const inputSelector = 'input[placeholder="Enter domain or URL"]';
  await page.waitForSelector(inputSelector, { visible: true });

  // Type the domain into the input box and press Enter
  await page.type(inputSelector, domain, { delay: 100 });
  await new Promise((res) => setTimeout(res, 500));
  await page.keyboard.press("Enter");

  console.log("Waiting for modal/results to appear...");
  await new Promise((res) => setTimeout(res, 15000));

  // Wait for the modal content to appear (Domain Rating element)
  try {
    await page.waitForSelector("span.css-vemh4e", { timeout: 30000 });
  } catch (error) {
    console.warn(`Could not find metrics for ${domain}`);
    return { domain, error: "Metrics not found or CAPTCHA not passed" };
  }

  // Get all the metric values using context-aware selectors
  const getMetricValues = async () => {
    try {
      // Find the parent containers that contain the labels to ensure we get the right values
      const metrics = await page.evaluate(() => {
        const results = {
          backlinks: "",
          linking_websites: "",
          backlinks_dofollow: "",
          linking_websites_dofollow: "",
        };

        // All metric blocks live inside these parent divs
        // Find all sections that contain metrics
        const sections = document.querySelectorAll(".css-2qi252");

        sections.forEach((section) => {
          // Check if this section contains "Backlinks" label
          const backlinksLabel = section.querySelector(
            'div[class*="css-1uq6mu9"]'
          );
          if (
            backlinksLabel &&
            backlinksLabel.textContent.trim() === "Backlinks"
          ) {
            // Get the value span and dofollow paragraph
            const valueSpan = section.querySelector("span.css-6s0ffe");
            const dofollowP = section.querySelector("p.css-uoqnqe");

            if (valueSpan) results.backlinks = valueSpan.textContent.trim();
            if (dofollowP)
              results.backlinks_dofollow = dofollowP.textContent.trim();
          }

          // Check if this section contains "Linking websites" label
          if (
            backlinksLabel &&
            backlinksLabel.textContent.trim() === "Linking websites"
          ) {
            // Get the value span and dofollow paragraph
            const valueSpan = section.querySelector("span.css-6s0ffe");
            const dofollowP = section.querySelector("p.css-uoqnqe");

            if (valueSpan)
              results.linking_websites = valueSpan.textContent.trim();
            if (dofollowP)
              results.linking_websites_dofollow = dofollowP.textContent.trim();
          }
        });

        return results;
      });

      return metrics;
    } catch (error) {
      console.error("Error getting metric values:", error);
      return {
        backlinks: "",
        linking_websites: "",
        backlinks_dofollow: "",
        linking_websites_dofollow: "",
      };
    }
  };

  // Collect metrics from page
  const metrics = await getMetricValues();

  // Build final result object with parsing helpers
  const result = {
    domain,
    domain_rating: parseNumber(await getTextContent(page, "span.css-vemh4e")),
    backlinks: parseNumber(metrics.backlinks),
    linking_websites: parseNumber(metrics.linking_websites),
    backlinks_dofollow_percentage: parsePercentage(metrics.backlinks_dofollow),
    linking_websites_dofollow_percentage: parsePercentage(
      metrics.linking_websites_dofollow
    ),
  };

  console.log("Extracted metrics:", {
    domain,
    raw_backlinks: metrics.backlinks,
    raw_linking_websites: metrics.linking_websites,
    raw_backlinks_dofollow: metrics.backlinks_dofollow,
    raw_linking_websites_dofollow: metrics.linking_websites_dofollow,
    parsed: result,
  });

  // Close modal for the next domain scrape
  try {
    const closeSelector = "button.css-190195q-closeButton";
    await page.waitForSelector(closeSelector, {
      visible: true,
      timeout: 10000,
    });
    await page.click(closeSelector);
    await new Promise((res) => setTimeout(res, 1000));
    console.log("Modal closed.");
  } catch {
    console.warn("Couldn't close modal.");
  }

  console.log(`Done: ${domain}`);
  return result;
}

module.exports = { scrapeDomain };
