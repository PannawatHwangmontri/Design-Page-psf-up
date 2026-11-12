import type { Lang } from "./content";

// Field and column definitions of the admin forms. Labels are Thai/English pairs, so the admin UI follows the page language.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type L = { th: string; en: string };
export type Item = any;
export type FieldType = "text" | "area" | "number" | "date" | "select" | "year" | "yearPair" | "level" | "image" | "file";
export type Field = {
  path: string; // dot path inside the item, e.g. "title.th"
  label: L;
  type: FieldType;
  options?: { value: string; label: L }[]; // select
  numeric?: boolean; // select: store a number
  optional?: boolean;
};
export type Column = { label: L; get: (item: Item, lang: Lang) => string };
export type ListSchema = { fields: Field[]; columns: Column[]; blank: () => Item };

const t = (th: string, en: string): L => ({ th, en });
const pair = (path: string, label: L, type: "text" | "area" = "text"): Field[] => [
  { path: `${path}.th`, label: t(`${label.th} (ไทย)`, `${label.en} (Thai)`), type },
  { path: `${path}.en`, label: t(`${label.th} (อังกฤษ)`, `${label.en} (English)`), type },
];
const emptyPair = () => ({ th: "", en: "" });
const today = () => new Date().toISOString().slice(0, 10);

const nameField = pair("name", t("ชื่อ-นามสกุล", "Name"));
const unitField = pair("unit", t("คณะ/หน่วยงาน", "Faculty / unit"));
const levelField: Field = {
  path: "level",
  label: t("ระดับ PSF", "PSF level"),
  type: "level",
  options: [1, 2, 3].map((n) => ({ value: String(n), label: t(`ระดับ ${n}`, `Level ${n}`) })),
};
const photoField: Field = { path: "photo", label: t("รูปถ่าย", "Photo"), type: "image", optional: true };
const personBlank = () => ({ name: emptyPair(), unit: emptyPair(), level: { th: "ระดับ 1", en: "Level 1" }, year: emptyPair() });

const cols = {
  name: { label: t("ชื่อ-นามสกุล", "Name"), get: (i: Item, l: Lang) => i.name?.[l] ?? "" },
  unit: { label: t("คณะ/หน่วยงาน", "Faculty / unit"), get: (i: Item, l: Lang) => i.unit?.[l] ?? "" },
  level: { label: t("ระดับ", "Level"), get: (i: Item, l: Lang) => i.level?.[l] ?? "" },
  title: { label: t("หัวข้อ", "Title"), get: (i: Item, l: Lang) => i.title?.[l] ?? "" },
  year: { label: t("ปี", "Year"), get: (i: Item, l: Lang) => (l === "th" ? String(i.year) : String(i.year - 543)) },
  file: { label: t("ไฟล์", "File"), get: (i: Item, l: Lang) => (i.file && i.file !== "#" ? "✓" : l === "th" ? "ไม่มี" : "none") },
};

