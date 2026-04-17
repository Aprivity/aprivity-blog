"use client";

import { useEffect, useMemo, useState } from "react";
import { InspirationGrid } from "@/components/inspiration-grid";
import {
  InspirationWallHeader,
  type InspirationFilter,
} from "@/components/inspiration-wall-header";
import {
  InspirationSkeletonGrid,
  InspirationStateCard,
} from "@/components/inspiration-wall-states";
import type {
  FavoriteSource,
  FavoritesCounts,
  UnifiedFavoriteItem,
  UnifiedFavoritesResponse,
} from "@/lib/favorite-types";

const CLIENT_REQUEST_TIMEOUT_MS = 12000;
const LOCAL_CACHE_KEY = "aprivity-unified-favorites-cache";
const AWWWARDS_COLLECTION_URL = "https://www.awwwards.com/Aprivity/collections/myfav/";
const GITHUB_STARS_URL = "https://github.com/Aprivity?tab=stars";

const COPY = {
  loadingTitle: "\u6b63\u5728\u8f7d\u5165\u6536\u85cf\u5185\u5bb9",
  errorTitle: "\u6682\u65f6\u65e0\u6cd5\u83b7\u53d6\u6536\u85cf",
  errorDescription:
    "Awwwards \u548c GitHub \u6570\u636e\u6e90\u90fd\u6682\u65f6\u6ca1\u6709\u8fd4\u56de\u53ef\u7528\u5185\u5bb9\u3002\u53ef\u4ee5\u91cd\u65b0\u52a0\u8f7d\uff0c\u6216\u7a0d\u540e\u518d\u8bd5\u3002",
  emptyTitle: "\u6682\u65e0\u6536\u85cf\u5185\u5bb9",
  emptyDescription:
    "\u5f53 Awwwards \u6216 GitHub \u6709\u53ef\u7528\u516c\u5f00\u6536\u85cf\u65f6\uff0c\u8fd9\u91cc\u4f1a\u81ea\u52a8\u94fa\u5f00\u6700\u65b0\u5185\u5bb9\u3002",
  filteredEmptyTitle: "\u5f53\u524d\u6765\u6e90\u6682\u65e0\u5185\u5bb9",
  filteredEmptyDescription:
    "\u8fd9\u4e2a\u7b5b\u9009\u4e0b\u6682\u65f6\u6ca1\u6709\u53ef\u5c55\u793a\u7684\u6536\u85cf\u9879\uff0c\u53ef\u4ee5\u5207\u56de All \u7ee7\u7eed\u6d4f\u89c8\u3002",
  retry: "\u91cd\u65b0\u52a0\u8f7d",
  showAll: "\u67e5\u770b\u5168\u90e8",
  refreshing: "\u6b63\u5728\u5237\u65b0\u6700\u65b0\u6536\u85cf",
  cached: "\u5f53\u524d\u663e\u793a\u6700\u8fd1\u4e00\u6b21\u6210\u529f\u83b7\u53d6\u7684\u5185\u5bb9",
  cacheFallback:
    "\u63a5\u53e3\u77ed\u65f6\u95f4\u6ca1\u6709\u54cd\u5e94\uff0c\u5df2\u4fdd\u7559\u4e0a\u6b21\u6210\u529f\u7ed3\u679c\u3002",
  updatedAt: "\u6700\u8fd1\u66f4\u65b0",
  footer: "\u6301\u7eed\u66f4\u65b0\u6211\u7684\u524d\u7aef\u7075\u611f\u548c\u5f00\u6e90\u6536\u85cf\u3002",
  home: "\u8fd4\u56de\u9996\u9875",
  sourceIssue: "\u6765\u6e90\u63d0\u793a",
};

type LoadStatus = "loading" | "success" | "empty" | "error";

function emptyCounts(): FavoritesCounts {
  return {
    awwwards: 0,
    github: 0,
    total: 0,
  };
}

function createEmptyResponse(status: LoadStatus = "loading"): UnifiedFavoritesResponse {
  return {
    status: status === "loading" ? "error" : status,
    all: [],
    groups: {
      awwwards: [],
      github: [],
    },
    counts: emptyCounts(),
    sources: {
      awwwards: {
        status: "error",
        isStale: false,
      },
      github: {
        status: "error",
        isStale: false,
      },
    },
    updatedAt: "",
  };
}

function isValidFavoritesResponse(value: unknown): value is UnifiedFavoritesResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<UnifiedFavoritesResponse>;

  return (
    Array.isArray(record.all) &&
    Boolean(record.groups) &&
    Boolean(record.counts) &&
    Boolean(record.sources)
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

    const parsed = JSON.parse(rawSnapshot) as unknown;

    return isValidFavoritesResponse(parsed) && parsed.all.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalSnapshot(data: UnifiedFavoritesResponse) {
  if (typeof window === "undefined" || data.all.length === 0) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore client cache write failures.
  }
}

function getVisibleItems(data: UnifiedFavoritesResponse, activeFilter: InspirationFilter) {
  if (activeFilter === "all") {
    return data.all;
  }

  return data.groups[activeFilter];
}

function getStatus(data: UnifiedFavoritesResponse): LoadStatus {
  if (data.status === "success") {
    return "success";
  }

  if (data.status === "empty") {
    return "empty";
  }

  return "error";
}

function formatDate(value: string) {
  if (!value) {
    return "";
  }

  try {
    return `${COPY.updatedAt}: ${new Date(value).toLocaleString()}`;
  } catch {
    return `${COPY.updatedAt}: ${value}`;
  }
}

