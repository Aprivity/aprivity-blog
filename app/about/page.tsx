import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Aprivity_ Portfolio",
  description:
    "About Aprivity_: a personal portfolio, growth record, and project practice page focused on AI, web development, and software engineering.",
};

const capabilities = [
  {
    title: "项目开发",
    description:
      "能够从想法出发，逐步完成页面设计、功能实现、部署上线与持续迭代。",
  },
  {
    title: "Web 工程",
    description:
      "持续学习 Next.js、TypeScript、Tailwind CSS 等现代前端技术，并将其应用到个人网站和工具类项目中。",
  },
  {
    title: "部署与运维",
    description:
      "熟悉基础的 Linux、Nginx、PM2、HTTPS 和 VPS 部署流程，能够独立完成网站上线与问题排查。",
  },
  {
    title: "竞赛与创新",
    description:
      "参与过数学建模、计算机设计等方向的实践活动，积累了建模分析、团队协作和项目表达经验。",
  },
  {
    title: "AI 探索",
    description:
      "关注 AI Agent、AI 辅助开发和智能应用方向，尝试把 AI 能力融入学习和项目开发流程。",
  },
  {
    title: "内容沉淀",
    description:
      "希望通过博客、项目文档和学习记录，将阶段性经验整理成可复用、可回顾的内容。",
  },
];

const techStack = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "Git / GitHub",
  "Linux",
  "Nginx",
  "PM2",
  "VPS 部署",
  "HTTPS / Certbot",
  "AI 辅助开发",
  "前端工程化",
];

const projects = [
  {
    name: "个人博客 / 作品集网站",
    description:
      "基于 Next.js、Tailwind CSS 和 TypeScript 构建，用于展示个人项目、技术笔记、成长记录和视觉设计实验。",
    keywords: ["Next.js", "Tailwind CSS", "TypeScript", "PM2", "Nginx", "VPS"],
  },
  {
    name: "离散数学刷题平台",
    description:
      "面向课程复习与练习的刷题平台，包含章节练习、题库整理、模拟考试、学习统计等功能。",
    keywords: ["题库系统", "模拟考试", "学习统计", "子域名部署"],
  },
  {
    name: "创新实践项目",
    description:
      "围绕竞赛、课程和实际需求进行项目开发，尝试将创意转化为可展示、可合作、可持续迭代的作品。",
    keywords: ["竞赛实践", "项目合作", "创新探索", "工程实现"],
  },
];

const directions = [
  {
    title: "AI 与软件工程",
    description:
      "持续学习 AI 应用开发、软件工程方法和系统设计能力，关注如何把 AI 技术落到真实产品中。",
  },
  {
    title: "项目实践与工程能力",
    description:
      "通过个人网站、刷题平台、服务器部署和项目迭代，不断提升前端开发、部署运维和问题排查能力。",
  },
  {
    title: "长期积累",
    description:
      "继续沉淀项目、博客、竞赛经历和技术笔记，让学习过程逐渐形成可展示、可复用的作品体系。",
  },
];

export default function AboutPage() {
  return (
    <section className="about-page relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-ambient-sky absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px]" />
        <div className="section-ambient-violet absolute right-[-12%] top-4 h-96 w-96 rounded-full bg-violet-500/12 blur-[160px]" />
        <div className="section-ambient-cyan absolute bottom-[12%] left-[24%] h-72 w-72 rounded-full bg-cyan-400/8 blur-[140px]" />
        <div className="section-ambient-grid absolute inset-0 opacity-24 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <header className="about-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_38%)] opacity-80" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

          <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="section-badge about-badge mb-5 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 shadow-[0_0_24px_rgba(167,139,250,0.12)] backdrop-blur">
                关于我
              </div>
              <h1 className="about-title font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-none text-white sm:text-6xl lg:text-[5rem]">
                Aprivity_
              </h1>
              <p className="about-card-title mt-5 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-sky-100 sm:text-2xl">
                软件工程方向学生 / AI 探索者 / Web 开发实践者
              </p>
            </div>

            <div className="about-card rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md sm:p-6">
              <p className="about-description text-base leading-8 text-slate-300">
                我关注 AI、软件工程与 Web 开发，喜欢把学习中的想法做成真实可运行的项目。这个网站既是我的作品展示页，也是我的学习记录本，用来沉淀项目、技术笔记和成长过程。
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://github.com/Aprivity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-cta hover-smooth inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_28px_rgba(59,130,246,0.28)] hover:-translate-y-0.5"
                >
                  查看项目
                </a>
                <Link
                  href="/"
                  className="secondary-cta hover-smooth inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-100 backdrop-blur hover:-translate-y-0.5"
                >
                  返回首页
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-12 space-y-12 md:mt-14 md:space-y-14">
          <section>
            <SectionHeading eyebrow="Overview" title="能力概览" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, index) => (
                <article
                  key={item.title}
                  className="about-card hover-smooth group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.28)] backdrop-blur-md hover:-translate-y-1 hover:border-sky-300/24"
                >
                  <div className="about-card-index absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-400">
                    0{index + 1}
                  </div>
                  <h3 className="about-card-title pr-10 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="about-card-description mt-3 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Stack" title="技术栈" />
            <div className="about-panel mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_42px_rgba(2,6,23,0.24)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((item) => (
                  <span
                    key={item}
                    className="source-badge inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-slate-200 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Practice" title="项目实践" />
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.name}
                  className="about-card hover-smooth rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.28)] backdrop-blur-md hover:-translate-y-1 hover:border-sky-300/24 sm:p-6"
                >
                  <h3 className="about-card-title font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="about-card-description mt-4 text-sm leading-7 text-slate-300">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="source-badge inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Direction" title="成长方向" />
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {directions.map((direction) => (
                <article
                  key={direction.title}
                  className="about-card hover-smooth rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(2,6,23,0.28)] backdrop-blur-md hover:-translate-y-1 hover:border-sky-300/24 sm:p-6"
                >
                  <h3 className="about-card-title font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
                    {direction.title}
                  </h3>
                  <p className="about-card-description mt-4 text-sm leading-7 text-slate-300">
                    {direction.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="about-subline flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-400">
        <span className="h-px w-10 bg-gradient-to-r from-sky-300 to-transparent" />
        {eyebrow}
      </p>
      <h2 className="about-title mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
