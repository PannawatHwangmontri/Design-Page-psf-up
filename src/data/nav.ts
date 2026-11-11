import type { content } from "./content";

// เมนูหลักของเว็บ href เป็นเส้นทางหลังภาษา ("" = หน้าแรก) ป้ายชื่ออยู่ใน content[lang].nav
export type NavKey = keyof (typeof content)["th"]["nav"];
export type NavItem = { key: NavKey; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { key: "home", href: "" },
  { key: "assessment", href: "/assessment" },
  {
    key: "publicity",
    href: "/publicity",
    children: [
      { key: "publicityNews", href: "/publicity" },
      {
        key: "outstanding",
        href: "/outstanding",
        children: [
          { key: "outstandingProject", href: "/outstanding/project" },
          { key: "outstandingAnnouncement", href: "/outstanding/announcement" },
          { key: "outstandingProcess", href: "/outstanding/process" },
          { key: "outstandingApply", href: "/outstanding/apply" },
        ],
      },
    ],
  },
  { key: "documents", href: "/documents", children: [{ key: "relatedAnnouncements", href: "/documents" }] },
];

export const outstandingSlugs = ["project", "announcement", "process", "apply"] as const;
export type OutstandingSlug = (typeof outstandingSlugs)[number];
