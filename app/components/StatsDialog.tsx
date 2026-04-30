"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { Stats, TileState } from "../utils/types";
import { useGame } from "../context/GameContext";
import { useLang } from "../context/LanguageContext";
import { copyResultsToClipboard } from "../utils/lib";

const WIN_MESSAGES: Record<number, string> = {
  1: "Genius!",
  2: "Magnificent!",
  3: "Impressive!",
  4: "Splendid!",
  5: "Great!",
  6: "Phew!",
};

export function StatsDialog({
  open, onClose, stats,
}: {
  open: boolean;
  onClose: () => void;
  stats: Stats;
}) {
  const { t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && ref.current) {
      ref.current.showModal();
    } else if (ref.current) {
      ref.current.close();
    }
  }, [open]);

  const { guesses, evaluations, target, hardMode, won } = useGame();

  const maxDist = Math.max(...stats.dist, 1);
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  const handleCopy = useCallback(() => {
    if (!won || guesses.length === 0) return;
    copyResultsToClipboard(guesses, evaluations, guesses.length, hardMode)
      .then(() => toast.success("Results copied to clipboard!"))
      .catch(() => toast.error("Failed to copy results"));
  }, [guesses, evaluations, hardMode, won]);

  const winMessage = useMemo(() => {
    if (!won) return null;
    return WIN_MESSAGES[guesses.length] ?? "Nice!";
  }, [won, guesses.length]);

  return (
    <>
      {open && <div className="backdrop" onClick={onClose} />}
      <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} className={`numeral-dialog ${open ? "open" : ""}`}>
        <div className="bg-[var(--island)] rounded-2xl border border-white/8 p-6 flex flex-col gap-6 items-center">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-base font-bold tracking-widest uppercase">{t("statistics")}</h2>
          <button onClick={onClose} className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors text-lg leading-none">✕</button>
        </div>
          {won && winMessage && (
            <p className="text-lg font-bold tracking-widest uppercase">{t(winMessage.toLowerCase())}</p>
          )}
        <div className="grid grid-cols-4 gap-2 w-full">
              {[
                { value: stats.played, key: "played" },
                { value: `${winPct}%`, key: "winPct" },
                { value: stats.streak, key: "streak" },
                { value: stats.maxStreak, key: "best" },
              ].map(({ value, key }) => (
                <div key={key} className="flex flex-col items-center gap-1 bg-[var(--background)] rounded-xl p-3">
                  <span className="text-2xl font-bold text-[var(--theme)]">{value}</span>
                  <span className="text-xs text-[var(--foreground)]/40 text-center leading-tight">{t(key)}</span>
                </div>
              ))}
        </div>
        <div className="flex flex-col gap-2 w-full">
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--foreground)]/40">{t("guessDistribution")}</p>
          {stats.dist.map((count, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-[var(--foreground)]/40 text-right text-xs">{i + 1}</span>
              <div className="flex-1 bg-[var(--background)] rounded h-7 overflow-hidden">
                <div
                  className="h-full bg-[var(--theme)] rounded flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-700 ease-out"
                  style={{ width: count ? `${Math.max((count / maxDist) * 100, 10)}%` : "0%" }}
                >
                  {count > 0 ? count : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
        {won && guesses.length > 0 && (
          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[var(--theme)] text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("shareResults")}
          </button>
        )}
      </div>
    </dialog>
    </>
  );
}
