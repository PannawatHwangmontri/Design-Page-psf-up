import type { Metadata } from "next";
import { Suspense } from "react";
import { LangAttr } from "@/components/LangAttr";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { content } from "@/data/content";
import { langOf, langs } from "@/lib/lang";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

// static (not generateMetadata): reading params there blocks the route; one bilingual title serves /th and /en
export const metadata: Metadata = {
  title: `${content.th.siteName} — ${content.en.siteName}`,
  description: `${content.th.siteOrg} / ${content.en.siteOrg} (demo)`,
};

// Shared frame of every page: top bar + sticky menu, page, footer. The language is the first path segment.
// params is URL data, so it is awaited inside <Suspense> (children, i.e. the pages, render inside it too);
// generateStaticParams still prerenders every /th and /en page.
export default function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={null}>
      <LangFrame params={params}>{children}</LangFrame>
    </Suspense>
  );
}

async function LangFrame({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const lang = await langOf(params);
  return (
    <div lang={lang} className="flex min-h-full flex-1 flex-col">
      <LangAttr lang={lang} />
      <SiteHeader lang={lang} />
      <div className="flex-1">{children}</div>
      <SiteFooter lang={lang} />
    </div>
  );
}
