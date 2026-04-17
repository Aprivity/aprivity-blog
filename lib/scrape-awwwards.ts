import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { load, type Cheerio } from "cheerio";
import {
  awwwardsCollectionUrl,
  type AwwwardsFavoritesEmptyResponse,
  type AwwwardsFavoritesErrorResponse,
  type AwwwardsFavoritesResponse,
  type AwwwardsFavoritesSuccessResponse,
  type ExternalFavoriteItem,
} from "@/lib/awwwards-favorites";

const AWWWARDS_ORIGIN = "https://www.awwwards.com";
const AWWWARDS_ASSET_ORIGIN = "https://assets.awwwards.com/";
const CACHE_DIR_PATH = path.join(process.cwd(), ".cache");
const CACHE_FILE_PATH = path.join(CACHE_DIR_PATH, "awwwards-favorites.json");
const MAX_ITEMS = 24;
const REQUEST_TIMEOUT_MS = 12000;
const REQUEST_ATTEMPTS = 2;
const RETRY_DELAY_MS = 700;

type CollectableModel = {
  title?: string;
  collectableTitle?: string;
  collectableIdentifier?: string;
  collectableImage?: string;
  slug?: string;
  tags?: string[];
  images?: {
    thumbnail?: string;
  };
};

type ExtractItemsResult = {
  items: ExternalFavoriteItem[];
  candidateCount: number;
};

type FavoritesCacheRecord = {
  items: ExternalFavoriteItem[];
  fetchedAt: string;
  sourceUrl: string;
};

