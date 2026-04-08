"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WealthLevel } from '@/lib/formulas';

export type Climate = 'tropical' | 'arctic' | 'desert' | 'temperate';

// ─── Climate detection ────────────────────────────────────────────────────────

const CLIMATE_MAP: Record<string, Climate> = {
  // Tropical countries
  BRA: 'tropical', IND: 'tropical', IDN: 'tropical', NGA: 'tropical', SGP: 'tropical',
  // Arctic / cold
  NOR: 'arctic', CAN: 'arctic',
  // Desert / arid
  SAU: 'desert', MEX: 'desert', ZAF: 'desert', ARG: 'desert',
  // US States — tropical
  HI: 'tropical', FL: 'tropical',
  // US States — arctic
  AK: 'arctic', MT: 'arctic', ND: 'arctic', MN: 'arctic', WI: 'arctic', ME: 'arctic', VT: 'arctic',
  // US States — desert
  AZ: 'desert', NV: 'desert', NM: 'desert', UT: 'desert', TX: 'desert',
};

export function getClimate(code: string | null): Climate {
  if (!code) return 'temperate';
  return CLIMATE_MAP[code.toUpperCase()] ?? 'temperate';
}

// ─── Colour palettes per climate ─────────────────────────────────────────────

const CLIMATE_PALETTES = {
  tropical: {
    sky: '#050f08',
    ground: '#0a1a0a',
    groundAccent: 'rgba(57,255,20,0.07)',
    skin: '#c68642',
    shirt: '#00c853',
    pants: '#1b5e20',
    boots: '#1a1a1a',
    label: 'TROPICAL',
  },
  arctic: {
    sky: '#030810',
    ground: '#080d16',
    groundAccent: 'rgba(0,245,255,0.07)',
    skin: '#ffe0b2',
    shirt: '#0288d1',
    pants: '#01579b',
    boots: '#212121',
    label: 'ARCTIC',
  },
  desert: {
    sky: '#100a02',
    ground: '#160e04',
    groundAccent: 'rgba(255,200,0,0.06)',
    skin: '#e07b39',
    shirt: '#f9a825',
    pants: '#bf360c',
    boots: '#3e2723',
    label: 'ARID',
  },
  temperate: {
    sky: '#040608',
    ground: '#050c08',
    groundAccent: 'rgba(57,255,20,0.05)',
    skin: '#d4956a',
    shirt: '#546e7a',
    pants: '#37474f',
    boots: '#1c1c1c',
    label: 'TEMPERATE',
  },
};

// ─── House config per wealth level ───────────────────────────────────────────

const HOUSE_CONFIG = {
  1: { label: 'Shack',   w: 56,  wh: 42,  rh: 22, wall: '#252525', roof: '#181818', accent: '#333', windows: 0, towers: 0 },
  2: { label: 'Cottage', w: 72,  wh: 52,  rh: 28, wall: '#3d2510', roof: '#2a1808', accent: '#5a3818', windows: 1, towers: 0 },
  3: { label: 'House',   w: 90,  wh: 64,  rh: 34, wall: '#1a3020', roof: '#0d2015', accent: '#264d33', windows: 2, towers: 0 },
  4: { label: 'Mansion', w: 112, wh: 76,  rh: 40, wall: '#122040', roof: '#0a1530', accent: '#1e3a6e', windows: 3, towers: 0 },
  5: { label: 'Estate',  w: 136, wh: 90,  rh: 46, wall: '#28104a', roof: '#180833', accent: '#4a1e80', windows: 4, towers: 1 },
  6: { label: 'Palace',  w: 164, wh: 106, rh: 52, wall: '#3a2800', roof: '#281c00', accent: '#806000', windows: 5, towers: 2 },
} as const;

// ─── Number formatter ─────────────────────────────────────────────────────────

