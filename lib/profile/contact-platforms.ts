import {
  AtSign,
  Globe,
  Link as LinkIcon,
  Linkedin,
  Mail,
} from 'lucide-react';
import type { ComponentType } from 'react';
import {
  SiBilibili,
  SiDevdotto,
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiGitlab,
  SiHashnode,
  SiHuggingface,
  SiInstagram,
  SiJuejin,
  SiKaggle,
  SiLeetcode,
  SiMedium,
  SiNpm,
  SiSinaweibo,
  SiStackoverflow,
  SiSubstack,
  SiTelegram,
  SiTiktok,
  SiThreads,
  SiWechat,
  SiX,
  SiXiaohongshu,
  SiYoutube,
  SiZhihu,
} from 'react-icons/si';

export const CONTACT_PLATFORM_ORDER = [
  'email',
  'github',
  'gitlab',
  'linkedin',
  'x',
  'telegram',
  'discord',
  'wechat',
  'weibo',
  'zhihu',
  'juejin',
  'bilibili',
  'xiaohongshu',
  'youtube',
  'instagram',
  'threads',
  'facebook',
  'tiktok',
  'medium',
  'devto',
  'hashnode',
  'substack',
  'leetcode',
  'stackoverflow',
  'kaggle',
  'npm',
  'huggingface',
  'website',
  'blog',
  'custom',
] as const;

export type ContactPlatform = (typeof CONTACT_PLATFORM_ORDER)[number];

export type ContactPlatformInputMode = 'email' | 'username' | 'url' | 'custom';
export type ContactPlatformIcon = ComponentType<{ className?: string; size?: number }>;

export interface ContactPlatformMeta {
  value: ContactPlatform;
  label: string;
  inputMode: ContactPlatformInputMode;
  placeholder: string;
  example: string;
  icon: ContactPlatformIcon;
  hrefTemplate?: string;
}

const websiteMeta = {
  value: 'website',
  label: 'Website',
  inputMode: 'url',
  placeholder: 'https://example.com',
  example: 'https://oli6666.top',
  icon: Globe,
} satisfies ContactPlatformMeta;

const blogMeta = {
  value: 'blog',
  label: 'Blog',
  inputMode: 'url',
  placeholder: 'https://blog.example.com',
  example: 'https://oli6666.top/blog',
  icon: LinkIcon,
} satisfies ContactPlatformMeta;

const customMeta = {
  value: 'custom',
  label: 'Custom',
  inputMode: 'custom',
  placeholder: 'Display value',
  example: 'Personal Site Mirror',
  icon: AtSign,
} satisfies ContactPlatformMeta;

