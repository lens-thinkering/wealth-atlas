"use client";

import { useState } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import { getWealthLevel, type WealthLevel } from '@/lib/formulas';
import { formatCurrency } from '@/components/Simulation/PixelScene';

const LEVEL_COLORS: Record<WealthLevel, string> = {
  1: '#4a4a4a',
  2: '#39ff14',
  3: '#00e5ff',
  4: '#ff9800',
  5: '#e040fb',
  6: '#ffd600',
};

interface CalculatorProps {
  scaledLevels: Record<WealthLevel, number>;
}

export default function Calculator({ scaledLevels }: CalculatorProps) {
  const { userNetWorth, setUserNetWorth } = useAtlasStore();
  const [raw, setRaw] = useState(userNetWorth !== null ? String(userNetWorth) : '');

  const computedLevel = userNetWorth !== null
    ? getWealthLevel(userNetWorth, scaledLevels)
    : null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setRaw(val);
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    setUserNetWorth(isNaN(num) ? null : num);
  }

  function handleClear() {
    setRaw('');
    setUserNetWorth(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-neon-green/50 font-pixel text-xs">&gt; YOUR NET WORTH</div>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green/50 font-pixel text-xs">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={raw}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-black border border-neon-green/40 text-neon-green font-pixel text-xs pl-6 pr-3 py-2 focus:outline-none focus:border-neon-green placeholder-neon-green/20"
          />
        </div>
        {raw && (
          <button
            onClick={handleClear}
            className="border border-neon-green/30 text-neon-green/50 font-pixel text-xs px-2 py-2 hover:border-neon-green/60 hover:text-neon-green/80 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {computedLevel !== null && (
        <div
          className="flex items-center gap-3 px-3 py-2 border font-pixel text-xs"
          style={{
            borderColor: `${LEVEL_COLORS[computedLevel]}60`,
            background: `${LEVEL_COLORS[computedLevel]}0d`,
          }}
        >
          <span style={{ color: LEVEL_COLORS[computedLevel] }}>
            ▶ LEVEL {computedLevel}
          </span>
          <span className="text-neon-green/40" style={{ fontSize: 9 }}>
            {formatCurrency(userNetWorth!)} in this location
          </span>
        </div>
      )}
    </div>
  );
}
