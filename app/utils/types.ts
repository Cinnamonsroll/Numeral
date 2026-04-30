export type TileState =
  | "correct"
  | "close"
  | "near"
  | "far"
  | "joker"
  | "empty"
  | "active";

export type Stats = {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  dist: number[];
};
