# Aprivity_ Personal Portfolio

一个基于 **Next.js** 构建的个人主页 / 博客入口 / 作品展示网站。
它是 Aprivity_ 的个人品牌主页，也是一个用于沉淀项目、灵感和收藏的数字空间。

## 项目简介

Aprivity_ Personal Portfolio 用来展示个人介绍、项目作品、博客入口、GitHub 收藏、Awwwards 设计灵感收藏等内容。它不只是一个静态主页，而是一个带有交互动画、主题切换、收藏聚合和视觉实验的个人网站。

网站整体以暗色科技感为主，使用柔和的蓝紫渐变、光晕、玻璃拟态卡片和细腻的悬浮反馈，营造轻盈但有记忆点的个人主页体验。同时，它也支持白天模式，在奶油白和浅色渐变背景下保持统一的视觉语言。

## 技术栈

- **Next.js 15**：基于 App Router 的页面与 API 路由结构
- **React 19**：组件化 UI 构建
- **TypeScript**：类型约束与更稳定的开发体验
- **Tailwind CSS 4**：快速构建响应式界面与主题样式
- **CSS Animation / Canvas**：页面动效、悬浮反馈、鼠标揭示与水波纹交互
- **GitHub API**：获取 GitHub 收藏 / Star 项目数据
- **Awwwards 数据获取接口**：聚合网页设计灵感收藏
- **Cheerio**：用于解析和整理 Awwwards 页面数据
- **PM2 / 宝塔面板**：用于服务器端 Node.js 服务管理与部署

## 核心特点

### 深色科技感视觉风格

项目默认偏向暗色模式，使用蓝紫渐变背景、柔和光晕、玻璃拟态卡片和现代化 Hero Section，整体视觉更接近个人品牌主页与创意作品集的结合。

### 白天 / 黑夜主题切换

网站支持浅色与深色主题切换：

- 白天模式使用奶油白、柔和浅蓝、浅紫色背景
- 夜间模式使用深色蓝紫科技风
- 主题切换后，导航、卡片、按钮、文字、光效都会保持统一的视觉层次

主题偏好会保存在本地，用户下次访问时会延续之前的选择。

### Hero Section

首页 Hero 区域是站点的第一视觉焦点：

- 左侧展示个人介绍、个人标识和状态信息
- 右侧展示头像与装饰卡片
- 包含“查看项目”“查看博客 / GitHub”等入口按钮
- 支持悬浮动画、渐变按钮、光效反馈和响应式布局

### 阴影擦除 / 鼠标揭示效果

Hero 右侧视觉卡片包含一个比较有特色的鼠标揭示交互：

- 初始状态下，内容被一层动态阴影或遮罩覆盖
- 鼠标移动经过时，会像橡皮擦一样擦除遮罩，露出隐藏内容
- 鼠标轨迹形成局部聚光和动态揭示效果
- 鼠标经过后的可视区域会短暂停留，再缓慢恢复遮罩

这个效果通过 Canvas 绘制遮罩轨迹实现，是项目里比较有辨识度的视觉亮点。

### 鼠标水波 / 涟漪交互效果

页面背景支持轻量的透明水波纹效果：

- 鼠标移动时产生类似水面扰动的涟漪
- 涟漪效果轻盈、透明，不会抢占正文内容
- 支持 `prefers-reduced-motion`，在用户减少动画偏好下会降低动态效果

### GitHub 收藏展示

项目内置 GitHub 收藏展示能力：

- 通过接口获取 GitHub Star / 收藏项目
- 将优秀项目以卡片形式展示
- 支持沉淀技术参考、开源项目和个人灵感来源

### Awwwards 收藏展示

除了代码项目，网站也保留了设计灵感收藏区：

- 展示来自 Awwwards 的网页设计灵感
- 可与 GitHub 收藏分区展示
- 形成个人长期维护的灵感库

### 响应式布局

项目适配桌面端、平板和移动端。页面结构会根据屏幕尺寸调整内容层次、卡片布局和间距，让个人介绍、项目卡片与收藏内容在不同设备上都保持清晰和美观。

## 项目目录结构

```bash
.
├── app/
│   ├── api/
│   │   ├── awwwards-favorites/
│   │   ├── favorites/
│   │   └── github-favorites/
│   ├── contact/
│   ├── favorites/
│   │   └── showcase/
│   ├── projects/
│   │   └── [repo]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── hero-section.tsx
│   ├── ripple-background.tsx
│   ├── theme-toggle.tsx
│   ├── github-favorite-card.tsx
│   ├── awwwards-favorites-card.tsx
│   └── ...
├── lib/
│   ├── github.ts
│   ├── github-favorites.ts
│   ├── awwwards-favorites.ts
│   ├── favorites-aggregator.ts
│   └── scrape-awwwards.ts
├── public/
│   ├── avatar.jpg
│   ├── awwwards-favorites-cover.svg
│   └── images/
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 构建与生产运行

构建生产版本：

```bash
npm run build
```

启动生产服务：

```bash
npm run start
```

## PM2 部署说明

项目已部署在服务器环境中，并通过 PM2 管理，服务名为 `aprivity`。

常用命令：

```bash
pm2 list
pm2 restart aprivity
pm2 logs aprivity
pm2 save
```

命令说明：

- `pm2 list`：查看当前 PM2 管理的服务列表
- `pm2 restart aprivity`：重启 Aprivity_ 网站服务
- `pm2 logs aprivity`：查看服务运行日志
- `pm2 save`：保存当前 PM2 进程配置，便于服务器重启后恢复

如果使用宝塔面板部署，可以在 Node 项目或终端中配合 PM2 管理服务，并将反向代理指向 Next.js 服务端口。

## 环境变量

环境变量为可选配置，具体取决于是否需要访问 GitHub API、站点 URL 或外部数据接口。请不要将真实密钥提交到仓库中。

可以在项目根目录创建 `.env.local`：

```bash
GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_SITE_URL=https://aprivity.xyz
```

可选说明：

- `GITHUB_TOKEN`：用于提高 GitHub API 请求额度，获取收藏项目或仓库信息时更稳定
- `NEXT_PUBLIC_SITE_URL`：站点线上地址，可用于 SEO、分享链接或接口拼接

## Roadmap

- 优化博客内容系统，完善文章列表、详情页与内容管理方式
- 增强项目展示页面，补充项目截图、技术标签和更完整的项目说明
- 优化 GitHub 收藏分类，让收藏项目更容易按技术方向筛选
- 增强 Awwwards 收藏缓存机制，减少重复请求并提升加载速度
- 优化鼠标交互动画性能，在低性能设备上保持流畅
- 增加更多个性化动画效果，让页面更有 Aprivity_ 的个人识别度

## 开发脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务
npm run lint     # 运行 lint 检查
```

## 关于 Aprivity_

Aprivity_ Personal Portfolio 是一个持续演进的个人网站项目。它既是作品集，也是博客入口和灵感收藏库；既用于展示已经完成的内容，也用于记录新的想法、实验和正在生长的作品。
