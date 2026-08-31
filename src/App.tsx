import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { EUROPE_COUNTRIES, CONTEXT_LAND_PATHS, MAP_CONFIG } from './data/europeData';
import { AFRICA_COUNTRIES, AFRICA_CONTEXT_LAND_PATHS, AFRICA_MAP_CONFIG } from './data/africaData';
import type { CountryData } from './types/game';
import { ContinentSelect } from './components/ContinentSelect';
import { Header } from './components/Header';
import { InteractiveMap } from './components/EuropeMap';
import { FlagDock } from './components/FlagDock';
import { VictoryScreen } from './components/VictoryScreen';
import { sound } from './utils/sound';

export function App() {
  const [screen, setScreen] = useState<'continent_select' | 'game'>('continent_select');
  const [activeContinentId, setActiveContinentId] = useState<string>('europe');

  // Continent data resolution
  const activeContinentData = useMemo(() => {
    if (activeContinentId === 'africa') {
      return {
        id: 'africa',
        name: 'Africa',
        countries: AFRICA_COUNTRIES,
        contextLandPaths: AFRICA_CONTEXT_LAND_PATHS,
        mapConfig: AFRICA_MAP_CONFIG
      };
    }
    return {
      id: 'europe',
      name: 'Europe',
      countries: EUROPE_COUNTRIES,
      contextLandPaths: CONTEXT_LAND_PATHS,
      mapConfig: MAP_CONFIG
    };
  }, [activeContinentId]);

  // Game state
  const [placedCountries, setPlacedCountries] = useState<Set<string>>(new Set());
  const [unplacedCountries, setUnplacedCountries] = useState<CountryData[]>([]);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [highlightedCountryId, setHighlightedCountryId] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize unplaced flags when continent changes or screen starts
  const initGame = useCallback((continentId: string) => {
    const data = continentId === 'africa' ? AFRICA_COUNTRIES : EUROPE_COUNTRIES;
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setActiveContinentId(continentId);
    setPlacedCountries(new Set());
    setUnplacedCountries(shuffled);
    setSelectedFlagId(shuffled[0]?.id || null);
    setHighlightedCountryId(null);
    setWrongFeedback(null);
    setScore(0);
    setTimeElapsed(0);
    setIsVictory(false);
  }, []);


  // Timer
  useEffect(() => {
    if (screen !== 'game' || isVictory) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, isVictory]);

  // Cleanup feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // Start continent game
  const handleSelectContinent = (continentId: string) => {
    initGame(continentId);
    setScreen('game');
  };

  // Restart / Reset game
  const handleRestart = () => {
    sound.playSelect();
    initGame(activeContinentId);
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
      setWrongFeedback(null);

      const nextPlaced = new Set(placedCountries).add(targetCountryId);
      setPlacedCountries(nextPlaced);
      setScore(prev => prev + 100);

      const remaining = unplacedCountries.filter(c => c.id !== targetCountryId);
      setUnplacedCountries(remaining);
      setSelectedFlagId(remaining[0]?.id || null);

      if (nextPlaced.size === activeContinentData.countries.length) {
        setIsVictory(true);
      }
    } else {
      sound.playIncorrect();
      const clickedCountry = activeContinentData.countries.find(c => c.id === targetCountryId);
      if (clickedCountry) {
        if (feedbackTimerRef.current) {
          clearTimeout(feedbackTimerRef.current);
        }
        setWrongFeedback(`This is ${clickedCountry.name}`);
        feedbackTimerRef.current = setTimeout(() => {
          setWrongFeedback(null);
        }, 1200);
      }
    }
  }, [selectedFlagId, placedCountries, unplacedCountries, activeContinentData.countries]);

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

    if (nextPlaced.size === activeContinentData.countries.length) {
      setIsVictory(true);
    }
  }, [placedCountries, unplacedCountries, activeContinentData.countries.length]);

  // Continent Selection View
  if (screen === 'continent_select') {
    return <ContinentSelect onSelectContinent={handleSelectContinent} />;
  }

  // Active Game View (Full width on any display)
  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <Header
        continentName={activeContinentData.name}
        placedCount={placedCountries.size}
        totalCount={activeContinentData.countries.length}
        score={score}
        timeElapsed={timeElapsed}
        onBackToContinents={() => setScreen('continent_select')}
        onRestart={handleRestart}
      />

      {/* Main Full-Width Arena: Left = Map, Right = Flags */}
      <main className="flex-1 w-full h-[calc(100vh-50px)] flex flex-col md:flex-row gap-2.5 p-2.5 overflow-hidden">
        {/* Left Side: Map fills all available space */}
        <section className="relative flex-1 h-full min-w-0 flex flex-col" aria-label="Map Canvas">
          {/* Wrong country notification banner (clean red badge) */}
          {wrongFeedback && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-1.5 bg-rose-950/95 border border-rose-600/80 text-rose-100 text-xs font-semibold rounded-md shadow-xl backdrop-blur-md">
                {wrongFeedback}
              </div>
            </div>
          )}

          <InteractiveMap
            countries={activeContinentData.countries}
            contextLandPaths={activeContinentData.contextLandPaths}
            mapConfig={activeContinentData.mapConfig}
            continentName={activeContinentData.name}
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
          totalCountries={activeContinentData.countries.length}
          onPlayAgain={handleRestart}
          onSelectContinent={() => setScreen('continent_select')}
        />
      )}
    </div>
  );
}

export default App;
