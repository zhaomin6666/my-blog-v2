---
title: "AI Agent 开发学习记录"
slug: "ai-agent-learning-log"
summary: "记录从传统后端开发转向 AI Agent 开发过程中的关键技术点、工具链和学习路径。"
date: "2026-05-20"
updatedAt: "2026-05-28"
tags: ["AI", "Agent", "LangChain", "LLM"]
series: "AI 应用开发"
status: "published"
lang: "zh"
cover: ""
seoTitle: "AI Agent 开发学习记录"
seoDescription: "从 Java 后端到 AI Agent 开发的学习路径和实践记录，涵盖 LangChain、RAG、Workflow 等关键技术。"
---

# 从后端到 AI Agent

传统后端开发的核心是数据模型、业务逻辑和系统稳定性。AI Agent 开发在此基础上增加了几个新维度：大模型交互、上下文管理、工具调用和自主决策。

## 关键概念

**LLM 作为推理引擎**
不再只是调用 API 获取文本生成结果，而是把 LLM 当作系统的"大脑"，通过 Prompt Engineering 和结构化输出控制行为。

**RAG（检索增强生成）**
让模型能够访问外部知识库，解决幻觉问题和知识时效性问题。核心组件：文档加载、分块、Embedding、向量存储、检索策略。

**Agent 工作流**
从简单的 Chain 到复杂的 Graph：ReAct、Plan-and-Execute、Multi-Agent 协作。LangGraph 提供了状态机和持久化能力，适合生产环境。

## 工具链

- **LangChain / LangGraph** — 应用编排框架
- **Ollama** — 本地模型运行
- **Chroma / Qdrant** — 向量数据库
- **Pydantic** — 结构化输出校验
- **FastAPI** — Agent 服务化部署

## 实践建议

1. 先从简单的 Chain 开始，不要一上来就做多 Agent
2. Prompt 版本化管理，记录每次改动的效果
3. 观察模型在边界情况下的行为，设计降级策略
4. 重视 Observability — LLM 调用成本不低，需要追踪和优化

下一步计划是把一个完整的 RAG + Agent 工作流部署为独立服务，并接入到现有的业务系统中。
