/**
 * API clients for external data sources.
 * World Bank API (global PPP) + St. Louis Fed FRED API (US state data).
 */

export interface PPPData {
  countryCode: string;
  countryName: string;
  year: number;
  pppValue: number;
}

export interface FREDData {
  stateCode: string;
  stateName: string;
  coliValue: number;
}

/**
 * Fetches PPP conversion factors from the World Bank API.
 * Indicator: PA.NUS.PPP
 * TODO: Implement full fetch with caching and local CSV fallback.
 */
export async function fetchWorldBankPPP(
  countryCode: string,
  year?: number
): Promise<PPPData | null> {
  // TODO: implement
  // Endpoint: https://api.worldbank.org/v2/country/{code}/indicator/PA.NUS.PPP?format=json
  return null;
}

/**
 * Fetches regional cost-of-living / price parity data from FRED.
 * Series: RPPSTATE (Regional Price Parities by State)
 * TODO: Implement full fetch with caching and local CSV fallback.
 */
export async function fetchFREDData(
  stateCode: string
): Promise<FREDData | null> {
  // TODO: implement
  // Endpoint: https://api.stlouisfed.org/fred/series/observations
  return null;
}
