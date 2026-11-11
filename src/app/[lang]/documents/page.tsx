import Link from "next/link";
import { PageFrame } from "@/components/DetailPage";
import { content } from "@/data/content";
import { announcements } from "@/data/mock";
import { fmtDate } from "@/lib/lang";
import { WithLang } from "@/components/WithLang";

// Documents menu: only "related announcements", all of them (the old regulation/order items were dropped)
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang) => {
          const t = content[lang].pages.documents;
          return (
            <PageFrame title={t.title} intro={t.intro}>
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <Link href={`/${lang}${a.href}`} className="block py-4 hover:text-accent-ink">
                      <time dateTime={a.date} className="text-xs tabular-nums text-ink-3">
                        {fmtDate(a.date, lang)}
                      </time>
                      <span className="mt-1 block font-medium">{a.title[lang]}</span>
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
