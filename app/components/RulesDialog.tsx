"use client";

import { useEffect, useRef } from "react";
import { useLang } from "../context/LanguageContext";

export function RulesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && ref.current) {
      ref.current.showModal();
    } else if (ref.current) {
      ref.current.close();
    }
  }, [open]);

  const rules = [
    { cls: "bg-[var(--correct)]", tKey: "exactMatch", num: "3" },
    { cls: "bg-[var(--close)]",   tKey: "offBy1or2", num: "5" },
    { cls: "bg-[var(--near)]",    tKey: "offBy3or4", num: "2" },
    { cls: "bg-[var(--far)]",     tKey: "offBy5plus", num: "8" },
    { cls: "bg-[var(--joker)]",   tKey: "jokerHidden", num: "∞" },
  ];

  return (
    <>
      {open && <div className="backdrop" onClick={onClose} />}
      <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} className={`numeral-dialog ${open ? "open" : ""}`}>
        <div className="bg-[var(--island)] rounded-2xl border border-white/8 p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold tracking-widest uppercase">{t("howToPlay", "common")}</h2>
            <button onClick={onClose} className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors text-lg leading-none">✕</button>
          </div>
          <p className="text-sm text-[var(--foreground)]/60 leading-relaxed">
            {t("guessSecret", "game")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {rules.map(({ cls, tKey, num }) => (
              <div key={tKey} className="flex items-center gap-3">
                <div className={`${cls} size-11 rounded-md flex-shrink-0 flex items-center justify-center text-white font-bold text-lg`}>{num}</div>
                <span className="text-sm text-[var(--foreground)]/75">{t(tKey, "game")}</span>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
