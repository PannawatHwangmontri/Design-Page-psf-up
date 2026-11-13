import type { content } from "./content";

// เมนูหลักของเว็บ href เป็นเส้นทางหลังภาษา ("" = หน้าแรก) ป้ายชื่ออยู่ใน content[lang].nav
export type NavKey = keyof (typeof content)["th"]["nav"];
export type NavItem = { key: NavKey; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { key: "home", href: "" },
  {
    key: "publicity",
    href: "/publicity",
    children: [
      { key: "publicityNews", href: "/publicity" },
      { key: "calendar", href: "/calendar" },
      {
        key: "outstanding",
        href: "/outstanding",
        children: [
          { key: "submitReview", href: "/outstanding#apply" },
          { key: "outstandingAnnouncement", href: "/outstanding#announcement" },
          { key: "certify", href: "/outstanding#process" },
        ],
      },
    ],
  },
  {
    key: "about",
    href: "/mission",
    children: [
      { key: "history", href: "/history" },
      { key: "mission", href: "/mission" },
      { key: "eligibility", href: "/eligibility" },
      { key: "processPage", href: "/process" },
      { key: "assessment", href: "/assessment" },
    ],
  },
  {
    key: "documents",
    href: "/documents",
    children: [
      { key: "otherForms", href: "/documents/forms" },
      { key: "manuals", href: "/documents/manuals" },
    ],
  },
  {
    key: "help",
    href: "/faq",
    children: [
      { key: "faq", href: "/faq" },
      { key: "contact", href: "/contact" },
    ],
  },
];
