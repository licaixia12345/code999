export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  isStarted: boolean;
  speed: number;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  CELL_SIZE: 20,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 5,
  MIN_SPEED: 50,
} as const;

export const DIFFICULTY_SPEED: Record<Difficulty, number> = {
  easy: 200,
  normal: 150,
  hard: 100,
};
