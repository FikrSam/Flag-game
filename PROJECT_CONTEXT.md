# Project Context & Architecture Blueprint: Flaggle 🌍

> **Developer & AI Context Reference**: This document serves as the persistent context, architectural blueprint, and technical changelog for **Flaggle**. Whenever working on or extending this repository, refer to this document to maintain consistency with cartographic projections, color palettes, flag aspect ratios, and interaction mechanics.

---

## 1. Project Overview & Core Mission

**Flaggle** is a minimalist, responsive, and tactile web-based geography game where players match official national flags onto authentic vector country shapes without names or geographical spoilers until successfully identified.

- **Primary Repository**: `git@github.com:FikrSam/Flag-game.git`
- **Branches**: `main` (production), `master` (synchronized mirror)
- **Tech Stack**:
  - **Framework**: React 19 + TypeScript (Strict mode)
  - **Styling**: Tailwind CSS v4 + Lucide React icons
  - **Cartography**: D3-geo (`d3.geoMercator`) with Natural Earth 50m TopoJSON
  - **Audio Engine**: Synthesized Web Audio API (zero external mp3/wav dependencies)
  - **Testing**: Vitest + React Testing Library (100% passing suites)
  - **Linter**: Oxlint (0 warnings, 0 errors policy)

---

## 2. Playable Continents & Dataset Architecture

All geospatial datasets are pre-processed offline via TypeScript generation scripts in `scripts/` from `node_modules/world-atlas/countries-50m.json` and compiled into static TypeScript files in `src/data/`:

| Continent | Sovereign Nations | Dataset File | Script Generator | Projection Used |
| :--- | :--- | :--- | :--- | :--- |
| **Europe** | 44 | `src/data/europeData.ts` | `scripts/generate-europe-dataset.ts` | D3 Mercator / Conic center `13°E` |
| **Africa** | 54 | `src/data/africaData.ts` | `scripts/generate-africa-dataset.ts` | D3 Mercator center `[18, 2]`, scale `400` |
| **South America** | 12 | `src/data/southAmericaData.ts` | `scripts/generate-south-america-dataset.ts` | D3 Mercator center `[-60, -22]`, scale `550` |

### Continent Definition Schema (`CountryData` in `src/types/game.ts`)
```typescript
export interface CountryData {
  id: string;            // ISO 2-letter code (e.g. "FR", "DZ", "BR")
  numeric: string;       // Natural Earth 3-digit ISO (e.g. "250", "012", "076")
  name: string;          // Country name (e.g. "France", "Algeria", "Brazil")
  capital: string;       // Capital city (e.g. "Paris", "Algiers", "Brasília")
  region: string;        // Sub-region or "Microstate"
  funFact: string;       // Educational fun fact
  flagDataUri: string;   // Embedded SVG Data URI / public SVG path
  path: string;          // SVG <path d="..."> vector boundary
  centroid: [number, number]; // [cx, cy] visual center on SVG canvas
  bbox: { x: number; y: number; width: number; height: number };
  isMicrostate?: boolean;
}
```

---

## 3. Critical Cartographic Rules & Geometric Transforms

### A. Un-Skewed Mercator Projections
- **No Equator-Straddling Conic Projections**: Conic projections curve parallels across the equator, tilting northern and southern nations diagonally. Always use **`d3.geoMercator()`** for continents that span across or near the equator (e.g. Africa and South America) to ensure straight horizontal parallels and vertical meridians.

### B. Outlying Territory Filtering
- Natural Earth includes distant sub-Antarctic or Pacific territories that distort continental bounding boxes if unfiltered:
  - **South Africa**: Prince Edward Islands at `-46.9°S` are filtered to keep continental bounds (`avgLat >= -36`).
  - **Chile**: Easter Island (Rapa Nui) at `-109°W` is filtered to keep continental Andean spine bounds (`avgLon >= -82`).
  - **Ecuador**: Galápagos Islands at `-90°W` are filtered to keep mainland bounds.

### C. Zero-Distortion 4:3 Aspect Ratio Flag Texturing
SVG flags inside country boundaries must **never be stretched or sheared**:
```typescript
// Symmetrically centered on country centroid [cx, cy] with exact 4:3 aspect ratio
const [cx, cy] = country.centroid;
const halfW = Math.max(cx - country.bbox.x, (country.bbox.x + country.bbox.width) - cx);
const halfH = Math.max(cy - country.bbox.y, (country.bbox.y + country.bbox.height) - cy);
const minW = Math.max(1, halfW * 2);
const minH = Math.max(1, halfH * 2);

const FLAG_ASPECT_RATIO = 4 / 3;
let patW: number;
let patH: number;

if (minW / minH > FLAG_ASPECT_RATIO) {
  patW = minW;
  patH = minW / FLAG_ASPECT_RATIO;
} else {
  patH = minH;
  patW = minH * FLAG_ASPECT_RATIO;
}

const patX = Math.round(cx - patW / 2);
const patY = Math.round(cy - patH / 2);
```
- Image element uses `preserveAspectRatio="xMidYMid slice"` to guarantee that emblems (e.g. Argentina Sun of May, Algeria crescent & star, Egypt Eagle, Morocco star) are **100% circular, un-skewed, and centered in the heart of each nation**.

---

## 4. Visual System & Color Palette

- **Ocean & Background**: Solid dark navy `#0f182a` with app wrapper `#070b14`.
- **Surrounding Context Land**: Dark muted navy `#1a253b` with fine `#334460` border (`0.4px`).
- **Unplaced Countries**:
  - Fill: Slate blue `#2a3d5e`
  - Border stroke: Crisp lightened slate steel blue `#6b82a6` (`0.5px`).
