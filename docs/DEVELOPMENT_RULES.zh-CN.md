# 开发规则 - Personal Dev OS

本文件是 `docs/DEVELOPMENT_RULES.md` 的中文工作版本。后续开发、修复、发布前检查都应遵守这些规则。

## 1. 跨工具协作规则

- Codex 和 Claude 开始任务前都必须阅读 docs 里的核心文档。
- 不理解现有结构前，不要重写。
- 不要重复实现已有功能。
- 大改前先说明影响范围。
- 大改后更新 `docs/CHANGELOG_AI.md`。

## 2. 设计一致性规则

- 所有 UI 优化都必须强化 Developer OS 概念。
- 不要把窗口系统弱化成普通网页区块。
- 不要移除 System Status Bar。
- 不要移除 Console App。
- 不要移除 Desktop fallback。
- `macos` / `vercel` 只能改变视觉质感，不能改变产品结构。

## 3. 代码结构规则

```text
components/os/       OS shell 组件
components/main/     Main App 内容组件
components/console/  Console App 组件
components/settings/ 设置切换组件
hooks/               状态逻辑 hooks
lib/                 类型、命令、翻译、样式 token
data/                本地 mock 数据
```

## 4. 文案规则

- 中英文文案必须集中在 `lib/translations.ts`。
- 不要在组件里散落硬编码文案。
- 所有用户可见文本使用 `@/lib/translations` 的 `t(key, lang)`。
- mock 数据也应考虑双语结构。

## 5. 设置规则

- 全局设置 theme、lang、stylePreset 都必须来自 `@/lib/settings-context` 的 `useSettings()`。
- 不要在 `SettingsContext` 之外新增 localStorage 读写。
- 旧 hooks `useTheme`、`useLanguage`、`useStylePreset` 只是兼容包装。
- 渲染依赖主题的 UI 前要检查 `mounted`，避免 hydration mismatch。

## 6. 主题与风格规则

- `theme` 控制 `light` / `dark`。
- `stylePreset` 控制 `macos` / `vercel`。
- 不要混淆 theme 和 stylePreset。
- 不要为了单个主题写完全独立的组件。
- 所有视觉 token 查询使用 `@/lib/stylePresets` 的 `getStyleTokens(preset)`。
- 新增视觉差异时，优先用 style tokens、CSS 变量或 Tailwind class 映射，不能复制组件。

## 7. 包管理规则

- 只使用 **pnpm**。
- 不要使用 npm、yarn 或 bun 做依赖操作。
- 不要提交 `package-lock.json`、`yarn.lock`、`bun.lockb`。
- `pnpm-lock.yaml` 是唯一 lockfile。
- 拉取包含依赖变更的代码后，运行 `pnpm install`。

## 8. CLI / Console 规则

- 所有 CLI 输出必须通过 `lib/translations.ts` 支持 zh / en。
- 当前 CLI prompt 是静态的：`visitor@dev-os:~ $`。
- 动态路径、真实文件系统命令、AI 自然语言解析都推迟到后续阶段。
- Console App 在 docked 和 maximized 状态下都必须保持纯文本终端体验。
- Console 最大化模式保持纯终端，不联动 Main App。

## 9. 博客架构规则

- 页面、组件、Console 命令不能直接读取 `content/blog/*.md`。
- 所有博客数据访问必须经过 `BlogService`：`@/lib/blog`。
- `BlogService` 委托给 `BlogRepository` 实现，上层不关心存储方式。
- 当前实现是 `FileBlogRepository`，只在服务端读取 Markdown。
- 未来可通过 `DbBlogRepository` 或 `CmsBlogRepository` 替换存储，不重写页面、Console 或 SEO 消费层。
- Markdown frontmatter 字段应尽量贴近未来数据库模型。
- Console 的 blog 命令不能维护独立 mock 数据。
- Console 展示的博客元数据必须来自 `BlogService`，再以可序列化 props 传给客户端组件。
- 客户端组件可以消费服务端传入的 `BlogPostMeta[]`，但不能导入 `fs`、`path`、`FileBlogRepository` 或 Markdown 文件。

## 10. SEO / 站点发现规则

- 公开 SEO 输出 `metadata`、`sitemap.xml`、`robots.txt`、`rss.xml` 不能暴露草稿。
- Sitemap 和 RSS 必须通过 `BlogService.getPublishedPosts()` 获取文章。
- 文章 metadata 必须通过 `BlogService.getPublishedPostBySlug()` 或其他 published-only 方法获取。
- 站点 URL 和默认 SEO 文案集中在 `lib/seo.ts`。
- 生产部署必须设置 `NEXT_PUBLIC_SITE_URL`。
- 未来升级 CMS / DB 时，应新增或替换 `BlogRepository`，而不是重写页面、Console 或 SEO 消费层。

## 11. 生产维护规则

- 修改 `NEXT_PUBLIC_SITE_URL` 后必须重新生产构建，因为 Next.js 会在构建期内联 `NEXT_PUBLIC_*`。
- 改动 SEO、sitemap、RSS 或域名后，必须在线复查。
- 生产更新使用：

```bash
git pull
docker compose --env-file .env.production up -d --build
```

- 发布前尽量运行 `pnpm lint` 和 `pnpm build`。
- 不要提交 `.env.production`、`.env.local`、证书文件、私钥、服务器 IP 或部署密钥。

## 12. 质量规则

- 有意义改动后运行 `pnpm lint`。
- 条件允许时运行 `pnpm build`。
- 修复 TypeScript 错误。
- 避免 `any`。
- 避免不必要的第三方库。
- 动画克制使用。

## 13. 视觉维护规则

- 任何视觉改动都要检查 `macos` 和 `vercel` 两种 preset。
- 任何颜色或背景改动都要检查 `light` 和 `dark`。
- 任何布局改动都要检查桌面、平板 768px、移动端 360px 到 430px。
- 不要把 Personal Developer OS 弱化成普通作品集或普通博客模板。
- 优先在 `lib/stylePresets.ts` 里做 style-token-driven 改动，少在组件里硬编码 preset 差异。
- hover 和 active 反馈要克制：scale 不超过 1.1，translate 不超过 4px，duration 不超过 250ms。
- 所有动画必须尊重 `prefers-reduced-motion`。

