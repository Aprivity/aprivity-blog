import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const GITHUB_USERNAME = "Aprivity";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_REPOS_API_URL = `${GITHUB_API_BASE_URL}/users/${GITHUB_USERNAME}/repos`;
const CACHE_DIR_PATH = path.join(process.cwd(), ".cache");
const REPOSITORIES_CACHE_FILE_PATH = path.join(CACHE_DIR_PATH, "github-projects.json");
const REPOSITORY_CACHE_FILE_PATH = (repoName: string) =>
  path.join(CACHE_DIR_PATH, `github-project-${repoName.toLowerCase()}.json`);
const REQUEST_TIMEOUT_MS = 10000;
const PER_PAGE = 100;
const MAX_PAGES = 3;

const COPY = {
  empty: "GitHub \u4e0a\u6682\u65f6\u6ca1\u6709\u53ef\u5c55\u793a\u7684\u516c\u5f00\u9879\u76ee\u3002 \ud83d\udccc",
  stale:
    "GitHub \u6682\u65f6\u6ca1\u6709\u54cd\u5e94\uff0c\u5f53\u524d\u663e\u793a\u6700\u8fd1\u4e00\u6b21\u6210\u529f\u83b7\u53d6\u7684\u9879\u76ee\u5feb\u7167\u3002 \ud83d\udccc",
  listError: "\u6682\u65f6\u65e0\u6cd5\u4ece GitHub \u83b7\u53d6\u9879\u76ee\u5217\u8868\u3002 \ud83d\udd0d",
  invalidRepo: "\u9879\u76ee\u540d\u79f0\u65e0\u6548\u3002",
  detailError:
    "\u6682\u65f6\u65e0\u6cd5\u4ece GitHub \u83b7\u53d6\u8fd9\u4e2a\u9879\u76ee\u7684\u8be6\u60c5\u3002",
};

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  topics: string[];
  archived: boolean;
  fork: boolean;
  visibility: string;
  license?: {
    name: string;
  } | null;
};

type CacheRecord<T> = {
  items?: T[];
  item?: T;
  fetchedAt: string;
  sourceUrl: string;
};

export type GitHubRepositoriesResponse =
  | {
      status: "success";
      items: GitHubRepository[];
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

export type GitHubRepositoryResponse =
  | {
      status: "success";
      item: GitHubRepository;
      sourceUrl: string;
      fetchedAt: string;
      isStale: boolean;
      message?: string;
    }
  | {
      status: "error";
      item: null;
      sourceUrl: string;
      isStale: false;
      message: string;
      fetchedAt?: string;
    };

function logGitHubProjects(level: "info" | "warn" | "error", message: string, details?: unknown) {
  const prefix = `[github-projects] ${message}`;

  if (details === undefined) {
    console[level](prefix);
    return;
  }

  console[level](prefix, details);
}

function createGitHubHeaders() {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "Aprivity-Portfolio-Projects",
    "x-github-api-version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function normalizeRepository(value: unknown): GitHubRepository | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const repo = value as Partial<GitHubRepository>;

  if (
    typeof repo.id !== "number" ||
    typeof repo.name !== "string" ||
    typeof repo.full_name !== "string" ||
    typeof repo.html_url !== "string"
  ) {
    return null;
  }

  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: typeof repo.description === "string" ? repo.description : null,
    homepage: typeof repo.homepage === "string" && repo.homepage ? repo.homepage : null,
    language: typeof repo.language === "string" ? repo.language : null,
    stargazers_count:
      typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
    forks_count: typeof repo.forks_count === "number" ? repo.forks_count : 0,
    open_issues_count:
      typeof repo.open_issues_count === "number" ? repo.open_issues_count : 0,
    created_at: typeof repo.created_at === "string" ? repo.created_at : "",
    updated_at: typeof repo.updated_at === "string" ? repo.updated_at : "",
    pushed_at: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
    topics: Array.isArray(repo.topics)
      ? repo.topics.filter((topic): topic is string => typeof topic === "string")
      : [],
    archived: Boolean(repo.archived),
    fork: Boolean(repo.fork),
    visibility: typeof repo.visibility === "string" ? repo.visibility : "public",
    license:
      repo.license && typeof repo.license === "object" && "name" in repo.license
        ? { name: String(repo.license.name) }
        : null,
  };
}

