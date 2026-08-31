# FlagQuest 🌍

An interactive, responsive, and minimalist web-based flag-matching geography game.

---

## 🎮 How to Play

1. **Pick a Continent**:
   - Start with **Europe** (all 44 sovereign nations included). Other continents are labeled *Coming Soon*.
2. **Pure Border-Shape Challenge**:
   - Unplaced countries show only their geographical boundary shape without names or spoilers.
3. **Drag or Tap Twice**:
   - **Drag & Drop**: Drag a flag card from the right-hand dock directly onto its territory on the map.
   - **Tap Twice**: Click/tap a flag card to select it, then click/tap its country on the map.
4. **Instant In-Border Flag Fills**:
   - Correctly placed countries are immediately filled with their official national flag and display their name with a green identified border.
5. **Little Countries & Microstates**:
   - Small territories (Andorra, Monaco, San Marino, Vatican City, Liechtenstein, Malta) are marked with a subtle target ring at standard zoom.
   - Zooming in fades out the rings so you can click the magnified landmass directly.
   - When identified, microstates display a clean, non-repeating mini flag rectangle.
6. **Stuck Helpers**:
   - **“Name it”**: Reveals the country name and capital on the flag card.
   - **“Show me”**: Auto-places the flag onto its location for free (awards 0 points) so you can keep progressing.
7. **Full-Width Responsive Arena**:
   - On desktop and tablet displays, the map fills all available space on the left side of the screen, with the country flag dock pinned to the furthest right.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Cartography**: Natural Earth 50m TopoJSON via D3 Conic Equal Area projection
- **Flag Assets**: `flag-icons` (embedded vector SVGs)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

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
