# 部署指南

这是 AI Native Portfolio CMS 面向用户的部署文档，只保留当前部署需要的信息。更长的生产 CMS 操作细节会链接到专门 runbook。

## 部署模式

### File Mode

file mode 是最简单的生产路径。

- 不需要 PostgreSQL。
- 内容来自 `content/site`、`content/homepage`、`content/pages`、`content/profile`、`content/blog` 和 `content/projects`。
- 内容源变量保持为 `file`。
- 修改内容、SEO、RSS、sitemap 或域名后需要重新构建。

### Database Mode

database mode 会启用 PostgreSQL 后台 CMS。

- 需要 `PERSONAL_SITE_DATABASE_URL`。
- 需要手动执行 migration。
- 需要配置 Admin 登录变量。
- 只有把对应内容源变量切到 `database` 后，公开页面才会读取数据库内容。

生产切换前先读 [数据库内容源说明](DATABASE_CONTENT_SOURCE.zh-CN.md)。更完整的生产 CMS 流程见 [Production CMS 部署手册](PRODUCTION_CMS_DEPLOYMENT.zh-CN.md)。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

本地地址：

```text
http://localhost:3000
```

部署前建议运行：

```bash
pnpm lint
pnpm build
pnpm security:admin
```

## 环境变量

### 站点 URL

```text
NEXT_PUBLIC_SITE_URL=https://example.com
```

本地开发：

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` 会影响：

- canonical metadata
- Open Graph URL
- `sitemap.xml`
- `robots.txt`
- `rss.xml`

Next.js 会在 `pnpm build` 时内联 `NEXT_PUBLIC_*` 变量，所以 Docker 部署时构建期和运行期都要有这个值。修改后需要重新构建镜像。

### File Mode 内容源

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

### Database Mode 内容源

全部切到 database：

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

也可以按领域逐步切换：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

### PostgreSQL

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
```

简单 file-mode 部署不需要配置 PostgreSQL，除非你启用了其他依赖数据库的功能。

### Admin 登录

```text
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
ADMIN_AUTH_DEBUG=false
```

生成本地安全值：

```bash
pnpm admin:secrets
```

生产注意事项：

- 不要提交真实 Admin 账号、password hash、session secret、数据库连接串或 `.env.production`。
- 生产环境保持 `ADMIN_AUTH_DEBUG=false`。
- 改动 Admin 相关文件后运行 `pnpm security:admin`。

### Agent Demo

如果启用 `/agent-demo`，在服务器环境变量中配置模型服务：

```text
AGENT_DEMO_MODEL_API_URL=
AGENT_DEMO_MODEL_API_KEY=
AGENT_DEMO_MODEL=
AGENT_DEMO_MODEL_TIMEOUT_MS=30000
AGENT_DEMO_RATE_LIMIT_WINDOW_MS=60000
AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS=10
AGENT_DEMO_LOG_LEVEL=info
AGENT_DEMO_RUN_LIVE_TEST=false
AGENT_DEMO_OBSERVABILITY_ENABLED=true
AGENT_DEMO_HASH_SALT=<random-server-side-salt>
AGENT_DEMO_DATABASE_URL=<postgres-connection-url>
```

API key 和 salt 不要写进已跟踪文件。如果不需要观测存储，可以设置 `AGENT_DEMO_OBSERVABILITY_ENABLED=false`，或不配置 `AGENT_DEMO_DATABASE_URL`。

## 数据库 Migration

应用不会在构建或启动时自动执行 migration。

database mode 需要手动按数字顺序执行 SQL：

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/005_create_page_configs.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/006_create_site_configs.sql
```

生产执行前：

- 先备份 PostgreSQL。
- 确认命令连接的是目标数据库。
- 记录已经执行的 migration 文件。
- 数据库和后台内容检查通过后，再重建或重启应用。

备份细节见 [PostgreSQL 备份与恢复](POSTGRES_BACKUP_RESTORE.zh-CN.md)。

## Docker 部署

仓库包含用于 Next.js standalone 输出的 Dockerfile 和 Compose 文件。

当前 Compose service：

```text
personal-dev-os
```

当前外部 Docker 网络：

```text
web-proxy
```

在服务器创建生产环境文件：

```bash
cp .env.example .env.production
```

编辑 `.env.production`，至少设置：

```text
NEXT_PUBLIC_SITE_URL=https://example.com
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

如果外部代理网络不存在，先创建：

```bash
docker network create web-proxy
```

构建并启动：

```bash
docker compose --env-file .env.production up -d --build
```

修改 `NEXT_PUBLIC_SITE_URL`、SEO、sitemap、RSS 或域名配置后，需要重新构建：

```bash
docker compose --env-file .env.production up -d --build
```

如果 Docker 缓存导致 metadata 没更新：

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

查看日志：

```bash
docker compose logs -f personal-dev-os
```

## Nginx 反向代理

Nginx 和应用放在同一个 Docker 网络，公开流量代理到：

```text
http://personal-dev-os:3000
```

通用 Nginx location 示例：

```nginx
location / {
    proxy_pass http://personal-dev-os:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

如果 Admin Markdown import 返回 `413 Request Entity Too Large`，配置一个和应用限制匹配的小上传限制：

```nginx
client_max_body_size 2m;
```

公开启用 Agent Demo 时，建议除了应用内限流外，也在 Nginx 对 `/api/agent-demo` 加一层 route-level rate limit。

修改 Nginx 后先检查再重载：

```bash
nginx -t
nginx -s reload
```

如果 Nginx 跑在容器里，使用对应的 `docker exec <nginx-container> ...` 命令。

## 生产检查清单

- `NEXT_PUBLIC_SITE_URL` 已设置为生产 origin。
- `.env.production` 没有进入 Git。
- 未启用 CMS 时，file mode 变量显式为 `file`。
- 启用 database mode 时，migration 已手动执行。
- 生产数据库改动前已有 PostgreSQL 备份。
- 启用 `/admin` 时，Admin 登录变量已配置。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- `pnpm security:admin` 通过。
- Docker 镜像可成功重建。
- `/` 能渲染 Developer OS shell。
- `/blog`、`/projects`、`/sitemap.xml`、`/robots.txt`、`/rss.xml` 正常。
- 草稿不会出现在公开页面、sitemap 和 RSS。
- `/admin/login` 使用安全凭据保护。
- `/agent-demo` 只在模型变量配置后启用。

## 线上验证

检查：

```text
https://example.com
https://example.com/blog
https://example.com/projects
https://example.com/sitemap.xml
https://example.com/robots.txt
https://example.com/rss.xml
```

如果启用 database mode，也检查：

```text
https://example.com/admin/login
https://example.com/admin/site
https://example.com/admin/hero
https://example.com/admin/pages
https://example.com/admin/profile
https://example.com/admin/stack
https://example.com/admin/contact
https://example.com/admin/blog
https://example.com/admin/projects
```

## 回滚

代码回滚：

```bash
git log --oneline
git checkout <previous-tag-or-commit>
docker compose --env-file .env.production up -d --build
```

内容源回滚时切回 file mode，然后重建或重启：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

内容源回滚不会删除数据库记录。
