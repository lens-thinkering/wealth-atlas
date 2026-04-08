"use client";

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlobeSphere from './GlobeSphere';
import CountryLayer from './CountryLayer';
import type { GeoFeature } from './utils';

interface GlobeSceneProps {
  features: GeoFeature[];
  selectedISO: string | null;
  onCountrySelect: (iso: string, name: string) => void;
}

export default function GlobeScene({ features, selectedISO, onCountrySelect }: GlobeSceneProps) {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const handleHover = useCallback((_iso: string | null, name: string | null) => {
    setHoveredName(name);
  }, []);

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
        <CountryLayer
          features={features}
          selectedISO={selectedISO}
          onHover={handleHover}
          onSelect={onCountrySelect}
        />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={9}
          autoRotate
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Country hover tooltip */}
      {hoveredName && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 border border-neon-green/40 bg-black/80 text-neon-green font-pixel text-xs pointer-events-none whitespace-nowrap">
          {hoveredName}
        </div>
      )}
    </div>
  );
}
