"use client";

import Link from "next/link";
import { PageFrame } from "@/components/DetailPage";
import { Placeholder } from "@/components/Placeholder";
import { WithLang } from "@/components/WithLang";
import { fmtDate } from "@/lib/lang";

// News list (home "view all"): every news item, newest first as ordered in the data. Each card opens /news/[id].
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, news }) => {
        const t = content[lang];
        return (
          <PageFrame title={t.pages.news.title} intro={t.pages.news.intro}>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
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
                      <h2 className="mt-2 text-lg font-medium group-hover:text-accent-ink">{n.title[lang]}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-ink-2">{n.excerpt[lang]}</p>
                    </div>
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