export const schemas = {
  news: {
    fields: [
      { path: "date", label: t("วันที่", "Date"), type: "date" },
      ...pair("title", t("หัวข้อข่าว", "Title")),
      ...pair("excerpt", t("ข้อความย่อ", "Excerpt"), "area"),
      { path: "image", label: t("ภาพข่าว", "Image"), type: "image", optional: true },
      { path: "file", label: t("ไฟล์แนบ (PDF)", "Attachment (PDF)"), type: "file", optional: true },
    ],
    columns: [{ label: t("วันที่", "Date"), get: (i) => i.date }, cols.title],
    blank: () => ({ date: today(), title: emptyPair(), excerpt: emptyPair() }),
  },
  announcements: {
    fields: [
      { path: "year", label: t("ปี (พ.ศ.)", "Year (B.E.)"), type: "year" },
      ...pair("title", t("ชื่อประกาศ", "Title"), "area"),
      { path: "file", label: t("ไฟล์ประกาศ (PDF)", "Announcement file (PDF)"), type: "file", optional: true },
    ],
    columns: [cols.year, cols.title],
    blank: () => ({ year: 2569, href: "/announcement", title: emptyPair() }),
  },
  passers: {
    fields: [
      ...nameField,
      ...unitField,
      levelField,
      { path: "year", label: t("ปีที่ผ่าน (พ.ศ.)", "Year passed (B.E.)"), type: "yearPair" },
      photoField,
    ],
    columns: [cols.name, cols.unit, cols.level, { label: t("ปีที่ผ่าน", "Year"), get: (i, l) => i.year?.[l] ?? "" }],
    blank: personBlank,
  },
  // people inside a year of the publicity tab: the year comes from the year tab, so it has no field
  people: {
    fields: [...nameField, ...unitField, levelField, photoField],
    columns: [cols.name, cols.unit, cols.level],
    blank: personBlank,
  },
  events: {
    fields: [
      { path: "round", label: t("รอบ", "Round"), type: "select", numeric: true, options: [1, 2].map((n) => ({ value: String(n), label: t(`รอบที่ ${n}`, `Round ${n}`) })) },
      {
        path: "type",
        label: t("ประเภทกิจกรรม", "Activity"),
        type: "select",
        options: [
          { value: "apply", label: t("รับสมัคร", "Applications") },
          { value: "assess", label: t("ประเมิน", "Assessment") },
          { value: "result", label: t("ประกาศผล", "Results") },
        ],
      },
      { path: "start", label: t("วันที่เริ่ม", "Start date"), type: "date" },
      { path: "end", label: t("วันที่สิ้นสุด", "End date"), type: "date", optional: true },
    ],
    columns: [
      { label: t("รอบ", "Round"), get: (i) => String(i.round) },
      { label: t("ประเภท", "Activity"), get: (i, l) => ({ apply: t("รับสมัคร", "Applications"), assess: t("ประเมิน", "Assessment"), result: t("ประกาศผล", "Results") })[i.type as "apply"]?.[l] ?? i.type },
      { label: t("เริ่ม", "Start"), get: (i) => i.start },
      { label: t("สิ้นสุด", "End"), get: (i) => i.end ?? "" },
    ],
    blank: () => ({ round: 1, type: "apply", start: today() }),
  },
  calendarDocs: {
    fields: [{ path: "year", label: t("ปี (พ.ศ.)", "Year (B.E.)"), type: "year" }, ...pair("title", t("ชื่อเอกสาร", "Title"), "area"), { path: "file", label: t("ไฟล์ PDF", "PDF file"), type: "file" }],
    columns: [cols.year, cols.title, cols.file],
    blank: () => ({ year: 2569, title: emptyPair(), file: "#" }),
  },
  forms: {
    fields: [
      ...pair("title", t("ชื่อแบบฟอร์ม", "Form name")),
      { path: "file", label: t("ไฟล์ PDF", "PDF file"), type: "file" },
      { path: "updated", label: t("วันที่อัปเดต", "Last updated"), type: "date" },
    ],
    columns: [cols.title, cols.file, { label: t("อัปเดต", "Updated"), get: (i) => i.updated ?? "" }],
    blank: () => ({ title: emptyPair(), file: "#", updated: today() }),
  },
} satisfies Record<string, ListSchema>;

// Groups of the general-text tab: each lists the content paths it edits (th and en are edited side by side)
export const contentGroups: { key: string; paths: string[] }[] = [
  { key: "general", paths: ["siteName", "siteOrg", "logo", "menu", "contact", "footer"] },
  { key: "nav", paths: ["nav"] },
  { key: "home", paths: ["hero", "process", "about", "news", "passers", "pages.news", "pages.announcement"] },
  { key: "detail", paths: ["detail"] },
  { key: "assessment", paths: ["pages.assessment", "pages.calendar"] },
  { key: "publicity", paths: ["pages.publicity"] },
  { key: "outstanding", paths: ["pages.outstanding"] },
  { key: "documents", paths: ["pages.documents", "pages.forms"] },
  { key: "history", paths: ["pages.history"] },
];

export const BE_YEARS = Array.from({ length: 16 }, (_, i) => 2563 + i);
