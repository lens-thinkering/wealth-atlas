"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAtlasStore } from '@/store/useAtlasStore';
import type { GeoFeature } from './utils';

const GlobeScene = dynamic(() => import('./GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neon-green font-pixel text-xs animate-pulse">
      [ LOADING ATLAS... ]
    </div>
  ),
});

export default function Globe() {
  const { selectedLocation, globeView, setSelectedLocation, setGlobeView } = useAtlasStore();

  const [countryFeatures, setCountryFeatures] = useState<GeoFeature[]>([]);
  const [stateFeatures, setStateFeatures] = useState<GeoFeature[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    Promise.all([
      fetch('/api/geodata').then((r) => r.json()),
      fetch('/api/geodata/states').then((r) => r.json()),
    ])
      .then(([countries, states]) => {
        setCountryFeatures(countries.features ?? []);
        setStateFeatures(states.features ?? []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  function handleCountrySelect(iso: string, name: string) {
    setSelectedLocation(iso, name);
    if (iso === 'USA') {
      setGlobeView('usa');
    }
  }

  function handleStateSelect(code: string, name: string) {
    setSelectedLocation(code, name);
  }

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neon-green font-pixel text-xs">
        <span className="animate-pulse">[ LOADING ATLAS... ]</span>
        <span className="text-neon-green/40">Fetching geographic data</span>
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
      countryFeatures={countryFeatures}
      stateFeatures={stateFeatures}
      selectedISO={selectedLocation}
      globeView={globeView}
      onCountrySelect={handleCountrySelect}
      onStateSelect={handleStateSelect}
    />
  );
}
