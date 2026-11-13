"use client";

import Link from "next/link";
import { useState } from "react";
import { PageFrame } from "@/components/DetailPage";
import { Placeholder } from "@/components/Placeholder";
import { WithLang } from "@/components/WithLang";
import type { Lang } from "@/data/content";
import { fmtDate } from "@/lib/lang";
import type { SiteData } from "@/lib/site";

const PER_PAGE = 9;

// News list (home "view all"): every news item sorted newest first, 9 per page with previous/next. Each card opens /news/[id].
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang, site) => <NewsList lang={lang} site={site} />}</WithLang>;
}

function NewsList({ lang, site }: { lang: Lang; site: SiteData }) {
  const t = site.content[lang];
  const [page, setPage] = useState(0);
  const sorted = [...site.news].sort((a, b) => b.date.localeCompare(a.date));
  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const shown = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const go = (i: number) => {
    setPage(i);
    document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
  };
  const btn = "inline-flex h-11 items-center rounded-full border border-ink/20 px-6 text-sm font-medium hover:border-ink/50 disabled:pointer-events-none disabled:opacity-40";

  return (
    <PageFrame title={t.pages.news.title} intro={t.pages.news.intro}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((n) => (
          <li key={n.id}>
            <Link href={`/${lang}/news/${n.id}`} className="group block h-full overflow-hidden rounded-xl border border-ink/10 bg-card transition-colors hover:border-accent/40">
              {n.image ? (
                <img src={n.image} alt={t.news.imageAlt} className="aspect-[16/10] w-full object-cover" />
              ) : (
                <Placeholder label={t.news.imageAlt} className="aspect-[16/10] bg-gradient-to-br from-tint to-raised" />
              )}
              <div className="p-5">
                <time dateTime={n.date} className="text-xs tabular-nums text-ink-3">
                  {fmtDate(n.date, lang)}
                </time>
                <h2 className="mt-2 line-clamp-2 text-lg font-medium group-hover:text-accent-ink">{n.title[lang]}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-2">{n.excerpt[lang]}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <button type="button" disabled={page === 0} onClick={() => go(page - 1)} className={btn}>
            ← {t.passers.prev}
          </button>
          <span className="font-mono text-sm tabular-nums text-ink-3" aria-live="polite">
            {page + 1} / {pages}
          </span>
          <button type="button" disabled={page === pages - 1} onClick={() => go(page + 1)} className={btn}>
            {t.passers.next} →
          </button>
        </nav>
      )}
    </PageFrame>
  );
}
