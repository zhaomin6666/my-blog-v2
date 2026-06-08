---
title: "Phase 7：Next.js 自托管部署：Docker、Nginx 与 HTTPS"
slug: "nextjs-docker-nginx-https-deployment"
summary: "记录 Personal Developer OS 上线到自有韩国云服务器的过程：Next.js standalone、Docker、Nginx、域名、HTTPS、SEO 输出检查和发布文档。"
date: "2026-06-08"
updatedAt: "2026-06-08"
tags: ["Next.js", "Docker", "Nginx", "Deployment"]
series: "从 Hexo 到 Personal Developer OS"
status: "published"
lang: "zh"
cover: ""
seoTitle: "Phase 7：Next.js 自托管部署：Docker、Nginx 与 HTTPS"
seoDescription: "记录 Next.js Personal Developer OS 使用 Docker、Nginx 和 Let's Encrypt 部署到自有服务器的过程，以及 NEXT_PUBLIC_SITE_URL 和 Docker 网络问题。"
---

# Phase 7：Next.js 自托管部署：Docker、Nginx 与 HTTPS

Phase 6 做完后，Personal Developer OS 已经具备了公开上线需要的大部分东西：页面、博客、Console、SEO、sitemap、robots、RSS。

剩下的问题就是把它真正放到线上。

部署这一步我没有直接用 Vercel，而是选择了自有韩国云服务器。不是因为 Vercel 不好。对 Next.js 来说，Vercel 当然是最省心的选择。但我这次想把部署、反代、HTTPS、证书续期、回滚这些过程也完整走一遍。

个人网站本身就是一个练习场。既然前面已经把它做成了 Personal Developer OS，那上线过程也值得记录下来。

## CentOS 9 和 Docker

服务器环境是 CentOS 9。

我没有直接在服务器上裸跑 Node 服务，而是选择 Docker。这样应用运行环境更固定，也方便后续更新和回滚。Node 版本、依赖安装、构建过程都放在镜像里，不依赖服务器上手动装出来的一堆环境。

项目使用 pnpm，所以 Dockerfile 里先启用 Corepack，再用 `pnpm install --frozen-lockfile` 安装依赖。这样构建时依赖版本跟 `pnpm-lock.yaml` 对齐。

这个阶段的目标不是追求复杂的 DevOps，而是让发布过程可重复。

## Next.js standalone output

Next.js 部署到 Docker 时，standalone output 很适合这个场景。

`next.config.ts` 里配置：

```text
output: standalone
```

构建后，Next.js 会把运行服务需要的文件放到 `.next/standalone`。Docker runner 阶段只需要复制 standalone、`.next/static` 和 `public`，再运行 `node server.js`。

这里还有一个容易漏的点：博客内容在 `content/blog` 下面，当前 `FileBlogRepository` 会在服务端读取 Markdown 文件。为了让 standalone 容器里也能读到这些文件，需要把 `content/blog` 加进 output tracing。否则本地 build 没问题，容器运行时可能找不到文章。

## Dockerfile 和 docker-compose

Dockerfile 做成多阶段：

- base：Node alpine、工作目录、关闭 telemetry、启用 Corepack。
- deps：安装依赖。
- builder：复制代码，传入 `NEXT_PUBLIC_SITE_URL`，执行 `pnpm build`。
- runner：复制 standalone 输出，以非 root 用户运行 `server.js`。

docker-compose 负责启动 `personal-dev-os` 服务，配置 restart 策略，并加载 `.env.production`。

我没有把 `.env.production` 提交进仓库。生产域名、服务器信息、证书路径这类内容都不应该进入版本库。

## NEXT_PUBLIC_SITE_URL 的坑

部署中最值得记的一点是 `NEXT_PUBLIC_SITE_URL`。

这个变量影响 canonical、Open Graph、sitemap、robots 和 RSS。问题在于它是 `NEXT_PUBLIC_*`，Next.js 会在构建期内联。

