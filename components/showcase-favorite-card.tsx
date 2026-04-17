"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ExternalFavoriteItem } from "@/lib/awwwards-favorites";

type ShowcaseFavoriteCardProps = {
  item: ExternalFavoriteItem;
  sourceLabel: string;
  detailButtonLabel: string;
  externalButtonLabel: string;
  featured?: boolean;
};

function getFallbackDomainLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toUpperCase();
  } catch {
    return "AWWWARDS";
  }
}

export function ShowcaseFavoriteCard({
  item,
  sourceLabel,
  detailButtonLabel,
  externalButtonLabel,
  featured = false,
}: ShowcaseFavoriteCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const fallbackDomainLabel = useMemo(
    () => getFallbackDomainLabel(item.externalUrl || item.url),
    [item.externalUrl, item.url],
  );
  const canRenderImage = Boolean(item.image) && !hasImageError;

  return (
    <article
      className={`showcase-card hover-smooth group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(9,13,30,0.92))] shadow-[0_18px_60px_rgba(2,6,23,0.4)] backdrop-blur-xl hover:-translate-y-1.5 hover:border-sky-300/26 hover:shadow-[0_26px_80px_rgba(37,99,235,0.18)] ${
        featured ? "xl:col-span-2" : ""
      }`}
    >
      <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-75 group-hover:opacity-100" />
      <div className="relative overflow-hidden border-b border-white/10 bg-black/20">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
          <div className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
            {canRenderImage ? (
              <>
                <Image
                  src={item.image!}
                  alt={item.title}
                  fill
                  sizes={featured ? "(min-width: 1280px) 820px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"}
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  onError={() => setHasImageError(true)}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.6))]" />
              </>
            ) : (
              <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(135deg,rgba(37,99,235,0.22),rgba(124,58,237,0.18),rgba(15,23,42,0.86))] p-5">
                <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-sky-100/85">
                  <span>{sourceLabel}</span>
                  <span>{fallbackDomainLabel}</span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-sky-100/70">
                    Preview unavailable
                  </p>
                  <p className="mt-3 max-w-[18rem] font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-tight text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-sky-100/85 backdrop-blur-md">
              {sourceLabel}
            </div>
          </div>
        </a>
      </div>

      <div className="relative flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="showcase-card-title font-[family-name:var(--font-space-grotesk)] text-xl font-semibold leading-tight text-white hover:text-sky-100 sm:text-2xl"
          >
            {item.title}
          </a>
          <p className="showcase-card-description mt-3 text-sm leading-7 text-slate-300">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
          >
            {detailButtonLabel}
          </a>

          <a
            href={item.externalUrl || item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-smooth inline-flex items-center rounded-full border border-sky-300/18 bg-sky-300/[0.08] px-4 py-2 text-sm text-sky-100 hover:-translate-y-1 hover:border-sky-300/36 hover:bg-sky-300/[0.12] hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
          >
            {externalButtonLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
