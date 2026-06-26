---
title: "Example Developer Profile"
slug: "profile"
summary:
  zh: "Example Developer 的示例公开档案，用于展示 Personal Developer OS / AI Native Portfolio CMS 的 file mode 内容结构。"
  en: "An example public profile for showing the file-mode content structure of the Personal Developer OS / AI Native Portfolio CMS."
role:
  zh: "Example Developer 是一名 Full-stack Developer / AI Application Builder，用于演示 profile、project、blog、contact 和 stack 内容如何组合成一个可替换的开发者档案。"
  en: "Example Developer is a Full-stack Developer / AI Application Builder used to demonstrate how profile, project, blog, contact, and stack content can form a replaceable developer profile."
status:
  zh: "Starter content: replace with your own public profile before publishing."
  en: "Starter content: replace with your own public profile before publishing."
intro:
  zh: "这是一个中性的 example profile，用于帮助开源用户在 file mode 下快速看到完整页面效果。你可以将这里的背景、项目、技能和联系方式替换为自己的公开内容。"
  en: "This is a neutral example profile that helps open-source users see a complete file-mode page. You can replace the background, projects, skills, and contact channels with your own public content."
fields:
  - labelKey: "about.role"
    value:
      zh: "Example Developer"
      en: "Example Developer"
  - labelKey: "about.direction"
    value:
      zh: "Full-stack Developer / AI Application Builder"
      en: "Full-stack Developer / AI Application Builder"
  - labelKey: "about.status"
    value:
      zh: "Starter profile for an AI Native Portfolio CMS"
      en: "Starter profile for an AI Native Portfolio CMS"
focus:
  - zh: "Portfolio CMS"
    en: "Portfolio CMS"
  - zh: "AI 应用原型"
    en: "AI application prototypes"
  - zh: "内容建模"
    en: "Content modeling"
  - zh: "Full-stack product UI"
    en: "Full-stack product UI"
  - zh: "Admin CMS workflow"
    en: "Admin CMS workflow"
  - zh: "安全的示例内容"
    en: "Safe example content"
background:
  - zh: "这个档案是 starter content，不代表任何具体个人、公司、客户或生产系统。"
    en: "This profile is starter content and does not represent a specific person, company, client, or production system."
  - zh: "它展示 file mode 可以怎样组织公开 profile 数据，并与 projects、blog、contact 和 stack 内容配合。"
    en: "It shows how file mode can organize public profile data alongside projects, blog posts, contact channels, and stack content."
  - zh: "在正式发布前，请将这些示例字段替换为你自己的公开背景、项目、技能和联系方式。"
    en: "Before publishing, replace these example fields with your own public background, projects, skills, and contact details."
building:
  - label:
      zh: "Example AI Native Portfolio"
      en: "Example AI Native Portfolio"
    href: "/projects/example-ai-native-portfolio"
    description:
      zh: "一个中性的 example project，用于演示 Personal Developer OS / AI Native Portfolio CMS 的项目内容模型。"
      en: "A neutral example project that demonstrates the project content model for a Personal Developer OS / AI Native Portfolio CMS."
  - label:
      zh: "Example Blog"
      en: "Example Blog"
    href: "/blog"
    description:
      zh: "一篇示例博客，用于说明 file mode、database mode、Admin CMS 和安全内容替换流程。"
      en: "An example blog post explaining file mode, database mode, Admin CMS editing, and safe content replacement."
workStyle:
  - zh: "Keep example data small, clear, and easy to replace"
    en: "Keep example data small, clear, and easy to replace"
  - zh: "Use file mode for Git-managed starter content"
    en: "Use file mode for Git-managed starter content"
  - zh: "Use database mode for Admin CMS-managed production content"
    en: "Use database mode for Admin CMS-managed production content"
coreSkills:
  - "Next.js"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Node.js"
  - "PostgreSQL"
  - "LLM Apps"
  - "RAG"
  - "Tool Calling"
  - "Structured Output"
  - "Docker"
  - "Nginx"
  - "Markdown"
  - "Admin CMS"
  - "SEO"
  - "RSS"
