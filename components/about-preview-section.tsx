"use client";

import { useLanguage } from "@/components/language-provider";

export function AboutPreviewSection() {
  const { messages } = useLanguage();
  const about = messages.about;

  return (
    <section id="about" className="about-section relative pb-24 pt-6 md:pb-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[8%] top-8 h-40 w-40 rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="section-ambient-violet absolute right-[10%] top-12 h-44 w-44 rounded-full bg-violet-500/12 blur-[110px]" />
        <div className="section-ambient-wash absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(59,130,246,0.06),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="about-panel relative animate-fade-up rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="about-copy relative">
              <div className="section-badge about-badge mb-5 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 shadow-[0_0_24px_rgba(167,139,250,0.12)] backdrop-blur">
                {about.badge}
              </div>

              <h2 className="about-title max-w-xl font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[3.1rem]">
                {about.title}
              </h2>

              <p className="about-description mt-5 max-w-xl text-base leading-8 text-slate-300">
                {about.description}
              </p>

              <div className="about-subline mt-8 flex items-center gap-4 text-sm text-slate-400">
                <span className="h-px w-14 bg-gradient-to-r from-sky-300 to-transparent" />
                {about.subline}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {about.cards.map((card, index) => (
                <article
                  key={card.title}
                  className="about-card hover-smooth group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(9,13,30,0.86))] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-md hover:-translate-y-1.5 hover:border-sky-300/24 hover:shadow-[0_24px_54px_rgba(37,99,235,0.18)]"
                >
                  <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-70 group-hover:opacity-100" />
                  <div className="about-card-index hover-smooth absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-400 group-hover:border-sky-300/30 group-hover:bg-sky-300/[0.08] group-hover:text-sky-100 group-hover:shadow-[0_0_18px_rgba(96,165,250,0.16)]">
                    0{index + 1}
                  </div>
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
                      {card.eyebrow}
                    </p>
                    <h3 className="about-card-title hover-smooth mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white group-hover:text-sky-50 group-hover:[text-shadow:0_0_16px_rgba(125,211,252,0.12)]">
                      {card.title}
                    </h3>
                    <p className="about-card-description mt-3 text-sm leading-7 text-slate-300">
                      {card.description}
                    </p>
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
