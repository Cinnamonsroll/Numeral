import type { TileState, Stats } from "./types";

export const TILE_COLORS: Record<TileState, string> = {
  correct: "bg-[var(--correct)] border-[var(--correct)] text-white",
  close: "bg-[var(--close)]   border-[var(--close)]   text-white",
  near: "bg-[var(--near)]    border-[var(--near)]     text-white",
  far: "bg-[var(--far)]     border-[var(--far)]      text-white",
  joker: "bg-[var(--joker)]   border-[var(--joker)]    text-white",
  empty:
    "bg-[var(--island)]  border-[var(--foreground)]/20 text-[var(--foreground)]",
  active:
    "bg-[var(--island)]  border-[var(--foreground)]/50 text-[var(--foreground)]",
};

export const PRIORITY: TileState[] = [
  "correct",
  "close",
  "near",
  "joker",
  "far",
];
export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
export const DEFAULT_STATS: Stats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  dist: [0, 0, 0, 0, 0, 0],
};
