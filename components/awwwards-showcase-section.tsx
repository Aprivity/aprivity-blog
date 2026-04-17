"use client";

import { useEffect, useMemo, useState } from "react";
import { ShowcaseFavoriteCard } from "@/components/showcase-favorite-card";
import { useLanguage } from "@/components/language-provider";
import {
  awwwardsCollectionUrl,
  type AwwwardsFavoritesResponse,
  type ExternalFavoriteItem,
  type ExternalFavoriteStatus,
} from "@/lib/awwwards-favorites";

const CLIENT_REQUEST_TIMEOUT_MS = 10000;
const LOCAL_CACHE_KEY = "aprivity-awwwards-favorites-cache";

type LocalFavoritesSnapshot = {
  items: ExternalFavoriteItem[];
  fetchedAt: string;
};

function LoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`showcase-loading-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl ${index === 0 ? "xl:col-span-2" : ""}`}
        >
          <div className={`animate-pulse bg-[linear-gradient(135deg,rgba(56,189,248,0.12),rgba(168,85,247,0.12))] ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`} />
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function readLocalSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSnapshot = window.localStorage.getItem(LOCAL_CACHE_KEY);

    if (!rawSnapshot) {
      return null;
    }

    const parsed = JSON.parse(rawSnapshot) as LocalFavoritesSnapshot;

    if (!Array.isArray(parsed.items) || parsed.items.length === 0 || !parsed.fetchedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeLocalSnapshot(items: ExternalFavoriteItem[], fetchedAt: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const snapshot: LocalFavoritesSnapshot = { items, fetchedAt };
    window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore client cache write failures.
  }
}

function clearLocalSnapshot() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(LOCAL_CACHE_KEY);
  } catch {
    // Ignore client cache cleanup failures.
  }
}

export function AwwwardsShowcaseSection() {
  const { messages } = useLanguage();
  const showcase = messages.showcase;
  const [status, setStatus] = useState<ExternalFavoriteStatus>("loading");
  const [items, setItems] = useState<ExternalFavoriteItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [fetchedAt, setFetchedAt] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isDisposed = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_REQUEST_TIMEOUT_MS);
    const cachedSnapshot = readLocalSnapshot();
    const hasCachedSnapshot = Boolean(cachedSnapshot?.items.length);

    if (hasCachedSnapshot && cachedSnapshot) {
      setItems(cachedSnapshot.items);
      setFetchedAt(cachedSnapshot.fetchedAt);
      setStatus("success");
      setIsStale(true);
      setIsRefreshing(true);
    } else {
      setItems([]);
      setFetchedAt("");
      setIsStale(false);
      setStatus("loading");
      setIsRefreshing(true);
    }

    async function loadFavorites() {
      try {
        const response = await fetch(`/api/awwwards-favorites?ts=${Date.now()}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = (await response.json()) as AwwwardsFavoritesResponse;

        if (isDisposed) {
          return;
        }

        if (data.status === "success" && data.items.length > 0) {
          setItems(data.items);
          setFetchedAt(data.fetchedAt);
          setStatus("success");
          setIsStale(data.isStale);

          if (!data.isStale) {
            writeLocalSnapshot(data.items, data.fetchedAt);
          }

          return;
        }

        if (data.status === "empty") {
          setItems([]);
          setFetchedAt(data.fetchedAt);
          setStatus("empty");
          setIsStale(false);
          clearLocalSnapshot();
          return;
        }

        if (!hasCachedSnapshot) {
          setItems([]);
          setFetchedAt(data.fetchedAt ?? "");
          setStatus("error");
          setIsStale(false);
        }
      } catch {
        if (!isDisposed && !hasCachedSnapshot) {
          setItems([]);
          setFetchedAt("");
          setStatus("error");
          setIsStale(false);
        }
      } finally {
        if (!isDisposed) {
          setIsRefreshing(false);
        }

        window.clearTimeout(timeoutId);
      }
    }

    loadFavorites();

    return () => {
      isDisposed = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [refreshKey]);

  const metaLine = useMemo(() => {
    if (!fetchedAt) {
      return "";
    }

    try {
      return `${showcase.lastUpdatedLabel}: ${new Date(fetchedAt).toLocaleString()}`;
    } catch {
      return `${showcase.lastUpdatedLabel}: ${fetchedAt}`;
    }
  }, [fetchedAt, showcase.lastUpdatedLabel]);

  return (
    <section className="showcase-section relative py-16 md:py-20 xl:py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-12 h-80 w-80 rounded-full bg-sky-500/14 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-16 h-96 w-96 rounded-full bg-violet-500/14 blur-[160px]" />
        <div className="section-ambient-cyan absolute bottom-[-4%] left-[24%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="animate-fade-up">
          <div className="section-badge inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
            {showcase.badge}
          </div>

          <div className="mt-8 max-w-4xl">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.4rem]">
              {showcase.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {showcase.subtitle}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              {showcase.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={awwwardsCollectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-cta hover-smooth inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-3.5 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.025] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)]"
            >
              {showcase.sourceButton}
            </a>
          </div>
        </div>

        <div className="mt-14 animate-fade-up-delayed">
          {status === "loading" ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white">
                  {showcase.loadingTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  {showcase.loadingDescription}
                </p>
              </div>
              <LoadingGrid />
            </div>
          ) : null}

          {status === "error" ? (
            <div className="showcase-state-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(9,13,30,0.92))] p-6 shadow-[0_20px_70px_rgba(2,6,23,0.4)] backdrop-blur-xl sm:p-8">
              <div className="max-w-2xl">
                <h2 className="showcase-state-title font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white">
                  {showcase.errorTitle}
                </h2>
                <p className="showcase-state-description mt-4 text-sm leading-7 text-slate-300">
                  {showcase.errorDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRefreshKey((value) => value + 1)}
                    className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                  >
                    {showcase.retryButton}
                  </button>
                  <a
                    href={awwwardsCollectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                  >
                    {showcase.sourceButton}
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {status === "empty" ? (
            <div className="showcase-state-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(9,13,30,0.92))] p-6 shadow-[0_20px_70px_rgba(2,6,23,0.4)] backdrop-blur-xl sm:p-8">
              <div className="max-w-2xl">
                <h2 className="showcase-state-title font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white">
                  {showcase.emptyTitle}
                </h2>
                <p className="showcase-state-description mt-4 text-sm leading-7 text-slate-300">
                  {showcase.emptyDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRefreshKey((value) => value + 1)}
                    className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                  >
                    {showcase.retryButton}
                  </button>
                  <a
                    href={awwwardsCollectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                  >
                    {showcase.sourceButton}
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {status === "success" ? (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="h-px w-16 bg-gradient-to-r from-sky-300 to-transparent" />
                {showcase.sectionTitle}
              </div>

              {(isRefreshing || isStale || metaLine) && (
                <div className="mb-6 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 backdrop-blur-md">
                  <div className="flex flex-wrap items-center gap-3">
                    {isRefreshing ? (
                      <span className="text-sky-200/90">{showcase.refreshingLabel}</span>
                    ) : null}
                    {isStale ? (
                      <span className="text-slate-300">{showcase.staleNotice}</span>
                    ) : null}
                    {metaLine ? (
                      <span className="text-slate-400">{metaLine}</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setRefreshKey((value) => value + 1)}
                      className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
                    >
                      {showcase.retryButton}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <ShowcaseFavoriteCard
                    key={`${item.url}-${index}`}
                    item={item}
                    featured={index === 0}
                    sourceLabel={showcase.sourceLabel}
                    detailButtonLabel={showcase.detailButton}
                    externalButtonLabel={showcase.externalButton}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
