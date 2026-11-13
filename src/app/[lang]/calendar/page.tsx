"use client";

import Link from "next/link";
import { WithLang } from "@/components/WithLang";

// ปฏิทิน (เมนู ประชาสัมพันธ์ > ปฏิทิน): รายการเอกสาร PDF ต่อปี มีปุ่มดาวน์โหลด และลิงก์ไปปฏิทินกิจกรรมที่หน้า /assessment
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, calendarDocs }) => {
        const t = content[lang];
        const p = t.pages.calendar;
        return (
          <main>
            <section className="bg-forest text-page">
              <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
                <p className="text-sm text-page/70">
                  {t.nav.publicity} / {t.nav.calendar}
                </p>
                <h1 className="mt-2 text-3xl font-medium md:text-4xl">{t.nav.calendar}</h1>
                <p className="mt-3 max-w-2xl text-page/85">{p.intro}</p>
              </div>
            </section>
            <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {calendarDocs.map((d) => {
                  const has = !!d.file && d.file !== "#";
                  return (
                    <li key={d.id} className="flex flex-wrap items-center gap-4 py-4">
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-ink">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                          <path d="M14 3v6h6M8 13h8M8 17h8" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        {d.title[lang]}
                        <span className="ml-3 rounded-full bg-accent/10 px-3 py-0.5 text-sm font-medium tabular-nums text-accent-ink">{lang === "th" ? d.year : d.year - 543}</span>
                      </span>
                      {has ? (
                        <a href={d.file} download className="inline-flex h-10 shrink-0 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover">
                          {p.download}
                        </a>
                      ) : (
                        <span className="shrink-0 text-sm text-ink-3">{p.noFile}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Link href={`/${lang}/assessment`} className="mt-8 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
                {p.toAssessment} →
              </Link>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
