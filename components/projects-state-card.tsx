import { GITHUB_PROFILE_URL } from "@/lib/github";

type ProjectsStateCardProps = {
  title: string;
  description: string;
  statusLabel?: string;
  linkLabel?: string;
  linkHref?: string;
  external?: boolean;
};

const COPY = {
  github: "\u67e5\u770b GitHub \u4e3b\u9875",
};

export function ProjectsStateCard({
  title,
  description,
  statusLabel = "Projects Status",
  linkLabel = COPY.github,
  linkHref = GITHUB_PROFILE_URL,
  external = true,
}: ProjectsStateCardProps) {
  return (
    <div className="projects-state-card relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(7,10,24,0.94))] p-6 shadow-[0_20px_68px_rgba(2,6,23,0.4)] backdrop-blur-xl sm:p-8">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/30 to-transparent" />
      <div className="relative max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-200/75">{statusLabel}</p>
        <h2 className="projects-state-title mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white">
          {title}
        </h2>
        <p className="projects-state-description mt-4 text-sm leading-7 text-slate-300">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={linkHref}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="secondary-cta hover-smooth rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
          >
            {linkLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeletonGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="projects-loading-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_58px_rgba(2,6,23,0.34)] backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-7 w-44 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="h-6 w-10 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="mt-16 flex justify-between gap-4">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
