"use client";

import Image from "next/image";
import { awwwardsCollectionUrl, type ExternalFavoriteItem, type ExternalFavoriteStatus } from "@/lib/awwwards-favorites";

type AwwwardsFavoritesCardProps = {
  status: ExternalFavoriteStatus;
  items: ExternalFavoriteItem[];
  eyebrow: string;
  sourceLabel: string;
  liveBadgeLabel: string;
  loadingBadgeLabel: string;
  errorBadgeLabel: string;
  loadingTitle: string;
  loadingDescription: string;
  errorTitle: string;
  errorDescription: string;
  latestListTitle: string;
  viewItemLabel: string;
  buttonLabel: string;
};

export function AwwwardsFavoritesCard({
  status,
  items,
  eyebrow,
  sourceLabel,
  liveBadgeLabel,
  loadingBadgeLabel,
  errorBadgeLabel,
  loadingTitle,
  loadingDescription,
  errorTitle,
  errorDescription,
  latestListTitle,
  viewItemLabel,
  buttonLabel,
}: AwwwardsFavoritesCardProps) {
  const featuredItem = status === "success" ? items[0] : undefined;
  const extraItems = status === "success" ? items.slice(1, 4) : [];
  const badgeLabel =
    status === "success"
      ? liveBadgeLabel
      : status === "loading"
        ? loadingBadgeLabel
        : errorBadgeLabel;

  return (
    <article className="favorites-card hover-smooth group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(9,13,30,0.86))] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-md hover:-translate-y-1.5 hover:border-sky-300/24 hover:shadow-[0_24px_54px_rgba(37,99,235,0.18)]">
      <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-70 group-hover:opacity-100" />
      <div className="absolute right-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-3 text-[11px] text-slate-300">
        01
      </div>
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex min-h-48 flex-col">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
            {eyebrow}
          </p>
          <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-sky-100/80">
            {badgeLabel}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/20">
          {featuredItem ? (
            <a
              href={featuredItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[16/10] w-full"
            >
              {featuredItem.image ? (
                <>
                  <Image
                    src={featuredItem.image}
                    alt={featuredItem.title}
                    fill
                    sizes="(min-width: 640px) 300px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.7))]" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(168,85,247,0.16))] px-6 text-center text-xs uppercase tracking-[0.28em] text-sky-100/80">
                  {featuredItem.title}
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-sky-100/80">
                <span>{sourceLabel}</span>
                <span>{items.length} Picks</span>
              </div>
            </a>
          ) : status === "loading" ? (
            <div className="aspect-[16/10] w-full bg-[linear-gradient(135deg,rgba(14,165,233,0.14),rgba(139,92,246,0.12))] p-4">
              <div className="h-full w-full animate-pulse rounded-[0.9rem] border border-white/10 bg-white/[0.05]" />
            </div>
          ) : (
            <div className="flex aspect-[16/10] w-full items-center justify-center bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(168,85,247,0.12))] px-6 text-center text-xs uppercase tracking-[0.28em] text-rose-100/80">
              {sourceLabel}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          {featuredItem ? (
            <a
              href={featuredItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="favorites-card-title w-fit font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white hover:text-sky-100"
            >
              {featuredItem.title}
            </a>
          ) : (
            <h2 className="favorites-card-title font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
              {status === "loading" ? loadingTitle : errorTitle}
            </h2>
          )}

          <p className="favorites-card-description mt-3 text-sm leading-7 text-slate-300">
            {featuredItem ? featuredItem.description : status === "loading" ? loadingDescription : errorDescription}
          </p>

          {featuredItem && extraItems.length > 0 ? (
            <div className="mt-5 rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/75">
                {latestListTitle}
              </p>
              <ul className="mt-3 space-y-2">
                {extraItems.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-smooth flex items-start justify-between gap-3 text-sm text-slate-300 hover:text-white"
                    >
                      <span className="line-clamp-1">{item.title}</span>
                      <span className="shrink-0 text-sky-200/80">-&gt;</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {featuredItem ? (
              <a
                href={featuredItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-smooth inline-flex w-fit items-center rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-4 py-2 text-sm text-sky-100 hover:border-sky-300/35 hover:bg-sky-300/[0.12] hover:shadow-[0_0_24px_rgba(96,165,250,0.14)]"
              >
                {viewItemLabel}
              </a>
            ) : null}

            <a
              href={awwwardsCollectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-smooth inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 hover:border-sky-300/35 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_24px_rgba(96,165,250,0.14)]"
            >
              {buttonLabel}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
