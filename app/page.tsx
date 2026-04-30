"use client";

import Image from "next/image";
import { GameProvider, useGame } from "./context/GameContext";
import { useLang } from "./context/LanguageContext";
import { RulesDialog, StatsDialog, SettingsDialog, WinModal } from "./components";

function GameBoard() {
  const {
    errorMsg, shake, hardMode, rulesOpen, statsOpen, settingsOpen, winOpen, stats,
    guesses, evaluations,
    setRulesOpen, setStatsOpen, setSettingsOpen, setWinOpen,
    gameOver, won, lost, target, rows, winRow, revealRow, keyStates, handleKey,
  } = useGame();
  const { t } = useLang();

  const keyboardRows = [
    ["1", "2", "3", "4", "5"],
    ["6", "7", "8", "9", "0"],
    ["ENTER", "⌫"],
  ];

  return (
    <>
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <StatsDialog open={statsOpen} onClose={() => setStatsOpen(false)} stats={stats} />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} hardMode={hardMode} setHardMode={() => {}} stats={stats} />
      <WinModal open={winOpen} onClose={() => setWinOpen(false)} guesses={guesses} evaluations={evaluations} target={target} hardMode={hardMode} guessCount={guesses.length} />

      <div className="w-full h-screen bg-[var(--background)] text-[var(--foreground)] flex justify-center overflow-hidden">
        <div className="fixed top-4 left-4 z-50">
          <a href="https://pancake.wtf" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--foreground)]/30 hover:text-[var(--theme)] transition-colors flex items-center gap-1">
            {t("footer.madeWith")}{" "}
            <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f95e.svg" alt="" width={14} height={14} className="inline-block w-3.5 h-3.5" />{" "}
            {t("and")}{" "}
            <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2764.svg" alt="" width={14} height={14} className="inline-block w-3.5 h-3.5" />{" "}
            {t("footer.byPancake")}
          </a>
        </div>

        <div className="w-[25%] flex flex-col">
          <header className="w-full flex justify-center py-2">
            <div className="w-full h-10 px-3 rounded-lg bg-[var(--island)] flex justify-between items-center">
              <button onClick={() => setRulesOpen(true)} className="text-[var(--foreground)]/60 hover:text-[var(--theme)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </button>
              <button onClick={() => setStatsOpen(true)} className="hidden sm:block font-bold tracking-widest text-sm uppercase hover:text-[var(--theme)] transition-colors">
                {t("common.numeral")}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSettingsOpen(true)} className="text-[var(--foreground)]/60 hover:text-[var(--theme)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <button onClick={() => setStatsOpen(true)} className="text-[var(--foreground)]/60 hover:text-[var(--theme)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center gap-4 relative">
            {errorMsg && (
              <div key={errorMsg} className="absolute top-2 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold px-4 py-2 rounded-full error-toast pointer-events-none z-10">
                {errorMsg}
              </div>
            )}
            {hardMode && (
              <div className="absolute top-2 text-xs text-[var(--theme)]/70 font-semibold tracking-widest uppercase">
                Hard Mode
              </div>
            )}
            <div className={`flex flex-col gap-1.5 ${shake ? "shake" : ""}`}>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex gap-1.5 ${winRow === rowIndex ? "row-bounce" : ""}`}>
                  {row.map((cell, cellIndex) => {
                    const isRevealing = revealRow === rowIndex;
                    return (
                      <div
                        key={cellIndex}
                        className={`size-14 border-2 flex items-center justify-center rounded-md text-xl font-bold transition-colors ${cell.state === "joker" ? "bg-[var(--joker)] border-[var(--joker)]" : cell.state === "correct" ? "bg-[var(--correct)] border-[var(--correct)]" : cell.state === "close" ? "bg-[var(--close)] border-[var(--close)]" : cell.state === "near" ? "bg-[var(--near)] border-[var(--near)]" : cell.state === "far" ? "bg-[var(--far)] border-[var(--far)]" : cell.state === "active" ? "bg-[var(--island)] border-[var(--foreground)]/50" : "bg-[var(--island)] border-[var(--foreground)]/20"} text-white ${isRevealing ? "tile-reveal" : ""}`}
                        style={isRevealing ? { animationDelay: `${cellIndex * 120}ms` } : undefined}
                      >
                        {cell.state === "joker" ? "∞" : cell.char}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
              {gameOver && !statsOpen && !winOpen && (
                <div className={`text-sm font-semibold px-5 py-2 rounded-full fade-up ${won ? "bg-[var(--theme)] text-white" : "bg-[var(--island)] border border-white/10 text-[var(--foreground)]/70"}`}>
                  {won ? `${t("game.nice")} 🎉` : `${t("game.theNumberWas")} ${target}`}
                </div>
              )}
          </main>

          <footer className="w-full flex flex-col items-center gap-1.5 pb-4 pt-2">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1.5">
                {row.map((key) => {
                  const digit = /^\d$/.test(key) ? key : null;
                  const ks = digit ? keyStates[digit] : undefined;
                  const colorClass = ks
                    ? ks === "correct" ? "bg-[var(--correct)] border-[var(--correct)]"
                      : ks === "close" ? "bg-[var(--close)] border-[var(--close)]"
                      : ks === "near" ? "bg-[var(--near)] border-[var(--near)]"
                      : ks === "far" ? "bg-[var(--far)] border-[var(--far)]"
                      : ks === "joker" ? "bg-[var(--joker)] border-[var(--joker)]"
                      : "bg-[var(--island)] border-transparent"
                    : "bg-[var(--island)] border-transparent text-[var(--foreground)]";
                  return (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className={`h-14 border-2 rounded-md flex items-center justify-center font-bold uppercase hover:opacity-70 active:scale-90 transition-all duration-100
                        ${colorClass} text-white
                        ${key === "ENTER" ? "px-3 min-w-24 text-xs tracking-wide" : key === "⌫" ? "px-3 min-w-20 text-base" : "w-14 text-sm"}`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </footer>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}