function sourceLabel(source: FavoriteSource) {
  return source === "github" ? "GitHub" : "Awwwards";
}

function SourceNoticeList({ data }: { data: UnifiedFavoritesResponse }) {
  const notices = (Object.entries(data.sources) as Array<[FavoriteSource, (typeof data.sources)[FavoriteSource]]>)
    .filter(([, state]) => state.status !== "success" || state.isStale || state.message)
    .map(([source, state]) => {
      const stateLabel =
        state.status === "success"
          ? state.isStale
            ? COPY.cached
            : state.message
          : state.message || `${sourceLabel(source)} source is temporarily unavailable.`;

      return {
        source,
        stateLabel,
      };
    });

  if (notices.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300 shadow-[0_14px_42px_rgba(2,6,23,0.2)] backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sky-200/90">{COPY.sourceIssue}</span>
        {notices.map((notice) => (
          <span key={notice.source} className="text-slate-400">
            {sourceLabel(notice.source)}: {notice.stateLabel}
          </span>
        ))}
      </div>
    </div>
  );
}

export function InspirationWallSection() {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [data, setData] = useState<UnifiedFavoritesResponse>(() => createEmptyResponse());
  const [activeFilter, setActiveFilter] = useState<InspirationFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [softError, setSoftError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isDisposed = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_REQUEST_TIMEOUT_MS);
    const cachedSnapshot = readLocalSnapshot();

    if (cachedSnapshot) {
      setData(cachedSnapshot);
      setStatus("success");
      setSoftError("");
    } else {
      setData(createEmptyResponse());
      setStatus("loading");
      setSoftError("");
    }

    setIsRefreshing(true);

    async function loadFavorites() {
      try {
        const response = await fetch(`/api/favorites?ts=${Date.now()}`, {
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

        const nextData = (await response.json()) as unknown;

        if (isDisposed) {
          return;
        }

        if (!isValidFavoritesResponse(nextData)) {
          throw new Error("Favorites response was not usable.");
        }

        setData(nextData);
        setStatus(getStatus(nextData));
        setSoftError("");

        if (nextData.all.length > 0) {
          writeLocalSnapshot(nextData);
        }
      } catch {
        if (!isDisposed && cachedSnapshot) {
          setData(cachedSnapshot);
          setStatus("success");
          setSoftError(COPY.cacheFallback);
        } else if (!isDisposed) {
          setData(createEmptyResponse("error"));
          setStatus("error");
          setSoftError("");
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

  const visibleItems = useMemo(() => getVisibleItems(data, activeFilter), [activeFilter, data]);
  const metaLine = formatDate(data.updatedAt);
  const refresh = () => setRefreshKey((value) => value + 1);

  return (
    <section className="inspiration-wall-section relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-cyan absolute bottom-[-4%] left-[26%] h-72 w-72 rounded-full bg-cyan-400/8 blur-[140px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <InspirationWallHeader
          activeFilter={activeFilter}
          counts={data.counts}
          isRefreshing={isRefreshing}
          onFilterChange={setActiveFilter}
          onRefresh={refresh}
        />

        {status === "success" && (isRefreshing || softError || metaLine) ? (
          <div className="mt-8 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300 shadow-[0_14px_42px_rgba(2,6,23,0.2)] backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              {isRefreshing ? <span className="text-sky-200/90">{COPY.refreshing}</span> : null}
              {softError ? <span className="text-slate-400">{softError}</span> : null}
              {metaLine ? <span className="text-slate-400">{metaLine}</span> : null}
            </div>
          </div>
        ) : null}

        {status === "success" ? <SourceNoticeList data={data} /> : null}

        <div className="mt-8 animate-fade-up-delayed">
          {status === "loading" ? <InspirationSkeletonGrid /> : null}

          {status === "error" ? (
            <InspirationStateCard
              title={COPY.errorTitle}
              description={COPY.errorDescription}
              actionLabel={COPY.retry}
              onAction={refresh}
            />
          ) : null}

          {status === "empty" ? (
            <InspirationStateCard
              title={COPY.emptyTitle}
              description={COPY.emptyDescription}
              actionLabel={COPY.retry}
              onAction={refresh}
            />
          ) : null}

          {status === "success" && visibleItems.length > 0 ? (
            <InspirationGrid
              items={visibleItems}
              layout={activeFilter === "awwwards" ? "gallery" : "github"}
            />
          ) : null}

          {status === "success" && visibleItems.length === 0 ? (
            <InspirationStateCard
              title={COPY.filteredEmptyTitle}
              description={COPY.filteredEmptyDescription}
              actionLabel={COPY.showAll}
              onAction={() => setActiveFilter("all")}
            />
          ) : null}
        </div>

        <footer className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{COPY.footer}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/#home"
              className="secondary-cta hover-smooth rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-slate-200 hover:-translate-y-1 hover:border-sky-300/38 hover:bg-white/[0.1] hover:text-white"
            >
              {COPY.home}
            </a>
            <a
              href={AWWWARDS_COLLECTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-smooth rounded-full border border-sky-300/18 bg-sky-300/[0.08] px-4 py-2 text-sky-100 hover:-translate-y-1 hover:border-sky-300/36 hover:bg-sky-300/[0.12]"
            >
              Awwwards
            </a>
            <a
              href={GITHUB_STARS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-smooth rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-slate-200 hover:-translate-y-1 hover:border-sky-300/38 hover:bg-white/[0.1] hover:text-white"
            >
              GitHub Stars
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
