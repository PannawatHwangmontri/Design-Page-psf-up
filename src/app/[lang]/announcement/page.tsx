"use client";

import Link from "next/link";
import { PageFrame } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";

// Announcements list (home "view all"): every announcement, newest first as ordered in the data. Each row opens /announcement/[id].
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, announcements }) => {
        const t = content[lang].pages.announcement;
        return (
          <PageFrame title={t.title} intro={t.intro}>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {announcements.map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-4">
                  <span className="w-28 shrink-0 text-sm tabular-nums text-ink-3">{lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}</span>
                  <Link href={`/${lang}/announcement/${a.id}`} className="min-w-0 flex-1 text-ink hover:text-accent-ink">
                    {a.title[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </PageFrame>
        );
      }}
    </WithLang>
  );
}