- **Hover State**: Fill `#364f78`, Border `#93c5fd` (`0.5px`).
- **Drag-Over State**: Fill `#b45309`, Border `#f59e0b`.
- **Placed / Completed Countries**:
  - Fill: `url(#flag-pat-${country.id})`
  - Border stroke: Emerald green `#22c55e` (`0.6px`).
- **Microstates & Small Territories**:
  - Outer target ring: `stroke="#7e9cc2"`, `fill="rgba(42, 61, 94, 0.6)"`, `r={6.5}` (remains permanently visible across all zoom levels for easy targeting).
  - Inner dot: `fill="#e2e8f0"`, `r={1.8}`.
  - Placed badge: Crisp `15×11px` single-image SVG flag with green border `#22c55e` (`0.9px`).
- **Incorrect Country Notification**:
  - Floating top-center red pill badge: `bg-rose-950/95 border-rose-600/80 text-rose-100 font-semibold shadow-xl rounded-md`.
  - Auto-dismisses after 1.2s.

---

## 5. Mobile-First Layout & Touch Ergonomics

1. **Balanced Mobile-First Viewport Hierarchy**:
   - Uses `h-[100dvh]` and `viewport-fit=cover` to eliminate URL bar jump/clipping on iOS Safari and Android Chrome.
   - **Hierarchy**:
     1. Minimal sticky top header (`h-11`) with back navigation, category, progress, score, and restart.
     2. Primary map arena (`flex-1 min-h-[220px]`) sized naturally without excessive void.
     3. Horizontal flag carousel (`h-24` to `h-28`) with auto-scrolling active card.
     4. Shared global action bar (`[ Name It ]` `[ Show Me ]`) operating on the currently selected flag.
2. **Shared Global Action Controls**:
   - Eliminated redundant, clipped individual buttons inside every flag card.
   - Single pair of ergonomic action buttons (`[ ❓ Name It ]` `[ 👁️ Show Me ]`) dynamically bound to the selected flag.
   - **Desktop**: Positioned at the top of the sidebar (`md:order-2`) directly below the header and above the flag grid for immediate access without long mouse travel.
   - **Mobile**: Positioned in the bottom dock (`order-3`) for natural thumb ergonomics.
   - Reveals the active country name upon click and updates automatically as players swipe between flags.
3. **Touch Carousel Swiping & Gesture Disambiguation**:
   - Carousel container uses `touch-action: pan-x` with `-webkit-overflow-scrolling: touch` and `overscroll-contain`.
   - Horizontal dragging swipes **ONLY** the carousel without dragging the entire webpage vertically.
   - Upward dragging towards the map canvas triggers the floating ghost preview for direct drag-and-drop placement.
   - Direct card tap selects the flag immediately with a vibrant sky-blue ring and checkmark.
4. **Map Multi-Touch Controls**:
   - 1-finger pan with soft boundary clamping.
   - 2-finger pinch-to-zoom centered on pinch coordinates (`0.8x` to `4.5x`).
   - `touch-none` prevents accidental browser pull-to-refresh or page bouncing.

---

## 6. Sound Engine & Touch Event Reliability (`src/utils/sound.ts`, `src/App.tsx`)

1. **Web Audio API Auto-Unlock**:
   - Registered listeners for `['click', 'touchstart', 'touchend', 'pointerdown', 'keydown']` to automatically instantiate and resume `AudioContext` on user interaction.
   - Every sound playback method calls `this.unlock()`, handling `AudioContext.resume()` safely and preventing dropped audio on mobile browsers.
2. **Synthetic Event & Double-Tap Debouncing**:
   - `handleCountryMatch` tracks timestamp and country ID with `lastMatchRef`.
   - Rapid double invocations (<250ms) from mobile touch + synthetic mouse clicks are safely debounced, preventing double tap sounds and erroneous mismatch sounds.
3. **Sound Library**:
   - `playSelect()`: High-frequency soft sine click.
   - `playCorrect(streak)`: Major chord arpeggio (adjusts root based on streak).
   - `playIncorrect()`: Gentle lowpass-filtered descending sawtooth buzz.
   - `playReveal()`: Ascending pentatonic chime.
   - `playVictory()`: Triumphant fanfare melody with canvas confetti.

---

## 7. Home Screen & Continent Selection Design (Minimalist Design)

- **Clean Typography & Layout**:
  - Crisp solid white header `Flaggle` with concise subtitle.
  - No emojis, gradients, or badge clutter.
- **Continent Cards**:
  - Clean dark containers (`#0d1424`) with muted slate border definition.
  - Vector continent silhouettes in subtle slate (`#64748b` for playable, `#334155` for locked).
  - Clear nation count and description (e.g. *44 countries • Includes 6 microstates*).
  - Solid, clean `Play <Continent>` action button (`bg-sky-600`) and subtle `Coming soon` for locked continents.
- **Instructional Footer**:
  - 3 clean, simple text cards covering Dual Controls, Microstate Target Rings, and Hints/Assistance.

---

## 8. Testing, Build & Deployment Protocol

Always ensure these verification steps pass before pushing:
```bash
# 1. Run all unit tests
npm test

# 2. Compile production TypeScript and bundle
npm run build

# 3. Verify zero lint errors/warnings
npm run lint

# 4. Push to remote branches
git push origin main && git push origin main:master
```
