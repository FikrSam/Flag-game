# Flaggle 🌍

An interactive, responsive, and minimalist web-based flag-matching geography game.

---

## 🎮 Features & Gameplay

1. **Playable Continents**:
   - **Europe** (44 sovereign nations).
   - **Africa** (54 sovereign nations).
   - **South America** (12 sovereign nations).
   - *Asia, North America, Oceania* labeled *Coming Soon*.
2. **Pure Border-Shape Geography Challenge**:
   - Unplaced countries display their authentic geographical boundaries without names or spoilers.
3. **Flexible Interaction (Drag or Tap Twice)**:
   - **Drag & Drop**: Drag a flag card from the right-hand dock directly onto its territory on the map.
   - **Tap Twice**: Click/tap a flag card to select it, then click/tap its country on the map.
4. **Centroid-Aligned In-Border Flag Texturing**:
   - Correctly matched countries are filled with their official national flag, with national emblems (stars, shields, eagles, crescents) centered directly in the visual heart of the nation and bordered with an ultra-fine `0.5px` emerald green outline.
5. **Microstates & Small Territories**:
   - Microstates and small island nations (e.g. Andorra, Monaco, San Marino, Cabo Verde, São Tomé, Seychelles, Mauritius, Comoros) display subtle target markers at default view that fade out on zoom.
   - When identified, microstates render a crisp, non-repeating flag badge.
6. **Smart Audio & Visual Feedback**:
   - Synthesized Web Audio API sound effects for selections, correct matches, victory fanfares, and incorrect attempts.
   - Clicking an incorrect country triggers a wrong sound effect and a temporary top notification pill: **`"This is <CountryName>"`**.
7. **Helpers & Stuck Assist**:
   - **“Name it”**: Reveals the country name and capital on the flag card.
   - **“Show me”**: Auto-places the flag onto its location for 0 points so you can keep learning and progressing.
8. **Expansive Canvas & Navigation**:
   - Open canvas panning and zooming (`0.8x` to `4.5x`) with smart boundary limits preventing loss of the continent.
   - Drag to pan anywhere across the ocean and landmasses.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Cartography**: Natural Earth 50m TopoJSON via D3 Mercator & Conic projections
- **Flag Assets**: `flag-icons` (embedded vector SVGs)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Linting**: Oxlint

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone git@github.com:FikrSam/Flag-game.git

# Navigate into the project folder
cd Flag-game

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## 📄 License

MIT License.
