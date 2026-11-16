"use client";

import Link from "next/link";
import { downloadBtn } from "@/components/DetailPage";
import { WithLang } from "@/components/WithLang";

// Outstanding teaching lecturers: one scrollable page (project, announcements, steps, application) + a comparison with PSF.
// The menu items link to the anchors below. Dark photo band on top, then the sections. The text for the project, steps and comparison is
// sample text (content.ts, marked "sample" in the band); TODO: real text from the project owner.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, announcements }) => {
        const t = content[lang];
        const o = t.pages.outstanding;
        const sec = "scroll-mt-28 border-t border-ink/10 pt-10 md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:gap-12";
        const h2 = "text-xl font-medium";
        const anchors = [
          { id: "project", label: t.nav.outstandingProject },
          { id: "announcement", label: t.nav.outstandingAnnouncement },
          { id: "process", label: t.nav.outstandingProcess },
          { id: "apply", label: t.nav.outstandingApply },
        ];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-team.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <h1 className="max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{o.title}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-page/80">{o.intro}</p>
                <span className="mt-6 inline-block rounded-full border border-page/30 px-3 py-1 text-xs text-page/80">{t.pages.faq.sample}</span>
              </div>
            </section>

            <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <nav aria-label={o.title} className="flex flex-wrap gap-2">
                {anchors.map((a) => (
                  <a key={a.id} href={`#${a.id}`} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink-2 hover:bg-accent/10 hover:text-accent-ink">
                    {a.label}
                  </a>
                ))}
              </nav>

              <div className="mt-12 space-y-12">
              <section id="project" className={sec}>
                <h2 className={h2}>{t.nav.outstandingProject}</h2>
                <p className="mt-4 max-w-3xl leading-8 text-ink-2 md:mt-0">{o.projectBody}</p>
              </section>

              <section id="compare" className={sec}>
                <h2 className={h2}>{o.compare.title}</h2>
                <div className="mt-4 overflow-x-auto md:mt-0">
                  <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/15">
                        {o.compare.headers.map((h) => (
                          <th key={h} className="px-4 py-3 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {o.compare.rows.map((r) => (
                        <tr key={r.label}>
                          <th scope="row" className="px-4 py-3 align-top font-medium text-ink-2">
                            {r.label}
                          </th>
                          <td className="px-4 py-3 align-top text-ink-2">{r.a}</td>
                          <td className="px-4 py-3 align-top text-ink-2">{r.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="announcement" className={sec}>
                <h2 className={h2}>{t.nav.outstandingAnnouncement}</h2>
                <div className="mt-4 md:mt-0">
                  <p className="text-ink-2">{o.announcementBody}</p>
                  <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                    {announcements.slice(0, 3).map((a) => (
                      <li key={a.id} className="flex gap-4 py-3">
                        <span className="w-24 shrink-0 text-sm tabular-nums text-ink-3">{lang === "th" ? `พ.ศ. ${a.year}` : `B.E. ${a.year}`}</span>
                        <Link href={`/${lang}/announcement/${a.id}`} className="hover:text-accent-ink">
                          {a.title[lang]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/announcement`} className="mt-4 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
                    {o.announcementLink} →
                  </Link>
                </div>
              </section>

              <section id="process" className={sec}>
                <h2 className={h2}>{t.nav.outstandingProcess}</h2>
                <ol className="mt-4 space-y-4 md:mt-0">
                  {o.steps.map((s, i) => (
                    <li key={s} className="flex gap-4 leading-7 text-ink-2">
                      <span className="w-8 shrink-0 text-sm tabular-nums text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </section>

              <section id="apply" className={sec}>
                <h2 className={h2}>{t.nav.outstandingApply}</h2>
                <div className="mt-4 md:mt-0">
                  <p className="text-ink-2">{o.applyBody}</p>
                  {/* TODO: ไฟล์ใบสมัครจริง (ตอนนี้ลิงก์ชั่วคราว) */}
                  <a href="#" className={downloadBtn}>
                    {o.download}
                  </a>
                </div>
              </section>
              </div>
            </div>
          </main>
        );
      }}
    </WithLang>
  );
}