async function readCache<T>(filePath: string) {
  try {
    const rawCache = await readFile(filePath, "utf8");
    const parsed = JSON.parse(rawCache) as CacheRecord<T>;

    if (!parsed.fetchedAt || !parsed.sourceUrl) {
      return null;
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      logGitHubProjects("warn", "Failed to read cache", {
        filePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return null;
  }
}

async function writeCache<T>(filePath: string, cacheRecord: CacheRecord<T>) {
  try {
    await mkdir(CACHE_DIR_PATH, { recursive: true });
    await writeFile(filePath, JSON.stringify(cacheRecord, null, 2), "utf8");
  } catch (error) {
    logGitHubProjects("warn", "Failed to write cache", {
      filePath,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function requestGitHubJson(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: createGitHubHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed with ${response.status}`);
    }

    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRepositoriesPage(page: number) {
  const url = new URL(GITHUB_REPOS_API_URL);
  url.searchParams.set("type", "owner");
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));

  const data = await requestGitHubJson(url.toString());

  if (!Array.isArray(data)) {
    throw new Error("GitHub repositories response was not an array");
  }

  return data.map(normalizeRepository).filter((repo): repo is GitHubRepository => Boolean(repo));
}

export async function fetchGitHubRepositories(): Promise<GitHubRepositoriesResponse> {
  try {
    const repositories: GitHubRepository[] = [];

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const pageItems = await fetchRepositoriesPage(page);
      repositories.push(...pageItems);

      if (pageItems.length < PER_PAGE) {
        break;
      }
    }

    const fetchedAt = new Date().toISOString();

    if (repositories.length === 0) {
      return {
        status: "empty",
        items: [],
        sourceUrl: GITHUB_REPOS_API_URL,
        fetchedAt,
        isStale: false,
        message: COPY.empty,
      };
    }

    await writeCache(REPOSITORIES_CACHE_FILE_PATH, {
      items: repositories,
      fetchedAt,
      sourceUrl: GITHUB_REPOS_API_URL,
    });

    return {
      status: "success",
      items: repositories,
      sourceUrl: GITHUB_REPOS_API_URL,
      fetchedAt,
      isStale: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub request failure";
    const cachedResult = await readCache<GitHubRepository>(REPOSITORIES_CACHE_FILE_PATH);

    logGitHubProjects("warn", "GitHub repositories fetch failed", { error: message });

    if (cachedResult?.items && cachedResult.items.length > 0) {
      return {
        status: "success",
        items: cachedResult.items,
        sourceUrl: cachedResult.sourceUrl,
        fetchedAt: cachedResult.fetchedAt,
        isStale: true,
        message: COPY.stale,
      };
    }

    return {
      status: "error",
      items: [],
      sourceUrl: GITHUB_REPOS_API_URL,
      isStale: false,
      message: COPY.listError,
    };
  }
}

export async function fetchGitHubRepository(repoName: string): Promise<GitHubRepositoryResponse> {
  const safeRepoName = repoName.trim();
  const sourceUrl = `${GITHUB_API_BASE_URL}/repos/${GITHUB_USERNAME}/${encodeURIComponent(safeRepoName)}`;

  if (!safeRepoName) {
    return {
      status: "error",
      item: null,
      sourceUrl,
      isStale: false,
      message: COPY.invalidRepo,
    };
  }

  try {
    const data = await requestGitHubJson(sourceUrl);
    const repository = normalizeRepository(data);

    if (!repository) {
      throw new Error("GitHub repository response was not usable");
    }

    const fetchedAt = new Date().toISOString();

    await writeCache(REPOSITORY_CACHE_FILE_PATH(safeRepoName), {
      item: repository,
      fetchedAt,
      sourceUrl,
    });

    return {
      status: "success",
      item: repository,
      sourceUrl,
      fetchedAt,
      isStale: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GitHub request failure";
    const cachedResult = await readCache<GitHubRepository>(REPOSITORY_CACHE_FILE_PATH(safeRepoName));

    logGitHubProjects("warn", "GitHub repository fetch failed", {
      repoName: safeRepoName,
      error: message,
    });

    if (cachedResult?.item) {
      return {
        status: "success",
        item: cachedResult.item,
        sourceUrl: cachedResult.sourceUrl,
        fetchedAt: cachedResult.fetchedAt,
        isStale: true,
        message: COPY.stale,
      };
    }

    return {
      status: "error",
      item: null,
      sourceUrl,
      isStale: false,
      message: COPY.detailError,
    };
  }
}
