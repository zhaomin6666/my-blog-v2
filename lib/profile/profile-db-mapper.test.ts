import { describe, expect, it } from "vitest";
import type {
  ContactChannelRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from "@/lib/db/dbTypes";
import {
  mapContactRowsToChannels,
  mapProfilePageRowToProfile,
  mapStackRowsToGroups,
} from "./profile-db-mapper";

describe("profile-db-mapper", () => {
  it("maps profile page data into localized public profile content", () => {
    const row: ProfilePageRow = {
      id: "profile-1",
      key: "profile",
      title: "Profile",
      summary: "Public profile",
      content_markdown: "Profile body",
      lang: "zh",
      data: {
        role: { zh: "后端开发", en: "Backend Developer" },
        coreSkills: ["Java", "Next.js"],
        published: true,
      },
    };

    const profile = mapProfilePageRowToProfile(row);

    expect(profile.role).toEqual({ zh: "后端开发", en: "Backend Developer" });
    expect(profile.coreSkills).toEqual(["Java", "Next.js"]);
    expect(profile.content).toBe("Profile body");
    expect(profile.published).toBe(true);
  });

  it("keeps contact and stack rows visible/order-ready for public rendering", () => {
    const contactRows: ContactChannelRow[] = [
      {
        id: "contact-1",
        label: "Blog",
        type: "blog",
        href: "/blog",
        description: "Engineering logs",
        visible: true,
        display_order: 1,
        lang: "en",
      },
    ];
    const groupRows: SystemStackGroupRow[] = [
      {
        id: "group-1",
        name: "Backend",
        description: "",
        display_order: 1,
        lang: "en",
      },
    ];
    const itemRows: SystemStackItemRow[] = [
      {
        id: "item-1",
        group_id: "group-1",
        name: "Java",
        description: "",
        level: "",
        status: "",
        display_order: 1,
      },
    ];

    expect(mapContactRowsToChannels(contactRows)[0]).toMatchObject({
      href: "/blog",
      type: "blog",
      visible: true,
      disabled: false,
    });
    expect(mapStackRowsToGroups(groupRows, itemRows)).toEqual([
      {
        name: { zh: "Backend", en: "Backend" },
        items: ["Java"],
      },
    ]);
  });
});
