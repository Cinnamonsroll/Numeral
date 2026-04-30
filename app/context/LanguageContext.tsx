"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";

type Translations = Record<string, any>;

const LanguageContext = createContext<{
  lang: string;
  setLang: (l: string) => void;
  t: (key: string, section?: string) => string;
} | null>(null);

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

async function loadTranslationsFile(lang: string): Promise<Translations> {
  try {
    const mod = await import(`../i18n/${lang}.json`);
    return mod.default ?? mod;
  } catch {
    const mod = await import(`../i18n/en.json`);
    return mod.default ?? mod;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("en");
  const [translations, setTranslations] = useState<Translations>({});

  const load = useCallback(async (l: string) => {
    const t = await loadTranslationsFile(l);
    setTranslations(t);
    setLangState(l);
    localStorage.setItem("numeral-lang", l);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("numeral-lang") ?? "en";
    load(saved);
  }, [load]);

  const t = useMemo(() => {
    return (key: string, section?: string) => {
      if (section) {
        return translations[section]?.[key] ?? key;
      }
      return translations[key] ?? key;
    };
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: load, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
