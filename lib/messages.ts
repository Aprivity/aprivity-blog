export const messages = {
  zh: {
    nav: {
      home: "首页",
      about: "关于",
      blog: "博客",
      projects: "项目",
      favorites: "我的收藏",
      contact: "联系",
    },
    language: {
      toggleLabel: "切换到英文",
      shortLabel: "中",
      nextLabel: "EN",
    },
    hero: {
      badge: "欢迎来到我的作品主页 ✨",
      titlePrefix: "你好，我是",
      intro:
        "这里用来整理我的项目、记录开发过程，也分享一些关于编程、设计和构建产品的想法。",
      projectsButton: "查看项目",
      blogButton: "查看博客",
      metrics: [
        { value: "05+", label: "持续开发中 🚀" },
        { value: "20+", label: "已完成项目" },
        { value: "24/7", label: "灵感加载中 💡" },
      ],
      avatarAlt: "Aprivity_ 的头像",
      role: "独立开发者",
      statusLabel: "当前状态",
      statusValue: "持续构建中 🛠️",
      revealHint: "移动鼠标探索 ✨",
    },
    about: {
      badge: "关于我",
      title: "用代码构建项目，也用内容记录自己的成长路径 💻",
      description:
        "我是一名专注于编程与项目开发的开发者，喜欢把灵感落成页面、产品和可持续迭代的作品。这里会展示我做过的项目，也会分享一些开发过程中的思考与总结。",
      subline: "项目展示、博客输出与个人成长记录 📌",
      cards: [
        {
          eyebrow: "方向",
          title: "AI / 软件工程 💻",
          description:
            "我关注如何把想法做成真正可用的产品，偏好现代前端工程、清晰架构，以及 AI 辅助开发流程。",
        },
        {
          eyebrow: "技术栈",
          title: "Next.js / Tailwind / TypeScript",
          description:
            "我主要使用这套技术组合来搭建快速、稳定且易维护的 Web 项目，也持续拓展更多实用能力。",
        },
        {
          eyebrow: "目标",
          title: "记录成长 / 展示项目 / 分享博客",
          description:
            "这个网站既是作品展示页，也是我的开发记录本，用来沉淀经验、整理输出并持续更新。",
        },
        {
          eyebrow: "状态",
          title: "学习中 / 构建中 / 探索中 🚀",
          description:
            "我会一边做项目，一边打磨技术细节，在不断实践里验证想法，也寻找下一步值得投入的方向。",
        },
      ],
    },
    favorites: {
      badge: "GitHub Stars",
      title: "我的收藏 📚",
      subtitle: "这里保留一些常看的灵感来源和收藏入口。",
      description:
        "Awwwards 的详细内容已经移到单独的展示页，适合更完整地浏览图片、标题和链接。",
      allButton: "查看我的 GitHub 星标项目",
      showcaseButton: "进入收藏展示页",
      cardButton: "查看仓库",
      showcaseEntry: {
        eyebrow: "Awwwards",
        title: "前端灵感收藏展示页 ✨",
        description: "把图片、标题和浏览节奏拉开，单独看更舒服。",
        buttonLabel: "进入收藏展示页",
      },
      cards: [
        {
          eyebrow: "AI",
          title: "AI 开发工具 🛠️",
          description: "关注能提升开发效率、辅助构建产品和改善工作流的 AI 项目。",
        },
        {
          eyebrow: "Engineering",
          title: "工程实践",
          description: "整理架构、性能、类型安全和代码质量相关的优秀仓库。",
        },
        {
          eyebrow: "Learning",
          title: "学习资源 📚",
          description: "保存一些适合持续阅读、复盘和扩展技术视野的项目。",
        },
      ],
    },
    showcase: {
      badge: "Awwwards Collection",
      title: "前端灵感收藏 ✨",
      subtitle: "把最近收藏的页面单独铺开，优先看图片、标题和浏览节奏。",
      description: "这里主要展示来自 Awwwards 收藏页的前端灵感内容。进入页面时会尝试获取最新收藏，拿不到数据时也会优雅回退。",
      sourceButton: "查看 Awwwards 原收藏页",
      retryButton: "重新获取",
      loadingTitle: "正在载入收藏内容 🔍",
      loadingDescription: "服务端正在尝试获取最新收藏，稍等一下，卡片会很快铺开。",
      errorTitle: "暂时无法获取最新收藏",
      errorDescription: "当前没有拿到 Awwwards 最新内容，你仍然可以直接打开原收藏页继续浏览。",
      emptyTitle: "这里暂时还没有收藏内容 📌",
      emptyDescription: "等有可用数据时，这里会自动展示最新的灵感卡片。",
      refreshingLabel: "正在尝试刷新最新收藏 🔍",
      staleNotice: "当前显示的是最近一次成功获取的收藏，新的内容会在下一次抓取成功后自动更新。",
      lastUpdatedLabel: "最近成功更新",
      sectionTitle: "最新收藏 📌",
      sourceLabel: "Awwwards",
      detailButton: "查看详情",
      externalButton: "打开站点",
    },
    contact: {
      badge: "Contact",
      title: "联系我 📬",
      subtitle: "如果你有项目合作或交流想法，欢迎联系我。",
      note: "欢迎投稿及合作 ✨",
      emailLabel: "邮箱 📬",
      emailDescription: "最直接的联系方式，工作日和灵感时刻都能收到。",
      copyButton: "复制邮箱",
      copiedButton: "已复制",
      copyFailedButton: "复制失败",
      sendButton: "发送邮件",
      copiedHint: "邮箱已复制到剪贴板 📌",
      copyFailedHint: "当前环境暂时无法复制，请手动复制邮箱",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      blog: "Blog",
      projects: "Projects",
      favorites: "Favorites",
      contact: "Contact",
    },
    language: {
      toggleLabel: "Switch to Chinese",
      shortLabel: "EN",
      nextLabel: "中",
    },
    hero: {
      badge: "Welcome to my portfolio",
      titlePrefix: "Hello, I am",
      intro:
        "This is where I organize projects, document my development process, and share thoughts on coding, design, and building products.",
      projectsButton: "View Projects",
      blogButton: "View Blog",
      metrics: [
        { value: "05+", label: "Building steadily" },
        { value: "20+", label: "Projects shipped" },
        { value: "24/7", label: "Ideas loading" },
      ],
      avatarAlt: "Aprivity_ avatar",
      role: "Independent Developer",
      statusLabel: "Current Status",
      statusValue: "Still building",
      revealHint: "Move to reveal",
    },
    about: {
      badge: "About Me",
      title: "I build projects with code and document my growth through writing.",
      description:
        "I am a developer focused on programming and project development. I enjoy turning ideas into pages, products, and works that can keep improving over time. This site showcases what I build and shares notes from the process.",
      subline: "Project showcase, blog notes, and personal growth log",
      cards: [
        {
          eyebrow: "Focus",
          title: "AI / Software Engineering",
          description:
            "I care about turning ideas into usable products, with a focus on modern frontend engineering, clear architecture, and AI-assisted workflows.",
        },
        {
          eyebrow: "Stack",
          title: "Next.js / Tailwind / TypeScript",
          description:
            "I mainly use this stack to build fast, stable, and maintainable web projects while continuing to expand practical skills.",
        },
        {
          eyebrow: "Goal",
          title: "Grow / Showcase / Share",
          description:
            "This site is both a portfolio and a development log, helping me collect experience, organize output, and keep improving.",
        },
        {
          eyebrow: "Status",
          title: "Learning / Building / Exploring",
          description:
            "I keep building projects, refining technical details, testing ideas in practice, and looking for the next direction worth exploring.",
        },
      ],
    },
    favorites: {
      badge: "GitHub Stars",
      title: "Favorites",
      subtitle: "A lighter gateway for the sources and collections I keep around.",
      description:
        "The Awwwards content has moved into a dedicated showcase page so it can breathe and be browsed more comfortably.",
      allButton: "View My GitHub Starred Projects",
      showcaseButton: "Open Showcase Page",
      cardButton: "View Repository",
      showcaseEntry: {
        eyebrow: "Awwwards",
        title: "Frontend Inspiration Showcase",
        description: "A more open layout built for browsing images, titles, and visual references.",
        buttonLabel: "Open Showcase Page",
      },
      cards: [
        {
          eyebrow: "AI",
          title: "AI Dev Tools",
          description: "Projects that improve development efficiency, product building, and practical workflows.",
        },
        {
          eyebrow: "Engineering",
          title: "Engineering Practices",
          description: "Repositories about architecture, performance, type safety, and code quality.",
        },
        {
          eyebrow: "Learning",
          title: "Learning Resources",
          description: "Projects worth revisiting for long-term learning, review, and broader technical perspective.",
        },
      ],
    },
    showcase: {
      badge: "Awwwards Collection",
      title: "Frontend Inspiration Showcase",
      subtitle: "A dedicated page for browsing recent favorites with more space, larger imagery, and a calmer reading rhythm.",
      description: "This page focuses on Awwwards collection picks. It tries to load fresh content on entry and falls back cleanly when the source is unavailable.",
      sourceButton: "View Original Awwwards Collection",
      retryButton: "Retry",
      loadingTitle: "Loading collection content",
      loadingDescription: "The server is pulling the latest favorites right now. The grid will settle in shortly.",
      errorTitle: "Unable to load the latest favorites right now",
      errorDescription: "The source did not respond in time or changed shape. You can still open the original collection directly.",
      emptyTitle: "No collection items are available yet",
      emptyDescription: "Once valid data is available, the latest inspiration cards will appear here.",
      refreshingLabel: "Refreshing the latest favorites",
      staleNotice: "You are viewing the most recent successful snapshot. New favorites will appear automatically after the next successful refresh.",
      lastUpdatedLabel: "Last successful update",
      sectionTitle: "Latest favorites",
      sourceLabel: "Awwwards",
      detailButton: "View Details",
      externalButton: "Open Site",
    },
    contact: {
      badge: "Contact",
      title: "Contact",
      subtitle: "If you have a project in mind or just want to talk, feel free to reach out.",
      note: "Submissions and collaborations are welcome.",
      emailLabel: "Email",
      emailDescription: "The fastest way to reach me for ideas, feedback, and project work.",
      copyButton: "👉 Copy Email",
      copiedButton: "Copied",
      copyFailedButton: "Copy Failed",
      sendButton: "Send Email",
      copiedHint: "Email copied to clipboard",
      copyFailedHint: "Clipboard is unavailable right now, please copy the address manually",
    },
  },
} as const;

export type Language = keyof typeof messages;
export type Messages = (typeof messages)[Language];
