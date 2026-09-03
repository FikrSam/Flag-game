import { useState, useEffect, useCallback, useRef } from 'react';
import { loadContinentData, preloadContinentData, getCachedContinentData, type ContinentGamePackage } from './data/continentLoader';
import type { CountryData } from './types/game';
import { ContinentSelect } from './components/ContinentSelect';
import { Header } from './components/Header';
import { InteractiveMap } from './components/EuropeMap';
import { FlagDock } from './components/FlagDock';
import { VictoryScreen } from './components/VictoryScreen';
import { triggerHaptic } from './utils/haptics';

export function App() {
  const [screen, setScreen] = useState<'continent_select' | 'game'>('continent_select');
  const [activeContinentId, setActiveContinentId] = useState<string>('europe');
  const [activeContinentData, setActiveContinentData] = useState<ContinentGamePackage | null>(null);
  const [loadingContinentId, setLoadingContinentId] = useState<string | null>(null);

  // Game state
  const [placedCountries, setPlacedCountries] = useState<Set<string>>(new Set());
  const [unplacedCountries, setUnplacedCountries] = useState<CountryData[]>([]);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [namedCountryIds, setNamedCountryIds] = useState<Set<string>>(new Set());
  const [showMeCountryIds, setShowMeCountryIds] = useState<Set<string>>(new Set());
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [highlightedCountryId, setHighlightedCountryId] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload Europe in the background on initial landing
  useEffect(() => {
    preloadContinentData('europe');
  }, []);

  // Helper to initialize and start gameplay once data package is ready
  const applyContinentData = useCallback((dataPkg: ContinentGamePackage, continentId: string) => {
    const shuffled = [...dataPkg.countries].sort(() => Math.random() - 0.5);
    setActiveContinentId(continentId);
    setActiveContinentData(dataPkg);
    setPlacedCountries(new Set());
    setUnplacedCountries(shuffled);
    setSelectedFlagId(shuffled[0]?.id || null);
    setNamedCountryIds(new Set());
    setShowMeCountryIds(new Set());
    setCurrentStreak(0);
    setMaxStreak(0);
    setHighlightedCountryId(null);
    setWrongFeedback(null);
    setScore(0);
    setTimeElapsed(0);
    setIsVictory(false);
    setScreen('game');
  }, []);

  // Lazy-load continent dataset and start game
  const initGame = useCallback((continentId: string) => {
    const cached = getCachedContinentData(continentId);
    if (cached) {
      applyContinentData(cached, continentId);
      return;
    }

    setLoadingContinentId(continentId);
    loadContinentData(continentId)
      .then((dataPkg) => {
        applyContinentData(dataPkg, continentId);
      })
      .catch((err) => {
        console.error(`Failed to load continent data for ${continentId}:`, err);
      })
      .finally(() => {
        setLoadingContinentId(null);
      });
  }, [applyContinentData]);

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
  };

  // Restart / Reset game
  const handleRestart = useCallback(() => {
    if (activeContinentId) {
      initGame(activeContinentId);
    }
  }, [activeContinentId, initGame]);

  // Flag selection
  const handleSelectFlag = (countryId: string) => {
    setSelectedFlagId(countryId);
    triggerHaptic('tap');
  };

  // "Name it" action: reveals name of country
  const handleNameIt = useCallback((countryId: string) => {
    setNamedCountryIds(prev => new Set(prev).add(countryId));
    triggerHaptic('hint');
  }, []);

  // Track last match event timestamp and country to prevent mobile double-tap synthetic clicks
  const lastMatchRef = useRef<{ time: number; countryId: string }>({ time: 0, countryId: '' });

  // Match interaction (drag drop or tap twice)
  const handleCountryMatch = useCallback((targetCountryId: string) => {
    if (!selectedFlagId || !activeContinentData) return;
    if (placedCountries.has(targetCountryId)) return;

    // Debounce duplicate synthetic clicks / rapid double triggers within 250ms
    const now = performance.now();
    if (now - lastMatchRef.current.time < 250 && lastMatchRef.current.countryId === targetCountryId) {
      return;
    }
    lastMatchRef.current = { time: now, countryId: targetCountryId };

    const isMatch = selectedFlagId === targetCountryId;

    if (isMatch) {
      // Haptic feedback for correct placement
      triggerHaptic('success');

      // Increment streak
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setMaxStreak(prev => Math.max(prev, nextStreak));
      setWrongFeedback(null);

      // Scoring: 100 pts without Name It hint, 70 pts (30% deduction) if Name It was used
      const isNamed = namedCountryIds.has(targetCountryId);
      const pointsEarned = isNamed ? 70 : 100;
      setScore(prev => prev + pointsEarned);

      const nextPlaced = new Set(placedCountries).add(targetCountryId);
      setPlacedCountries(nextPlaced);

      const remaining = unplacedCountries.filter(c => c.id !== targetCountryId);
      setUnplacedCountries(remaining);
      setSelectedFlagId(remaining[0]?.id || null);

      if (nextPlaced.size === activeContinentData.countries.length) {
        setIsVictory(true);
      }
    } else {
      // Haptic feedback for mistake
      triggerHaptic('error');

      // Break streak on mistake
      setCurrentStreak(0);
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
  }, [selectedFlagId, activeContinentData, placedCountries, currentStreak, namedCountryIds, unplacedCountries]);

  // "Show me" action: places flag automatically for 0 points & breaks streak
  const handleShowMe = useCallback((countryId: string) => {
    if (!activeContinentData) return;
    triggerHaptic('hint');
    setCurrentStreak(0);
    setShowMeCountryIds(prev => new Set(prev).add(countryId));

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
  }, [activeContinentData, placedCountries, unplacedCountries]);

  // Desktop Speedrun Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing inside inputs or textareas
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Escape key: close victory modal or return to continent selection
      if (e.key === 'Escape') {
        if (isVictory) {
          setIsVictory(false);
        } else if (screen === 'game') {
          setScreen('continent_select');
        }
        return;
      }

      // Only handle game shortcuts during active game screen
      if (screen !== 'game' || isVictory || !activeContinentData) return;

      // N or n: Name It
      if (e.key === 'n' || e.key === 'N') {
        if (selectedFlagId) {
          e.preventDefault();
          handleNameIt(selectedFlagId);
        }
      }

      // S or s: Show Me
      if (e.key === 's' || e.key === 'S') {
        if (selectedFlagId) {
          e.preventDefault();
          handleShowMe(selectedFlagId);
        }
      }

      // R or r: Restart continent
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }

      // Arrow keys: cycle unplaced flags
      if (unplacedCountries.length > 1) {
        const currentIndex = unplacedCountries.findIndex(c => c.id === selectedFlagId);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (currentIndex + 1) % unplacedCountries.length;
          setSelectedFlagId(unplacedCountries[nextIdx].id);
          triggerHaptic('tap');
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (currentIndex - 1 + unplacedCountries.length) % unplacedCountries.length;
          setSelectedFlagId(unplacedCountries[prevIdx].id);
          triggerHaptic('tap');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isVictory, selectedFlagId, unplacedCountries, activeContinentData, handleNameIt, handleShowMe, handleRestart]);

  // Continent Selection View
  if (screen === 'continent_select' || !activeContinentData) {
    return (
      <ContinentSelect
        onSelectContinent={handleSelectContinent}
        loadingContinentId={loadingContinentId}
      />
    );
  }

  // Active Game View (Full width on any display, mobile dynamic viewport height)
  return (
    <div className="h-[100dvh] w-screen max-w-full bg-[#0d0d0d] text-[#f8fafc] flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <Header
        continentName={activeContinentData.name}
        placedCount={placedCountries.size}
        totalCount={activeContinentData.countries.length}
        score={score}
        streak={currentStreak}
        timeElapsed={timeElapsed}
        onBackToContinents={() => setScreen('continent_select')}
        onRestart={handleRestart}
      />

      {/* Main Full-Width Arena: Map fills top/left, Flags Carousel + Global Controls at bottom/right */}
      <main className="flex-1 w-full h-[calc(100dvh-44px)] md:h-[calc(100dvh-50px)] min-h-0 flex flex-col md:flex-row gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 overflow-hidden">
        {/* Left / Top Side: Map fills available space naturally */}
        <section className="relative flex-1 min-h-[220px] w-full h-full flex flex-col overflow-hidden rounded-lg border border-[#333333] shadow-md bg-[#0d0d0d]" aria-label="Map Canvas">
          {/* Wrong country notification banner (vivid rose error feedback) */}
          {wrongFeedback && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-1.5 bg-rose-950/95 border border-rose-500 text-rose-100 text-xs font-semibold rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
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

        {/* Right / Bottom Side: Flags Dock with Carousel & Shared Controls */}
        <aside className="w-full h-44 sm:h-48 md:h-full md:w-72 lg:w-80 xl:w-96 shrink-0 flex flex-col overflow-hidden" aria-label="Flag Selection">
          <FlagDock
            unplacedCountries={unplacedCountries}
            selectedFlagId={selectedFlagId}
            namedCountryIds={namedCountryIds}
            onSelectFlag={handleSelectFlag}
            onNameIt={handleNameIt}
            onShowMe={handleShowMe}
            onDropOnCountry={handleCountryMatch}
          />
        </aside>
      </main>

      {/* Victory Modal */}
      {isVictory && (
        <VictoryScreen
          continentName={activeContinentData.name}
          score={score}
          timeElapsed={timeElapsed}
          totalCountries={activeContinentData.countries.length}
          maxStreak={maxStreak}
          showMeCount={showMeCountryIds.size}
          nameItCount={namedCountryIds.size}
          onPlayAgain={handleRestart}
          onSelectContinent={() => setScreen('continent_select')}
        />
      )}
    </div>
  );
}

export default App;
