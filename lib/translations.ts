import { Lang } from './types';

const translations = {
  zh: {
    // Status Bar
    'status.portfolio': 'Portfolio',
    'status.terminal': '终端',
    'status.switchToMinimal': '切换极简',
    'status.switchToMacos': '切换 macOS',

    // Window Titles
    'window.main.title': 'Portfolio.app',
    'window.console.title.macos': 'visitor@DevOS: ~',
    'window.console.title.vercel': 'Terminal.app',

    // Desktop
    'desktop.openMain': 'Portfolio',
    'desktop.openConsole': '终端',
    'desktop.welcome': 'Personal Dev OS',

    // Console
    'console.welcome': 'Personal DevOS Terminal v1.0.0',
    'console.help': '输入 "help" 查看可用命令。',
    'console.prompt': 'DevOS:~ visitor$',
    'console.notFound': '命令未找到。输入 `help` 查看可用命令。',

    // Sections
    'section.hero': '面向 AI 时代构建产品的后端开发者',
    'section.about': '关于',
    'section.skills': '技能',
    'section.projects': '项目',
    'section.blog': '博客',
    'section.contact': '联系',

    // Commands
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
  },
  en: {
    // Status Bar
    'status.portfolio': 'Portfolio',
    'status.terminal': 'Terminal',
    'status.switchToMinimal': 'Switch to Minimal',
    'status.switchToMacos': 'Switch to macOS',

    // Window Titles
    'window.main.title': 'Portfolio.app',
    'window.console.title.macos': 'visitor@DevOS: ~',
    'window.console.title.vercel': 'Terminal.app',

    // Desktop
    'desktop.openMain': 'Portfolio',
    'desktop.openConsole': 'Terminal',
    'desktop.welcome': 'Personal Dev OS',

    // Console
    'console.welcome': 'Personal DevOS Terminal v1.0.0',
    'console.help': 'Type "help" to see available commands.',
    'console.prompt': 'DevOS:~ visitor$',
    'console.notFound': 'Command not found. Type `help` to see available commands.',

    // Sections
    'section.hero': 'Backend Developer building AI-era products.',
    'section.about': 'About',
    'section.skills': 'Skills',
    'section.projects': 'Projects',
    'section.blog': 'Blog',
    'section.contact': 'Contact',

    // Commands
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
  },
} as const;

export function t(key: string, lang: Lang): string {
  const dict = translations[lang] as Record<string, string>;
  return dict[key] ?? key;
}

export function getAllTranslations(lang: Lang): Record<string, string> {
  return translations[lang] as Record<string, string>;
}
