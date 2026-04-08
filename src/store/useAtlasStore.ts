import { create } from 'zustand';
import type { WealthLevel } from '@/lib/formulas';

interface AtlasState {
  selectedLocation: string | null;
  selectedLocationName: string | null;
  currentWealthLevel: WealthLevel;
  globeView: 'world' | 'usa';
  userNetWorth: number | null;
  setSelectedLocation: (code: string | null, name?: string | null) => void;
  setWealthLevel: (level: WealthLevel) => void;
  setGlobeView: (view: 'world' | 'usa') => void;
  setUserNetWorth: (amount: number | null) => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  selectedLocation: null,
  selectedLocationName: null,
  currentWealthLevel: 1,
  globeView: 'world',
  userNetWorth: null,
  setSelectedLocation: (code, name = null) =>
    set({ selectedLocation: code, selectedLocationName: name }),
  setWealthLevel: (level) => set({ currentWealthLevel: level }),
  setGlobeView: (view) => set({ globeView: view }),
  setUserNetWorth: (amount) => set({ userNetWorth: amount }),
}));
