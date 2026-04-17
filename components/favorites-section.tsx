"use client";

import { FavoritesShowcaseEntryCard } from "@/components/favorites-showcase-entry-card";
import { useLanguage } from "@/components/language-provider";

const githubStarsLink = "https://github.com/Aprivity?tab=stars";

export function FavoritesSection() {
  const { messages } = useLanguage();
  const favorites = messages.favorites;

  return (
    <section className="favorites-section relative min-h-[calc(100vh-96px)] py-16 md:py-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-8%] top-16 h-72 w-72 rounded-full bg-sky-500/14 blur-[120px]" />
        <div className="section-ambient-violet absolute right-[-10%] top-8 h-80 w-80 rounded-full bg-violet-500/14 blur-[140px]" />
        <div className="section-ambient-cyan absolute bottom-0 left-[34%] h-64 w-64 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="favorites-panel relative animate-fade-up overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
          <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="relative">
              <div className="section-badge mb-5 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
                {favorites.badge}
              </div>

              <h1 className="max-w-xl font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.2rem]">
                {favorites.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                {favorites.subtitle}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                {favorites.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={githubStarsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-cta hover-smooth inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-3.5 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.025] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)]"
                >
                  {favorites.allButton}
                  <span className="ml-2">-&gt;</span>
                </a>

                <a
                  href="/favorites/showcase"
                  className="secondary-cta hover-smooth inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                >
                  {favorites.showcaseButton}
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FavoritesShowcaseEntryCard
                eyebrow={favorites.showcaseEntry.eyebrow}
                title={favorites.showcaseEntry.title}
                description={favorites.showcaseEntry.description}
                buttonLabel={favorites.showcaseEntry.buttonLabel}
              />

              {favorites.cards.map((card, index) => (
                <article
                  key={card.title}
                  className="favorites-card hover-smooth group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(9,13,30,0.86))] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-md hover:-translate-y-1.5 hover:border-sky-300/24 hover:shadow-[0_24px_54px_rgba(37,99,235,0.18)]"
                >
                  <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-70 group-hover:opacity-100" />
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-400">
                    0{index + 2}
                  </div>
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="relative flex min-h-48 flex-col">
                    <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
                      {card.eyebrow}
                    </p>
                    <h2 className="favorites-card-title mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
                      {card.title}
                    </h2>
                    <p className="favorites-card-description mt-3 flex-1 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>

                    <a
                      href={githubStarsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-smooth mt-5 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 hover:border-sky-300/35 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_24px_rgba(96,165,250,0.14)]"
                    >
                      {favorites.cardButton}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
