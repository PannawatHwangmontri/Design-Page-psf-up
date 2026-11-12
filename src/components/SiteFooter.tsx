"use client";

import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

export function SiteFooter({ lang }: { lang: Lang }) {
  const { content } = useSite();
  return (
    <footer className="bg-accent py-8 text-center text-sm text-white/90">
      <div className="mx-auto max-w-6xl px-4 md:px-8">{content[lang].footer}</div>
    </footer>
  );
}
