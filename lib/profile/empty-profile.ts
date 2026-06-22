import type {
  ContactChannels,
  ProfileContent,
  PublicProfile,
  SystemStack,
} from './profile-types';

function createEmptyText() {
  return { zh: '', en: '' };
}

function hasLocalizedText(value: { zh: string; en: string }): boolean {
  return Boolean(value.zh.trim() || value.en.trim());
}

export function isProfileContentEmpty(profile: ProfileContent): boolean {
  return !(
    hasLocalizedText(profile.summary) ||
    hasLocalizedText(profile.role) ||
    hasLocalizedText(profile.status) ||
    hasLocalizedText(profile.intro) ||
    profile.fields.length ||
    profile.focus.length ||
    profile.background.length ||
    profile.building.length ||
    profile.workStyle.length ||
    profile.coreSkills.length ||
    profile.aiFocus.length ||
    profile.enterpriseExperience.length ||
    profile.featuredProjects.length ||
    profile.careerDirection.length ||
    hasLocalizedText(profile.privacyNote) ||
    profile.content.trim()
  );
}

export function createEmptyProfileContent(): ProfileContent {
  return {
    title: '',
    slug: 'profile',
    summary: createEmptyText(),
    role: createEmptyText(),
    status: createEmptyText(),
    intro: createEmptyText(),
    fields: [],
    focus: [],
    background: [],
    building: [],
    workStyle: [],
    coreSkills: [],
    aiFocus: [],
    enterpriseExperience: [],
    featuredProjects: [],
    careerDirection: [],
    privacyNote: createEmptyText(),
    published: false,
    lang: 'zh',
    content: '',
    rawContent: '',
  };
}

export function createEmptyContactChannels(): ContactChannels {
  return {
    title: '',
    slug: 'contact-channels',
    summary: createEmptyText(),
    channels: [],
    privacyNote: createEmptyText(),
    resumeNote: createEmptyText(),
    published: false,
    lang: 'zh',
    content: '',
    rawContent: '',
  };
}

export function createEmptySystemStack(): SystemStack {
  return {
    title: '',
    slug: 'system-stack',
    summary: createEmptyText(),
    groups: [],
    published: false,
    lang: 'zh',
    content: '',
    rawContent: '',
  };
}

export function createEmptyPublicProfile(): PublicProfile {
  return {
    profile: createEmptyProfileContent(),
    contactChannels: createEmptyContactChannels(),
    systemStack: createEmptySystemStack(),
  };
}