export const CONTACT_PLATFORM_META: Record<ContactPlatform, ContactPlatformMeta> = {
  email: {
    value: 'email',
    label: 'Email',
    inputMode: 'email',
    placeholder: 'name@example.com',
    example: 'name@example.com',
    icon: Mail,
  },
  github: {
    value: 'github',
    label: 'GitHub',
    inputMode: 'username',
    placeholder: 'username',
    example: 'octocat',
    icon: SiGithub,
    hrefTemplate: 'https://github.com/{value}',
  },
  gitlab: {
    value: 'gitlab',
    label: 'GitLab',
    inputMode: 'username',
    placeholder: 'username',
    example: 'gitlab-user',
    icon: SiGitlab,
    hrefTemplate: 'https://gitlab.com/{value}',
  },
  linkedin: {
    value: 'linkedin',
    label: 'LinkedIn',
    inputMode: 'username',
    placeholder: 'username',
    example: 'in/example',
    icon: Linkedin,
    hrefTemplate: 'https://www.linkedin.com/{value}',
  },
  x: {
    value: 'x',
    label: 'X',
    inputMode: 'username',
    placeholder: 'username',
    example: 'builder',
    icon: SiX,
    hrefTemplate: 'https://x.com/{value}',
  },
  telegram: {
    value: 'telegram',
    label: 'Telegram',
    inputMode: 'username',
    placeholder: 'username',
    example: 'telegram_user',
    icon: SiTelegram,
    hrefTemplate: 'https://t.me/{value}',
  },
  discord: {
    value: 'discord',
    label: 'Discord',
    inputMode: 'username',
    placeholder: 'username',
    example: 'dev_builder',
    icon: SiDiscord,
  },
  wechat: {
    value: 'wechat',
    label: 'WeChat',
    inputMode: 'username',
    placeholder: 'wechat id',
    example: 'wechat_id',
    icon: SiWechat,
  },
  weibo: {
    value: 'weibo',
    label: 'Weibo',
    inputMode: 'username',
    placeholder: 'username',
    example: 'weibo_user',
    icon: SiSinaweibo,
    hrefTemplate: 'https://weibo.com/{value}',
  },
  zhihu: {
    value: 'zhihu',
    label: 'Zhihu',
    inputMode: 'username',
    placeholder: 'people/username',
    example: 'people/example-user',
    icon: SiZhihu,
    hrefTemplate: 'https://www.zhihu.com/{value}',
  },
  juejin: {
    value: 'juejin',
    label: 'Juejin',
    inputMode: 'username',
    placeholder: 'user id',
    example: '1234567890',
    icon: SiJuejin,
    hrefTemplate: 'https://juejin.cn/user/{value}',
  },
  bilibili: {
    value: 'bilibili',
    label: 'Bilibili',
    inputMode: 'username',
    placeholder: 'uid',
    example: '123456',
    icon: SiBilibili,
    hrefTemplate: 'https://space.bilibili.com/{value}',
  },
  xiaohongshu: {
    value: 'xiaohongshu',
    label: 'Xiaohongshu',
    inputMode: 'username',
    placeholder: 'profile id',
    example: '5f1234567890abcd',
    icon: SiXiaohongshu,
    hrefTemplate: 'https://www.xiaohongshu.com/user/profile/{value}',
  },
  youtube: {
    value: 'youtube',
    label: 'YouTube',
    inputMode: 'username',
    placeholder: '@channel or channel path',
    example: '@builder',
    icon: SiYoutube,
    hrefTemplate: 'https://www.youtube.com/{value}',
  },
  instagram: {
    value: 'instagram',
    label: 'Instagram',
    inputMode: 'username',
    placeholder: 'username',
    example: 'insta_user',
    icon: SiInstagram,
    hrefTemplate: 'https://www.instagram.com/{value}',
  },
  threads: {
    value: 'threads',
    label: 'Threads',
    inputMode: 'username',
    placeholder: '@username',
    example: '@builder',
    icon: SiThreads,
    hrefTemplate: 'https://www.threads.com/{value}',
  },
  facebook: {
    value: 'facebook',
    label: 'Facebook',
    inputMode: 'username',
    placeholder: 'username',
    example: 'builder.page',
    icon: SiFacebook,
    hrefTemplate: 'https://www.facebook.com/{value}',
  },
  tiktok: {
    value: 'tiktok',
    label: 'TikTok',
    inputMode: 'username',
    placeholder: 'username',
    example: 'tiktok_user',
    icon: SiTiktok,
    hrefTemplate: 'https://www.tiktok.com/@{value}',
  },
  medium: {
    value: 'medium',
    label: 'Medium',
    inputMode: 'username',
    placeholder: '@username',
    example: '@builder',
    icon: SiMedium,
    hrefTemplate: 'https://medium.com/{value}',
  },
  devto: {
    value: 'devto',
    label: 'DEV',
    inputMode: 'username',
    placeholder: 'username',
    example: 'builder',
    icon: SiDevdotto,
    hrefTemplate: 'https://dev.to/{value}',
  },
  hashnode: {
    value: 'hashnode',
    label: 'Hashnode',
    inputMode: 'username',
    placeholder: 'username',
    example: 'builder',
    icon: SiHashnode,
    hrefTemplate: 'https://hashnode.com/@{value}',
  },
  substack: {
    value: 'substack',
    label: 'Substack',
    inputMode: 'username',
    placeholder: 'publication',
    example: 'builder',
    icon: SiSubstack,
    hrefTemplate: 'https://{value}.substack.com',
  },
  leetcode: {
    value: 'leetcode',
    label: 'LeetCode',
    inputMode: 'username',
    placeholder: 'username',
    example: 'leetcode-user',
    icon: SiLeetcode,
    hrefTemplate: 'https://leetcode.com/u/{value}',
  },
  stackoverflow: {
    value: 'stackoverflow',
    label: 'Stack Overflow',
    inputMode: 'username',
    placeholder: 'user id or slug',
    example: '123456/example-user',
    icon: SiStackoverflow,
    hrefTemplate: 'https://stackoverflow.com/users/{value}',
  },
  kaggle: {
    value: 'kaggle',
    label: 'Kaggle',
    inputMode: 'username',
    placeholder: 'username',
    example: 'kaggle_user',
    icon: SiKaggle,
    hrefTemplate: 'https://www.kaggle.com/{value}',
  },
  npm: {
    value: 'npm',
    label: 'npm',
    inputMode: 'username',
    placeholder: 'username',
    example: '~builder',
    icon: SiNpm,
    hrefTemplate: 'https://www.npmjs.com/{value}',
  },
  huggingface: {
    value: 'huggingface',
    label: 'Hugging Face',
    inputMode: 'username',
    placeholder: 'username',
    example: 'builder',
    icon: SiHuggingface,
    hrefTemplate: 'https://huggingface.co/{value}',
  },
  website: websiteMeta,
  blog: blogMeta,
  custom: customMeta,
};

export const CONTACT_PLATFORM_OPTIONS = CONTACT_PLATFORM_ORDER.map(
  (value) => CONTACT_PLATFORM_META[value],
);

export function isContactPlatform(value: string): value is ContactPlatform {
  return CONTACT_PLATFORM_ORDER.includes(value as ContactPlatform);
}

export function sanitizeContactValue(platform: ContactPlatform, value: string): string {
  const trimmed = value.trim();

  if (CONTACT_PLATFORM_META[platform].inputMode === 'username') {
    return trimmed.replace(/^@+/, '');
  }

  return trimmed;
}

export function formatContactDisplayValue(platform: ContactPlatform, value: string): string {
  const sanitized = sanitizeContactValue(platform, value);
  if (!sanitized) return '';

  if (CONTACT_PLATFORM_META[platform].inputMode === 'username') {
    return sanitized.startsWith('@') ? sanitized : `@${sanitized}`;
  }

  return sanitized;
}

export function buildContactHref(
  platform: ContactPlatform,
  value: string,
  hrefOverride: string,
): string {
  const override = hrefOverride.trim();
  if (override) return override;

  const sanitized = sanitizeContactValue(platform, value);
  if (!sanitized) return '';

  if (platform === 'email') {
    return `mailto:${sanitized}`;
  }

  if (platform === 'website' || platform === 'blog') {
    return sanitized;
  }

  if (platform === 'custom') {
    return '';
  }

  const template = CONTACT_PLATFORM_META[platform].hrefTemplate;
  if (!template) return '';
  return template.replace('{value}', sanitized);
}
