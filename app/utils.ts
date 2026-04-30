import { DEFAULT_STATS } from "./utils/constants";
import { Stats, TileState } from "./utils/types";


const lcg = (seed: number) => {
  const m = 2 ** 16;
  const c = 54321;
  const a = 22695477;
  return ((a * seed + c) % m) % 100_000;
};

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
    if (Math.random() < 0.05) return "joker";
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
