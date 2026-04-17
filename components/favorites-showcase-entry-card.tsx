import Image from "next/image";
import Link from "next/link";

type FavoritesShowcaseEntryCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
};

export function FavoritesShowcaseEntryCard({
  eyebrow,
  title,
  description,
  buttonLabel,
}: FavoritesShowcaseEntryCardProps) {
  return (
    <article className="favorites-card hover-smooth group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(9,13,30,0.9))] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-md hover:-translate-y-1.5 hover:border-sky-300/24 hover:shadow-[0_24px_54px_rgba(37,99,235,0.18)] sm:col-span-2">
      <div className="hover-smooth absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.14),transparent_38%)] opacity-80 group-hover:opacity-100" />
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />

      <div className="relative grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/awwwards-favorites-cover.svg"
              alt={title}
              fill
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.68))]" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-sky-100/80">
              <span>{eyebrow}</span>
              <span>Showcase</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-full flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
              {eyebrow}
            </p>
            <h2 className="favorites-card-title mt-4 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white sm:text-[2rem]">
              {title}
            </h2>
            <p className="favorites-card-description mt-4 text-sm leading-7 text-slate-300">
              {description}
            </p>
          </div>

          <Link
            href="/favorites/showcase"
            className="secondary-cta hover-smooth mt-6 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_36px_rgba(96,165,250,0.14)]"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
