# 部署手册 - Personal Dev OS

本文件是项目发布操作的中文手册。每次发布前优先看这份文档，尤其注意 `NEXT_PUBLIC_SITE_URL` 的构建期行为。

## 1. 项目部署目标

生产环境必须保留 Personal Developer OS 的产品结构：

- System Status Bar。
- Main App。
- Console App。
- Desktop fallback。
- `macos` / `vercel` 视觉 preset。
- `light` / `dark` 主题。
- `zh` / `en` 语言切换。

当前生产地址：

```text
https://oli6666.top
```

当前生产栈：

- 自有韩国云服务器。
- CentOS 9。
- Docker + Docker Compose。
- Next.js standalone 输出。
- Docker Nginx 反向代理。
- Let's Encrypt HTTPS。
- 主域名：`oli6666.top`。
- `www.oli6666.top` 重定向到 `oli6666.top`。

## 2. 本地开发

```bash
pnpm install
pnpm dev
```

本地地址通常是：

```text
http://localhost:3000
```

常用检查命令：

```bash
pnpm lint
pnpm build
```

项目使用 Next.js standalone 输出给 Docker 自托管：

```text
output: standalone
```

`pnpm build` 后，生产服务包在 `.next/standalone` 下。Docker 镜像运行的是 standalone Node server，不是静态导出目录。

## 3. 关键环境变量

生产环境必须设置：

```text
NEXT_PUBLIC_SITE_URL=https://oli6666.top
```

本地 fallback：

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` 会影响：

- canonical metadata。
- Open Graph URL。
- `sitemap.xml`。
- `robots.txt`。
- `rss.xml`。

### 重要：这个变量同时需要构建期和运行期

Next.js 会在 `pnpm build` 时内联 `NEXT_PUBLIC_*` 变量。

因此 Docker 部署时必须同时满足：

- **构建期**：构建镜像时传入 `NEXT_PUBLIC_SITE_URL`，否则 sitemap、RSS、metadata 可能仍然是 localhost 或旧域名。
- **运行期**：容器启动时继续传入同一个 `NEXT_PUBLIC_SITE_URL`，保证 standalone server 运行时也能读取。

当前 `docker-compose.yml` 已经同时处理这两处：

```yaml
build:
  args:
    NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
env_file:
  - .env.production
environment:
  NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
```

不要提交 `.env.production`、`.env.local`、证书、私钥、服务器 IP 或部署密钥。

## 4. 服务器目录

当前约定目录：

```text
/opt/apps/personal-dev-os
/opt/infra/nginx
/opt/infra/nginx/conf.d
/opt/infra/nginx/certbot/www
/etc/letsencrypt/live/oli6666.top
```

应用目录：

```bash
cd /opt/apps/personal-dev-os
```

Nginx 目录：

```bash
cd /opt/infra/nginx
```

## 5. 首次部署流程

### 5.1 检查 Docker

```bash
docker --version
docker compose version
```

如果 CentOS 9 没有 Compose 插件：

```bash
sudo dnf install docker-compose-plugin
```

### 5.2 准备应用目录

```bash
sudo mkdir -p /opt/apps/personal-dev-os
sudo chown -R "$USER":"$USER" /opt/apps/personal-dev-os
cd /opt/apps/personal-dev-os
git clone <repo-url> .
```

不要把真实仓库 URL、服务器 IP、密钥或账号信息写进已跟踪文件。

### 5.3 创建生产环境变量

如果域名和 HTTPS 已完成，直接使用正式域名：

```bash
cat > .env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=https://oli6666.top
EOF
```

如果还在临时 IP 调试阶段，可以临时写：

```bash
cat > .env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=http://your-server-ip
EOF
```

域名和 HTTPS 完成后，必须改回：

```text
NEXT_PUBLIC_SITE_URL=https://oli6666.top
```

改完后必须重新 build。

### 5.4 构建并启动

```bash
docker compose --env-file .env.production up -d --build
```

当前应用容器只暴露给 Docker 网络，不直接对公网开放。当前 `docker-compose.yml` 使用外部网络：

```text
web-proxy
```

Nginx 容器应加入同一个 `web-proxy` 网络，并代理到：

```text
http://personal-dev-os:3000
```

首次启动前确保网络存在：

```bash
docker network create web-proxy
```

如果网络已存在，Docker 会提示已存在，可以继续。

不要把 Next.js 容器直接暴露到公网。

## 6. 每次发布更新流程

这是最常用的发布路径。

### 6.1 本地发布前检查

在本地仓库运行：

```bash
pnpm lint
pnpm build
```

重点确认：

- 首页仍然是 Personal Developer OS，不是普通作品集页面。
- `/blog` 能看到已发布文章。
- 草稿文章不会出现在公开页面。
- Console 命令仍能使用，尤其是 `blog`、`logs`、`articles`。

### 6.2 推送代码

```bash
git status
git add <changed-files>
git commit -m "<message>"
git push
```

### 6.3 服务器拉取并重建

在服务器执行：

```bash
cd /opt/apps/personal-dev-os
git pull
docker compose --env-file .env.production up -d --build
```

### 6.4 如果改了域名、SEO、sitemap、RSS 或 `.env.production`

优先用无缓存构建，避免旧的 sitemap/RSS/metadata 留在镜像里：

```bash
cd /opt/apps/personal-dev-os
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

