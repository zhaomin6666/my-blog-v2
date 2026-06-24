import { profileService, type ContactChannelData, type SystemStackGroup } from "@/lib/profile";
import type { AgentDemoLocale, AgentKnowledgeItem } from "../agentDemoTypes";
import { pickLocalizedText, truncateText } from "./textUtils";

function visibleContactSummary(
  channels: ContactChannelData[],
): string {
  const visibleChannels = channels.filter((channel) => channel.href && channel.value);

  if (!visibleChannels.length) return "No public contact channels are available.";

  return visibleChannels
    .map((channel) => {
      return `${channel.label}: ${channel.value}`;
    })
    .join("\n");
}

function stackSummary(groups: SystemStackGroup[], locale: AgentDemoLocale): string {
  return groups
    .map((group) => {
      return `${group.name}: ${group.items.map((item) => item.name).join(", ")}`;
    })
    .join("\n");
}

export async function getPublicProfile(
  locale: AgentDemoLocale = "zh",
): Promise<AgentKnowledgeItem> {
  const publicProfile = await profileService.getPublicProfile();
  const profile = publicProfile.profile;
  const intro = pickLocalizedText(profile.intro, locale);
  const role = pickLocalizedText(profile.role, locale);
  const status = pickLocalizedText(profile.status, locale);
  const focus = profile.focus.map((item) => pickLocalizedText(item, locale)).join(", ");
  const background = profile.background
    .map((item) => pickLocalizedText(item, locale))
    .join(" ");
  const careerDirection = profile.careerDirection
    .map((item) => pickLocalizedText(item, locale))
    .join(", ");

  const context = [
    `Profile: ${profile.title}`,
    `Role: ${role}`,
    `Status: ${status}`,
    `Intro: ${intro}`,
    `Focus: ${focus}`,
    `Background: ${background}`,
    `Career Direction: ${careerDirection}`,
  ].join("\n");

  return {
    source: {
      type: "profile",
      title: "Public Profile",
      url: "/",
      excerpt: truncateText(intro),
    },
    context,
    score: 10,
  };
}

export async function getSystemStack(
  locale: AgentDemoLocale = "zh",
): Promise<AgentKnowledgeItem> {
  const stack = await profileService.getSystemStack();
  const summary = stackSummary(stack.groups, locale);

  return {
    source: {
      type: "profile",
      title: "Public System Stack",
      url: "/",
      excerpt: truncateText(summary),
    },
    context: [`System Stack`, summary].join("\n"),
    score: 10,
  };
}

export async function getPublicContact(
  _locale: AgentDemoLocale = "zh",
): Promise<AgentKnowledgeItem> {
  const channels = await profileService.getContactChannels();
  const summary = visibleContactSummary(channels.channels);

  return {
    source: {
      type: "profile",
      title: "Public Contact Channels",
      url: "/",
      excerpt: truncateText(summary),
    },
    context: [`Contact`, summary].join("\n"),
    score: 10,
  };
}
