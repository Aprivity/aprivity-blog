import type { ExternalFavoriteItem } from "@/lib/awwwards-favorites";
import type { GitHubStarredRepository } from "@/lib/github-favorites";
import type { UnifiedFavoriteItem } from "@/lib/favorite-types";

function normalizeText(value: string | undefined | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function splitTags(value: string) {
  return value
    .split(/[\/,|]/)
    .map((tag) => normalizeText(tag))
    .filter((tag) => tag && tag.length <= 28)
    .slice(0, 4);
}

function getAllowedAwwwardsImage(url: string | undefined) {
  const normalizedUrl = normalizeText(url);

  if (!normalizedUrl) {
    return undefined;
  }

  if (normalizedUrl.startsWith("/")) {
    return normalizedUrl;
  }

  try {
    const hostname = new URL(normalizedUrl).hostname;
    const isAllowedHost = hostname === "assets.awwwards.com" || hostname === "www.awwwards.com";

    return isAllowedHost ? normalizedUrl : undefined;
  } catch {
    return undefined;
  }
}

export function mapAwwwardsFavorite(
  item: ExternalFavoriteItem,
  index: number,
): UnifiedFavoriteItem | null {
  const href = normalizeText(item.url);
  const externalUrl = normalizeText(item.externalUrl);
  const title = normalizeText(item.title) || `Awwwards Pick ${index + 1}`;
  const description =
    normalizeText(item.description) ||
    (externalUrl ? `Preview from ${getDomain(externalUrl)}` : "Collected from Awwwards");

  if (!href && !externalUrl) {
    return null;
  }

  return {
    id: `awwwards:${href || externalUrl || index}`,
    source: "awwwards",
    title,
    description,
    href: externalUrl || href,
    image: getAllowedAwwwardsImage(item.image),
    tags: splitTags(description),
    meta: {
      sourceLabel: "Awwwards",
      domain: getDomain(externalUrl || href),
      homepage: externalUrl || undefined,
    },
  };
}

export function mapGitHubFavorite(repo: GitHubStarredRepository): UnifiedFavoriteItem | null {
  const href = normalizeText(repo.html_url);
  const fullName = normalizeText(repo.full_name);
  const title = fullName || normalizeText(repo.name) || "Untitled repository";
  const description = normalizeText(repo.description) || "Public starred GitHub repository.";
  const topics = Array.isArray(repo.topics) ? repo.topics.filter(Boolean).slice(0, 5) : [];
  const language = normalizeText(repo.language);

  if (!href) {
    return null;
  }

  return {
    id: `github:${repo.id}`,
    source: "github",
    title,
    description,
    href,
    tags: language ? [language, ...topics].slice(0, 5) : topics,
    meta: {
      sourceLabel: "GitHub",
      domain: "github.com",
      owner: repo.owner?.login,
      repo: repo.name,
      language: language || undefined,
      homepage: normalizeText(repo.homepage) || undefined,
    },
    stats: {
      stars: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : undefined,
      forks: Number.isFinite(repo.forks_count) ? repo.forks_count : undefined,
    },
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  };
}
