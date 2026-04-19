import { ProjectsHeader } from "@/components/projects-header";
import { ProjectsSkeletonGrid } from "@/components/projects-state-card";

export default function ProjectsLoading() {
  return (
    <section className="projects-section relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <div className="mt-8">
          <ProjectsSkeletonGrid />
        </div>
      </div>
    </section>
  );
}
