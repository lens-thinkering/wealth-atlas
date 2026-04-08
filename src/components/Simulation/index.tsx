"use client";

// TODO: Implement 2D Pokemon FireRed/LeafGreen-style pixel-art scene
// - Top-down canvas with character sprite + house/yard
// - Character outfit changes based on region (tropical/arctic/etc.)
// - House and yard upgrade visually per wealth level (1–6)
// - Text bubble: "In [Location], your wealth makes you a Level [X] Traveler!"

interface SimulationProps {
  locationName: string;
  wealthLevel: number;
  userNetWorth?: number;
}

export default function Simulation({
  locationName,
  wealthLevel,
  userNetWorth,
}: SimulationProps) {
  return (
    <div className="w-full h-full flex items-center justify-center text-neon-green font-pixel text-xs">
      [ Simulation Coming Soon ]
    </div>
  );
}
