"use client";

import { useEffect } from "react";
import type { Lang } from "@/data/content";

// root layout is shared by both languages, so <html lang> is set here
export function LangAttr({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
