import Link from "next/link";
import type { GitHubRepository } from "@/lib/github";

type ProjectCardProps = {
  repository: GitHubRepository;
  index: number;
};

const COPY = {
  unknown: "\u672a\u77e5",
  fallbackDescription:
    "\u8fd9\u4e2a\u4ed3\u5e93\u6682\u65f6\u8fd8\u6ca1\u6709\u586b\u5199\u63cf\u8ff0\u3002 \ud83d\udccc",
  detailAriaPrefix: "\u67e5\u770b",
  detailAriaSuffix: "\u9879\u76ee\u8be6\u60c5",
  updatedAt: "\u66f4\u65b0\u65f6\u95f4",
  detail: "\u67e5\u770b\u8be6\u60c5",
};

function formatNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return String(value);
}

function formatDate(value: string) {
  if (!value) {
    return COPY.unknown;
  }

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ProjectCard({ repository, index }: ProjectCardProps) {
  const detailHref = `/projects/${encodeURIComponent(repository.name)}`;
  const description = repository.description || COPY.fallbackDescription;
  const visibleTopics = repository.topics.slice(0, 3);

  return (
    <article className="project-card hover-smooth group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(7,10,24,0.92))] p-6 shadow-[0_18px_58px_rgba(2,6,23,0.36)] backdrop-blur-xl hover:-translate-y-1.5 hover:border-sky-300/30 hover:shadow-[0_28px_82px_rgba(37,99,235,0.2)]">
      <Link
        href={detailHref}
        aria-label={`${COPY.detailAriaPrefix} ${repository.name} ${COPY.detailAriaSuffix}`}
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_42%)] opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent" />

      <div className="relative z-10 flex h-full flex-1 flex-col">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200/75">
              Repository
            </p>
            <Link
              href={detailHref}
              className="project-card-title hover-smooth mt-2 block break-words font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold leading-tight text-white hover:text-sky-100"
            >
              {repository.name}
            </Link>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </header>

        <p className="project-card-description mt-5 line-clamp-3 flex-1 text-sm leading-7 text-slate-300">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="project-meta-pill rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">
            {repository.language || "Code"}
          </span>
          <span className="project-meta-pill rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">
            Stars {formatNumber(repository.stargazers_count)}
          </span>
          <span className="project-meta-pill rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">
            Forks {formatNumber(repository.forks_count)}
          </span>
        </div>

        {visibleTopics.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTopics.map((topic) => (
              <span
                key={topic}
                className="project-topic-pill rounded-full border border-sky-300/14 bg-sky-300/[0.07] px-2.5 py-1 text-[11px] text-sky-100/85"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}

        <footer className="mt-auto pt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {COPY.updatedAt} {formatDate(repository.updated_at)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={detailHref}
                className="secondary-cta hover-smooth relative z-20 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
              >
                {COPY.detail}
              </Link>
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-smooth relative z-20 inline-flex items-center rounded-full border border-sky-300/18 bg-sky-300/[0.08] px-4 py-2 text-sm text-sky-100 hover:-translate-y-1 hover:border-sky-300/36 hover:bg-sky-300/[0.12] hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
