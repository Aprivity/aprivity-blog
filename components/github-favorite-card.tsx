"use client";

import { SourceBadge } from "@/components/source-badge";
import type { UnifiedFavoriteItem } from "@/lib/favorite-types";

type GitHubFavoriteCardProps = {
  item: UnifiedFavoriteItem;
  index: number;
};

const COPY = {
  openGitHub: "\u6253\u5f00 GitHub",
  stars: "stars",
};

function formatNumber(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return String(value);
}

function getRepositoryParts(item: UnifiedFavoriteItem) {
  if (item.meta.owner || item.meta.repo) {
    return {
      owner: item.meta.owner ?? "GitHub",
      repo: item.meta.repo ?? item.title,
    };
  }

  const [owner, ...repoParts] = item.title.split("/");

  return {
    owner: repoParts.length > 0 ? owner : "GitHub",
    repo: repoParts.length > 0 ? repoParts.join("/") : item.title,
  };
}

function CompactMeta({ item }: { item: UnifiedFavoriteItem }) {
  const starCount = formatNumber(item.stats?.stars);
  const metaItems = [
    item.meta.language,
    starCount ? `${starCount} ${COPY.stars}` : "",
  ].filter(Boolean);

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
      {metaItems.map((meta) => (
        <span
          key={meta}
          className="github-meta-pill rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-slate-300"
        >
          {meta}
        </span>
      ))}
    </div>
  );
}

function TopicList({ tags }: { tags: string[] }) {
  const visibleTags = tags.slice(0, 3);
  const hiddenCount = Math.max(tags.length - visibleTags.length, 0);

  if (visibleTags.length === 0 && hiddenCount === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="github-topic-pill rounded-full border border-sky-300/14 bg-sky-300/[0.07] px-2.5 py-1 text-[11px] text-sky-100/85"
        >
          {tag}
        </span>
      ))}

      {hiddenCount > 0 ? (
        <span className="github-topic-pill rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[11px] text-slate-300">
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}

export function GitHubFavoriteCard({ item, index }: GitHubFavoriteCardProps) {
  const { owner, repo } = getRepositoryParts(item);

  return (
    <article className="github-favorite-card inspiration-card hover-smooth group relative flex min-h-[21rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(7,10,24,0.92))] p-6 shadow-[0_18px_58px_rgba(2,6,23,0.36)] backdrop-blur-xl hover:-translate-y-1.5 hover:border-sky-300/30 hover:shadow-[0_26px_76px_rgba(37,99,235,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.11),transparent_42%)] opacity-72 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent" />

      <div className="relative flex h-full flex-1 flex-col">
        <header className="flex items-start justify-between gap-4">
          <SourceBadge source="github" />
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </header>

        <div className="mt-7 flex-1">
          <p className="line-clamp-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {owner}
          </p>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inspiration-card-title mt-2 block break-words font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold leading-tight text-white hover:text-sky-100"
          >
            <span className="line-clamp-2">{repo}</span>
          </a>

          <p className="inspiration-card-description mt-4 line-clamp-2 text-sm leading-7 text-slate-300">
            {item.description}
          </p>

          <CompactMeta item={item} />
          <TopicList tags={item.tags} />
        </div>

        <footer className="mt-auto pt-7">
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
          >
            {COPY.openGitHub}
          </a>
        </footer>
      </div>
    </article>
  );
}
