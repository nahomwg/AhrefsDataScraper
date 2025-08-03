# Ahrefs Backlink Checker Scraper

## 🛠️ Installation

### 1. Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/nahomwg/AhrefsDataScraper.git
cd AhrefsDataScraper
```
### 2.Install the required dependencies:
```
npm install
```
#### This project uses:

##### -puppeteer-real-browser

##### -puppeteer-extra-plugin-stealth

## ▶️ Running the Script
```
node scraper.js
```
## 🧠 Approach & Design Decisions
Automation Framework: Used puppeteer-real-browser to simulate a real user browser with stealth capabilities.

CAPTCHA Handling: Instead of using a CAPTCHA-solving service, we used browser fingerprinting evasion (puppeteer-extra-plugin-stealth) and human-like interaction to trigger and solve Cloudflare Turnstile manually.

Scraping Logic: Metrics are extracted contextually by matching labels (e.g., "Backlinks", "Linking websites") to ensure accurate data collection from a modal-based interface.

Modularity: Code is split into modules (/scraper, /utils, /helper) for clarity and maintainability.

Fallback Handling: If scraping fails (e.g., due to CAPTCHA failure), the script logs an error for that domain and continues.