也就是说，只在容器运行时设置它是不够的。镜像构建时如果没有拿到生产域名，构建出来的 sitemap、RSS、metadata 可能仍然使用 localhost 或旧地址。

最后的处理方式是：Docker build 阶段通过 build args 传入 `NEXT_PUBLIC_SITE_URL`，运行时也通过 `.env.production` 保留同一个值。

如果改了 `.env.production`、域名、SEO、sitemap 或 RSS，必须重新 build。必要时还要无缓存构建：

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

这个坑看起来小，但会直接影响线上公开输出。

## 从 GitHub 拉代码到服务器

代码放在 GitHub 仓库里，服务器上 clone 到：

```text
/opt/apps/personal-dev-os
```

后续更新流程保持简单：

```bash
git pull
docker compose --env-file .env.production up -d --build
```

这套流程不复杂，但对个人项目已经够用。关键是每次发布都能重复执行，而不是靠临时命令拼出来。

## Nginx 反向代理和 Docker 网络

应用容器只负责跑 Next.js，公网流量由 Docker Nginx 代理。

一开始这里遇到过 502。原因出在网络关系上：Nginx 容器和应用容器不在同一个可访问网络里，代理自然找不到 upstream。

后来把它们接到共享的 Docker network。应用服务叫 `personal-dev-os`，Nginx 可以通过服务名代理到：

```text
http://personal-dev-os:3000
```

这比把应用端口直接暴露到公网更清楚。Next.js 容器留在内部网络里，外部只通过 Nginx 访问。

## 域名和 HTTPS

域名使用 `oli6666.top`。

DNS 解析完成后，Nginx 配置主域名访问应用，并把 `www.oli6666.top` 重定向到 `oli6666.top`。这样线上入口保持唯一，SEO 输出也更干净。

HTTPS 使用 Let's Encrypt。证书签发成功后，Nginx 配置 80 到 443 的跳转，再加载证书路径。上线后需要检查几件事：

- `https://oli6666.top` 能打开首页。
- HTTP 会跳转到 HTTPS。
- `www.oli6666.top` 会跳转到主域名。
- 证书链正常。

证书续期也写进部署文档。个人项目最怕的是上线时能跑，过几个月忘了怎么维护。

## sitemap 和 RSS 线上检查

应用跑起来后，我重点看了几个公开输出：

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`
- `/blog`
- 文章详情页

这里要确认两件事。

第一，URL 必须是 `https://oli6666.top`，不能混入 localhost。

第二，草稿不能出现在公开输出里。sitemap 和 RSS 都应该只包含 published 文章。

这些检查看起来偏琐碎，但它们决定了这个网站是不是一个真正可发布的内容站，而不只是“页面能打开”。

## 部署文档、续期和回滚

Phase 7 最后补的是发布后运维归档。

包括服务器目录、更新流程、日志查看、Nginx reload、证书续期、回滚命令和线上验证清单。后来我又补了中文部署手册，把每次发布最容易忘的点放在前面。

回滚方式也很朴素：切回上一个 tag 或 commit，再重新 build 容器。后续正式发布最好都打 tag，这样出问题时不用在一堆 commit 里猜。

## 自托管的价值

这次自托管没有比托管平台更省事。

它要处理服务器、Docker、Nginx、DNS、HTTPS、日志和证书。但这也正是它的价值。对个人开发者来说，完整走一遍上线链路，会把很多以前模糊的东西变具体。

我更清楚了 Next.js standalone 怎么工作，`NEXT_PUBLIC_*` 为什么会影响构建输出，Docker 网络怎么影响反向代理，SEO 文件为什么必须在线检查。

Personal Developer OS 到这里算是从本地项目变成了一个真实在线系统。前面几篇写的是设计和实现，这一篇更像把它放到现实环境里跑一遍。很多问题只有上线时才会出现，也只有处理过一次，后面才不会慌。

从 Hexo 到 Personal Developer OS 的第一轮建设，到这里基本闭合了。后面要做的，不是继续堆功能，而是持续写内容，让这个系统真的成为个人技术记录和作品展示的入口。

