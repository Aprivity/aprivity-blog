"use client";

import type { FavoriteSource } from "@/lib/favorite-types";

type SourceBadgeProps = {
  source: FavoriteSource;
  label?: string;
};

export function SourceBadge({ source, label }: SourceBadgeProps) {
  const displayLabel = label ?? (source === "github" ? "GitHub" : "Awwwards");
  const className =
    source === "github"
      ? "border-white/12 bg-white/[0.06] text-slate-100"
      : "border-sky-300/20 bg-sky-300/[0.1] text-sky-100";

  return (
    <span
      className={`source-badge inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md ${className}`}
    >
      {displayLabel}
    </span>
  );
}
