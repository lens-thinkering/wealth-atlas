"use client";

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlobeSphere from './GlobeSphere';
import CountryLayer from './CountryLayer';
import StateLayer from './StateLayer';
import CameraController from './CameraController';
import type { GeoFeature } from './utils';

interface GlobeSceneProps {
  countryFeatures: GeoFeature[];
  stateFeatures: GeoFeature[];
  selectedISO: string | null;
  globeView: 'world' | 'usa';
  onCountrySelect: (iso: string, name: string) => void;
  onStateSelect: (code: string, name: string) => void;
}

export default function GlobeScene({
  countryFeatures,
  stateFeatures,
  selectedISO,
  globeView,
  onCountrySelect,
  onStateSelect,
}: GlobeSceneProps) {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const handleHover = useCallback((_code: string | null, name: string | null) => {
    setHoveredName(name);
  }, []);

  const isUSA = globeView === 'usa';

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true }}
        style={{ background: '#000000' }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[6, 6, 6]} intensity={1.2} color="#00f5ff" />
        <pointLight position={[-6, -4, -6]} intensity={0.4} color="#39ff14" />

        <GlobeSphere />

        {isUSA ? (
          <StateLayer
            features={stateFeatures}
            selectedCode={selectedISO}
            onHover={handleHover}
            onSelect={onStateSelect}
          />
        ) : (
          <CountryLayer
            features={countryFeatures}
            selectedISO={selectedISO}
            onHover={handleHover}
            onSelect={onCountrySelect}
          />
        )}

        <CameraController isUSA={isUSA} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          minDistance={isUSA ? 2.5 : 3}
          maxDistance={isUSA ? 5.5 : 9}
          autoRotate={!isUSA}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Hover tooltip */}
      {hoveredName && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 border border-neon-green/40 bg-black/80 text-neon-green font-pixel text-xs pointer-events-none whitespace-nowrap">
          {hoveredName}
        </div>
      )}
    </div>
  );
}
