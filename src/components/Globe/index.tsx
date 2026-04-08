"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { GeoFeature } from './utils';

const GlobeScene = dynamic(() => import('./GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neon-green font-pixel text-xs">
      [ LOADING ATLAS... ]
    </div>
  ),
});

interface GlobeProps {
  selectedISO: string | null;
  onCountrySelect: (iso: string, name: string) => void;
}

export default function Globe({ selectedISO, onCountrySelect }: GlobeProps) {
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/geodata')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFeatures(data.features ?? []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neon-green font-pixel text-xs">
        <span className="animate-pulse">[ LOADING ATLAS... ]</span>
        <span className="text-neon-green/40">Fetching country data</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center text-neon-green font-pixel text-xs">
        [ ERROR: Failed to load geodata ]
      </div>
    );
  }

  return (
    <GlobeScene
      features={features}
      selectedISO={selectedISO}
      onCountrySelect={onCountrySelect}
    />
  );
}
