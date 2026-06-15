# Agent Demo 架构说明

## 第一版目标

Phase 10 将 `AI Agent Demo` 从项目介绍页升级为真实可交互的只读 Agent Demo。第一版必须保持小而清晰：只回答来自公开网站内容的问题，并在响应中展示 trace 和 sources，让访问者能理解它的能力边界。

当前第一版已经完成：

- Phase 10.1：架构与安全基础。
- Phase 10.2：只读知识工具、规则型范围识别器和公开知识检索。
- Phase 10.2.1：单元测试基础。
- Phase 10.3：只读 API MVP 和 server-only 模型适配器。
- Phase 10.4：限流、超时、上下文长度和输出长度保护。
- Phase 10.5：公开 `/agent-demo` UI、回答、trace、sources、错误态和限流态。
- Phase 10.6：生产环境变量、日志、Nginx 限流和线上安全验证文档。
- Phase 10.7：第一版最终验收与文档收口。

## 公开回答范围

Demo 可以回答：

- 网站公开展示的作者 Profile 和职业方向。
- 公开技术栈和学习方向。
- 已发布项目：`Personal Developer OS` 和 `AI Agent Demo`。
- 已发布 Blog 文章、系列、标签、摘要和有限摘录。
- AI Agent 学习路线和这个只读 Demo 的设计思路。
- Personal Developer OS 的设计、开发、部署、SEO、RSS 和内容系统。
- Project、Blog、Profile 页面已经公开的信息。

## 禁止回答范围

Demo 必须拒绝：

- 与本站无关的通用百科问题。
- 与作者或本站无关的编程咨询。
- 医疗、法律、金融、政治等高风险建议。
- 真实手机号、微信、家庭住址、真实雇主、真实客户或甲方信息。
- 密钥、证书、环境变量、数据库账号、服务器路径、原始日志或基础设施内部细节。
- 执行命令、写文件、爬任意 URL、攻击系统、发送邮件或改变状态的请求。
- 编造经历、项目结果、用户量、收入或商业落地数据的请求。

## API 契约

API route：

```text
POST /api/agent-demo
```

请求体：

```json
{
  "question": "string",
  "locale": "zh"
}
```

响应体：

```json
{
  "answer": "string",
  "allowed": true,
  "category": "project",
  "trace": [],
  "sources": [],
  "usage": {
    "inputLength": 24,
    "maxInputLength": 800,
    "sourceCount": 2,
    "maxSources": 5
  }
}
```

Route handler 只负责解析请求、调用共享校验和 Agent Demo service、返回 JSON。业务逻辑保留在 `features/agent-demo`。

## 安全边界

Agent Demo 是只读的：

- 只能使用公开知识工具。
- 不能调用写入工具。
- 不能访问私有文件。
- 只能在服务端读取模型配置环境变量：`AGENT_DEMO_MODEL_API_URL`、`AGENT_DEMO_MODEL_API_KEY`、`AGENT_DEMO_MODEL`。
- 不能抓取任意外部 URL。
- 不能保存完整对话。
- 不能暴露原始错误、stack trace、密钥或基础设施细节。

## 工具权限

允许工具：

- `BlogService`：仅已发布文章和有限公开摘录。
- `ProjectService`：仅已发布项目。
- `ProfileService`：仅公开 Profile 和公开技术栈。

禁止工具：

- `readFile`
- `writeFile`
- `executeCommand`
- `fetchUrl`
- `queryDatabaseRaw`
- `sendEmail`
- `accessEnv`
- `accessServer`
- `arbitrarySql`

## 限流、超时和长度限制

第一版保护包括：

