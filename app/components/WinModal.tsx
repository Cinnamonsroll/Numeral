"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { toast } from "sonner";
import type { TileState } from "../utils/types";
import { TILE_COLORS } from "../utils/constants";
import { copyResultsToClipboard } from "../utils/lib";
import { useLang } from "../context/LanguageContext";

const WIN_MESSAGES: Record<number, string> = {
  1: "Genius!",
  2: "Magnificent!",
  3: "Impressive!",
  4: "Splendid!",
  5: "Great!",
  6: "Phew!",
};

export function WinModal({
  open, onClose, guesses, evaluations, target, hardMode, guessCount,
}: {
  open: boolean;
  onClose: () => void;
  guesses: string[];
  evaluations: TileState[][];
  target: string;
  hardMode: boolean;
  guessCount: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && ref.current) {
      ref.current.showModal();
    } else if (ref.current) {
      ref.current.close();
    }
  }, [open]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);

  const nextGame = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const countdown = useMemo(() => {
    const diff = nextGame.getTime() - now;
    if (diff <= 0) return "Soon";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }, [now, nextGame]);

  const handleCopy = useCallback(() => {
    copyResultsToClipboard(guesses, evaluations, guessCount, hardMode)
      .then(() => toast.success("Results copied to clipboard!"))
      .catch(() => toast.error("Failed to copy results"));
  }, [guesses, evaluations, guessCount, hardMode]);

  const { t } = useLang();
  const winMessage = WIN_MESSAGES[guessCount] ?? t("game.nice");

  return (
    <>
      {open && <div className="backdrop" onClick={onClose} />}
      <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} className={`numeral-dialog ${open ? "open" : ""}`}>
        <div className="bg-[var(--island)] rounded-2xl border border-white/8 p-6 flex flex-col gap-4 items-center">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-widest uppercase">{winMessage}</h2>
          <button
            onClick={onClose}
            className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
          <p className="text-sm text-[var(--foreground)]/60 text-center">
            {t("game.theNumberWas")}{" "}
            <span className="font-bold text-[var(--theme)]">{target}</span>
          </p>
        <div className="flex flex-col gap-1.5">
          {guesses.map((g, i) => (
            <div key={i} className="flex gap-1.5">
              {g.split("").map((ch, j) => (
                <div
                  key={j}
                  className={`size-9 rounded-md flex items-center justify-center text-sm font-bold text-white ${TILE_COLORS[evaluations[i][j]]}`}
                >
                  {evaluations[i][j] === "joker" ? "∞" : ch}
                </div>
              ))}
            </div>
          ))}
        </div>
          <div className="text-center text-xs text-[var(--foreground)]/40 font-mono">
            {t("game.nextGameIn")} {countdown}
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[var(--theme)] text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("game.shareResults")}
          </button>
      </div>
    </dialog>
    </>
  );
}
