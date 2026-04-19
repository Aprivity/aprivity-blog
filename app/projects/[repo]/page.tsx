import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsStateCard } from "@/components/projects-state-card";
import { fetchGitHubRepository } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Project Detail | Aprivity_ Portfolio",
  description: "GitHub repository detail from Aprivity_'s public projects.",
};

type ProjectDetailPageProps = {
  params: Promise<{
    repo: string;
  }>;
};

const COPY = {
  unknown: "\u672a\u77e5",
  back: "\u8fd4\u56de\u9879\u76ee\u5217\u8868",
  errorTitle: "\u6682\u65f6\u65e0\u6cd5\u52a0\u8f7d\u9879\u76ee\u8be6\u60c5 \ud83d\udd0d",
  errorSuffix:
    "\u4f60\u4ecd\u7136\u53ef\u4ee5\u56de\u5230\u9879\u76ee\u5217\u8868\uff0c\u6216\u76f4\u63a5\u6253\u5f00 GitHub \u4ed3\u5e93\u4e3b\u9875\u7ee7\u7eed\u67e5\u770b\u3002 \ud83d\udccc",
  fallbackDescription:
    "\u8fd9\u4e2a\u4ed3\u5e93\u6682\u65f6\u8fd8\u6ca1\u6709\u586b\u5199\u63cf\u8ff0\u3002 \ud83d\udccc",
  openRepo: "\u524d\u5f80\u4ed3\u5e93",
  createdAt: "\u521b\u5efa\u65f6\u95f4",
  updatedAt: "\u66f4\u65b0\u65f6\u95f4",
  pushedAt: "\u6700\u8fd1\u63a8\u9001",
  fullName: "\u5b8c\u6574\u540d\u79f0",
  visibility: "\u53ef\u89c1\u6027",
  status: "\u72b6\u6001",
  archived: "\u5df2\u5f52\u6863 \ud83d\udccc",
  active: "\u6301\u7eed\u53ef\u8bbf\u95ee \ud83d\ude80",
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
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="project-detail-stat rounded-[1rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_14px_42px_rgba(2,6,23,0.24)] backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { repo } = await params;
  const repoName = decodeURIComponent(repo);
  const result = await fetchGitHubRepository(repoName);

  return (
    <section className="project-detail-section relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-cyan absolute bottom-[-4%] left-[26%] h-72 w-72 rounded-full bg-cyan-400/8 blur-[140px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="secondary-cta hover-smooth inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-1 hover:border-sky-300/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.14)]"
        >
          &lt;- {COPY.back}
        </Link>

        {result.status === "error" ? (
          <div className="mt-8">
            <ProjectsStateCard
              title={COPY.errorTitle}
              description={`${result.message} ${COPY.errorSuffix}`}
              linkLabel={COPY.back}
              linkHref="/projects"
              external={false}
            />
          </div>
        ) : null}

        {result.status === "success" ? (
          <article className="project-detail-panel relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-8 lg:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="relative">
              {result.message ? (
                <div className="mb-6 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-sky-200/90">
                  {result.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="section-badge mb-5 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
                    Project Detail
                  </div>
                  <h1 className="project-detail-title break-words font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.1rem]">
                    {result.item.name}
                  </h1>
                  <p className="project-detail-description mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                    {result.item.description || COPY.fallbackDescription}
                  </p>
                </div>

                <a
                  href={result.item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-cta hover-smooth inline-flex w-fit items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-3.5 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.025] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)]"
                >
                  {COPY.openRepo}
                  <span className="ml-2">-&gt;</span>
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Language" value={result.item.language || "Code"} />
                <StatCard label="Stars" value={formatNumber(result.item.stargazers_count)} />
                <StatCard label="Forks" value={formatNumber(result.item.forks_count)} />
                <StatCard label="Issues" value={formatNumber(result.item.open_issues_count)} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="project-detail-card rounded-[1rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_14px_42px_rgba(2,6,23,0.22)] backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/75">
                    Timeline
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                    <p>{COPY.createdAt}: {formatDate(result.item.created_at)}</p>
                    <p>{COPY.updatedAt}: {formatDate(result.item.updated_at)}</p>
                    <p>{COPY.pushedAt}: {formatDate(result.item.pushed_at || "")}</p>
                  </div>
                </div>

                <div className="project-detail-card rounded-[1rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_14px_42px_rgba(2,6,23,0.22)] backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/75">
                    Repository
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                    <p>{COPY.fullName}: {result.item.full_name}</p>
                    <p>{COPY.visibility}: {result.item.visibility}</p>
                    <p>{COPY.status}: {result.item.archived ? COPY.archived : COPY.active}</p>
                  </div>
                </div>
              </div>

              {result.item.topics.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {result.item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="project-topic-pill rounded-full border border-sky-300/14 bg-sky-300/[0.07] px-3 py-1.5 text-xs text-sky-100/85"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