aiFocus:
  - zh: "LLM app content flows"
    en: "LLM app content flows"
  - zh: "RAG-ready documentation structure"
    en: "RAG-ready documentation structure"
  - zh: "Tool calling examples"
    en: "Tool calling examples"
  - zh: "Structured output examples"
    en: "Structured output examples"
  - zh: "Admin CMS editing boundaries"
    en: "Admin CMS editing boundaries"
enterpriseExperience:
  - zh: "Example content can describe public product scope, architecture notes, and safe implementation details."
    en: "Example content can describe public product scope, architecture notes, and safe implementation details."
  - zh: "Keep private credentials, production configuration, server details, and confidential customer data out of Markdown files."
    en: "Keep private credentials, production configuration, server details, and confidential customer data out of Markdown files."
featuredProjects:
  - title:
      zh: "Example AI Native Portfolio"
      en: "Example AI Native Portfolio"
    href: "/projects/example-ai-native-portfolio"
    summary:
      zh: "一个用于开源 starter 的中性项目示例，展示 homepage、projects、blog、profile、contact 和 stack 的内容组织方式。"
      en: "A neutral project example for the open-source starter, showing content organization for homepage, projects, blog, profile, contact, and stack."
careerDirection:
  - zh: "Full-stack Development"
    en: "Full-stack Development"
  - zh: "AI Application Building"
    en: "AI Application Building"
  - zh: "Portfolio CMS"
    en: "Portfolio CMS"
  - zh: "Developer Tooling"
    en: "Developer Tooling"
privacyNote:
  zh: "This is placeholder content. Replace it with public information you are comfortable publishing, and keep secrets or private production data out of the repository."
  en: "This is placeholder content. Replace it with public information you are comfortable publishing, and keep secrets or private production data out of the repository."
published: true
lang: "en"
---

<!--
Profile content mapping:

This file is the source for the public Profile section in the Main App.
It is starter content for an example developer profile.

Frontmatter fields:
- title:
  Internal content title. The Main App section heading currently uses the shared
  translation key nav.profile instead of rendering this field directly.
- slug:
  Stable content identifier for the Profile repository.
- summary:
  Parsed into publicProfile.profile.summary. It is useful for content metadata,
  CMS/admin preview text, and future profile cards.
- role:
  Parsed into publicProfile.profile.role. Reserved for a future compact hero,
  badge, or metadata display. Current homepage uses fields/intro instead.
- status:
  Displayed in the Profile section status note.
- intro:
  Displayed as the short opening paragraph in the Profile section.
- fields:
  Displayed as the three Profile info cards. labelKey must match existing
  translation keys such as about.role, about.direction, and about.status.
- focus:
  Displayed as Current Focus tags in the Profile section.
- background:
  Displayed in the Background list in the Profile section.
- building:
  Displayed as linked entries in the Building area of the Profile section.
- workStyle:
  Displayed in the How I Work area of the Profile section.
- coreSkills:
  Parsed for future profile metadata/CMS use. The visible Stack section comes
  from content/profile/system-stack.md.
- aiFocus:
  Parsed for future detailed profile views.
- enterpriseExperience:
  Parsed for future detailed profile views. In this starter file it contains
  general safe-content notes, not private history.
- featuredProjects:
  Parsed for future CMS/project cross-linking. Current visible project cards come
  from content/projects through ProjectService.
- careerDirection:
  Displayed as direction tags in the Profile section.
- privacyNote:
  Displayed in the Profile note area.
- published:
  Controls whether ProfileService returns this public profile.
- lang:
  Source content language marker.

Markdown body:
- Parsed into publicProfile.profile.content and rawContent.
- The current Main App does not render the markdown body directly. Keep it as an
  editor-facing narrative/metadata reserve for a future detail view or CMS
  preview.

Frontend display mapping:
- Main App / Profile:
  Reads publicProfile.profile intro, fields, focus, background, building,
  workStyle, careerDirection, status, and privacyNote.
- Main App / Stack:
  Reads publicProfile.systemStack.groups from system-stack.md.
- Main App / Contact:
  Reads publicProfile.contactChannels visible channels from
  contact-channels.md.

Safety guard:
- Do not add secrets, API keys, database URLs, private server details, private
  customer data, phone numbers, private addresses, or confidential identifiers.
-->

This is an example developer profile for the file-mode starter. Replace it with your own public profile content when you customize the project.
