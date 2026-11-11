import { notFound } from "next/navigation";
import type { Lang } from "@/data/content";

export const langs: Lang[] = ["th", "en"];

// params.lang comes from the [lang] segment; anything else is a 404
export async function langOf(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (lang !== "th" && lang !== "en") notFound();
  return lang;
}

export const fmtDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
