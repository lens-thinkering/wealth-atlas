"use client";

import { useMemo } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import Globe from '@/components/Globe';
import SearchBar from '@/components/UI/SearchBar';
import Simulation from '@/components/Simulation';
import { FALLBACK_COUNTRY_COLI, FALLBACK_STATE_RPP } from '@/lib/api-clients';

export default function Home() {
  const {
    selectedLocation,
    selectedLocationName,
    globeView,
    setSelectedLocation,
    setGlobeView,
  } = useAtlasStore();

  const locations = useMemo(() => {
    const countries = Object.entries(FALLBACK_COUNTRY_COLI).map(([code, { name }]) => ({
      code,
      name,
    }));
    const states = Object.entries(FALLBACK_STATE_RPP).map(([code, { name }]) => ({
      code,
      name,
    }));
    return [...countries, ...states].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  function handleBackToWorld() {
    setGlobeView('world');
    setSelectedLocation(null);
  }

  function handleSearchSelect(code: string, name: string) {
    setSelectedLocation(code, name);
    // 2-letter codes are US states — drill into USA view
    if (code.length === 2) setGlobeView('usa');
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-neon-green/20 shrink-0 gap-4">
        <h1 className="text-neon-green text-xs tracking-wider shrink-0">THE WEALTH ATLAS</h1>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <SearchBar locations={locations} onSelect={handleSearchSelect} />
          {globeView === 'usa' && (
            <button
              onClick={handleBackToWorld}
              className="shrink-0 border border-neon-green/50 text-neon-green font-pixel text-xs px-3 py-2 hover:bg-neon-green/10 transition-colors"
            >
              &lt; World
            </button>
          )}
        </div>
      </header>

      {/* Globe */}
      <section className="flex-1" style={{ minHeight: '75vh' }}>
        <Globe />
      </section>

      {/* Simulation */}
      <Simulation />

      {/* Status footer */}
      <footer className="shrink-0 px-6 py-3 border-t border-neon-green/20 font-pixel text-xs min-h-[44px] flex items-center gap-4">
        {globeView === 'usa' && (
          <span className="text-neon-green/40">[USA]</span>
        )}
        {selectedLocationName ? (
          <span className="text-neon-blue">
            &gt; {selectedLocationName}{' '}
            <span className="text-neon-green/50">[{selectedLocation}]</span>
          </span>
        ) : (
          <span className="text-neon-green/30">
            {globeView === 'usa'
              ? '&gt; Click a state to explore_'
              : '&gt; Click a country to explore_'}
          </span>
        )}
      </footer>
    </main>
  );
}
