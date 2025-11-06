
export enum GameState {
  START,
  PLAYING,
  PAUSED,
  GAME_OVER,
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinates {
  x: number;
  y: number;
}
