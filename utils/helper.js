const parseNumber = (text) => {
  if (!text) return 0;
  text = text.trim().toUpperCase();
  if (text.endsWith("K")) return Math.round(parseFloat(text) * 1000);
  if (text.endsWith("M")) return Math.round(parseFloat(text) * 1000000);
  return parseInt(text.replace(/[^\d]/g, "")) || 0;
};

const parsePercentage = (text) => {
  const match = text.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 0;
};
const getText = async (selector) => {
  try {
    return await page.$eval(selector, (el) => el.textContent.trim());
  } catch {
    return "";
  }
};
module.exports = {
  parseNumber,
  parsePercentage,
  getText,
};
