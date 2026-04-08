/**
 * Wealth Ladder base figures (USD) representing the 6 levels.
 * Source: "Of Dollars and Data" – Wealth Ladder concept.
 */
export const BASE_WEALTH_LEVELS = {
  1: { name: "Paycheck Wealth", amount: 0 },
  2: { name: "Grocery prices matter less", amount: 10_000 },
  3: { name: "Restaurant prices matter less", amount: 100_000 },
  4: { name: "Vacation prices matter less", amount: 1_000_000 },
  5: { name: "Home prices matter less", amount: 10_000_000 },
  6: { name: "What are prices?", amount: 100_000_000 },
} as const;

export type WealthLevel = keyof typeof BASE_WEALTH_LEVELS;

/**
 * Scales a US base wealth amount to a target location using COLI/PPP.
 * Formula: W_L = W_US × (COLI_L / COLI_US)
 */
export function scaleWealth(
  baseAmount: number,
  locationCOLI: number,
  usCOLI: number = 100
): number {
  if (usCOLI === 0) throw new Error("US COLI cannot be zero");
  return baseAmount * (locationCOLI / usCOLI);
}

/**
 * Returns the wealth level (1–6) for a given net worth in a location.
 */
export function getWealthLevel(
  netWorth: number,
  scaledLevels: Record<WealthLevel, number>
): WealthLevel {
  const levels = [6, 5, 4, 3, 2, 1] as WealthLevel[];
  for (const level of levels) {
    if (netWorth >= scaledLevels[level]) return level;
  }
  return 1;
}
