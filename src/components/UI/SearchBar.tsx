"use client";

// TODO: Implement fuzzy-search bar for countries and US states
// - Uses fuse.js or similar for fuzzy matching
// - Jumps globe camera to selected location
// - Triggers setSelectedLocation via useGlobeControls

interface SearchBarProps {
  onSelect: (locationCode: string, locationName: string) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search country or state..."
      className="bg-black border border-neon-green text-neon-green font-pixel text-xs px-3 py-2 w-full placeholder-neon-green/40 focus:outline-none focus:border-neon-blue"
    />
  );
}
