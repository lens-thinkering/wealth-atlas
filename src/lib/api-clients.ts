/**
 * API clients for external data sources.
 * World Bank API (global PPP) + St. Louis Fed FRED API (US state RPP data).
 * All fetches include local fallback data on error.
 */

export interface PPPData {
  countryCode: string;
  countryName: string;
  year: number;
  /** PPP conversion factor: local currency units per international dollar */
  pppFactor: number;
  /** COLI-equivalent index (US = 100) derived from PPP */
  coliIndex: number;
}

export interface StateRPPData {
  stateCode: string;
  stateName: string;
  /** Regional Price Parity index (US avg = 100) */
  rppIndex: number;
}

// ---------------------------------------------------------------------------
// Fallback data (used when APIs are unavailable)
// Source: World Bank 2022 + BEA Regional Price Parities 2022
// ---------------------------------------------------------------------------

/** US COLI baseline = 100. Other countries relative to this. */
export const FALLBACK_COUNTRY_COLI: Record<string, { name: string; coliIndex: number }> = {
  USA: { name: "United States", coliIndex: 100 },
  GBR: { name: "United Kingdom", coliIndex: 92 },
  DEU: { name: "Germany", coliIndex: 83 },
  FRA: { name: "France", coliIndex: 84 },
  JPN: { name: "Japan", coliIndex: 76 },
  CHN: { name: "China", coliIndex: 41 },
  IND: { name: "India", coliIndex: 23 },
  BRA: { name: "Brazil", coliIndex: 37 },
  CAN: { name: "Canada", coliIndex: 85 },
  AUS: { name: "Australia", coliIndex: 95 },
  CHE: { name: "Switzerland", coliIndex: 131 },
  NOR: { name: "Norway", coliIndex: 125 },
  SGP: { name: "Singapore", coliIndex: 87 },
  MEX: { name: "Mexico", coliIndex: 34 },
  ZAF: { name: "South Africa", coliIndex: 36 },
  NGA: { name: "Nigeria", coliIndex: 22 },
  ARG: { name: "Argentina", coliIndex: 28 },
  KOR: { name: "South Korea", coliIndex: 72 },
  IDN: { name: "Indonesia", coliIndex: 28 },
  SAU: { name: "Saudi Arabia", coliIndex: 54 },
};

/** BEA Regional Price Parities by US State (2022, US avg = 100) */
export const FALLBACK_STATE_RPP: Record<string, { name: string; rppIndex: number }> = {
  AL: { name: "Alabama", rppIndex: 86.8 },
  AK: { name: "Alaska", rppIndex: 103.4 },
  AZ: { name: "Arizona", rppIndex: 96.1 },
  AR: { name: "Arkansas", rppIndex: 85.2 },
  CA: { name: "California", rppIndex: 115.1 },
  CO: { name: "Colorado", rppIndex: 103.2 },
  CT: { name: "Connecticut", rppIndex: 109.3 },
  DE: { name: "Delaware", rppIndex: 101.3 },
  FL: { name: "Florida", rppIndex: 100.8 },
  GA: { name: "Georgia", rppIndex: 91.8 },
  HI: { name: "Hawaii", rppIndex: 118.8 },
  ID: { name: "Idaho", rppIndex: 95.5 },
  IL: { name: "Illinois", rppIndex: 97.5 },
  IN: { name: "Indiana", rppIndex: 89.9 },
  IA: { name: "Iowa", rppIndex: 89.4 },
  KS: { name: "Kansas", rppIndex: 88.4 },
  KY: { name: "Kentucky", rppIndex: 87.1 },
  LA: { name: "Louisiana", rppIndex: 89.4 },
  ME: { name: "Maine", rppIndex: 99.4 },
  MD: { name: "Maryland", rppIndex: 108.1 },
  MA: { name: "Massachusetts", rppIndex: 113.0 },
  MI: { name: "Michigan", rppIndex: 92.3 },
  MN: { name: "Minnesota", rppIndex: 96.0 },
  MS: { name: "Mississippi", rppIndex: 84.4 },
  MO: { name: "Missouri", rppIndex: 88.3 },
  MT: { name: "Montana", rppIndex: 96.2 },
  NE: { name: "Nebraska", rppIndex: 90.5 },
  NV: { name: "Nevada", rppIndex: 99.6 },
  NH: { name: "New Hampshire", rppIndex: 107.1 },
  NJ: { name: "New Jersey", rppIndex: 114.5 },
  NM: { name: "New Mexico", rppIndex: 89.3 },
  NY: { name: "New York", rppIndex: 116.1 },
  NC: { name: "North Carolina", rppIndex: 91.1 },
  ND: { name: "North Dakota", rppIndex: 95.2 },
  OH: { name: "Ohio", rppIndex: 90.1 },
  OK: { name: "Oklahoma", rppIndex: 87.3 },
  OR: { name: "Oregon", rppIndex: 105.3 },
  PA: { name: "Pennsylvania", rppIndex: 97.0 },
  RI: { name: "Rhode Island", rppIndex: 107.8 },
  SC: { name: "South Carolina", rppIndex: 90.6 },
  SD: { name: "South Dakota", rppIndex: 90.5 },
  TN: { name: "Tennessee", rppIndex: 89.0 },
  TX: { name: "Texas", rppIndex: 95.2 },
  UT: { name: "Utah", rppIndex: 99.3 },
  VT: { name: "Vermont", rppIndex: 106.1 },
  VA: { name: "Virginia", rppIndex: 101.9 },
  WA: { name: "Washington", rppIndex: 107.5 },
  WV: { name: "West Virginia", rppIndex: 83.9 },
  WI: { name: "Wisconsin", rppIndex: 92.0 },
  WY: { name: "Wyoming", rppIndex: 93.6 },
  DC: { name: "District of Columbia", rppIndex: 118.2 },
};

