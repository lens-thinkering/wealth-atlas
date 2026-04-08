"use client";

// TODO: Implement net worth input calculator
// - User enters their net worth
// - App computes their Wealth Level in the selected location
// - Feeds into Simulation component for personalized text bubble

interface CalculatorProps {
  onNetWorthChange: (value: number) => void;
}

export default function Calculator({ onNetWorthChange }: CalculatorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-neon-green font-pixel text-xs">Your Net Worth (USD)</label>
      <input
        type="number"
        min={0}
        placeholder="0"
        onChange={(e) => onNetWorthChange(Number(e.target.value))}
        className="bg-black border border-neon-green text-neon-green font-pixel text-xs px-3 py-2 w-full focus:outline-none focus:border-neon-blue"
      />
    </div>
  );
}
