"use client";

import { useState, useEffect } from "react";
import { scaleWealth, WealthLevel } from "@/lib/formulas";
import { fetchWorldBankPPP, fetchFREDData } from "@/lib/api-clients";

export interface WealthData {
  locationName: string;
  scaledLevels: Record<WealthLevel, number>;
  isLoading: boolean;
  error: string | null;
}

// TODO: implement full data fetching and scaling logic
export function useWealthData(locationCode: string | null): WealthData {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    locationName: locationCode ?? "",
    scaledLevels: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    isLoading,
    error,
  };
}
