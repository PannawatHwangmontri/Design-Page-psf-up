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

// size of an uploaded file stored as a data URL ("" for the placeholder link)
export function fileSize(dataUrl: string | undefined) {
  if (!dataUrl?.startsWith("data:")) return "";
  const bytes = Math.round(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
