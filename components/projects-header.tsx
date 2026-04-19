import { GITHUB_PROFILE_URL } from "@/lib/github";

const COPY = {
  title: "\u6211\u7684\u9879\u76ee \u2728",
  subtitle:
    "\u8fd9\u91cc\u5c55\u793a\u4e86\u6211\u5728 GitHub \u4e0a\u516c\u5f00\u7684\u9879\u76ee\u4e0e\u4ee3\u7801\u5b9e\u8df5 \ud83d\udcbb",
  github: "\u67e5\u770b GitHub \u4e3b\u9875",
};

export function ProjectsHeader() {
  return (
    <header className="projects-header relative animate-fade-up overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_22px_82px_rgba(2,6,23,0.42)] backdrop-blur-xl md:p-8 lg:p-10">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
      <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-badge mb-5 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 shadow-[0_0_24px_rgba(56,189,248,0.12)] backdrop-blur">
            GitHub Projects
          </div>
          <h1 className="projects-title font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4.25rem]">
            {COPY.title}
          </h1>
          <p className="projects-subtitle mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {COPY.subtitle}
          </p>
        </div>

        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-cta hover-smooth inline-flex w-fit items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-3.5 font-medium text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:-translate-y-1 hover:scale-[1.025] hover:from-sky-400 hover:via-blue-500 hover:to-violet-400 hover:shadow-[0_0_70px_rgba(96,165,250,0.45)]"
        >
          {COPY.github}
          <span className="ml-2">-&gt;</span>
        </a>
      </div>
    </header>
  );
}
