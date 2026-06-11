---
title: "AI Agent Demo"
slug: "ai-agent-demo"
subtitle: "面向企业知识库和业务流程理解的 AI Agent 学习项目。"
summary: "一个从 Java 后端经验出发的 AI Agent 学习项目，使用 TypeScript、LangChain.js 和 LangGraph.js 逐步练习结构化输出、意图识别、工具调用、RAG、状态管理和企业系统集成思路。"
status: "building"
statusLabel: "In Progress / Learning Project"
type: "Learning Project"
role:
  - "AI Application Learning"
  - "TypeScript Practice"
  - "Agent Workflow Design"
  - "Enterprise System Thinking"
timeline: "2026 · 持续学习与实现中"
featured: true
order: 2
techStack:
  - "TypeScript"
  - "Node.js"
  - "pnpm"
  - "LangChain.js"
  - "LangGraph.js"
  - "Zod"
  - "OpenAI-compatible API"
features:
  - "围绕 Prompt Messages、Structured Output、Intent Classifier 和 Tool Calling 拆分 Agent 基础能力。"
  - "逐步补充 Agent Executor、RAG、Agent State、LangGraph Workflow 和 Persistence 的实践记录。"
  - "后续预留 MCP / OAuth / 向量数据库 / 企业系统集成方向，但暂不包装成成熟生产产品。"
highlights:
  - "从 Java 后端和企业系统经验出发，关注 Agent 如何理解真实业务上下文，而不是只停留在聊天问答。"
  - "用 Zod 和结构化输出约束模型结果，为意图识别、工具选择和后续业务调用保留稳定边界。"
  - "把工具调用、执行器、状态图和持久化作为工程问题拆解，贴近企业流程编排场景。"
  - "面向企业知识库、业务流程理解和交付辅助 Agent 方向持续沉淀学习记录。"
links: []
relatedPosts: []
published: true
lang: "zh"
seoTitle: "AI Agent Demo 项目案例"
seoDescription: "一个面向企业知识库和业务流程理解的 AI Agent 学习项目，从 Java 后端经验出发，使用 TypeScript、LangChain.js、LangGraph.js 实践结构化输出、工具调用、RAG、状态图和企业系统集成思路。"
---

## 项目背景

我是 Java 后端开发者，过去接触更多的是企业系统开发：招投标系统、供应商管理、专家管理、采购计划管理、企业系统对接，以及围绕需求、文档、接口和交付展开的沟通工作。

这些经历让我对 AI Agent 的兴趣不只停留在聊天机器人。真实企业系统里的问题往往不是“回答一句话”就能结束：业务规则分散在文档里，接口能力分散在多个系统里，流程状态和角色权限也会影响下一步动作。如果 Agent 未来要进入这类场景，它需要理解上下文、选择工具、组织步骤，并且能把结果稳定地交给后续系统处理。

所以我把 `AI Agent Demo` 定位成一个面向企业知识库和业务流程理解的学习项目。它目前还在 In Progress / Learning Project 阶段，主要用于求职展示、学习记录和持续练习。它不是已经上线的成熟产品，也没有真实生产用户、企业落地结果、访问量或商业收益。

## 项目目标

这个项目想逐步验证几类能力：

- 如何让 LLM 更稳定地理解用户意图，而不是只生成一段自然语言回答。
- 如何用 Zod 和 Structured Output 约束输出结构，让结果更接近后端接口可以消费的数据。
- 如何注册和调用工具，让 Agent 能把问题拆到具体业务能力上。
- 如何把一次 Agent 调用拆成多个步骤，而不是把所有逻辑塞进一个 prompt。
- 如何用 LangGraph 管理状态、节点、分支和工作流。
- 如何接入知识库检索，形成面向企业文档、接口说明和业务规则的 RAG 流程。
- 如何为后续 MCP、OAuth 和企业系统集成预留工程边界。

我希望通过这个项目，把过去做后端业务系统时积累的流程理解、接口边界和交付意识，迁移到 Agent 应用设计里。

## 当前已完成 / 正在学习的能力

当前更准确的状态是：基础能力已经开始拆分和练习，完整企业级 Demo 还在逐步补齐。

