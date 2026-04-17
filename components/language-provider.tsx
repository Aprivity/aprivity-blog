"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages, type Language, type Messages } from "@/lib/messages";

const STORAGE_KEY = "aprivity-language";

type LanguageContextValue = {
  language: Language;
  messages: Messages;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return "zh";
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return storedLanguage === "en" ? "en" : "zh";
}

function applyLanguage(language: Language) {
  document.documentElement.dataset.language = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    applyLanguage(language);
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const setLanguage = (nextLanguage: Language) => {
      setLanguageState(nextLanguage);
    };

    return {
      language,
      messages: messages[language],
      setLanguage,
      toggleLanguage: () => setLanguageState((current) => (current === "zh" ? "en" : "zh")),
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
