"use client";

import { notFound, useParams } from "next/navigation";
import type { Lang } from "@/data/content";
import { useSite, type SiteData } from "@/lib/site";

type Render = (lang: Lang, site: SiteData) => React.ReactNode;

// Every page runs on the client so it can show the data edited in /admin (localStorage).
// The language comes from useParams(), not use(params): re-rendering after a store update must not suspend again.
// `params` is accepted only so the pages keep their signature. Every /th and /en page is still prerendered.
export function WithLang({ children }: { params?: unknown; children: Render }) {
  const { lang } = useParams<{ lang: string }>();
  const site = useSite();
  if (lang !== "th" && lang !== "en") notFound();
  return children(lang, site);
}
