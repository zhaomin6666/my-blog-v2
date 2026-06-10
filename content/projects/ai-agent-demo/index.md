---
title: "AI Agent Demo"
slug: "ai-agent-demo"
subtitle: "企业知识库 Agent 学习项目。"
summary: "面向企业知识库和业务流程理解的 AI Agent 学习项目，目标是用 TypeScript、LangChain.js 和 LangGraph.js 实践 RAG、工具调用、状态图与企业系统集成思路。"
status: "building"
statusLabel: "In Progress / Learning Project"
type: "AI Agent / 学习项目 / 求职展示"
role:
  - "AI Application Learning"
  - "TypeScript Practice"
  - "Agent Workflow Design"
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
  - "当前聚焦 Prompt Messages、Structured Output、Intent Classifier 和 Tool Calling。"
  - "逐步学习 Agent Executor、LangChain.js、LangGraph.js、RAG、Agent State 和 Persistence。"
  - "后续计划继续探索 MCP / OAuth / 企业系统集成。"
highlights:
  - "从 Java 后端视角学习 TypeScript AI 应用开发，关注工程结构和可维护性。"
  - "使用结构化输出提高意图识别稳定性，而不是只做一次大模型调用。"
  - "通过工具注册和执行器模拟 Agent 工具调用链路。"
  - "使用 LangGraph 理解状态图、多步骤工作流和持久化思路。"
links:
  - label: "学习记录待补充"
    href: "/blog"
    type: "blog"
relatedPosts: []
published: true
lang: "zh"
seoTitle: "AI Agent Demo 项目案例"
seoDescription: "一个面向企业知识库和业务流程理解的 AI Agent 学习项目，使用 TypeScript、LangChain.js、LangGraph.js 实践 RAG、工具调用、状态图和企业系统集成思路。"
---

## 项目背景

我是 Java 后端开发者，长期接触企业系统、招投标系统、供应商管理、专家管理、采购计划、系统对接等业务场景。现在我正在系统学习 AI Agent，希望把传统后端业务系统经验和 AI Agent 应用开发结合起来。

这个项目不是一个已经上线的成熟产品，也不是简单调用大模型接口的聊天页面。它更像一个持续建设的学习项目和求职展示项目，用来记录我如何从后端工程视角理解 AI Agent。

## 要解决的问题

企业系统里有大量业务知识、流程规则、角色权限、审批状态和外部系统对接。如果只是把用户输入丢给大模型，很难稳定处理这些上下文。

我希望通过这个项目逐步回答几个问题：

- 如何用结构化输出提高意图识别的稳定性。
- 如何设计 Agent 可以调用的业务工具。
- 如何用状态图组织多步骤任务。
- 如何把 RAG、工具调用、持久化和企业系统集成放到同一个工程结构中思考。

## 当前学习方向

当前学习和实现方向包括：

- TypeScript AI 工程基础。
- Prompt Messages。
- Structured Output。
- Intent Classifier。
- Tool Calling。
- Agent Executor。
- LangChain.js。
- LangGraph.js。
- RAG。
- Agent State。
- Persistence。
- 后续 MCP / OAuth / 企业系统集成。

## 设计思路

项目会从小能力点开始，而不是一开始就做一个“大而全”的 Agent。

第一步是补 TypeScript AI 工程基础，明确消息结构、模型调用边界、Zod schema 和结构化输出。

第二步是做 Intent Classifier 和 Tool Calling，让 Agent 不只是生成回答，而是能识别用户意图并选择合适工具。

第三步会引入 LangGraph.js，用状态图理解多步骤工作流、状态流转和持久化边界。

再往后，项目会逐步扩展到 RAG、企业知识库检索、MCP、OAuth 和企业系统集成。

## 工程亮点

这个项目的重点不是炫技，而是把后端工程里常见的边界意识迁移到 AI Agent 开发中。

例如：结构化输出对应稳定接口，工具注册对应服务能力暴露，状态图对应流程编排，持久化对应跨步骤上下文管理。它们都和传统企业系统开发中的建模、权限、流程和集成经验有关系。

每一节学习内容都会尽量配套代码和博客沉淀，让项目形成可展示的学习路径，而不是只留下零散 demo。

## AI 协作开发

AI 会用于辅助理解 LangChain.js、LangGraph.js、结构化输出和 Agent 工作流概念，也会参与代码草稿和学习记录整理。

但项目不会把 AI 生成结果直接当成生产能力。每个能力点都需要通过代码、日志、复盘和阶段验收确认理解是否扎实。

## 当前状态

项目当前是 In Progress / Learning Project。

它还不是成熟生产产品，没有真实生产用户、企业落地结果、访问量或商业收益。当前更准确的定位是：AI Agent 学习项目、求职展示项目和持续建设项目。

## 后续计划

后续会继续补 RAG、Agent State、Persistence、LangGraph 多步骤工作流和持久化示例。

更远一些，会探索 MCP、OAuth、向量数据库和企业系统集成。但在线聊天和真实 Agent API 接入会放到后续阶段，不在当前阶段实现。
