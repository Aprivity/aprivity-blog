"use client";

import Image from "next/image";
import { useState } from "react";
import { GitHubFavoriteCard } from "@/components/github-favorite-card";
import { SourceBadge } from "@/components/source-badge";
import type { UnifiedFavoriteItem } from "@/lib/favorite-types";

type InspirationCardProps = {
  item: UnifiedFavoriteItem;
  index: number;
};

const COPY = {
  viewDetails: "\u67e5\u770b\u8be6\u60c5",
  openSite: "\u6253\u5f00\u539f\u7f51\u7ad9",
  previewUnavailable: "Preview unavailable",
};

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.slice(0, 5).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-slate-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function AwwwardsFavoriteCard({ item, index }: InspirationCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const canRenderImage = Boolean(item.image) && !hasImageError;

  return (
    <article className="inspiration-card hover-smooth group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(7,10,24,0.92))] shadow-[0_18px_58px_rgba(2,6,23,0.38)] backdrop-blur-xl hover:-translate-y-1.5 hover:border-sky-300/30 hover:shadow-[0_26px_76px_rgba(37,99,235,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_40%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent" />

      <div className="relative overflow-hidden border-b border-white/10 bg-black/20">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`View ${item.title}`}
        >
          <div className="relative aspect-[16/11] overflow-hidden">
            {canRenderImage ? (
              <>
                <Image
                  src={item.image!}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.045]"
                  onError={() => setHasImageError(true)}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.68))]" />
              </>
            ) : (
              <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,rgba(14,165,233,0.2),rgba(99,102,241,0.14),rgba(15,23,42,0.94))] p-5">
                <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-sky-100/80">
                  <span>Awwwards</span>
                  <span>#{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-sky-100/70">
                    {COPY.previewUnavailable}
                  </p>
                  <p className="mt-3 max-w-[18rem] font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-tight text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-end justify-between gap-3 p-4">
              <SourceBadge source="awwwards" />
              {item.meta.domain ? (
                <span className="rounded-full border border-white/12 bg-slate-950/44 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200/80 backdrop-blur-md">
                  {item.meta.domain}
                </span>
              ) : null}
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/18 opacity-0 backdrop-blur-[1px] transition duration-300 group-hover:opacity-100">
              <div className="translate-y-2 rounded-full border border-sky-200/24 bg-slate-950/58 px-4 py-2 text-sm font-medium text-white shadow-[0_0_30px_rgba(96,165,250,0.18)] backdrop-blur-md transition duration-300 group-hover:translate-y-0">
                {COPY.viewDetails}
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="inspiration-card-title line-clamp-2 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-tight text-white">
            {item.title}
          </h2>
          <span className="shrink-0 rounded-full border border-sky-300/16 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-100/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="inspiration-card-description mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-300">
          {item.description}
        </p>

        <TagList tags={item.tags} />

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
          >
            {COPY.viewDetails}
          </a>

          {item.meta.homepage ? (
            <a
              href={item.meta.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-smooth inline-flex items-center rounded-full border border-sky-300/18 bg-sky-300/[0.08] px-4 py-2 text-sm text-sky-100 hover:-translate-y-1 hover:border-sky-300/36 hover:bg-sky-300/[0.12] hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
            >
              {COPY.openSite}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function InspirationCard({ item, index }: InspirationCardProps) {
  if (item.source === "github") {
    return <GitHubFavoriteCard item={item} index={index} />;
  }

  return <AwwwardsFavoriteCard item={item} index={index} />;
}
