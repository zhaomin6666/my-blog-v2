import { Lang } from './types';

const translations = {
  zh: {
    // Status Bar
    'status.portfolio': 'Portfolio',
    'status.terminal': '终端',
    'status.switchToMinimal': '切换极简',
    'status.switchToMacos': '切换 macOS',
    'status.stylePresetAbbrevMacos': 'A',
    'status.stylePresetAbbrevVercel': 'B',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.lightAbbrev': 'LGT',
    'theme.darkAbbrev': 'DRK',

    // Language
    'lang.en': 'EN',
    'lang.zh': 'ZH',

    // Style Preset
    'stylePreset.macos': 'macOS',
    'stylePreset.vercel': 'Vercel',

    // Window Titles
    'window.main.title': 'Portfolio.app',
    'window.console.title.macos': 'visitor@DevOS: ~',
    'window.console.title.vercel': 'Terminal.app',

    // Window ARIA
    'window.aria.close': '关闭',
    'window.aria.minimize': '最小化',
    'window.aria.maximize': '最大化',

    // Desktop
    'desktop.openMain': 'Portfolio',
    'desktop.openConsole': '终端',
    'desktop.welcome': 'Personal Dev OS',

    // Console
    'console.welcome': 'Personal DevOS Terminal v1.0.0',
    'console.help': '输入 "help" 查看可用命令。',
    'console.prompt': 'DevOS:~ visitor$',
    'console.notFound': '命令未找到。输入 `help` 查看可用命令。',
    'console.macosWelcome': (...args: string[]) => `Last login: ${args[0]} on ttys001\nDevOS:~ visitor$ welcome`,

    // Nav — App module navigation (not normal website nav)
    'nav.overview': 'Overview',
    'nav.profile': 'Profile',
    'nav.stack': 'Stack',
    'nav.services': 'Services',
    'nav.logs': 'Logs',
    'nav.contact': 'Contact',

    // Hero — Dashboard widget style
    'hero.title': '面向 AI 时代构建产品的后端开发者',
    'hero.subtitle': '我专注于构建可靠的后端系统、AI 驱动的应用，以及独立数字产品。这个网站既是我的作品集，也是我的技术笔记与产品实验室。',
    'hero.badge': '后端开发者 · AI 构建者 · 独立开发者',
    'hero.cta.projects': 'View Projects',
    'hero.cta.terminal': 'Open Terminal',

    // About — Profile panel
    'about.description': '我是一名后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。我关注架构设计、工程实践、产品思维，以及如何借助 AI 工具更高效地完成独立交付。',
    'about.role': '后端开发者',
    'about.location': 'Location',
    'about.focus': 'Focus',

    // Skills — Skill matrix / system config
    'skills.title': 'System Stack',
    'skills.module': '模块',

    // Projects — Service modules / app cards
    'projects.title': 'Services',
    'projects.status.building': 'Building',
    'projects.status.production': 'Production',
    'projects.status.mvp': 'MVP',
    'projects.techStack': 'Tech Stack',
    'projects.viewProject': '查看项目',

    // Blog — Engineering logs
    'blog.title': 'Engineering Logs',
    'blog.logLevel': 'INFO',
    'blog.readMore': '查看详情',
    'blog.tags': 'Tags',

    // Contact — Contact channels / endpoint panel
    'contact.title': 'Contact Channels',
    'contact.email': 'Email',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',
    'contact.resume': 'Resume',
    'contact.comingSoon': 'Coming Soon',
    'contact.endpoint': 'Endpoint',

    // Sections (legacy, kept for compatibility)
    'section.hero': '面向 AI 时代构建产品的后端开发者',
    'section.about': '关于',
    'section.skills': '技能',
    'section.projects': '项目',
    'section.blog': '博客',
    'section.contact': '联系',

    // Contact (legacy)
    'contact.resumeLabel': '简历',
    'contact.downloadPdf': '下载 PDF',

    // Commands descriptions
    'cmd.help.desc': '显示帮助信息',
    'cmd.about.desc': '关于我',
    'cmd.skills.desc': '技能栈',
    'cmd.projects.desc': '项目列表',
    'cmd.blog.desc': '博客文章',
    'cmd.contact.desc': '联系方式',
    'cmd.resume.desc': '下载简历',
    'cmd.clear.desc': '清空终端',
    'cmd.classic.desc': '切换到经典视图',
    'cmd.whoami.desc': '当前用户',
    'cmd.sudo.desc': 'sudo hire me',

    // Command outputs
    'cmd.help.header': '可用命令：',
    'cmd.about.output': '后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。',
    'cmd.skills.output': 'Java, Spring Boot, React, Next.js, LLM Apps, RAG, Docker...',
    'cmd.projects.output': 'AI Agent Demo, Bidding System, Personal Dev OS',
    'cmd.blog.output': '从 Java 后端到 AI Agent 开发的学习路线等文章',
    'cmd.contact.output': 'Email, GitHub, LinkedIn',
    'cmd.resume.output': '简历下载链接：[即将推出]',
    'cmd.classic.output': '正在切换到经典视图...[即将推出]',
    'cmd.whoami.output': 'visitor — Personal DevOS 的访客用户',
    'cmd.sudo.hireMe': '不错的尝试！😄 给我发邮件来讨论机会吧。',
    'cmd.sudo.error': 'sudo: 命令未找到或权限不足',
  },
  en: {
    // Status Bar
    'status.portfolio': 'Portfolio',
    'status.terminal': 'Terminal',
    'status.switchToMinimal': 'Switch to Minimal',
    'status.switchToMacos': 'Switch to macOS',
    'status.stylePresetAbbrevMacos': 'A',
    'status.stylePresetAbbrevVercel': 'B',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.lightAbbrev': 'LGT',
    'theme.darkAbbrev': 'DRK',

    // Language
    'lang.en': 'EN',
    'lang.zh': 'ZH',

    // Style Preset
    'stylePreset.macos': 'macOS',
    'stylePreset.vercel': 'Vercel',

    // Window Titles
    'window.main.title': 'Portfolio.app',
    'window.console.title.macos': 'visitor@DevOS: ~',
    'window.console.title.vercel': 'Terminal.app',

    // Window ARIA
    'window.aria.close': 'Close',
    'window.aria.minimize': 'Minimize',
    'window.aria.maximize': 'Maximize',

    // Desktop
    'desktop.openMain': 'Portfolio',
    'desktop.openConsole': 'Terminal',
    'desktop.welcome': 'Personal Dev OS',

    // Console
    'console.welcome': 'Personal DevOS Terminal v1.0.0',
    'console.help': 'Type "help" to see available commands.',
    'console.prompt': 'DevOS:~ visitor$',
    'console.notFound': 'Command not found. Type `help` to see available commands.',
    'console.macosWelcome': (...args: string[]) => `Last login: ${args[0]} on ttys001\nDevOS:~ visitor$ welcome`,

    // Nav — App module navigation (not normal website nav)
    'nav.overview': 'Overview',
    'nav.profile': 'Profile',
    'nav.stack': 'Stack',
    'nav.services': 'Services',
    'nav.logs': 'Logs',
    'nav.contact': 'Contact',

    // Hero — Dashboard widget style
    'hero.title': 'Backend Developer building AI-era products.',
    'hero.subtitle': 'I build reliable backend systems, AI-powered applications, and independent digital products. This site is my portfolio, technical notebook, and product lab.',
    'hero.badge': 'Backend Developer · AI Builder · Indie Hacker',
    'hero.cta.projects': 'View Projects',
    'hero.cta.terminal': 'Open Terminal',

    // About — Profile panel
    'about.description': 'I am a backend developer focused on building reliable business systems and exploring AI-native applications. I care about clean architecture, practical engineering, product thinking, and using AI tools to ship faster as an independent builder.',
    'about.role': 'Backend Developer',
    'about.location': 'Location',
    'about.focus': 'Focus',

    // Skills — Skill matrix / system config
    'skills.title': 'System Stack',
    'skills.module': 'Module',

    // Projects — Service modules / app cards
    'projects.title': 'Services',
    'projects.status.building': 'Building',
    'projects.status.production': 'Production',
    'projects.status.mvp': 'MVP',
    'projects.techStack': 'Tech Stack',
    'projects.viewProject': 'View Project',

    // Blog — Engineering logs
    'blog.title': 'Engineering Logs',
    'blog.logLevel': 'INFO',
    'blog.readMore': 'Read More',
    'blog.tags': 'Tags',

    // Contact — Contact channels / endpoint panel
    'contact.title': 'Contact Channels',
    'contact.email': 'Email',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',
    'contact.resume': 'Resume',
    'contact.comingSoon': 'Coming Soon',
    'contact.endpoint': 'Endpoint',

    // Sections (legacy, kept for compatibility)
    'section.hero': 'Backend Developer building AI-era products.',
    'section.about': 'About',
    'section.skills': 'Skills',
    'section.projects': 'Projects',
    'section.blog': 'Blog',
    'section.contact': 'Contact',

    // Contact (legacy)
    'contact.resumeLabel': 'Resume',
    'contact.downloadPdf': 'Download PDF',

    // Commands descriptions
    'cmd.help.desc': 'Show help information',
    'cmd.about.desc': 'About me',
    'cmd.skills.desc': 'Skills stack',
    'cmd.projects.desc': 'Project list',
    'cmd.blog.desc': 'Blog posts',
    'cmd.contact.desc': 'Contact info',
    'cmd.resume.desc': 'Download resume',
    'cmd.clear.desc': 'Clear terminal',
    'cmd.classic.desc': 'Switch to classic view',
    'cmd.whoami.desc': 'Current user',
    'cmd.sudo.desc': 'sudo hire me',

    // Command outputs
    'cmd.help.header': 'Available commands:',
    'cmd.about.output': 'Backend developer focused on building reliable business systems and exploring AI-native applications.',
    'cmd.skills.output': 'Java, Spring Boot, React, Next.js, LLM Apps, RAG, Docker...',
    'cmd.projects.output': 'AI Agent Demo, Bidding System, Personal Dev OS',
    'cmd.blog.output': 'Learning path from Java backend to AI Agent dev, etc.',
    'cmd.contact.output': 'Email, GitHub, LinkedIn',
    'cmd.resume.output': 'Resume download link: [coming soon]',
    'cmd.classic.output': 'Switching to classic view... [coming soon]',
    'cmd.whoami.output': 'visitor — Guest user on Personal DevOS',
    'cmd.sudo.hireMe': "Nice try! 😄 Send me an email to discuss opportunities.",
    'cmd.sudo.error': 'sudo: command not found or insufficient privileges',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['zh'];

export function t(key: TranslationKey, lang: Lang, ...args: string[]): string {
  const value = translations[lang][key];
  if (typeof value === 'function') {
    return value(...args);
  }
  return value ?? key;
}

export function getAllTranslations(lang: Lang): Record<TranslationKey, string | ((...args: string[]) => string)> {
  return translations[lang];
}
