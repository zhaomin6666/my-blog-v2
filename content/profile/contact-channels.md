---
title: "Contact Channels"
slug: "contact-channels"
summary:
  zh: "公开联系入口。"
  en: "Public contact entry points."
channels:
  - label:
      zh: "Blog"
      en: "Blog"
    type: "blog"
    href: "/blog"
    value:
      zh: "工程日志与学习记录"
      en: "Engineering logs and learning notes"
    endpoint: "GET /blog"
    visible: true
  - label:
      zh: "Projects"
      en: "Projects"
    type: "projects"
    href: "/projects"
    value:
      zh: "项目案例与作品集"
      en: "Project case studies and portfolio"
    endpoint: "GET /projects"
    visible: true
  - label:
      zh: "Personal Developer OS"
      en: "Personal Developer OS"
    type: "projects"
    href: "/projects/personal-developer-os"
    value:
      zh: "已上线的个人开发者 OS 项目"
      en: "Live Personal Developer OS project"
    endpoint: "GET /projects/personal-developer-os"
    visible: true
  - label:
      zh: "AI Agent Demo"
      en: "AI Agent Demo"
    type: "projects"
    href: "/projects/ai-agent-demo"
    value:
      zh: "AI Agent 学习项目与案例说明"
      en: "AI Agent learning project and case study"
    endpoint: "GET /projects/ai-agent-demo"
    visible: true
  - label:
      zh: "Email"
      en: "Email"
    type: "email"
    href: ""
    value:
      zh: "正式沟通时提供"
      en: "Available during formal communication"
    endpoint: "GET /email"
    visible: false
    privacyNote:
      zh: "邮箱暂不在公开网站展示。"
      en: "Email is not displayed publicly for now."
  - label:
      zh: "Resume"
      en: "Resume"
    type: "resume"
    href: ""
    value:
      zh: "完整简历：正式沟通时提供"
      en: "Full resume: available on request"
    endpoint: "GET /resume"
    visible: true
    disabled: true
privacyNote:
  zh: "不在公开网站展示手机号、微信、住址、身份证、生日等个人敏感信息。"
  en: "Phone number, WeChat, address, ID number, birthday, and other sensitive personal information are not shown publicly."
resumeNote:
  zh: "完整简历可在正式沟通时提供。"
  en: "The full resume can be shared during formal communication."
published: true
lang: "zh"
---

<!--
Contact channels content mapping:

- title:
  Internal content title. The Main App Contact section heading currently uses the
  shared translation key contact.title.
- summary:
  Parsed for content metadata, CMS/admin preview text, and future card summaries.
  It is not rendered directly on the current homepage.
- channels:
  Drives the Contact section channel cards.
- channels.visible:
  Only channels with visible=true are shown in the public Contact section.
- channels for /blog, /projects, /projects/personal-developer-os, and
  /projects/ai-agent-demo:
  These are the current public CTAs. Keep the list focused and avoid turning
  Contact into a marketing link wall.
- channels.href:
  If href is empty, the channel is not rendered as an active clickable link.
  A disabled channel may still be shown as a status/availability note.
- channels.disabled:
  Shows the channel as unavailable/coming soon and prevents navigation.
- channels.privacyNote:
  Channel-level note reserved for future detailed views. It is not rendered in
  the current Contact card list.
- privacyNote:
  Displayed under the Contact cards.
- resumeNote:
  Displayed after privacyNote in the Contact section.

Privacy guard:
- Do not add phone number, WeChat ID, address, ID number, birthday, private email,
  real employer name, real client name, buyer name, or sensitive project details.
- Do not add a public resume PDF download link unless the privacy policy changes.
-->

公开联系入口仅保留站内可访问内容和正式沟通说明，不包含私人联系方式。
