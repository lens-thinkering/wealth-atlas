"use client";

import { motion } from 'framer-motion';
import { BASE_WEALTH_LEVELS, type WealthLevel } from '@/lib/formulas';
import { formatCurrency } from './PixelScene';

const LEVELS = [1, 2, 3, 4, 5, 6] as WealthLevel[];

const LEVEL_COLORS: Record<WealthLevel, string> = {
  1: '#4a4a4a',
  2: '#39ff14',
  3: '#00e5ff',
  4: '#ff9800',
  5: '#e040fb',
  6: '#ffd600',
};

interface WealthLevelSelectorProps {
  activeLevel: WealthLevel;
  scaledLevels: Record<WealthLevel, number>;
  onSelect: (level: WealthLevel) => void;
}

export default function WealthLevelSelector({
  activeLevel,
  scaledLevels,
  onSelect,
}: WealthLevelSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-neon-green/50 font-pixel text-xs mb-1">&gt; WEALTH LEVEL</div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
        {LEVELS.map((level) => {
          const isActive = level === activeLevel;
          const color = LEVEL_COLORS[level];
          const amount = scaledLevels[level];
          const name = BASE_WEALTH_LEVELS[level].name;

          return (
            <motion.button
              key={level}
              onClick={() => onSelect(level)}
              whileTap={{ scale: 0.95 }}
              style={{
                borderColor: isActive ? color : 'rgba(57,255,20,0.2)',
                color: isActive ? color : 'rgba(57,255,20,0.4)',
                background: isActive ? `${color}12` : 'transparent',
                boxShadow: isActive ? `0 0 8px ${color}40` : 'none',
              }}
              className="flex flex-col items-center gap-1 px-2 py-3 border font-pixel text-xs transition-all duration-150 cursor-pointer"
            >
              <span style={{ fontSize: 9, color: isActive ? color : 'inherit' }}>
                LVL {level}
              </span>
              <span style={{ fontSize: 7, opacity: 0.8 }}>
                {formatCurrency(amount)}
              </span>
              <span style={{ fontSize: 6, opacity: 0.5, textAlign: 'center', lineHeight: 1.4 }}>
                {name.split(' ').slice(0, 2).join(' ')}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
