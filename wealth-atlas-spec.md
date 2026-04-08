# Project Specification: The Wealth Atlas

## 1. Vision & Core Concept
**The Wealth Atlas** is an interactive data-storytelling application based on the "Wealth Ladder" concept from *Of Dollars and Data*. It visualizes the "ideal" levels of wealth across the globe and within the 50 US States using a retro 8-bit aesthetic.

* **Primary Goal:** To show users how much capital is required to reach specific life-stages (Grocery Wealth to Philanthropic Wealth) in different geographic locations.
* **Secondary Goal:** To allow users to input their own data to see their "Wealth Level" equivalent in any country or state.

---

## 2. Technical Stack
* **Framework:** Next.js (App Router), TypeScript.
* **Styling:** Tailwind CSS (Dark Mode focused).
* **3D Graphics:** `react-three-fiber`, `three`, `@react-three/drei`.
* **Animations:** Framer Motion (UI) + CSS Sprite Animations (2D Scenes).
* **Data APIs:**
    * World Bank API (Global PPP/GDP).
    * St. Louis Fed (FRED) API (US State-level economic data).

---

## 3. The Data Engine
### The Wealth Ladder (Base US Figures)
The app operates on six distinct levels:
1. **Level 1: Paycheck Wealth** (Covers essentials).
2. **Level 2: Grocery Wealth** (Groceries without price-checking).
3. **Level 3: Restaurant Wealth** (Dining out without checking prices).
4. **Level 4: Travel Wealth** (First-class/luxury lodging).
5. **Level 5: Time Wealth** (Buying back time/outsourcing all chores).
6. **Level 6: Philanthropic Wealth** (Impactful giving).

### The Scaling Formula
To adjust these figures for any location $L$, the app uses a Cost of Living Index ($COLI$) or Purchasing Power Parity ($PPP$) multiplier:

$$W_L = W_{US} 	imes \left( \frac{COLI_L}{COLI_{US}} \right)$$

---

## 4. UI/UX Requirements
### Phase A: The 8-Bit Globe (Hero Section)
* **Visuals:** A 3D rotating sphere with a pixelated shader effect.
* **Interaction:**
    * Full mouse/touch orbit and zoom.
    * Political borders (GeoJSON) that highlight on hover.
    * **The Drill-Down:** Clicking the USA triggers a camera "Lerp" zoom and swaps the national mesh for a 50-state detailed mesh.
* **Search:** A fuzzy-search bar to jump to any country or state.

### Phase B: The "Pokemon" Results Section
* **Canvas:** A 2D top-down scene below the globe.
* **Styling:** *Pokemon FireRed/LeafGreen* (GBA era) pixel art.
* **Dynamics:**
    * **The Character:** Outfits change based on region (e.g., tropical vs. arctic).
    * **The Environment:** The "House" and yard upgrade visually as the user toggles through the 6 Wealth Levels.
    * **Personalization:** If the user inputs their own net worth, the character speaks via a text bubble: *"In [Location], your current wealth makes you a Level [X] Traveler!"*

---

## 5. Proposed File Structure
```text
wealth-atlas/
├── public/assets/
│   ├── sprites/            # Character & House sheets
│   └── data/               # Local GeoJSON & Fallback CSVs
├── src/
│   ├── app/                # Next.js Pages & API routes
│   ├── components/
│   │   ├── Globe/          # Three.js Globe & Shaders
│   │   ├── Simulation/     # 2D Pixel-art Canvas
│   │   └── UI/             # Calculator & Search components
│   ├── lib/
│   │   ├── formulas.ts     # Wealth scaling logic
│   │   └── api-clients.ts  # World Bank & FRED fetchers
│   └── hooks/              # useWealthData, useGlobeControls
└── tailwind.config.ts      # Custom retro font & palette
```

---

## 6. Implementation Roadmap
1. **Skeleton:** Initialize Next.js and Tailwind.
2. **The Engine:** Build the logic to fetch PPP data and scale the 6 Wealth Levels.
3. **The Globe:** Implement the 3D sphere with `OrbitControls` and basic country clicking.
4. **The Zoom:** Add the US state drill-down logic and GeoJSON swap.
5. **The Canvas:** Build the 2D sprite renderer for the "Pokemon" world.
6. **The Finish:** Apply the global 8-bit pixelation shader and final "Dark Mode" styling.

---

### Instructions for the Coding Agent:
* Prioritize modularity in the Three.js components.
* Use `Zustand` or `Context API` for global state (SelectedLocation, CurrentWealthLevel).
* Ensure all data fetching includes robust error handling and local fallbacks.
* Apply a "Retro-Modern" UI theme: #000000 background, neon-green/blue accents, and pixel-style typography.
