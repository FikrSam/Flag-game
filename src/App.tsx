import { useState, useEffect, useCallback } from 'react';
import { EUROPE_COUNTRIES } from './data/europeData';
import type { CountryData } from './data/europeData';
import { ContinentSelect } from './components/ContinentSelect';
import { Header } from './components/Header';
import { EuropeMap } from './components/EuropeMap';
import { FlagDock } from './components/FlagDock';
import { VictoryScreen } from './components/VictoryScreen';
import { sound } from './utils/sound';

export function App() {
  const [screen, setScreen] = useState<'continent_select' | 'game'>('continent_select');

  // Game state
  const [placedCountries, setPlacedCountries] = useState<Set<string>>(new Set());
  const [unplacedCountries, setUnplacedCountries] = useState<CountryData[]>(() => {
    return [...EUROPE_COUNTRIES].sort(() => Math.random() - 0.5);
  });
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [highlightedCountryId, setHighlightedCountryId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Auto-select first unplaced flag
  useEffect(() => {
    if (unplacedCountries.length > 0 && !selectedFlagId) {
      setSelectedFlagId(unplacedCountries[0].id);
    }
  }, [unplacedCountries, selectedFlagId]);

  // Timer
  useEffect(() => {
    if (screen !== 'game' || isVictory) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, isVictory]);

  // Start continent game
  const handleSelectContinent = (_continentId: string) => {
    handleRestart();
    setScreen('game');
  };

  // Restart / Reset game
  const handleRestart = () => {
    sound.playSelect();
    const shuffled = [...EUROPE_COUNTRIES].sort(() => Math.random() - 0.5);
    setPlacedCountries(new Set());
    setUnplacedCountries(shuffled);
    setSelectedFlagId(shuffled[0]?.id || null);
    setHighlightedCountryId(null);
    setScore(0);
    setTimeElapsed(0);
    setIsVictory(false);
  };

  // Flag selection
  const handleSelectFlag = (countryId: string) => {
    setSelectedFlagId(countryId);
  };

  // Match interaction (drag drop or tap twice)
  const handleCountryMatch = useCallback((targetCountryId: string) => {
    if (!selectedFlagId) return;
    if (placedCountries.has(targetCountryId)) return;

    const isMatch = selectedFlagId === targetCountryId;

    if (isMatch) {
      sound.playCorrect(1);

      const nextPlaced = new Set(placedCountries).add(targetCountryId);
      setPlacedCountries(nextPlaced);
      setScore(prev => prev + 100);

      const remaining = unplacedCountries.filter(c => c.id !== targetCountryId);
      setUnplacedCountries(remaining);
      setSelectedFlagId(remaining[0]?.id || null);

      if (nextPlaced.size === EUROPE_COUNTRIES.length) {
        setIsVictory(true);
      }
    } else {
      sound.playIncorrect();
    }
  }, [selectedFlagId, placedCountries, unplacedCountries]);

  // "Show me" action: places flag automatically for 0 points
  const handleShowMe = useCallback((countryId: string) => {
    sound.playReveal();

    // Pulse highlight on map briefly
    setHighlightedCountryId(countryId);
    setTimeout(() => {
      setHighlightedCountryId(prev => (prev === countryId ? null : prev));
    }, 1500);

    const nextPlaced = new Set(placedCountries).add(countryId);
    setPlacedCountries(nextPlaced);

    const remaining = unplacedCountries.filter(c => c.id !== countryId);
    setUnplacedCountries(remaining);
    setSelectedFlagId(remaining[0]?.id || null);

    if (nextPlaced.size === EUROPE_COUNTRIES.length) {
      setIsVictory(true);
    }
  }, [placedCountries, unplacedCountries]);

  // Continent Selection View
  if (screen === 'continent_select') {
    return <ContinentSelect onSelectContinent={handleSelectContinent} />;
  }

  // Active Game View (Full width on any display)
  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <Header
        continentName="Europe"
        placedCount={placedCountries.size}
        totalCount={EUROPE_COUNTRIES.length}
        score={score}
        timeElapsed={timeElapsed}
        onBackToContinents={() => setScreen('continent_select')}
        onRestart={handleRestart}
      />

      {/* Main Full-Width Arena: Left = Map, Right = Flags */}
      <main className="flex-1 w-full h-[calc(100vh-50px)] flex flex-col md:flex-row gap-2.5 p-2.5 overflow-hidden">
        {/* Left Side: Map fills all available space */}
        <section className="flex-1 h-full min-w-0 flex flex-col" aria-label="Map Canvas">
          <EuropeMap
            placedCountries={placedCountries}
            selectedFlagId={selectedFlagId}
            highlightedCountryId={highlightedCountryId}
            onCountryMatch={handleCountryMatch}
          />
        </section>

        {/* Right Side: Flags Dock */}
        <aside className="w-full md:w-72 lg:w-80 xl:w-96 shrink-0 h-full flex flex-col overflow-hidden" aria-label="Flag Selection">
          <FlagDock
            unplacedCountries={unplacedCountries}
            selectedFlagId={selectedFlagId}
            onSelectFlag={handleSelectFlag}
            onShowMe={handleShowMe}
          />
        </aside>
      </main>

      {/* Victory Modal */}
      {isVictory && (
        <VictoryScreen
          score={score}
          timeElapsed={timeElapsed}
          totalCountries={EUROPE_COUNTRIES.length}
          onPlayAgain={handleRestart}
          onSelectContinent={() => setScreen('continent_select')}
        />
      )}
    </div>
  );
}

export default App;
