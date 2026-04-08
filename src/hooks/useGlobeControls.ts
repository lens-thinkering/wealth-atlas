"use client";

import { useState } from "react";

export type GlobeView = "world" | "usa";

export interface GlobeControls {
  selectedLocation: string | null;
  view: GlobeView;
  setSelectedLocation: (code: string | null) => void;
  drillIntoUSA: () => void;
  resetToWorld: () => void;
}

// TODO: integrate with Three.js camera lerp and GeoJSON swap logic
export function useGlobeControls(): GlobeControls {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [view, setView] = useState<GlobeView>("world");

  return {
    selectedLocation,
    view,
    setSelectedLocation,
    drillIntoUSA: () => setView("usa"),
    resetToWorld: () => {
      setView("world");
      setSelectedLocation(null);
    },
  };
}
