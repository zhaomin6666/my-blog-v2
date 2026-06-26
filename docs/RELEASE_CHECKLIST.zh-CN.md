# 发布检查清单

这份清单供维护者在打 tag 或发布开源版本前使用。

它覆盖 file mode、database mode 文档、公开文档、环境变量示例、Admin 安全边界和敏感信息扫描。

## 1. 必跑命令

```bash
pnpm lint
pnpm build
pnpm security:admin
pnpm security:public
pnpm release:check
```

## 2. File Mode 检查

- `.env.example` 支持 file mode。
- `CONTENT_SOURCE=file` 不依赖 PostgreSQL。
- 未配置 `PERSONAL_SITE_DATABASE_URL` 时公开页面仍可构建。
- sitemap、robots 和 RSS 只从公开内容生成。

## 3. Database Mode 检查

- migrations 已文档化，并且需要手动执行。
- Admin auth 相关环境变量已文档化。
- database mode 不会自动切换公开内容源。
- Admin routes 仍然受登录保护。
- 空数据库 fallback 行为已记录清楚。

## 4. 文档检查

- `README.md` 和 `README.zh-CN.md` 保持最新。
- Getting Started 文档面向首次运行。
- Deployment 文档简洁且符合当前项目状态。
- Content Workflow 反映当前 file/database 内容源矩阵。
- 开发历史文档只作为二级参考，不替代用户文档。

## 5. 敏感信息检查

确认公开发布文件中没有出现以下私有信息：

- 真实生产密钥
- 真实数据库 URL
- 私有 `.env` 文件
- 真实服务器 IP
- 真实备份 dump 路径
- 私有账号名
- 私有业务 / 客户信息
- 私人联系方式

## 6. Release Notes

- 总结主要用户可见变化。
- 如有 migration 要求，需要明确说明。
- 明确本次是否改动 database migrations。
- 记录已知限制。

## 7. Tagging

```bash
git status
git tag vX.Y.Z
git push origin vX.Y.Z
```
