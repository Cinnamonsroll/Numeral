"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { TileState, Stats } from "../utils/types";
import {
  DEFAULT_STATS,
  MAX_GUESSES,
  WORD_LENGTH,
  PRIORITY,
  TILE_COLORS,
} from "../utils/constants";
import {
  generateNumber,
  evaluateGuess,
  loadStats,
  saveStats,
  loadGame,
  saveGame,
} from "../utils/lib";

interface GameState {
  target: string;
  guesses: string[];
  evaluations: TileState[][];
  current: string;
  shake: boolean;
  stats: Stats;
  rulesOpen: boolean;
  statsOpen: boolean;
  settingsOpen: boolean;
  winOpen: boolean;
  errorMsg: string;
  revealRow: number | null;
  winRow: number | null;
  gameLoaded: boolean;
  won: boolean;
  lost: boolean;
  gameOver: boolean;
  rows: { char: string; state: TileState }[][];
  keyStates: Record<string, TileState>;
  setRulesOpen: (v: boolean) => void;
  setStatsOpen: (v: boolean) => void;
  setSettingsOpen: (v: boolean) => void;
  setWinOpen: (v: boolean) => void;
  handleKey: (key: string) => void;
}

const GameContext = createContext<GameState | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<TileState[][]>([]);
  const [current, setCurrent] = useState("");
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [revealRow, setRevealRow] = useState<number | null>(null);
  const [winRow, setWinRow] = useState<number | null>(null);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setTarget(saved.target);
      setGuesses(saved.guesses);
      setEvaluations(saved.evaluations);
      if (saved.won) {
        setWinOpen(true);
      }
    } else {
      setTarget(generateNumber());
    }
    setStats(loadStats());
    setGameLoaded(true);
  }, []);

  const won = evaluations.at(-1)?.every((s) => s === "correct") ?? false;
  const lost = !won && guesses.length === MAX_GUESSES;
  const gameOver = won || lost;

  useEffect(() => {
    if (!gameLoaded) return;
    if (won || lost) {
      saveGame({ target, guesses, evaluations, won });
    }
  }, [won, lost, target, guesses, evaluations, gameLoaded]);

  const showError = useCallback((msg: string) => {
    setErrorMsg("");
    requestAnimationFrame(() => setErrorMsg(msg));
    setTimeout(() => setErrorMsg(""), 2000);
  }, []);

  const updateStats = useCallback((didWin: boolean, guessCount: number) => {
    setStats((prev) => {
      const next: Stats = {
        played: prev.played + 1,
        wins: prev.wins + (didWin ? 1 : 0),
        streak: didWin ? prev.streak + 1 : 0,
        maxStreak: didWin
          ? Math.max(prev.maxStreak, prev.streak + 1)
          : prev.maxStreak,
        dist: prev.dist.map((v, i) =>
          didWin && i === guessCount - 1 ? v + 1 : v,
        ),
      };
      saveStats(next);
      return next;
    });
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver || !gameLoaded) return;

      if (key === "⌫" || key === "Backspace") {
        setCurrent((c) => c.slice(0, -1));
        return;
      }

      if (key === "ENTER" || key === "Enter") {
        if (current.length < WORD_LENGTH) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          showError("Not enough digits");
          return;
        }

        const rowIndex = guesses.length;
        const ev = evaluateGuess(current, target);
        const didWin = ev.every((s) => s === "correct");
        const nextCount = rowIndex + 1;

        setGuesses((g) => [...g, current]);
        setEvaluations((e) => [...e, ev]);
        setCurrent("");
        setRevealRow(rowIndex);
        setTimeout(() => setRevealRow(null), WORD_LENGTH * 130 + 450);

        if (didWin) {
          const delay = WORD_LENGTH * 130 + 100;
          setTimeout(() => {
            setWinRow(rowIndex);
            setTimeout(() => setWinRow(null), 700);
          }, delay);
          setTimeout(() => updateStats(true, nextCount), delay);
          setTimeout(() => setWinOpen(true), delay + 600);
        } else if (nextCount === MAX_GUESSES) {
          setTimeout(() => updateStats(false, nextCount), 400);
          setTimeout(() => setStatsOpen(true), 900);
        }
        return;
      }

      if (/^\d$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => c + key);
      }
    },
    [
      gameOver,
      current,
      evaluations,
      guesses,
      target,
      showError,
      updateStats,
      gameLoaded,
    ],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const rows = useMemo(() => {
    const result: { char: string; state: TileState }[][] = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
      if (r < guesses.length) {
        result.push(
          guesses[r]
            .split("")
            .map((ch, i) => ({ char: ch, state: evaluations[r][i] })),
        );
      } else if (r === guesses.length && !gameOver) {
        result.push(
          Array(WORD_LENGTH)
            .fill(null)
            .map((_, i) => ({
              char: current[i] ?? "",
              state: (current[i] ? "active" : "empty") as TileState,
            })),
        );
      } else {
        result.push(
          Array(WORD_LENGTH)
            .fill(null)
            .map(() => ({ char: "", state: "empty" as TileState })),
        );
      }
    }
    return result;
  }, [guesses, evaluations, current, gameOver]);

  const keyStates: Record<string, TileState> = {};
  evaluations.forEach((ev, gi) => {
    guesses[gi].split("").forEach((ch, i) => {
      const prev = keyStates[ch];
      if (!prev || PRIORITY.indexOf(ev[i]) < PRIORITY.indexOf(prev))
        keyStates[ch] = ev[i];
    });
  });

  return (
    <GameContext.Provider
      value={{
        target,
        guesses,
        evaluations,
        current,
        shake,
        stats,
        rulesOpen,
        statsOpen,
        settingsOpen,
        winOpen,
        errorMsg,
        revealRow,
        winRow,
        gameLoaded,
        won,
        lost,
        gameOver,
        rows,
        keyStates,
        setRulesOpen,
        setStatsOpen,
        setSettingsOpen,
        setWinOpen,
        handleKey,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