// ---------------------------------------------------------------------------
// World Bank API
// ---------------------------------------------------------------------------

/**
 * Fetches PPP data for a country from the World Bank API.
 * Falls back to FALLBACK_COUNTRY_COLI on error.
 */
export async function fetchWorldBankPPP(countryCode: string): Promise<PPPData | null> {
  const fallback = FALLBACK_COUNTRY_COLI[countryCode];

  try {
    const res = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/PA.NUS.PRVT.PP?format=json&mrv=1`,
      { next: { revalidate: 86400 } } // cache 24h
    );

    if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);

    const json = await res.json();
    const record = json?.[1]?.[0];

    if (!record?.value) throw new Error("No PPP value in response");

    // Convert PPP factor to COLI index relative to US (US PPP ≈ 1.0 by definition)
    const usPPP = 1.0;
    const coliIndex = (usPPP / record.value) * 100;

    return {
      countryCode,
      countryName: record.country?.value ?? countryCode,
      year: record.date,
      pppFactor: record.value,
      coliIndex,
    };
  } catch {
    if (!fallback) return null;
    return {
      countryCode,
      countryName: fallback.name,
      year: 2022,
      pppFactor: 0,
      coliIndex: fallback.coliIndex,
    };
  }
}

// ---------------------------------------------------------------------------
// FRED API (BEA Regional Price Parities)
// ---------------------------------------------------------------------------

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

/**
 * Fetches Regional Price Parity for a US state from FRED.
 * Series ID format: RPPSTATE (e.g., RPPCA for California).
 * Falls back to FALLBACK_STATE_RPP on error or missing API key.
 */
export async function fetchFREDData(stateCode: string): Promise<StateRPPData | null> {
  const fallback = FALLBACK_STATE_RPP[stateCode];
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    return fallback
      ? { stateCode, stateName: fallback.name, rppIndex: fallback.rppIndex }
      : null;
  }

  try {
    const seriesId = `RPP${stateCode}`;
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) throw new Error(`FRED API error: ${res.status}`);

    const json = await res.json();
    const value = parseFloat(json?.observations?.[0]?.value);

    if (isNaN(value)) throw new Error("No RPP value in response");

    return {
      stateCode,
      stateName: fallback?.name ?? stateCode,
      rppIndex: value,
    };
  } catch {
    return fallback
      ? { stateCode, stateName: fallback.name, rppIndex: fallback.rppIndex }
      : null;
  }
}
