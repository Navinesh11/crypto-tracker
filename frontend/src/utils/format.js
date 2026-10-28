/**
 * utils/format.js — Number / currency formatting helpers
 */

// Format large numbers (1.2B, 345.6M, etc.)
export function formatLargeNumber(num) {
  if (num === null || num === undefined) return "—";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9)  return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6)  return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3)  return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

// Format price with appropriate decimals
export function formatPrice(price) {
  if (price === null || price === undefined) return "—";
  if (price >= 1)    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
}

// Format percentage
export function formatPercent(pct) {
  if (pct === null || pct === undefined) return "—";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

// Return CSS class for positive/negative change
export function changeClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

// Convert Unix timestamp to readable date
export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
