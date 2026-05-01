import { DEFAULT_STATS } from "./constants";
import type { Stats, TileState } from "./types";

const lcg = (seed: number) => {
  const m = 2 ** 16;
  const c = 54321;
  const a = 22695477;
  return ((a * seed + c) % m) % 100_000;
};

export function getDayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function generateNumber(): string {
  const date = new Date();
  const seed =
    date.getDay() + date.getMonth() * date.getDate() + date.getFullYear();
  return lcg(seed).toString().padStart(5, "0");
}

export function evaluateGuess(guess: string, target: string): TileState[] {
  return guess.split("").map((ch, i) => {
    const dist = Math.abs(Number(ch) - Number(target[i]));
    if (dist === 0) return "correct";
    if (Math.random() < 0.01) return "joker";
    if (dist <= 2) return "close";
    if (dist <= 4) return "near";
    return "far";
  });
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem("numeral-stats");
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(s: Stats) {
  try {
    localStorage.setItem("numeral-stats", JSON.stringify(s));
  } catch {}
}

export interface GameState {
  target: string;
  guesses: string[];
  evaluations: TileState[][];
  won: boolean;
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(`numeral-game-${getDayKey()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState) {
  try {
    localStorage.setItem(`numeral-game-${getDayKey()}`, JSON.stringify(state));
  } catch {}
}

const EMOJI_MAP: Record<string, string> = {
  correct: "🟩", close: "🟨", near: "🟧", far: "🟥", joker: "🟪",
};

export function generateShareText(
  guesses: string[],
  evaluations: TileState[][],
  guessCount: number,
): string {
  const lines = guesses.map((g, i) =>
    g.split("").map((_, j) => EMOJI_MAP[evaluations[i][j]] ?? "⬛").join("")
  );
  return [
    `Numeral ${new Date().toLocaleDateString()} ${guessCount}/6`,
    ...lines,
    "",
    "https://numeral.pancake.wtf",
  ].join("\n");
}

export async function copyResultsToClipboard(
  guesses: string[],
  evaluations: TileState[][],
  guessCount: number,
): Promise<void> {
  const text = generateShareText(guesses, evaluations, guessCount);
  await navigator.clipboard.writeText(text);
}
