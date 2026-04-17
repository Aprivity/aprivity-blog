"use client";

import type { FavoriteSource, FavoritesCounts } from "@/lib/favorite-types";

export type InspirationFilter = "all" | FavoriteSource;

type InspirationWallHeaderProps = {
  activeFilter: InspirationFilter;
  counts: FavoritesCounts;
  isRefreshing: boolean;
  onFilterChange: (filter: InspirationFilter) => void;
  onRefresh: () => void;
};

const COPY = {
  badge: "Favorite Sources",
  title: "Frontend Inspirations",
  subtitle:
    "\u6c47\u96c6\u6211\u7684 Awwwards \u524d\u7aef\u7075\u611f\u4e0e GitHub \u516c\u5f00\u661f\u6807\u4ed3\u5e93\uff0c\u4f18\u5148\u6d4f\u89c8\u5185\u5bb9\u672c\u8eab\u3002",
  all: "All",
  awwwards: "Awwwards \u6536\u85cf",
  github: "GitHub \u6536\u85cf",
  reload: "\u91cd\u65b0\u52a0\u8f7d",
  refreshing: "\u5237\u65b0\u4e2d",
  countLabel: "\u6536\u85cf",
};

const filters: Array<{ key: InspirationFilter; label: string }> = [
  { key: "all", label: COPY.all },
  { key: "awwwards", label: COPY.awwwards },
  { key: "github", label: COPY.github },
];

function getFilterCount(counts: FavoritesCounts, filter: InspirationFilter) {
  if (filter === "all") {
    return counts.total;
  }

  return counts[filter];
}

export function InspirationWallHeader({
  activeFilter,
  counts,
  isRefreshing,
  onFilterChange,
  onRefresh,
}: InspirationWallHeaderProps) {
  return (
    <header className="inspiration-header animate-fade-up">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="section-badge mb-4 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
            {COPY.badge}
          </div>
          <h1 className="inspiration-title font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {COPY.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {COPY.subtitle}
          </p>
        </div>

        <div className="inspiration-toolbar rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-3 shadow-[0_18px_52px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-sky-300/16 bg-sky-300/[0.08] px-3 py-2 text-xs text-sky-100/85">
              Awwwards {counts.awwwards}
            </div>
            <div className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-xs text-slate-200">
              GitHub {counts.github}
            </div>
            <div className="rounded-full border border-violet-300/16 bg-violet-300/[0.08] px-3 py-2 text-xs text-violet-100/85">
              Total {counts.total}
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="secondary-cta hover-smooth rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-200 hover:-translate-y-0.5 hover:border-sky-300/38 hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isRefreshing ? COPY.refreshing : COPY.reload}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = getFilterCount(counts, filter.key);

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`hover-smooth shrink-0 rounded-full border px-4 py-2 text-sm ${
                isActive
                  ? "border-sky-300/42 bg-sky-300/[0.14] text-sky-50 shadow-[0_0_28px_rgba(96,165,250,0.16)]"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:-translate-y-0.5 hover:border-sky-300/28 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {filter.label}
              <span className="ml-2 text-xs text-current opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
