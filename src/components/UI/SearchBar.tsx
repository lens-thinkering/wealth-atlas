"use client";

import { useState, useMemo } from 'react';

interface Location {
  code: string;
  name: string;
}

interface SearchBarProps {
  locations: Location[];
  onSelect: (code: string, name: string) => void;
}

export default function SearchBar({ locations, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return locations
      .filter((l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, locations]);

  function handleSelect(loc: Location) {
    onSelect(loc.code, loc.name);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        placeholder="&gt; Search country or state_"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full bg-black border border-neon-green/50 text-neon-green font-pixel text-xs px-3 py-2 placeholder-neon-green/30 focus:outline-none focus:border-neon-green"
      />
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-black border border-neon-green/40 border-t-0 z-50 max-h-48 overflow-y-auto">
          {results.map((loc) => (
            <li key={loc.code}>
              <button
                onMouseDown={() => handleSelect(loc)}
                className="w-full text-left px-3 py-2 text-neon-green font-pixel text-xs hover:bg-neon-green/10 flex justify-between"
              >
                <span>{loc.name}</span>
                <span className="text-neon-green/40">{loc.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
