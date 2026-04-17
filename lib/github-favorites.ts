import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mapGitHubFavorite } from "@/lib/favorite-mappers";
import type { UnifiedFavoriteItem } from "@/lib/favorite-types";

const GITHUB_USERNAME = "Aprivity";
const GITHUB_STARRED_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/starred`;
const CACHE_DIR_PATH = path.join(process.cwd(), ".cache");
const CACHE_FILE_PATH = path.join(CACHE_DIR_PATH, "github-favorites.json");
const MAX_ITEMS = 60;
const PER_PAGE = 30;
const MAX_PAGES = Math.ceil(MAX_ITEMS / PER_PAGE);
const REQUEST_TIMEOUT_MS = 10000;

export type GitHubStarredRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  created_at?: string;
  updated_at?: string;
  owner?: {
    login: string;
  };
};

type GitHubFavoritesCacheRecord = {
  items: UnifiedFavoriteItem[];
  fetchedAt: string;
  sourceUrl: string;
};

export type GitHubFavoritesResponse =
  | {
      status: "success";
      items: UnifiedFavoriteItem[];
      sourceUrl: string;
      fetchedAt: string;
      isStale: boolean;
      message?: string;
    }
  | {
      status: "empty";
      items: [];
      sourceUrl: string;
      fetchedAt: string;
      isStale: false;
      message: string;
    }
  | {
      status: "error";
      items: [];
      sourceUrl: string;
      isStale: false;
      message: string;
      fetchedAt?: string;
    };

function logGitHub(level: "info" | "warn" | "error", message: string, details?: unknown) {
  const prefix = `[github-favorites] ${message}`;

  if (details === undefined) {
    console[level](prefix);
    return;
  }

  console[level](prefix, details);
}

async function readGitHubCache() {
  try {
    const rawCache = await readFile(CACHE_FILE_PATH, "utf8");
    const parsed = JSON.parse(rawCache) as GitHubFavoritesCacheRecord;

    if (!Array.isArray(parsed.items) || parsed.items.length === 0 || !parsed.fetchedAt) {
      return null;
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      logGitHub("warn", "Failed to read GitHub favorites cache", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return null;
  }
}

async function writeGitHubCache(result: Extract<GitHubFavoritesResponse, { status: "success" }>) {
  try {
    await mkdir(CACHE_DIR_PATH, { recursive: true });
    await writeFile(
      CACHE_FILE_PATH,
      JSON.stringify(
        {
          items: result.items,
          fetchedAt: result.fetchedAt,
          sourceUrl: result.sourceUrl,
        } satisfies GitHubFavoritesCacheRecord,
        null,
        2,
      ),
      "utf8",
    );
  } catch (error) {
    logGitHub("warn", "Failed to write GitHub favorites cache", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function fetchStarredPage(page: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = new URL(GITHUB_STARRED_API_URL);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("page", String(page));
    url.searchParams.set("sort", "created");

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "Aprivity-Portfolio-Favorites",
        "x-github-api-version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub starred request failed with ${response.status}`);
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      throw new Error("GitHub starred response was not an array");
    }

    return data as GitHubStarredRepository[];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchFreshGitHubFavorites(): Promise<GitHubFavoritesResponse> {
  try {
    const repositories: GitHubStarredRepository[] = [];

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const pageItems = await fetchStarredPage(page);
      repositories.push(...pageItems);

      if (pageItems.length < PER_PAGE || repositories.length >= MAX_ITEMS) {
        break;
      }
    }

    const items = repositories
      .slice(0, MAX_ITEMS)
      .map((repo) => mapGitHubFavorite(repo))
      .filter((item): item is UnifiedFavoriteItem => Boolean(item));
    const fetchedAt = new Date().toISOString();

    if (items.length === 0) {
      return {
        status: "empty",
        items: [],
        sourceUrl: GITHUB_STARRED_API_URL,
        fetchedAt,
        isStale: false,
        message: "No public GitHub starred repositories were found.",
      };
    }

    return {
      status: "success",
      items,
      sourceUrl: GITHUB_STARRED_API_URL,
      fetchedAt,
      isStale: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub request failure";

    logGitHub("warn", "GitHub starred fetch failed", { error: message });

    return {
      status: "error",
      items: [],
      sourceUrl: GITHUB_STARRED_API_URL,
      isStale: false,
      message,
    };
  }
}

export async function fetchGitHubFavorites(): Promise<GitHubFavoritesResponse> {
  const freshResult = await fetchFreshGitHubFavorites();

  if (freshResult.status === "success") {
    await writeGitHubCache(freshResult);
    return freshResult;
  }

  if (freshResult.status === "empty") {
    return freshResult;
  }

  const cachedResult = await readGitHubCache();

  if (cachedResult) {
    logGitHub("warn", "Falling back to cached GitHub favorites", {
      fetchedAt: cachedResult.fetchedAt,
      itemCount: cachedResult.items.length,
      reason: freshResult.message,
    });

    return {
      status: "success",
      items: cachedResult.items,
      sourceUrl: cachedResult.sourceUrl || GITHUB_STARRED_API_URL,
      fetchedAt: cachedResult.fetchedAt,
      isStale: true,
      message: "Showing the most recent successful GitHub starred snapshot.",
    };
  }

  return {
    status: "error",
    items: [],
    sourceUrl: GITHUB_STARRED_API_URL,
    isStale: false,
    message: "Unable to load public GitHub starred repositories right now.",
  };
}
