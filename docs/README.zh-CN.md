# docs 中文文档入口

本目录已添加中文工作文档，方便后续开发、发布和 AI 协作时直接阅读。

## 优先阅读

- [部署手册](DEPLOYMENT.zh-CN.md)：每次发布前优先看这份，特别注意 `NEXT_PUBLIC_SITE_URL` 的构建期和运行期要求。
- [开发规则](DEVELOPMENT_RULES.zh-CN.md)：编码、架构、博客、SEO、生产维护规则。
- [设计简报](DESIGN_BRIEF.zh-CN.md)：Personal Developer OS 的产品概念和设计底线。
- [实施计划](IMPLEMENTATION_PLAN.zh-CN.md)：项目阶段进度和当前状态。
- [AI 变更记录中文摘要](CHANGELOG_AI.zh-CN.md)：项目历史的中文速览。

## 发布时最重要的三件事

1. `NEXT_PUBLIC_SITE_URL` 必须是生产域名：

```text
NEXT_PUBLIC_SITE_URL=https://oli6666.top
```

2. 更新生产环境时使用：

```bash
cd /opt/apps/personal-dev-os
git pull
docker compose --env-file .env.production up -d --build
```

3. 如果改过域名、SEO、sitemap、RSS 或 `.env.production`，使用无缓存构建：

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

只改 `.env.production` 但不重建镜像，不会刷新 Next.js 构建期内联的公开变量。

