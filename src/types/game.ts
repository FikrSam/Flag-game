export type GameMode = 'challenge' | 'practice';

export type GameScreen = 'title' | 'game';

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  timeElapsed: number;
  correctPlacements: number;
  mistakes: number;
  revealsUsed: number;
}

export interface CountryData {
  id: string;
  numeric: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
  flagDataUri: string;
  path: string;
  centroid: [number, number];
  bbox: { x: number; y: number; width: number; height: number };
  isMicrostate: boolean;
}
