import { ProjectsSkeletonGrid } from "@/components/projects-state-card";

export default function ProjectDetailLoading() {
  return (
    <section className="project-detail-section relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="h-11 w-36 animate-pulse rounded-full bg-white/10" />
        <div className="project-detail-panel mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="space-y-5">
            <div className="h-9 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="h-14 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-white/10" />
            <div className="h-5 w-4/5 max-w-2xl animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="mt-10">
            <ProjectsSkeletonGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
