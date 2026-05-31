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
      t('cmd.help.header', lang),
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
    output: t('section.about', lang) + ' — ' + t('cmd.about.output', lang),
    action: 'scroll',
    target: 'about',
  }),
  skills: (lang) => ({
    output: t('section.skills', lang) + ' — ' + t('cmd.skills.output', lang),
    action: 'scroll',
    target: 'skills',
  }),
  projects: (lang) => ({
    output: t('section.projects', lang) + ' — ' + t('cmd.projects.output', lang),
    action: 'scroll',
    target: 'projects',
  }),
  blog: (lang) => ({
    output: t('section.blog', lang) + ' — ' + t('cmd.blog.output', lang),
    action: 'scroll',
    target: 'blog',
  }),
  contact: (lang) => ({
    output: t('section.contact', lang) + ' — ' + t('cmd.contact.output', lang),
    action: 'scroll',
    target: 'contact',
  }),
  resume: (lang) => ({
    output: t('cmd.resume.output', lang),
    action: 'none',
  }),
  clear: () => ({
    output: '',
    action: 'clear',
  }),
  classic: (lang) => ({
    output: t('cmd.classic.output', lang),
    action: 'none',
  }),
  whoami: (lang) => ({
    output: t('cmd.whoami.output', lang),
    action: 'none',
  }),
  sudo: (lang, args) => {
    const rest = args.join(' ');
    if (rest.toLowerCase() === 'hire me') {
      return {
        output: t('cmd.sudo.hireMe', lang),
        action: 'scroll',
        target: 'contact',
      };
    }
    return {
      output: t('cmd.sudo.error', lang),
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
