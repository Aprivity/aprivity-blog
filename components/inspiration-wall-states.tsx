"use client";

type StateCardProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  linkLabel?: string;
  linkHref?: string;
};

const COPY = {
  status: "Collection Status",
};

export function InspirationSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="inspiration-loading-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-[0_18px_58px_rgba(2,6,23,0.34)] backdrop-blur-xl"
        >
          <div className="aspect-[16/11] animate-pulse bg-[linear-gradient(135deg,rgba(56,189,248,0.12),rgba(168,85,247,0.12))]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-6 w-4/5 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InspirationStateCard({
  title,
  description,
  actionLabel,
  onAction,
  linkLabel,
  linkHref,
}: StateCardProps) {
  return (
    <div className="inspiration-state-card relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(7,10,24,0.94))] p-6 shadow-[0_20px_68px_rgba(2,6,23,0.4)] backdrop-blur-xl sm:p-8">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/30 to-transparent" />
      <div className="relative max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-200/75">{COPY.status}</p>
        <h2 className="inspiration-state-title mt-4 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white">
          {title}
        </h2>
        <p className="inspiration-state-description mt-4 text-sm leading-7 text-slate-300">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="secondary-cta hover-smooth rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
            >
              {actionLabel}
            </button>
          ) : null}

          {linkLabel && linkHref ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-smooth rounded-full border border-sky-300/18 bg-sky-300/[0.08] px-5 py-3 text-sm text-sky-100 hover:-translate-y-1 hover:border-sky-300/36 hover:bg-sky-300/[0.12] hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
            >
              {linkLabel}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
