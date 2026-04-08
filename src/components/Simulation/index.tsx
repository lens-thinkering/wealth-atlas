"use client";

import { useAtlasStore } from '@/store/useAtlasStore';
import { useWealthData } from '@/hooks/useWealthData';
import { getWealthLevel, type WealthLevel } from '@/lib/formulas';
import PixelScene from './PixelScene';
import WealthLevelSelector from './WealthLevelSelector';
import Calculator from '@/components/UI/Calculator';

export default function Simulation() {
  const {
    selectedLocation,
    selectedLocationName,
    currentWealthLevel,
    userNetWorth,
    setWealthLevel,
  } = useAtlasStore();

  const { scaledLevels, isLoading, coliIndex } = useWealthData(selectedLocation);

  const userLevel: WealthLevel | null =
    userNetWorth !== null ? getWealthLevel(userNetWorth, scaledLevels) : null;

  const scaledAmount = scaledLevels[currentWealthLevel];

  // ── No location selected ────────────────────────────────────────────────────
  if (!selectedLocation) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 border-t border-neon-green/10">
        <div className="border border-neon-green/20 px-8 py-6 text-center max-w-sm">
          <p className="text-neon-green/60 font-pixel text-xs leading-loose">
            [ SELECT A LOCATION ]
          </p>
          <p className="text-neon-green/30 font-pixel text-xs leading-loose mt-3">
            Click any country on the globe above to see how far your wealth goes.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 border-t border-neon-green/10">
        <p className="text-neon-green font-pixel text-xs animate-pulse">
          [ LOADING DATA... ]
        </p>
      </div>
    );
  }

  return (
    <section className="border-t border-neon-green/20">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neon-green/10">
        <div className="font-pixel text-xs">
          <span className="text-neon-blue">{selectedLocationName?.toUpperCase()}</span>
          <span className="text-neon-green/30 ml-3">COLI {coliIndex.toFixed(1)}</span>
        </div>
        <div className="text-neon-green/30 font-pixel text-xs">
          [ SIMULATION ]
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 flex flex-col gap-6">
        {/* Pixel scene */}
        <PixelScene
          level={currentWealthLevel}
          locationCode={selectedLocation}
          locationName={selectedLocationName}
          scaledAmount={scaledAmount}
          userNetWorth={userNetWorth}
          userLevel={userLevel}
        />

        {/* Level selector */}
        <WealthLevelSelector
          activeLevel={currentWealthLevel}
          scaledLevels={scaledLevels}
          onSelect={setWealthLevel}
        />

        {/* Divider */}
        <div className="border-t border-neon-green/10" />

        {/* Calculator */}
        <Calculator scaledLevels={scaledLevels} />
      </div>
    </section>
  );
}
