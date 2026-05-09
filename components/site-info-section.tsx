"use client";

import { useLanguage } from "@/components/language-provider";

export function SiteInfoSection() {
  const { language, messages } = useLanguage();
  const siteInfo = messages.siteInfo;
  const stackTitle = language === "zh" ? "技术栈与部署" : "Stack & Deployment";

  return (
    <section id="site-info" className="site-info-section relative pb-24 pt-6 md:pb-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[8%] top-8 h-40 w-40 rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="section-ambient-violet absolute right-[10%] top-12 h-44 w-44 rounded-full bg-violet-500/12 blur-[110px]" />
        <div className="section-ambient-wash absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(59,130,246,0.06),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="about-panel relative animate-fade-up rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="about-copy relative">
              <div className="section-badge about-badge mb-5 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 shadow-[0_0_24px_rgba(167,139,250,0.12)] backdrop-blur">
                {siteInfo.title}
              </div>

              <h2 className="about-title max-w-xl font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[3.1rem]">
                {siteInfo.title}
              </h2>

              <p className="about-description mt-5 max-w-xl text-base leading-8 text-slate-300">
                {siteInfo.description}
              </p>
            </div>

            <div className="about-card relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(9,13,30,0.86))] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-md sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-70" />
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative grid gap-3">
                {siteInfo.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="site-info-stat-row flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                  >
                    <span className="site-info-stat-label min-w-0 text-sm leading-6 text-slate-300">
                      {stat.label}
                    </span>
                    <strong className="site-info-stat-value shrink-0 text-right font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-white sm:text-xl">
                      {stat.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="site-info-badge-panel relative mt-5 overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.035] px-3.5 py-3 backdrop-blur-md sm:px-4 lg:mt-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.08),transparent_40%)] opacity-80" />
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

            <div className="relative">
              <h3 className="site-info-badge-title mb-2 font-[family-name:var(--font-space-grotesk)] text-sm font-semibold leading-5 text-white">
                {stackTitle}
              </h3>

              <div className="site-info-badges flex min-w-0 flex-wrap gap-2">
                {siteInfo.badges.map((badge) => {
                  const badgeContent = (
                    <>
                      <span className="site-info-badge-label min-w-0 px-1.5 py-0.5">
                        {badge.label}
                      </span>
                      <span className="site-info-badge-value min-w-0 px-1.5 py-0.5 font-medium">
                        {badge.value}
                      </span>
                    </>
                  );

                  if (badge.href) {
                    return (
                      <a
                        key={`${badge.label}-${badge.value}`}
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-info-badge site-info-badge-link hover-smooth inline-flex max-w-full overflow-hidden rounded-full border text-[11px] leading-[18px]"
                      >
                        {badgeContent}
                      </a>
                    );
                  }

                  return (
                    <span
                      key={`${badge.label}-${badge.value}`}
                      className="site-info-badge inline-flex max-w-full overflow-hidden rounded-full border text-[11px] leading-[18px]"
                    >
                      {badgeContent}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
