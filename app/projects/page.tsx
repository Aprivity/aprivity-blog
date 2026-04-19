import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects-grid";
import { ProjectsHeader } from "@/components/projects-header";
import { ProjectsStateCard } from "@/components/projects-state-card";
import { fetchGitHubRepositories } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Aprivity_ Portfolio",
  description: "Aprivity_'s public GitHub projects and code practice.",
};

const COPY = {
  emptyTitle: "\u8fd9\u91cc\u6682\u65f6\u8fd8\u6ca1\u6709\u9879\u76ee \ud83d\udccc",
  errorTitle: "\u6682\u65f6\u65e0\u6cd5\u52a0\u8f7d\u9879\u76ee \ud83d\udd0d",
  errorDescription:
    "GitHub \u6570\u636e\u6e90\u77ed\u65f6\u95f4\u5185\u6ca1\u6709\u8fd4\u56de\u53ef\u7528\u5185\u5bb9\u3002\u4f60\u4ecd\u7136\u53ef\u4ee5\u76f4\u63a5\u6253\u5f00 GitHub \u4e3b\u9875\u67e5\u770b\u516c\u5f00\u4ed3\u5e93\u3002 \ud83d\udccc",
};

export default async function ProjectsPage() {
  const result = await fetchGitHubRepositories();

  return (
    <section className="projects-section relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-cyan absolute bottom-[-4%] left-[26%] h-72 w-72 rounded-full bg-cyan-400/8 blur-[140px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />

        {result.status === "success" && result.message ? (
          <div className="mt-8 rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300 shadow-[0_14px_42px_rgba(2,6,23,0.2)] backdrop-blur-md">
            <span className="text-sky-200/90">{result.message}</span>
          </div>
        ) : null}

        <div className="mt-8 animate-fade-up-delayed">
          {result.status === "success" ? (
            <ProjectsGrid repositories={result.items} />
          ) : null}

          {result.status === "empty" ? (
            <ProjectsStateCard title={COPY.emptyTitle} description={result.message} />
          ) : null}

          {result.status === "error" ? (
            <ProjectsStateCard
              title={COPY.errorTitle}
              description={COPY.errorDescription}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
