"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { language, messages, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="language-toggle hover-smooth inline-flex h-10 min-w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-semibold tracking-[0.18em] text-slate-200 backdrop-blur-md hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_24px_rgba(96,165,250,0.18)]"
      aria-label={messages.language.toggleLabel}
      title={messages.language.toggleLabel}
    >
      <span className="text-sky-200">{messages.language.shortLabel}</span>
      <span className="mx-1.5 text-slate-500">/</span>
      <span className="text-slate-400">{messages.language.nextLabel}</span>
    </button>
  );
}
