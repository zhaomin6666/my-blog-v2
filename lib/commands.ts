import { Lang } from './types';
import { t } from './translations';

export type CommandResult = {
  output: string;
  action?: 'scroll' | 'highlight' | 'clear' | 'none';
  target?: string;
};

const commands: Record<string, (lang: Lang, args: string[]) => CommandResult> = {
  help: (lang) => ({
    output: [
      'Available commands:',
      '  help      — ' + t('cmd.help.desc', lang),
      '  about     — ' + t('cmd.about.desc', lang),
      '  skills    — ' + t('cmd.skills.desc', lang),
      '  projects  — ' + t('cmd.projects.desc', lang),
      '  blog      — ' + t('cmd.blog.desc', lang),
      '  contact   — ' + t('cmd.contact.desc', lang),
      '  resume    — ' + t('cmd.resume.desc', lang),
      '  clear     — ' + t('cmd.clear.desc', lang),
      '  classic   — ' + t('cmd.classic.desc', lang),
      '  whoami    — ' + t('cmd.whoami.desc', lang),
      '  sudo      — ' + t('cmd.sudo.desc', lang),
    ].join('\n'),
    action: 'none',
  }),
  about: (lang) => ({
    output: t('section.about', lang) + ' — ' + (lang === 'zh'
      ? '后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。'
      : 'Backend developer focused on building reliable business systems and exploring AI-native applications.'),
    action: 'scroll',
    target: 'about',
  }),
  skills: (lang) => ({
    output: t('section.skills', lang) + ' — ' + (lang === 'zh'
      ? 'Java, Spring Boot, React, Next.js, LLM Apps, RAG, Docker...'
      : 'Java, Spring Boot, React, Next.js, LLM Apps, RAG, Docker...'),
    action: 'scroll',
    target: 'skills',
  }),
  projects: (lang) => ({
    output: t('section.projects', lang) + ' — AI Agent Demo, Bidding System, Personal Dev OS',
    action: 'scroll',
    target: 'projects',
  }),
  blog: (lang) => ({
    output: t('section.blog', lang) + ' — ' + (lang === 'zh'
      ? '从 Java 后端到 AI Agent 开发的学习路线等文章'
      : 'Learning path from Java backend to AI Agent dev, etc.'),
    action: 'scroll',
    target: 'blog',
  }),
  contact: (lang) => ({
    output: t('section.contact', lang) + ' — Email, GitHub, LinkedIn',
    action: 'scroll',
    target: 'contact',
  }),
  resume: () => ({
    output: 'Resume download link: [coming soon]',
    action: 'none',
  }),
  clear: () => ({
    output: '',
    action: 'clear',
  }),
  classic: () => ({
    output: 'Switching to classic view... [coming soon]',
    action: 'none',
  }),
  whoami: () => ({
    output: 'visitor — Guest user on Personal DevOS',
    action: 'none',
  }),
  sudo: (_, args) => {
    const rest = args.join(' ');
    if (rest.toLowerCase() === 'hire me') {
      return {
        output: 'Nice try! 😄 Send me an email to discuss opportunities.',
        action: 'scroll',
        target: 'contact',
      };
    }
    return {
      output: 'sudo: command not found or insufficient privileges',
      action: 'none',
    };
  },
};

export function executeCommand(input: string, lang: Lang): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: '', action: 'none' };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handler = commands[cmd];
  if (!handler) {
    return {
      output: t('console.notFound', lang),
      action: 'none',
    };
  }

  return handler(lang, args);
}

export const AVAILABLE_COMMANDS = Object.keys(commands);
