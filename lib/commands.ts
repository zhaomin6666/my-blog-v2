import { blogs } from '@/data/blogs';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { Lang, MainSectionId, ProjectStatus } from './types';
import { t } from './translations';

export type CommandAction = 'clear' | 'none';

export type CommandResult = {
  output: string;
  action: CommandAction;
  isError?: boolean;
  navigationTarget?: MainSectionId;
  activateMain?: boolean;
};

type CommandDefinition = {
  name: string;
  descriptionKey: CommandDescriptionKey;
  run: (lang: Lang) => CommandResult;
};

type CommandDescriptionKey =
  | 'cmd.help.desc'
  | 'cmd.about.desc'
  | 'cmd.skills.desc'
  | 'cmd.projects.desc'
  | 'cmd.blog.desc'
  | 'cmd.contact.desc'
  | 'cmd.resume.desc'
  | 'cmd.clear.desc'
  | 'cmd.classic.desc'
  | 'cmd.whoami.desc'
  | 'cmd.sudo.desc';

const projectStatusLabels: Record<ProjectStatus, { zh: string; en: string }> = {
  building: {
    zh: '构建中',
    en: 'Building',
  },
  production: {
    zh: '生产运行',
    en: 'Production',
  },
  mvp: {
    zh: 'MVP',
    en: 'MVP',
  },
};

const command = (
  output: string,
  options: Pick<CommandResult, 'navigationTarget' | 'activateMain'> = {}
): CommandResult => ({
  output,
  action: 'none',
  ...options,
});

const clearCommand = (): CommandResult => ({
  output: '',
  action: 'clear',
});

function formatSkills(lang: Lang) {
  return [
    t('cmd.skills.header', lang),
    ...skills.map((category) => {
      return `${category.category[lang]}: ${category.items.join(', ')}`;
    }),
  ].join('\n');
}

function formatProjects(lang: Lang) {
  return [
    t('cmd.projects.header', lang),
    ...projects.map((project) => {
      const status = projectStatusLabels[project.status][lang];
      return [
        `- ${project.title[lang]}`,
        `  ${t('cmd.projects.statusLabel', lang)}: ${status}`,
        `  ${t('cmd.projects.stackLabel', lang)}: ${project.stack.join(', ')}`,
      ].join('\n');
    }),
  ].join('\n');
}

function formatBlogs(lang: Lang) {
  return [
    t('cmd.blog.header', lang),
    ...blogs.map((blog) => {
      return `- ${blog.date}  ${blog.title[lang]} [${blog.tags.join(', ')}]`;
    }),
  ].join('\n');
}

function formatContact(lang: Lang) {
  return [
    t('cmd.contact.header', lang),
    `Email: ${t('cmd.contact.statusComingSoon', lang)}`,
    `GitHub: ${t('cmd.contact.statusComingSoon', lang)}`,
    `LinkedIn: ${t('cmd.contact.statusComingSoon', lang)}`,
    `${t('contact.resume', lang)}: ${t('contact.comingSoon', lang)}`,
  ].join('\n');
}

const commandDefinitions: CommandDefinition[] = [
  {
    name: 'help',
    descriptionKey: 'cmd.help.desc',
    run: (lang) => {
      const rows = commandDefinitions.map((item) => {
        return `  ${item.name.padEnd(12)} ${t(item.descriptionKey, lang)}`;
      });

      return command([t('cmd.help.header', lang), ...rows].join('\n'));
    },
  },
  {
    name: 'about',
    descriptionKey: 'cmd.about.desc',
    run: (lang) => command(t('cmd.about.output', lang), { navigationTarget: 'about' }),
  },
  {
    name: 'skills',
    descriptionKey: 'cmd.skills.desc',
    run: (lang) => command(formatSkills(lang), { navigationTarget: 'skills' }),
  },
  {
    name: 'projects',
    descriptionKey: 'cmd.projects.desc',
    run: (lang) => command(formatProjects(lang), { navigationTarget: 'projects' }),
  },
  {
    name: 'blog',
    descriptionKey: 'cmd.blog.desc',
    run: (lang) => command(formatBlogs(lang), { navigationTarget: 'blog' }),
  },
  {
    name: 'contact',
    descriptionKey: 'cmd.contact.desc',
    run: (lang) => command(formatContact(lang), { navigationTarget: 'contact' }),
  },
  {
    name: 'resume',
    descriptionKey: 'cmd.resume.desc',
    run: (lang) => command(t('cmd.resume.output', lang)),
  },
  {
    name: 'clear',
    descriptionKey: 'cmd.clear.desc',
    run: clearCommand,
  },
  {
    name: 'classic',
    descriptionKey: 'cmd.classic.desc',
    run: (lang) => command(t('cmd.classic.output', lang), {
      navigationTarget: 'overview',
      activateMain: true,
    }),
  },
  {
    name: 'whoami',
    descriptionKey: 'cmd.whoami.desc',
    run: (lang) => command(t('cmd.whoami.output', lang)),
  },
  {
    name: 'sudo hire me',
    descriptionKey: 'cmd.sudo.desc',
    run: (lang) => command(t('cmd.sudo.hireMe', lang), { navigationTarget: 'contact' }),
  },
];

const commandAliases = new Map<string, string>([
  ['stack', 'skills'],
  ['logs', 'blog'],
  ['articles', 'blog'],
  ['mail', 'contact'],
  ['hire', 'sudo hire me'],
]);

const commandMap = new Map(commandDefinitions.map((item) => [item.name, item]));

export function executeCommand(input: string, lang: Lang): CommandResult {
  const normalizedInput = input.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalized = commandAliases.get(normalizedInput) ?? normalizedInput;

  if (!normalized) {
    return command('');
  }

  const handler = commandMap.get(normalized);

  if (!handler) {
    return {
      output: t('console.notFound', lang),
      action: 'none',
      isError: true,
    };
  }

  return handler.run(lang);
}

export const AVAILABLE_COMMANDS = commandDefinitions.map((item) => item.name);
