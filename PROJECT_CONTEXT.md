# Project Context & Architecture Blueprint: Flaggle 🌍

> **Developer & AI Context Reference**: This document serves as the persistent context, architectural blueprint, and technical changelog for **Flaggle**. Whenever working on or extending this repository, refer to this document to maintain consistency with cartographic projections, color palettes, flag aspect ratios, and interaction mechanics.

---

## 1. Project Overview & Core Mission

**Flaggle** is a minimalist, responsive, and tactile web-based geography game where players match official national flags onto authentic vector country shapes without names or geographical spoilers until successfully identified.

- **Primary Repository**: `git@github.com:FikrSam/Flag-game.git`
- **Branches**: `main` (production), `dev` (development)
- **Tech Stack**:
  - **Framework**: React 19 + TypeScript (Strict mode)
  - **Styling**: Tailwind CSS v4
  - **Icons**: Standalone Tabler SVG suite (`src/components/TablerIcons.tsx`)
  - **Cartography**: D3-geo (`d3.geoMercator`) with Natural Earth 50m TopoJSON
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

## 4. Visual System & High-Contrast Palette (Correct/Incorrect Feedback & Max 8px Radius)

- **Philosophy**: High-contrast dark grayscale foundation (`#0d0d0d` to `#ffffff`) with dedicated semantic colors for gameplay validation: **Emerald Green (`#22c55e`)** for correct placement, **Vivid Rose (`#f43f5e`)** for incorrect placement/notifications, **Warm Gold/Amber (`#fbbf24`)** for streaks & assistance, and **Crisp White (`#f1f1f1` / `#ffffff`)** as the primary sleek accent for interactive selection, bold play buttons (`bg-[#f1f1f1] text-[#101010]`), and progress telemetry.
- **Border Radius Rule**: Strict maximum border-radius of **8px (`rounded-lg`)** site-wide (no `rounded-xl`, `rounded-2xl`, etc.).
- **Grayscale Architecture (High Contrast)**:
  - Dark Base / Canvas: `#0d0d0d`
  - Cards, Shell & Dock: `#181818` with crisp `#333333` borders
  - Primary Accent Surfaces & Buttons: `#f1f1f1` (hover `#ffffff`, text `#101010`)
  - Secondary Interactive Surfaces & Buttons: `#242424` (hover `#2c2c2c`, border `#383838`)
  - Surrounding Context Land: `#171717` (stroke `#2b2b2b`)
  - Unplaced Countries: Fill `#242424`, Border `#454545` (0.5px) — high contrast against ocean
  - Hover State: Fill `#383838`, Border `#454545` (clean area-only highlight with zero border clipping artifacts)
  - Drag-Over & Assist State: Fill `#4a4a4a`, Border `#454545`
  - Selected Country Ring: Border `#f1f1f1` with `ring-2 ring-white/90`
  - Muted Text / Labels: `#9ca3af` / `#a1a1aa`
  - Secondary Text: `#d1d5db` / `#e5e7eb`
  - Lightest Headings & Active Text: `#ffffff` / `#f8fafc` / `#f1f1f1`
- **Brand Iconography & Favicon**:
  - **Logo (`Logo.tsx`)**: Official Tabler solid filled flag icon (`IconFlag`) in crisp pure white (`#ffffff`).
  - **Favicon (`public/favicon.svg`)**: Official Tabler solid filled flag icon in pure white (`#ffffff`) placed on dark `#0d0d0d` rounded container with `#262626` border for crisp visibility across light and dark browser tabs. Cache-busted via `?v=5` in `index.html`.
- **Scoring & Geography Learning Rules**:
  - **Unassisted Correct Placement**: **100 points** awarded per country.
  - **"Name It" Hint Used**: **70 points** awarded (30% point deduction to discourage hint overuse and reinforce memory).
  - **"Show Me" Auto-Placement**: **0 points** awarded (resets active streak to 0).
  - **Reference Victory Screen Breakdown**: Top-right dismiss button (`IconX`), circular flag badge (`#1c1c1c`) with attached checkmark sub-badge, bold uppercase `{CONTINENT} COMPLETE` title, fine ornamental divider with center dot (`— • —`), big hero fraction `44 / 44` with `FLAGS MATCHED` label & dynamic contextual message, horizontal 4-column stats box (Score, Best Streak, Time, Hints Used), and high-contrast action buttons (`Play Again` and `← Choose Another Region`).

---

## 5. Mobile-First Layout & Touch Ergonomics

1. **Balanced Mobile-First Viewport Hierarchy**:
   - Uses `h-[100dvh]` and `viewport-fit=cover` to eliminate URL bar jump/clipping on iOS Safari and Android Chrome.
   - **Hierarchy**:
     1. Minimal sticky top header (`h-11`) with back navigation, category, progress, streak, time, score, and restart.
     2. Primary map arena (`flex-1 min-h-[220px]`) sized naturally without excessive void.
     3. Horizontal flag carousel (`h-24` to `h-28`) with auto-scrolling active card.
     4. Shared global action bar (`[ Name It ]` `[ Show Me ]`) operating on the currently selected flag.
