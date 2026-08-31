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