- 基于 `x-forwarded-for`、`x-real-ip`、`cf-connecting-ip` 和 `local` fallback 的进程内 fixed-window 限流。
- 通过 `AGENT_DEMO_MODEL_TIMEOUT_MS` 配置模型请求超时。
- 通过 `AGENT_DEMO_RATE_LIMIT_WINDOW_MS` 和 `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS` 配置应用层限流。
- 输入长度限制：800 字符。
- 检索上下文限制：6000 字符。
- 输出长度限制：1800 字符。
- sources 数量限制：5 个。
- 限流时返回 HTTP `429` 和 `Retry-After`。
- 生产侧建议再用 Nginx `limit_req` 保护 `/api/agent-demo`。

Redis 分布式限流保留为未来多实例生产环境选项。

## 诊断日志

Agent Demo 服务端日志使用 `[agent-demo]` 前缀，并由 `AGENT_DEMO_LOG_LEVEL` 控制：

- `info`：生产默认值，记录 requestId、阶段状态、scope 分类、source 数量、context 长度、模型请求耗时、上游状态、超时和安全错误码。
- `debug`：只在短时间排查问题时开启，增加 payload size 摘要。
- `silent`：功能稳定且日志过多时可关闭 Agent Demo 日志。

日志不得包含 API key、完整 prompt、完整检索上下文、完整模型回答、上游原始响应体、私有环境变量值或服务器路径。

## Trace 契约

每个响应包含以下 trace steps：

- `input_validation`
- `rate_limit_check`
- `scope_check`
- `retrieve_context`
- `generate_answer`

每个 step 包含：

- `step`
- `label`
- `status`：`pending`、`passed`、`blocked` 或 `failed`
- 可选 `detail`

## Sources 契约

Sources 必须公开且受限：

- `type`：`blog`、`project`、`profile` 或 `system`
- `title`
- 可选 `url`
- 可选短 `excerpt`

Sources 不能包含 draft 内容、私有路径、原始 Markdown 文件路径或私有基础设施信息。

## 范围识别

Phase 10 使用保守的规则型关键词分类器。返回字段：

- `allowed`
- `category`
- `reason`

允许分类：

- `profile`
- `project`
- `blog`
- `agent_learning`
- `website`
- `contact_public`

拒绝分类：

- `out_of_scope`
- `privacy`
- `security`
- `server_internal`
- `dangerous_action`
- `high_risk_advice`

## 生产安全验证

公开启用 `/agent-demo` 前需要确认：

- `.env.production` 包含模型 API URL、API key、模型名、超时、限流和日志级别。
- `.env.production` 未被 Git 跟踪。
- 生产默认使用 `AGENT_DEMO_LOG_LEVEL=info`。
- Nginx 对 `/api/agent-demo` 配置 route-level 限流。
- 安全公开问题返回 `allowed: true`，并包含 trace / sources。
- 私密、密钥、服务器内部、危险操作和高风险建议问题会在模型生成前拒答。
- 连续重复请求最终返回 `429`。
- 上游超时返回 `upstream_timeout` / HTTP `504`，不暴露原始上游细节。
- 日志只包含 `[agent-demo]` requestId 和安全阶段摘要。
- sitemap 包含 `/agent-demo`，RSS 仍然只包含博客文章。

## 第一版最终验收结论

Phase 10.7 收口后，第一版公开 Agent Demo 达到可发布状态：

- `/agent-demo` 公开页面存在。
- `POST /api/agent-demo` 可用。
- UI 展示回答、trace、sources、loading、error、rate limit 和 scope notice。
- API 使用 server-only 环境变量调用 OpenAI-compatible Chat Completions 接口。
- 单元测试覆盖输入校验、scope 分类、知识检索、模型适配、限流、超时和 live-test opt-in。
- 部署文档覆盖 Qwen / DashScope 兼容接口配置、日志级别、Nginx 限流和线上验证。
- 英文和中文文档都记录公开范围、禁止范围、安全边界、API 契约、日志和生产验收清单。

## 后续可选方向

- Redis-backed distributed rate limiting，用于多实例部署。
- 更系统的评测集和线上监控。
- 如果 Agent 复杂度增长，可拆分为独立 `agent-api` 服务。
