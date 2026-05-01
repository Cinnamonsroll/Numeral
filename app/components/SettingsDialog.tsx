"use client";

import { useEffect, useRef } from "react";
import type { Stats } from "../utils/types";
import { useLang } from "../context/LanguageContext";
import Image from "next/image";

export function SettingsDialog({
  open,
  onClose,
  stats,
}: {
  open: boolean;
  onClose: () => void;
  stats?: Stats;
}) {
  const { lang, setLang, t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && ref.current) {
      ref.current.showModal();
    } else if (ref.current) {
      ref.current.close();
    }
  }, [open]);

  return (
    <>
      {open && <div className="backdrop" onClick={onClose} />}
      <dialog
        ref={ref}
        onClose={onClose}
        onClick={(e) => {
          if (e.target === ref.current) onClose();
        }}
        className={`numeral-dialog ${open ? "open" : ""}`}
      >
        <div className="bg-[var(--island)] rounded-2xl border border-white/8 p-6 flex flex-col gap-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-base font-bold tracking-widest uppercase">
              {t("common.settings")}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--foreground)]/40 mb-4">
              Language
            </p>
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${lang === "en" ? "bg-[var(--theme)] text-white" : "bg-[var(--background)] text-[var(--foreground)]/60 border border-white/10"}`}
            >
              <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg" alt="EN" width={18} height={18} className="inline-block" />
              English
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${lang === "fr" ? "bg-[var(--theme)] text-white" : "bg-[var(--background)] text-[var(--foreground)]/60 border border-white/10"}`}
            >
              <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1eb-1f1f7.svg" alt="FR" width={18} height={18} className="inline-block" />
              Français
            </button>
          </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