特别注意：只改 `.env.production` 但不重建镜像，不足以刷新构建期内联的 `NEXT_PUBLIC_SITE_URL`。

## 7. 日志查看

应用日志：

```bash
cd /opt/apps/personal-dev-os
docker compose logs -f
```

Nginx 日志：

```bash
cd /opt/infra/nginx
docker compose logs -f
```

## 8. Nginx 重载

修改 Nginx 配置后先检查：

```bash
docker exec nginx-proxy nginx -t
```

通过后重载：

```bash
docker exec nginx-proxy nginx -s reload
```

## 9. HTTPS 证书续期

手动续期：

```bash
docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /opt/infra/nginx/certbot/www:/var/www/certbot \
  certbot/certbot renew --webroot -w /var/www/certbot

docker exec nginx-proxy nginx -s reload
```

后续可以把续期命令加入 cron 定时任务。

## 10. 服务器本机检查

在服务器应用目录执行，检查应用容器自身：

```bash
cd /opt/apps/personal-dev-os
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/blog
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/sitemap.xml
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/rss.xml
```

也可以从共享代理网络检查：

```bash
docker run --rm --network web-proxy curlimages/curl http://personal-dev-os:3000
```

如果容器内检查正常，但公网不正常，优先检查 Nginx、`web-proxy` 网络、域名解析、HTTPS 证书和防火墙。

## 11. 线上验证清单

每次发布后至少检查：

- `https://oli6666.top`
- `https://oli6666.top/blog`
- `https://oli6666.top/sitemap.xml`
- `https://oli6666.top/robots.txt`
- `https://oli6666.top/rss.xml`
- HTTP 能跳转到 HTTPS。
- `www.oli6666.top` 能跳转到 `oli6666.top`。
- sitemap 和 RSS 里的 URL 使用 `https://oli6666.top`。
- 草稿文章没有公开。
- Console 的 `blog` 命令正常。
- 移动端基础布局没有溢出。
- `light` / `dark` 正常。
- `macos` / `vercel` 正常。

## 12. 回滚流程

查看提交记录：

```bash
cd /opt/apps/personal-dev-os
git log --oneline
```

切回上一个 tag 或 commit：

```bash
git checkout <previous-tag-or-commit>
docker compose --env-file .env.production up -d --build
```

建议后续每次正式发布都打 Git tag，这样回滚目标更清晰。

## 13. 发布前总清单

- 本地 `pnpm lint` 通过。
- 本地 `pnpm build` 通过。
- `.env.production` 中 `NEXT_PUBLIC_SITE_URL=https://oli6666.top`。
- 服务器使用 `docker compose --env-file .env.production up -d --build`。
- 改过域名 / SEO / sitemap / RSS / `.env.production` 时使用 `build --no-cache`。
- `/` 可访问并仍是 Personal Developer OS。
- `/blog` 可访问。
- 至少一篇已发布文章可访问。
- 草稿文章返回 404。
- `/sitemap.xml` 不包含 draft。
- `/robots.txt` 指向生产 sitemap。
- `/rss.xml` 使用绝对 URL 且不包含 draft。
- Console 命令正常。
- 移动端不溢出。

## 14. 推荐部署平台说明

当前主路径是自托管 Docker Compose + Nginx。

如果未来迁移到托管平台，应选择支持 Next.js App Router 和 Node server runtime 的平台。Vercel 是自然选项，但当前 Docker 目标使用 standalone 输出，不是静态导出。

不要把平台账号 ID、私有项目名、访问 token 或部署密钥写入仓库。