- TypeScript AI 工程基础：用 TypeScript、Node.js 和 pnpm 组织学习代码，明确模型调用、schema、工具函数和执行入口之间的边界。
- Prompt Messages：练习 system / user / assistant message 的组织方式，避免把所有上下文写成一段不可维护的长 prompt。
- Structured Output：使用 Zod 约束输出字段，为意图识别、结果解析和后续工具调用提供稳定结构。
- Intent Classifier：把用户输入先分类，再决定进入问答、检索、工具调用或后续流程。
- Tool Calling：练习把业务能力包装成可调用工具，理解工具描述、参数 schema 和执行结果之间的关系。
- Agent Executor：正在学习如何把意图、工具选择、执行结果和最终回答串起来。
- LangChain.js 基础：用于理解 messages、model、parser、tool 和 chain 的组合方式。
- LangGraph.js 基础：正在学习用 graph / node / edge / state 表达多步骤 Agent Workflow。
- RAG：作为后续重点补充方向，会从简单文档检索开始，再逐步贴近企业知识库场景。
- Persistence：计划在 LangGraph 学习推进后补充，用来理解多轮任务和跨步骤状态保存。

后续如果整理出独立的 AI Agent 学习博客系列，会再把真实存在的文章 slug 关联到 `relatedPosts`。当前没有伪造不存在的文章链接。

## 技术栈

当前项目技术选择以轻量、可练习、便于迁移为主：

- TypeScript
- Node.js
- pnpm
- LangChain.js
- LangGraph.js
- Zod
- OpenAI-compatible API

后续可能继续补充：

- Alibaba Cloud DashScope / Qwen
- 向量数据库
- MCP
- OAuth
- 企业系统接口模拟

这些后续内容会按学习进度逐步加入，不会提前写成已经完成的生产能力。

## 工程思路

这个项目不是一次性写完一个 Demo，而是按能力点逐步演进。

第一步先从单次 LLM 调用开始，明确请求、响应、错误处理和环境变量边界。

第二步学习 Prompt Messages，把不同角色的消息拆清楚，让上下文组织更可维护。

第三步加入 Structured Output，用 schema 让模型输出变成后端程序可以解析和校验的数据。

第四步做 Intent Classifier，让 Agent 先判断用户到底是在问知识、查流程、找接口，还是需要触发某个工具。

第五步引入 Tool Calling 和 Agent Executor，把工具注册、参数校验、执行结果和最终回复串起来。

再往后，会进入 LangGraph：用节点、边、状态和持久化来表达更复杂的 Agent Workflow。对 Java 后端开发者来说，这个过程有点像把 `Controller / Service / Repository` 的分层思维，迁移到 `Agent / Tool / Graph / State` 的 AI 应用架构里。

## 适合展示的能力

这个项目更适合作为学习型作品展示，而不是成熟产品展示。它能说明几件事：

- 我可以用 TypeScript 搭建 AI 应用的基础工程结构。
- 我能区分普通 LLM 问答和 Agent Workflow，不会把一次 API 调用包装成完整 Agent。
- 我在练习结构化输出、意图识别、工具调用和状态图这些 Agent 基础能力。
- 我会从企业系统视角思考 Agent 落地：业务上下文、流程状态、权限边界、接口对接和交付可控性。
- 我会把学习过程沉淀成项目说明、代码实践和后续博客，而不是只停留在零散试验。

这也是它对 AI Agent 岗位求职的主要价值：它展示的是学习路线、工程判断和业务迁移能力，而不是夸大一个还没有成熟上线的产品。

## AI 协作开发

AI 会用于辅助理解 LangChain.js、LangGraph.js、Structured Output、Tool Calling 和 Agent Workflow 概念，也会参与代码草稿、学习笔记和项目说明整理。

但我不会把 AI 生成内容直接当成项目成果。每个能力点都需要通过代码实践、日志记录、复盘和阶段验收来确认理解是否扎实。对我来说，AI 更像学习和实现过程中的辅助工具，最后的边界判断仍然需要自己负责。

## 当前状态

项目当前仍处于 In Progress / Learning Project 阶段。

目前它主要用于：

- 系统学习 TypeScript + LangChain.js + LangGraph.js 的 Agent 开发路径。
- 把 Java 后端业务系统经验迁移到 Agent 应用设计中。
- 作为求职作品集里的 AI Agent 学习项目。
- 为后续企业知识库 / 交付辅助 Agent Demo 做准备。

它暂时不是生产环境产品，也没有在线聊天入口、真实 Agent API 服务、真实企业知识库接入或生产用户。

## 后续计划

后续会按学习路线继续补充：

- 完成 LangGraph Persistence 学习和示例。
- 接入简单知识库 RAG，从本地文档检索开始验证流程。
- 设计企业文档问答流程，例如需求文档、接口说明、业务规则和交付记录。
- 增加更清晰的工具调用示例，把“查文档”“查流程”“生成交付建议”等能力拆成工具。
- 增加 Agent Workflow 图示说明，让状态流转更容易被阅读。
- 在条件成熟后考虑在线 Demo，但不会在当前阶段强行接入真实聊天服务。
- 后续 AI Agent 博客系列完成后，再把真实文章关联到这个项目页。