function logAwwwards(level: "info" | "warn" | "error", message: string, details?: unknown) {
  const prefix = `[awwwwards] ${message}`;

  if (details === undefined) {
    console[level](prefix);
    return;
  }

  console[level](prefix, details);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value: string | undefined | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function buildAbsoluteUrl(url: string | undefined, base: string) {
  const normalizedUrl = normalizeText(url);

  if (!normalizedUrl) {
    return "";
  }

  try {
    const absoluteUrl = new URL(normalizedUrl, base);

    if (!["http:", "https:"].includes(absoluteUrl.protocol)) {
      return "";
    }

    return absoluteUrl.toString();
  } catch {
    return "";
  }
}

function getPreferredImage(
  imgSrcset: string | undefined,
  directImage: string | undefined,
  fallbackImage: string | undefined,
) {
  const candidates = (imgSrcset ?? "")
    .split(",")
    .map((entry) => normalizeText(entry.split(" ")[0]))
    .filter(Boolean);
  const preferredSrc = candidates.at(-1) ?? candidates[0];

  if (preferredSrc) {
    return buildAbsoluteUrl(preferredSrc, AWWWARDS_ORIGIN);
  }

  return (
    buildAbsoluteUrl(directImage, AWWWARDS_ORIGIN) ||
    buildAbsoluteUrl(fallbackImage, AWWWARDS_ASSET_ORIGIN)
  );
}

function parseCollectableModel(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as CollectableModel;
  } catch (error) {
    logAwwwards("warn", "Failed to parse collectable model JSON", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function pickFirstText(scope: Cheerio<any>, selectors: string[]) {
  for (const selector of selectors) {
    const value = normalizeText(scope.find(selector).first().text());

    if (value) {
      return value;
    }
  }

  return "";
}

function pickFirstAttr(scope: Cheerio<any>, selectors: string[], attributes: string[]) {
  for (const selector of selectors) {
    const target = scope.find(selector).first();

    for (const attribute of attributes) {
      const value = normalizeText(target.attr(attribute));

      if (value) {
        return value;
      }
    }
  }

  return "";
}

function createFallbackTitle(url: string, model: CollectableModel | null) {
  const modelTitle =
    normalizeText(model?.title) ||
    normalizeText(model?.collectableTitle) ||
    normalizeText(model?.collectableIdentifier) ||
    normalizeText(model?.slug);

  if (modelTitle) {
    return modelTitle;
  }

  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? "Untitled";

    return lastSegment
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return "Untitled";
  }
}

function createDescription(
  tags: string[] | undefined,
  author: string | undefined,
  externalUrl: string | undefined,
) {
  const cleanTags = (tags ?? []).map((tag) => normalizeText(tag)).filter(Boolean);

  if (cleanTags.length > 0) {
    return cleanTags.slice(0, 3).join(" / ");
  }

  if (author) {
    return `Collected from Awwwards by ${author}`;
  }

  if (externalUrl) {
    try {
      return `Preview from ${new URL(externalUrl).hostname.replace(/^www\./, "")}`;
    } catch {
      return "Collected from Awwwards";
    }
  }

  return "Collected from Awwwards";
}

function buildItemFromNode(rawHtml: string, index: number) {
  const $ = load(rawHtml);
  const scope = $("body").children().first();
  const model =
    parseCollectableModel(scope.attr("data-collectable-model-value")) ??
    parseCollectableModel(scope.attr("data-model"));
  const detailHref =
    pickFirstAttr(scope, ["a.figure-rollover__link"], ["href"]) ||
    pickFirstAttr(scope, ["a[data-preview-url-value]"], ["href"]) ||
    pickFirstAttr(scope, ["a[href*='/sites/']", "a[href*='/websites/']"], ["href"]);
  const url =
    buildAbsoluteUrl(detailHref, AWWWARDS_ORIGIN) ||
    buildAbsoluteUrl(model?.slug ? `/sites/${model.slug}` : "", AWWWARDS_ORIGIN);

  if (!url) {
    logAwwwards("warn", "Skipping favorite without a valid URL", { index });
    return null;
  }

  const title =
    normalizeText(model?.title) ||
    normalizeText(model?.collectableTitle) ||
    normalizeText(scope.find("a.figure-rollover__link").first().attr("aria-label")) ||
    pickFirstText(scope, [
      ".figure-rollover__row:nth-of-type(2)",
      ".figure-rollover__row",
      ".avatar-name__title",
      "img[alt]",
    ]) ||
    createFallbackTitle(url, model);
  const author = pickFirstText(scope, [
    ".avatar-name__title",
    ".avatar-name__name",
    "[itemprop='author']",
  ]);
  const externalUrl = buildAbsoluteUrl(
    pickFirstAttr(
      scope,
      ["a.figure-rollover__bt[href^='http']", "a[href^='http']:not([href*='awwwards.com'])"],
      ["href"],
    ),
    AWWWARDS_ORIGIN,
  );
  const image = getPreferredImage(
    pickFirstAttr(scope, ["img.figure-rollover__file", "img"], ["data-srcset", "srcset"]),
    pickFirstAttr(scope, ["img.figure-rollover__file", "img"], ["data-src", "src"]),
    model?.images?.thumbnail || model?.collectableImage,
  );

  return {
    title,
    description: createDescription(model?.tags, author, externalUrl || undefined),
    url,
    image: image || undefined,
    externalUrl: externalUrl || undefined,
  } satisfies ExternalFavoriteItem;
}

function extractItems(html: string): ExtractItemsResult {
  const $ = load(html);
  const rootNodes = $("li.js-collectable, li[data-collectable-model-value]").toArray();
  const fallbackNodes = rootNodes.length > 0 ? rootNodes : $(".figure-rollover").toArray();
  const uniqueItems = new Map<string, ExternalFavoriteItem>();

  for (const [index, node] of fallbackNodes.entries()) {
    if (uniqueItems.size >= MAX_ITEMS) {
      break;
    }

    const scope = $(node).closest("li, article, div");
    const target = scope.length > 0 ? scope : $(node);
    const item = buildItemFromNode($.html(target), index);

    if (item && !uniqueItems.has(item.url)) {
      uniqueItems.set(item.url, item);
    }
  }

  return {
    items: Array.from(uniqueItems.values()),
    candidateCount: fallbackNodes.length,
  };
}

function looksLikeExplicitEmptyState(html: string) {
  const $ = load(html);

  if ($(".message-empty, .empty-state, .is-empty, [data-empty-state]").length > 0) {
    return true;
  }

  const bodyText = normalizeText($("body").text()).toLowerCase();

  return (
    bodyText.includes("no items") ||
    bodyText.includes("no results") ||
    bodyText.includes("no favorites")
  );
}

async function readFavoritesCache() {
  try {
    const rawCache = await readFile(CACHE_FILE_PATH, "utf8");
    const parsed = JSON.parse(rawCache) as FavoritesCacheRecord;

    if (!Array.isArray(parsed.items) || parsed.items.length === 0 || !parsed.fetchedAt) {
      return null;
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      logAwwwards("warn", "Failed to read favorites cache", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return null;
  }
}

async function writeFavoritesCache(result: AwwwardsFavoritesSuccessResponse) {
  try {
    await mkdir(CACHE_DIR_PATH, { recursive: true });
    await writeFile(
      CACHE_FILE_PATH,
      JSON.stringify(
        {
          items: result.items,
          fetchedAt: result.fetchedAt,
          sourceUrl: result.sourceUrl,
        } satisfies FavoritesCacheRecord,
        null,
        2,
      ),
      "utf8",
    );
  } catch (error) {
    logAwwwards("warn", "Failed to write favorites cache", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function fetchCollectionHtml(attempt: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(awwwardsCollectionUrl, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Awwwards request failed with ${response.status}`);
    }

    const html = await response.text();

    logAwwwards("info", "Fetched Awwwards collection page", {
      attempt,
      length: html.length,
    });

    return html;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchFreshFavorites() {
  let lastFailureReason = "Unknown failure";

  for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const html = await fetchCollectionHtml(attempt);
      const extracted = extractItems(html);

      if (extracted.items.length > 0) {
        logAwwwards("info", "Parsed favorites successfully", {
          attempt,
          itemCount: extracted.items.length,
          candidateCount: extracted.candidateCount,
        });

        return {
          status: "success",
          items: extracted.items,
          sourceUrl: awwwardsCollectionUrl,
          fetchedAt: new Date().toISOString(),
          isStale: false,
        } satisfies AwwwardsFavoritesSuccessResponse;
      }

      if (extracted.candidateCount === 0 && looksLikeExplicitEmptyState(html)) {
        logAwwwards("info", "Awwwards collection appears empty", { attempt });

        return {
          status: "empty",
          items: [],
          sourceUrl: awwwardsCollectionUrl,
          fetchedAt: new Date().toISOString(),
          message: "The collection is currently empty",
        } satisfies AwwwardsFavoritesEmptyResponse;
      }

      lastFailureReason =
        extracted.candidateCount === 0
          ? "No favorites could be extracted from the collection page"
          : `Parsed ${extracted.candidateCount} candidates but produced 0 usable items`;

      logAwwwards("warn", "Awwwards parsing returned no usable items", {
        attempt,
        candidateCount: extracted.candidateCount,
      });
    } catch (error) {
      lastFailureReason =
        error instanceof Error ? error.message : "Unknown request failure";

      logAwwwards("warn", "Awwwards fetch attempt failed", {
        attempt,
        error: lastFailureReason,
      });
    }

    if (attempt < REQUEST_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  return {
    status: "error",
    items: [],
    sourceUrl: awwwardsCollectionUrl,
    message: lastFailureReason,
  } satisfies AwwwardsFavoritesErrorResponse;
}

export async function scrapeAwwwardsFavorites(): Promise<AwwwardsFavoritesResponse> {
  const freshResult = await fetchFreshFavorites();

  if (freshResult.status === "success") {
    await writeFavoritesCache(freshResult);
    return freshResult;
  }

  if (freshResult.status === "empty") {
    return freshResult;
  }

  const cachedResult = await readFavoritesCache();

  if (cachedResult) {
    logAwwwards("warn", "Falling back to cached favorites", {
      fetchedAt: cachedResult.fetchedAt,
      itemCount: cachedResult.items.length,
      reason: freshResult.message,
    });

    return {
      status: "success",
      items: cachedResult.items,
      sourceUrl: cachedResult.sourceUrl || awwwardsCollectionUrl,
      fetchedAt: cachedResult.fetchedAt,
      isStale: true,
      message: "Showing the most recent successful favorites snapshot",
    };
  }

  logAwwwards("error", "Failed to fetch favorites and no cache was available", {
    reason: freshResult.message,
  });

  return {
    status: "error",
    items: [],
    sourceUrl: awwwardsCollectionUrl,
    message: "Unable to load the latest favorites right now",
  };
}
