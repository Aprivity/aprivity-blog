import { scrapeAwwwardsFavorites } from "@/lib/scrape-awwwards";
import { fetchGitHubFavorites } from "@/lib/github-favorites";
import { mapAwwwardsFavorite } from "@/lib/favorite-mappers";
import type {
  FavoriteSourceState,
  UnifiedFavoriteItem,
  UnifiedFavoritesResponse,
} from "@/lib/favorite-types";

function buildAwwwardsState(result: Awaited<ReturnType<typeof scrapeAwwwardsFavorites>>): FavoriteSourceState {
  if (result.status === "success") {
    return {
      status: "success",
      isStale: result.isStale,
      message: result.message,
      updatedAt: result.fetchedAt,
    };
  }

  return {
    status: result.status,
    isStale: false,
    message: result.message,
    updatedAt: result.fetchedAt,
  };
}

function buildGitHubState(result: Awaited<ReturnType<typeof fetchGitHubFavorites>>): FavoriteSourceState {
  if (result.status === "success") {
    return {
      status: "success",
      isStale: result.isStale,
      message: result.message,
      updatedAt: result.fetchedAt,
    };
  }

  return {
    status: result.status,
    isStale: false,
    message: result.message,
    updatedAt: result.fetchedAt,
  };
}

function settleErrorState(message: string): FavoriteSourceState {
  return {
    status: "error",
    isStale: false,
    message,
  };
}

function uniqueById(items: UnifiedFavoriteItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

export async function getUnifiedFavorites(): Promise<UnifiedFavoritesResponse> {
  const [awwwardsSettled, githubSettled] = await Promise.allSettled([
    scrapeAwwwardsFavorites(),
    fetchGitHubFavorites(),
  ]);

  const awwwardsItems =
    awwwardsSettled.status === "fulfilled" && awwwardsSettled.value.status === "success"
      ? awwwardsSettled.value.items
          .map((item, index) => mapAwwwardsFavorite(item, index))
          .filter((item): item is UnifiedFavoriteItem => Boolean(item))
      : [];
  const githubItems =
    githubSettled.status === "fulfilled" && githubSettled.value.status === "success"
      ? githubSettled.value.items
      : [];
  const all = uniqueById([...awwwardsItems, ...githubItems]);
  const awwwardsState =
    awwwardsSettled.status === "fulfilled"
      ? buildAwwwardsState(awwwardsSettled.value)
      : settleErrorState(
          awwwardsSettled.reason instanceof Error
            ? awwwardsSettled.reason.message
            : "Awwwards source failed unexpectedly.",
        );
  const githubState =
    githubSettled.status === "fulfilled"
      ? buildGitHubState(githubSettled.value)
      : settleErrorState(
          githubSettled.reason instanceof Error
            ? githubSettled.reason.message
            : "GitHub source failed unexpectedly.",
        );
  const status =
    all.length > 0
      ? "success"
      : awwwardsState.status === "empty" && githubState.status === "empty"
        ? "empty"
        : "error";

  return {
    status,
    all,
    groups: {
      awwwards: awwwardsItems,
      github: githubItems,
    },
    counts: {
      awwwards: awwwardsItems.length,
      github: githubItems.length,
      total: all.length,
    },
    sources: {
      awwwards: awwwardsState,
      github: githubState,
    },
    updatedAt: new Date().toISOString(),
  };
}
