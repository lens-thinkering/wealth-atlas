"use client";

import { useMemo } from 'react';
import { useAtlasStore } from '@/store/useAtlasStore';
import Globe from '@/components/Globe';
import SearchBar from '@/components/UI/SearchBar';
import { FALLBACK_COUNTRY_COLI, FALLBACK_STATE_RPP } from '@/lib/api-clients';

export default function Home() {
  const { selectedLocation, selectedLocationName, setSelectedLocation } = useAtlasStore();

  // Build combined location list for the search bar
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

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-neon-green/20 shrink-0">
        <h1 className="text-neon-green text-xs tracking-wider">THE WEALTH ATLAS</h1>
        <div className="flex items-center gap-4">
          <SearchBar
            locations={locations}
            onSelect={(code, name) => setSelectedLocation(code, name)}
          />
          <span className="text-neon-blue text-xs hidden sm:block">&gt; v0.1_</span>
        </div>
      </header>

      {/* Globe */}
      <section className="flex-1" style={{ minHeight: '75vh' }}>
        <Globe
          selectedISO={selectedLocation}
          onCountrySelect={(iso, name) => setSelectedLocation(iso, name)}
        />
      </section>

      {/* Selected location bar */}
      <footer className="shrink-0 px-6 py-3 border-t border-neon-green/20 font-pixel text-xs min-h-[44px] flex items-center">
        {selectedLocationName ? (
          <span className="text-neon-blue">
            &gt; {selectedLocationName}{' '}
            <span className="text-neon-green/50">[{selectedLocation}]</span>
          </span>
        ) : (
          <span className="text-neon-green/30">&gt; Click a country to explore_</span>
        )}
      </footer>
    </main>
  );
}
