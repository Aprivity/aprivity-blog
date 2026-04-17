# Aprivity_ Portfolio

Aprivity_ Portfolio 是一个基于 Next.js App Router 构建的个人主页与收藏展示站点。项目用于展示个人介绍、联系入口，以及一个以 Awwwards 灵感收藏和 GitHub Starred Repositories 为数据来源的收藏墙。

整体视觉风格偏深色蓝紫渐变、科技感、现代作品集风格，并支持浅色模式与中英文切换。

## 功能特性

- 个人作品集首页
  - 现代化 Hero 区域
  - 个人头像展示
  - 项目与成长方向简介
  - 联系入口

- 收藏展示页
  - 纯展示型收藏墙布局
  - 支持 `All`、`Awwwards 收藏`、`GitHub 收藏` 三类筛选
  - Awwwards 收藏使用偏视觉型图片卡片
  - GitHub 收藏使用仓库信息型卡片
  - 支持 loading skeleton、空状态、错误状态、局部来源失败提示
  - 支持本地缓存，接口短时间失败时可优先展示上次成功结果

- 双来源收藏数据
  - Awwwards 收藏来源：`https://www.awwwards.com/Aprivity/collections/myfav/`
  - GitHub 收藏来源：`Aprivity` 用户公开 starred repositories
  - `/api/favorites` 聚合两类收藏，并输出统一数据结构

- 主题与语言
  - 深色 / 浅色模式切换
  - 中文 / 英文文案切换
  - 首屏通过 boot script 减少主题闪烁

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Cheerio
- Next.js App Router

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 启动生产服务

```bash
npm run start
```

## 项目结构

```text
.
├── app
│   ├── api
│   │   ├── awwwards-favorites
│   │   ├── favorites
│   │   └── github-favorites
│   ├── contact
│   ├── favorites
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── hero-section.tsx
│   ├── navbar.tsx
│   ├── inspiration-wall-section.tsx
│   ├── inspiration-wall-header.tsx
│   ├── inspiration-grid.tsx
│   ├── inspiration-card.tsx
│   ├── github-favorite-card.tsx
│   ├── source-badge.tsx
│   ├── theme-toggle.tsx
│   └── language-toggle.tsx
├── lib
│   ├── awwwards-favorites.ts
│   ├── scrape-awwwards.ts
│   ├── github-favorites.ts
│   ├── favorites-aggregator.ts
│   ├── favorite-mappers.ts
│   ├── favorite-types.ts
│   └── messages.ts
├── public
│   ├── avatar.jpg
│   └── awwwards-favorites-cover.svg
├── next.config.ts
├── package.json
└── tsconfig.json
```

## API 说明

### `/api/awwwards-favorites`

拉取并解析 Awwwards 收藏页内容。

特点：

- 使用 Cheerio 解析页面 HTML
- 带服务端缓存
- 支持超时和重试
- 失败时可回退到最近一次成功缓存

### `/api/github-favorites`

读取 GitHub 用户 `Aprivity` 的公开 starred repositories。

特点：

- 不使用 OAuth
- 只读取公开可访问的 starred repositories
- 支持分页拉取和数量限制
- 带服务端缓存
- GitHub 请求失败时不会导致站点崩溃

### `/api/favorites`

聚合 Awwwards 和 GitHub 两类收藏，返回统一结构。

返回结构包含：

```ts
{
  all: UnifiedFavoriteItem[];
  groups: {
    awwwards: UnifiedFavoriteItem[];
    github: UnifiedFavoriteItem[];
  };
  counts: {
    awwwards: number;
    github: number;
    total: number;
  };
  sources: {
    awwwards: FavoriteSourceState;
    github: FavoriteSourceState;
  };
  updatedAt: string;
}
```

某一来源失败时，另一来源仍会正常返回，前端会展示局部来源提示。

## 统一收藏数据结构

收藏墙前端主要消费统一结构：

```ts
type UnifiedFavoriteItem = {
  id: string;
  source: "awwwards" | "github";
  title: string;
  description: string;
  href: string;
  image?: string;
  tags: string[];
  meta: {
    sourceLabel: string;
    domain?: string;
    owner?: string;
    repo?: string;
    language?: string;
    homepage?: string;
  };
  stats?: {
    stars?: number;
    forks?: number;
  };
  createdAt?: string;
  updatedAt?: string;
};
```

## 收藏页设计

收藏页入口：

```text
/favorites
```

页面结构：

- 顶部轻量标题区
- 来源数量统计
- `All / Awwwards 收藏 / GitHub 收藏` 筛选
- 响应式收藏网格
- 底部低调说明与外部链接

布局策略：

- Awwwards 视图更偏图片画廊，可在大屏展示更多列
- GitHub 视图更偏文字信息卡，桌面端保持 3 列，避免信息过挤
- All 视图采用更舒展的 3 列策略，兼顾两类卡片

## 缓存说明

服务端缓存文件会写入项目根目录下的 `.cache` 文件夹，例如：

```text
.cache/awwwards-favorites.json
.cache/github-favorites.json
```

这些缓存用于在外部接口短时间失败时提供兜底数据。

## 可用脚本

```bash
npm run dev
```

启动开发服务器。

```bash
npm run build
```

构建生产版本，并进行类型检查。

```bash
npm run start
```

启动生产服务器。

```bash
npm run lint
```

运行 lint 脚本。注意：当前项目使用 Next.js 15，若本地 Next lint 命令不可用，可按实际需求补充 ESLint 配置。

## 部署建议

推荐部署到支持 Next.js App Router 的平台，例如 Vercel。

部署时无需配置 GitHub OAuth，因为当前 GitHub 收藏只读取公开 starred repositories。

## 维护建议

- 如果 Awwwards 页面结构变化，优先检查 `lib/scrape-awwwards.ts`
- 如果需要调整 GitHub 收藏数量，检查 `lib/github-favorites.ts`
- 如果需要新增收藏来源，建议在 `lib/favorite-types.ts` 扩展统一类型，并在 `lib/favorite-mappers.ts` 中新增 mapper
- 如果需要调整收藏墙视觉，优先修改 `components/inspiration-*` 相关组件

## License

This project is private and currently has no public license.
