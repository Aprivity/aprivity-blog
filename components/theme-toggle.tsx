"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "aprivity-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const initialTheme: Theme = storedTheme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle hover-smooth inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 backdrop-blur-md hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_24px_rgba(96,165,250,0.18)]"
      aria-label={mounted ? (theme === "dark" ? "切换到浅色模式" : "切换到深色模式") : "切换主题"}
      title={mounted ? (theme === "dark" ? "切换到浅色模式" : "切换到深色模式") : "切换主题"}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
            mounted && theme === "light"
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-45 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5" />
          <path d="M12 19.5V22" />
          <path d="M4.93 4.93l1.77 1.77" />
          <path d="M17.3 17.3l1.77 1.77" />
          <path d="M2 12h2.5" />
          <path d="M19.5 12H22" />
          <path d="M4.93 19.07l1.77-1.77" />
          <path d="M17.3 6.7l1.77-1.77" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
            !mounted || theme === "dark"
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 rotate-45 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.4 14.5A8.5 8.5 0 1 1 9.5 3.6a7 7 0 0 0 10.9 10.9Z" />
        </svg>
      </span>
    </button>
  );
}