2. **Flag Card Geometry (Zero Bottom Dead Space)**:
   - Flag cards are exact `aspect-[4/3]` units directly wrapping `<FlagImage className="w-full h-full object-cover">`.
   - Capped at `rounded-lg` (8px), eliminating dead whitespace around flags.
3. **Shared Global Action Controls**:
   - Eliminated redundant, clipped individual buttons inside every flag card.
   - Single pair of ergonomic action buttons (`[ ❓ Name It ]` `[ 👁️ Show Me ]`) dynamically bound to the selected flag.
   - **Desktop**: Positioned at the top of the sidebar (`md:order-2`) directly below the header and above the flag grid for immediate access without long mouse travel.
   - **Mobile**: Positioned in the bottom dock (`order-3`) for natural thumb ergonomics.
   - Reveals the active country name upon click and updates automatically as players swipe between flags.
4. **Touch Carousel Swiping & Gesture Disambiguation**:
   - Carousel container uses `touch-action: pan-x` with `-webkit-overflow-scrolling: touch` and `overscroll-contain`.
   - Horizontal dragging swipes **ONLY** the carousel without dragging the entire webpage vertically.
   - Upward dragging towards the map canvas triggers the floating ghost preview for direct drag-and-drop placement.
   - Direct card tap selects the flag immediately with a vibrant sky-blue ring and checkmark.
4. **Map Multi-Touch Controls**:
   - 1-finger pan with soft boundary clamping.
   - 2-finger pinch-to-zoom centered on pinch coordinates (`0.8x` to `4.5x`).
   - `touch-none` prevents accidental browser pull-to-refresh or page bouncing.

---

## 6. Sound Engine & Touch Event Reliability (`src/utils/sound.ts`, `src/App.tsx`, `src/components/Header.tsx`)

1. **Desktop & Mobile Web Audio Architecture (`executeSound`)**:
   - Registered global interaction capture listeners on both `window` and `document` (`['click', 'mousedown', 'pointerdown', 'touchstart', 'touchend', 'keydown']`) to auto-instantiate and resume `AudioContext`.
   - `executeSound()` handles asynchronous `ctx.resume()` promises: if the AudioContext was suspended (common in desktop Chrome/Safari autoplay policies), audio node scheduling waits for `ctx.resume()` to resolve before evaluating `ctx.currentTime`, ensuring zero dropped audio frames.
   - Enhanced gain and frequency curves for rich, audible playback on laptop/desktop speakers and mobile devices.
2. **Sound Controls in Header**:
   - Header contains an interactive sound toggle (`Volume2` / `VolumeX`) with visual state feedback and local storage persistence.
3. **Synthetic Event & Double-Tap Debouncing**:
   - `handleCountryMatch` tracks timestamp and country ID with `lastMatchRef`.
   - Rapid double invocations (<250ms) from mobile touch + synthetic mouse clicks are safely debounced, preventing double tap sounds and erroneous mismatch sounds.
4. **Sound Library**:
   - `playSelect()`: High-frequency soft sine click (520Hz -> 980Hz).
   - `playCorrect(streak)`: Major chord arpeggio (adjusts root based on streak).
   - `playIncorrect()`: Gentle lowpass-filtered descending sawtooth buzz (180Hz -> 110Hz).
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

## 8. Brand Identity, Custom Logo, Favicon & Tabler Icons (`public/favicon.svg`, `src/components/Logo.tsx`, `src/components/TablerIcons.tsx`)

- **Bespoke Vector Mark**:
  - Precision dark rounded tile (`#141414` with `#333333` border).
  - Fine-line globe meridian and equator grid (`#4a4a4a` / `#333333`).
  - Anchored white flagpole with electric Sky Blue (`#38bdf8`) geometric pennant fold and mast finial.
- **Site Favicon**:
  - Standalone high-contrast vector `public/favicon.svg` linked via `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`.
- **Complete Tabler Icon System (`src/components/TablerIcons.tsx`)**:
  - 100% of icons site-wide use Tabler vector icons: `IconFlame` (for streaks, zero emojis), `IconArrowLeft`, `IconRotateClockwise`, `IconVolume`, `IconVolumeOff`, `IconZoomIn`, `IconZoomOut`, `IconCheck`, `IconHelp`, `IconEye`, `IconMapPin`, and `IconSparkles`.
- **Component Integration**:
  - `<Logo />` displayed in Home Landing (`ContinentSelect.tsx`), In-Game Header (`Header.tsx`), and Victory Modal (`VictoryScreen.tsx`).

---

## 9. Testing, Build & Git Protocol (`main` & `dev`)

- **Branch Structure**:
  - `main`: Production release branch.
  - `dev`: Active development and feature staging branch.

Always ensure these verification steps pass before pushing:
```bash
# 1. Run all unit tests
npm test

# 2. Compile production TypeScript and bundle
npm run build

# 3. Verify zero lint errors/warnings
npm run lint

# 4. Push to origin main and dev
git push origin main && git push origin dev
```