export function formatCurrency(n: number): string {
  if (n === 0) return '$0';
  if (n < 1_000) return `$${n.toFixed(0)}`;
  if (n < 1_000_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n < 1_000_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000_000_000).toFixed(1)}B`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PixelHouse({ level }: { level: WealthLevel }) {
  const cfg = HOUSE_CONFIG[level];

  const windowPositions = useMemo(() => {
    const positions: number[] = [];
    if (cfg.windows === 0) return positions;
    for (let i = 0; i < cfg.windows; i++) {
      positions.push(Math.round((cfg.w / (cfg.windows + 1)) * (i + 1) - 7));
    }
    return positions;
  }, [cfg]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Tower left */}
      {cfg.towers >= 2 && (
        <div style={{ display: 'flex', gap: 4, marginBottom: -2, alignSelf: 'stretch', justifyContent: 'space-between', padding: '0 8px' }}>
          {[0, 1].map((t) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `18px solid ${cfg.roof}` }} />
              <div style={{ width: 20, height: 32, background: cfg.wall, border: `2px solid ${cfg.accent}` }} />
            </div>
          ))}
        </div>
      )}
      {cfg.towers === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: -2 }}>
          <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: `20px solid ${cfg.roof}` }} />
          <div style={{ width: 24, height: 36, background: cfg.wall, border: `2px solid ${cfg.accent}` }} />
        </div>
      )}

      {/* Roof */}
      <div style={{ width: 0, height: 0, borderLeft: `${cfg.w / 2}px solid transparent`, borderRight: `${cfg.w / 2}px solid transparent`, borderBottom: `${cfg.rh}px solid ${cfg.roof}` }} />

      {/* Walls */}
      <div style={{ width: cfg.w, height: cfg.wh, background: cfg.wall, border: `2px solid ${cfg.accent}`, position: 'relative' }}>
        {/* Windows */}
        {windowPositions.map((x, i) => (
          <div key={i} style={{ position: 'absolute', top: 10, left: x, width: 14, height: 12, background: level >= 4 ? '#00f5ff' : '#39ff14', opacity: 0.7, boxShadow: `0 0 6px ${level >= 4 ? '#00f5ff' : '#39ff14'}` }} />
        ))}
        {/* Door */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 14, height: 20, background: '#000', border: `1px solid ${cfg.accent}` }}>
          {level >= 3 && <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, background: '#39ff14', borderRadius: '50%' }} />}
        </div>
        {/* Palace columns */}
        {level === 6 && [0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', bottom: 0, left: `${16 + i * 40}px`, width: 6, height: cfg.wh, background: cfg.accent, opacity: 0.5 }} />
        ))}
      </div>
      {/* Label */}
      <div style={{ color: '#39ff14', fontSize: 7, marginTop: 4, fontFamily: 'inherit', opacity: 0.7, letterSpacing: 1 }}>
        {cfg.label}
      </div>
    </div>
  );
}

function PixelCharacter({ climate }: { climate: Climate }) {
  const p = CLIMATE_PALETTES[climate];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, imageRendering: 'pixelated' }}>
      {/* Hat (climate hint) */}
      <div style={{ width: 16, height: 5, background: climate === 'arctic' ? '#01579b' : climate === 'desert' ? '#bf360c' : climate === 'tropical' ? '#1b5e20' : '#37474f' }} />
      {/* Head */}
      <div style={{ width: 14, height: 14, background: p.skin, border: '1px solid #000', position: 'relative' }}>
        {/* Eyes */}
        <div style={{ position: 'absolute', top: 4, left: 3, width: 2, height: 2, background: '#000' }} />
        <div style={{ position: 'absolute', top: 4, right: 3, width: 2, height: 2, background: '#000' }} />
      </div>
      {/* Body */}
      <div style={{ width: 16, height: 18, background: p.shirt, border: '1px solid #000' }} />
      {/* Legs */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: 7, height: 12, background: p.pants, border: '1px solid #000' }} />
        <div style={{ width: 2, height: 12 }} />
        <div style={{ width: 7, height: 12, background: p.pants, border: '1px solid #000' }} />
      </div>
      {/* Boots */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: 8, height: 5, background: p.boots, border: '1px solid #000' }} />
        <div style={{ width: 2, height: 5 }} />
        <div style={{ width: 8, height: 5, background: p.boots, border: '1px solid #000' }} />
      </div>
    </div>
  );
}

// ─── Dialog box ───────────────────────────────────────────────────────────────

function DialogBox({ lines }: { lines: string[] }) {
  return (
    <div style={{
      border: '3px solid #39ff14',
      background: '#000',
      padding: '10px 14px',
      position: 'relative',
      minHeight: 56,
    }}>
      {/* Corner pixels */}
      {[[-3, -3], [-3, 'auto'], ['auto', -3], ['auto', 'auto']].map(([t, b], i) => (
        <div key={i} style={{
          position: 'absolute',
          top: typeof t === 'number' ? t : undefined,
          bottom: typeof b === 'number' ? b : undefined,
          left: i < 2 ? -3 : undefined,
          right: i >= 2 ? -3 : undefined,
          width: 3,
          height: 3,
          background: '#000',
        }} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: '#fff', fontSize: 8, letterSpacing: 0.5, lineHeight: 1.6, fontFamily: 'inherit' }}>
            {line}
          </div>
        ))}
      </div>
      {/* Blinking arrow */}
      <div style={{
        position: 'absolute',
        bottom: 6,
        right: 10,
        color: '#39ff14',
        fontSize: 8,
        fontFamily: 'inherit',
        animation: 'blink 1s step-end infinite',
      }}>▼</div>
    </div>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────────

interface PixelSceneProps {
  level: WealthLevel;
  locationCode: string | null;
  locationName: string | null;
  scaledAmount: number;
  userNetWorth: number | null;
  userLevel: WealthLevel | null;
}

export default function PixelScene({
  level,
  locationCode,
  locationName,
  scaledAmount,
  userNetWorth,
  userLevel,
}: PixelSceneProps) {
  const climate = getClimate(locationCode);
  const palette = CLIMATE_PALETTES[climate];

  const dialogLines = useMemo(() => {
    const loc = locationName ?? '???';
    const lines: string[] = [];
    if (userNetWorth !== null && userLevel !== null) {
      lines.push(`YOUR ${formatCurrency(userNetWorth)} = LEVEL ${userLevel} IN ${loc.toUpperCase()}`);
      lines.push(`LEVEL ${level}: ${formatCurrency(scaledAmount)} HERE`);
    } else {
      lines.push(`LEVEL ${level} IN ${loc.toUpperCase()}:`);
      lines.push(`${formatCurrency(scaledAmount)} LIQUID NET WORTH`);
    }
    return lines;
  }, [level, locationName, scaledAmount, userNetWorth, userLevel]);

  return (
    <div style={{ fontFamily: '"Press Start 2P", monospace' }}>
      {/* GBA-style viewport */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        maxHeight: 360,
        position: 'relative',
        overflow: 'hidden',
        background: palette.sky,
        imageRendering: 'pixelated',
      }}>
        {/* Scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }} />

        {/* Stars (sky area) */}
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${(i * 37) % 38}%`,
            left: `${(i * 13 + 7) % 95}%`,
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            background: '#fff',
            opacity: 0.3 + (i % 5) * 0.12,
          }} />
        ))}

        {/* Climate badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 5,
          border: '2px solid rgba(57,255,20,0.4)', background: 'rgba(0,0,0,0.7)',
          padding: '3px 6px', color: 'rgba(57,255,20,0.7)', fontSize: 7, letterSpacing: 1,
        }}>
          {palette.label}
        </div>

        {/* Ground */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '52%',
          background: palette.ground,
          backgroundImage: `
            linear-gradient(${palette.groundAccent} 1px, transparent 1px),
            linear-gradient(90deg, ${palette.groundAccent} 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
          borderTop: '2px solid rgba(57,255,20,0.2)',
        }} />

        {/* House */}
        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '15%',
              transform: 'translateX(0) translateY(50%)',
              zIndex: 3,
            }}
          >
            <PixelHouse level={level} />
          </motion.div>
        </AnimatePresence>

        {/* Character */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          right: '20%',
          transform: 'translateY(50%)',
          zIndex: 4,
        }}>
          <PixelCharacter climate={climate} />
        </div>

        {/* Dialog box */}
        <motion.div
          key={dialogLines.join()}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            zIndex: 6,
            padding: '0 12px 10px',
          }}
        >
          <DialogBox lines={dialogLines} />
        </motion.div>
      </div>

      {/* CSS for blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
