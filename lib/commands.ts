import type { BlogPostMeta } from './blog/blog-types';
import type { PublicProfile } from './profile';
import type { ProjectMeta } from './projects';
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
  run: (context: CommandContext) => CommandResult;
};

export type CommandContext = {
  lang: Lang;
  blogPosts: BlogPostMeta[];
  profile: PublicProfile;
  projects: ProjectMeta[];
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

function localizedText(value: { zh: string; en: string }, lang: Lang) {
  return value[lang].trim();
}

function formatAbout(lang: Lang, profile: PublicProfile) {
  const intro = localizedText(profile.profile.intro, lang);
  const fields = profile.profile.fields
    .map((field) => {
      const value = localizedText(field.value, lang);
      if (!value) return null;
      return `${t(field.labelKey, lang)}: ${value}`;
    })
    .filter((item): item is string => item !== null);

  if (!intro && fields.length === 0) {
    return t('about.empty', lang);
  }

  return [intro, ...fields].filter(Boolean).join('\n');
}

function formatSkills(lang: Lang, profile: PublicProfile) {
  const groups = profile.systemStack.groups
    .map((group) => {
      const groupName = group.name.trim();
      if (!groupName) return null;
      const items = group.items
        .map((item) => item.name.trim())
        .filter(Boolean);

      return `${groupName}: ${items.join(', ')}`;
    })
    .filter((item): item is string => item !== null);

  if (groups.length === 0) {
    return t('skills.empty', lang);
  }

  return [t('cmd.skills.header', lang), ...groups].join('\n');
}

function formatProjects(lang: Lang, projects: ProjectMeta[]) {
  return [
    t('cmd.projects.header', lang),
    ...projects.map((project) => {
      const status = projectStatusLabels[project.status][lang];
      return [
        `- ${project.title}`,
        `  ${t('cmd.projects.statusLabel', lang)}: ${status}`,
        `  ${t('cmd.projects.stackLabel', lang)}: ${project.techStack.join(', ')}`,
      ].join('\n');
    }),
  ].join('\n');
}

function formatBlogs(lang: Lang, posts: BlogPostMeta[]) {
  if (posts.length === 0) {
    return [t('cmd.blog.header', lang), t('blog.empty', lang)].join('\n');
  }

  return [
    t('cmd.blog.header', lang),
    ...posts.map((post, index) => {
      const meta = [post.date, post.series].filter(Boolean).join(' - ');
      const tags = post.tags.length > 0 ? post.tags.join(', ') : '-';

      return [
        `${index + 1}. ${post.title}`,
        `   ${post.summary}`,
        `   ${meta}`,
        `   ${t('blog.tags', lang)}: ${tags}`,
        `   /blog/${post.slug}`,
      ].join('\n');
    }),
  ].join('\n\n');
}

function formatContact(lang: Lang, profile: PublicProfile) {
  const channels = profile.contactChannels.channels
    .filter((channel) => channel.href && channel.value)
    .map((channel) => {
      const label = channel.label.trim();
      const href = channel.href.trim();
      if (!label || !href) return null;
      return `${label}: ${href}`;
    })
    .filter((item): item is string => item !== null);

  if (channels.length === 0) {
    return t('contact.empty', lang);
  }

  return [t('cmd.contact.header', lang), ...channels].join('\n');
}

function formatWhoami(lang: Lang, profile: PublicProfile) {
  const role = localizedText(profile.profile.role, lang);
  if (role) {
    return role;
  }

  const intro = localizedText(profile.profile.intro, lang);
  if (intro) {
    return intro;
  }

  return lang === 'zh'
    ? '当前访问者正在浏览这个 AI Native Portfolio CMS starter。'
    : 'You are visiting this AI Native Portfolio CMS starter.';
}

const commandDefinitions: CommandDefinition[] = [
  {
    name: 'help',
    descriptionKey: 'cmd.help.desc',
    run: ({ lang }) => {
      const rows = commandDefinitions.map((item) => {
        return `  ${item.name.padEnd(12)} ${t(item.descriptionKey, lang)}`;
      });

      return command([t('cmd.help.header', lang), ...rows].join('\n'));
    },
  },
  {
    name: 'about',
    descriptionKey: 'cmd.about.desc',
    run: ({ lang, profile }) => command(formatAbout(lang, profile), { navigationTarget: 'about' }),
  },
  {
    name: 'skills',
    descriptionKey: 'cmd.skills.desc',
    run: ({ lang, profile }) => command(formatSkills(lang, profile), { navigationTarget: 'skills' }),
  },
  {
    name: 'projects',
    descriptionKey: 'cmd.projects.desc',
    run: ({ lang, projects }) => command(formatProjects(lang, projects), { navigationTarget: 'projects' }),
  },
  {
    name: 'blog',
    descriptionKey: 'cmd.blog.desc',
    run: ({ lang, blogPosts }) => command(formatBlogs(lang, blogPosts), { navigationTarget: 'blog' }),
  },
  {
    name: 'contact',
    descriptionKey: 'cmd.contact.desc',
    run: ({ lang, profile }) => command(formatContact(lang, profile), { navigationTarget: 'contact' }),
  },
  {
    name: 'resume',
    descriptionKey: 'cmd.resume.desc',
    run: ({ lang }) => command(t('cmd.resume.output', lang)),
  },
  {
    name: 'clear',
    descriptionKey: 'cmd.clear.desc',
    run: clearCommand,
  },
  {
    name: 'classic',
    descriptionKey: 'cmd.classic.desc',
    run: ({ lang }) => command(t('cmd.classic.output', lang), {
      navigationTarget: 'overview',
      activateMain: true,
    }),
  },
  {
    name: 'whoami',
    descriptionKey: 'cmd.whoami.desc',
    run: ({ lang, profile }) => command(formatWhoami(lang, profile)),
  },
  {
    name: 'sudo hire me',
    descriptionKey: 'cmd.sudo.desc',
    run: ({ lang }) => command(t('cmd.sudo.hireMe', lang), { navigationTarget: 'contact' }),
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

export function executeCommand(input: string, context: CommandContext): CommandResult {
  const normalizedInput = input.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalized = commandAliases.get(normalizedInput) ?? normalizedInput;

  if (!normalized) {
    return command('');
  }

  const handler = commandMap.get(normalized);

  if (!handler) {
    return {
      output: t('console.notFound', context.lang),
      action: 'none',
      isError: true,
    };
  }

  return handler.run(context);
}

export const AVAILABLE_COMMANDS = commandDefinitions.map((item) => item.name);
