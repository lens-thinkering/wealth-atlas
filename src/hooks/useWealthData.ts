"use client";

import { useState, useEffect } from "react";
import { BASE_WEALTH_LEVELS, scaleWealth, getWealthLevel, WealthLevel } from "@/lib/formulas";
import { fetchWorldBankPPP, fetchFREDData, FALLBACK_COUNTRY_COLI, FALLBACK_STATE_RPP } from "@/lib/api-clients";

export interface ScaledWealthData {
  locationName: string;
  coliIndex: number;
  scaledLevels: Record<WealthLevel, number>;
  isLoading: boolean;
  error: string | null;
}

type LocationType = { type: "country"; code: string } | { type: "state"; code: string } | null;

function parseLocationCode(code: string): LocationType {
  if (code.length === 2) return { type: "state", code: code.toUpperCase() };
  if (code.length === 3) return { type: "country", code: code.toUpperCase() };
  return null;
}

function buildScaledLevels(coliIndex: number): Record<WealthLevel, number> {
  return Object.fromEntries(
    (Object.keys(BASE_WEALTH_LEVELS) as unknown as WealthLevel[]).map((level) => [
      level,
      scaleWealth(BASE_WEALTH_LEVELS[level].amount, coliIndex),
    ])
  ) as Record<WealthLevel, number>;
}

export function useWealthData(locationCode: string | null): ScaledWealthData {
  const [data, setData] = useState<ScaledWealthData>({
    locationName: "",
    coliIndex: 100,
    scaledLevels: buildScaledLevels(100),
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!locationCode) return;

    const location = parseLocationCode(locationCode);
    if (!location) {
      setData((d) => ({ ...d, error: `Unknown location code: ${locationCode}` }));
      return;
    }

    setData((d) => ({ ...d, isLoading: true, error: null }));

    async function load() {
      try {
        if (location!.type === "country") {
          const ppp = await fetchWorldBankPPP(location!.code);
          if (!ppp) throw new Error(`No data for country: ${location!.code}`);
          setData({
            locationName: ppp.countryName,
            coliIndex: ppp.coliIndex,
            scaledLevels: buildScaledLevels(ppp.coliIndex),
            isLoading: false,
            error: null,
          });
        } else {
          const rpp = await fetchFREDData(location!.code);
          if (!rpp) throw new Error(`No data for state: ${location!.code}`);
          setData({
            locationName: rpp.stateName,
            coliIndex: rpp.rppIndex,
            scaledLevels: buildScaledLevels(rpp.rppIndex),
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        setData((d) => ({
          ...d,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load data",
        }));
      }
    }

    load();
  }, [locationCode]);

  return data;
}
