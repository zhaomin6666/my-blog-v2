import type { AgentScopeCategory, AgentScopeResult } from "../agentDemoTypes";

interface KeywordRule {
  category: AgentScopeCategory;
  keywords: string[];
  reason: string;
}

const blockedRules: KeywordRule[] = [
  {
    category: "privacy",
    keywords: [
      "phone",
      "wechat",
      "address",
      "employer",
      "client",
      "buyer",
      "real company",
      "real customer",
      "手机号",
      "手机",
      "微信",
      "住址",
      "地址",
      "真实单位",
      "真实公司",
      "真实客户",
      "甲方",
      "身份证",
      "生日",
    ],
    reason: "The question asks for private personal, employer, client, or buyer information.",
  },
  {
    category: "security",
    keywords: [
      "secret",
      "api key",
      "apikey",
      "token",
      "password",
      "credential",
      "certificate",
      "private key",
      "密钥",
      "密码",
      "令牌",
      "证书",
      "私钥",
      "数据库账号",
      "数据库密码",
    ],
    reason: "The question asks for secrets, credentials, certificates, or security-sensitive data.",
  },
  {
    category: "server_internal",
    keywords: [
      "server path",
      "internal path",
      "env",
      "environment variable",
      ".env",
      "log file",
      "nginx config",
      "服务器路径",
      "内部路径",
      "环境变量",
      "日志文件",
      "生产配置",
    ],
    reason: "The question asks for private server or deployment internals.",
  },
  {
    category: "dangerous_action",
    keywords: [
      "run command",
      "execute",
      "write file",
      "delete file",
      "attack",
      "exploit",
      "crawl",
      "scrape",
      "ddos",
      "执行命令",
      "运行命令",
      "写文件",
      "删除文件",
      "攻击",
      "爬取",
      "爬虫",
      "入侵",
    ],
    reason: "The question requests command execution, file mutation, crawling, or other unsafe actions.",
  },
  {
    category: "high_risk_advice",
    keywords: [
      "medical",
      "legal",
      "financial advice",
      "investment",
      "politics",
      "diagnosis",
      "lawsuit",
      "loan",
      "stock",
      "crypto",
      "医疗",
      "法律",
      "金融",
      "投资",
      "政治",
      "诊断",
      "诉讼",
      "股票",
      "币",
    ],
    reason: "The question asks for high-risk advice outside this demo.",
  },
];

const allowedRules: KeywordRule[] = [
  {
    category: "agent_learning",
    keywords: [
      "ai agent",
      "agent demo",
      "langchain",
      "langgraph",
      "rag",
      "tool calling",
      "structured output",
      "prompt",
      "学习路线",
      "智能体",
      "工具调用",
      "知识库",
      "向量",
      "工作流",
    ],
    reason: "The question is about the public AI Agent Demo or AI Agent learning journey.",
  },
  {
    category: "website",
    keywords: [
      "personal developer os",
      "developer os",
      "personal dev os",
      "website",
      "site",
      "next.js",
      "docker",
      "nginx",
      "deployment",
      "seo",
      "rss",
      "sitemap",
      "个人网站",
      "开发者操作系统",
      "部署",
      "博客系统",
      "内容系统",
      "站点",
      "网站",
    ],
    reason: "The question is about the Personal Developer OS website or its implementation.",
  },
  {
    category: "project",
    keywords: [
      "project",
      "portfolio",
      "personal developer os",
      "ai agent demo",
      "项目",
      "作品",
      "作品集",
    ],
    reason: "The question is about published projects.",
  },
  {
    category: "blog",
    keywords: [
      "blog",
      "article",
      "post",
      "series",
      "tag",
      "writing",
      "博客",
      "文章",
      "系列",
      "标签",
      "写过",
      "日志",
    ],
    reason: "The question is about published blog content.",
  },
  {
    category: "contact_public",
    keywords: [
      "contact",
      "email",
      "github",
      "linkedin",
      "resume",
      "联系",
      "邮箱",
      "简历",
      "求职",
    ],
    reason: "The question is about public contact channels or resume availability.",
  },
  {
    category: "profile",
    keywords: [
      "who are you",
      "whoami",
      "profile",
      "about",
      "skill",
      "stack",
      "career",
      "background",
      "java",
      "spring",
      "typescript",
      "你是谁",
      "介绍",
      "个人介绍",
      "技术栈",
      "技能",
      "背景",
      "方向",
      "经历",
    ],
    reason: "The question is about the public author profile or public technical stack.",
  },
];

function includesKeyword(question: string, keyword: string): boolean {
  return question.includes(keyword.toLowerCase());
}

function matchRule(question: string, rules: KeywordRule[]): KeywordRule | null {
  return (
    rules.find((rule) =>
      rule.keywords.some((keyword) => includesKeyword(question, keyword)),
    ) ?? null
  );
}

export function classifyAgentDemoScope(question: string): AgentScopeResult {
  const normalized = question.toLowerCase().trim();

  const blockedRule = matchRule(normalized, blockedRules);
  if (blockedRule) {
    return {
      allowed: false,
      category: blockedRule.category,
      reason: blockedRule.reason,
    };
  }

  const allowedRule = matchRule(normalized, allowedRules);
  if (allowedRule) {
    return {
      allowed: true,
      category: allowedRule.category,
      reason: allowedRule.reason,
    };
  }

  return {
    allowed: false,
    category: "out_of_scope",
    reason:
      "The question is not clearly about the public profile, projects, blog posts, website, or AI Agent learning journey.",
  };
}
