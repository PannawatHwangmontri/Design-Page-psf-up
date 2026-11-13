"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { WithLang } from "@/components/WithLang";
import { fileSize, fmtDate } from "@/lib/lang";

// Forms (menu: Documents > Forms): PDF downloads. Dark photo band, then a sticky intro column beside one card per form.
// Files are placeholders until the real PDFs are supplied.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content, forms }) => {
        const c = content[lang];
        const t = c.pages.forms;
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <Breadcrumb lang={lang} items={[{ label: c.nav.documents }, { label: c.nav.otherForms }]} />
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
              <div className="md:col-span-4">
                <div className="md:sticky md:top-28">
                  <p className="font-serif text-7xl font-light tabular-nums">{forms.length}</p>
                  <p className="mt-2 font-mono text-xs tracking-[0.05em] text-ink-3">{t.title}</p>
                  <p className="mt-8 text-ink-2">{c.pages.assessment.formDesc}</p>
                  <a
                    href={`/${lang}/calendar`}
                    className="mt-6 inline-block font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink"
                  >
                    {c.pages.calendar.toAssessment} →
                  </a>
                </div>
              </div>

              <ul className="space-y-4 md:col-span-8">
                {forms.map((f, i) => {
                  const meta = [fileSize(f.file) && `${t.size} ${fileSize(f.file)}`, f.updated && `${t.updated} ${fmtDate(f.updated, lang)}`].filter(Boolean).join(" · ");
                  return (
                    <li key={f.id} className="flex flex-col gap-6 rounded-xl border border-ink/10 bg-card p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                      <div className="flex min-w-0 gap-6">
                        <span aria-hidden="true" className="font-serif text-4xl font-light tabular-nums text-accent-ink/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-serif text-2xl font-light leading-snug">{f.title[lang]}</h2>
                          {meta && <p className="mt-2 font-mono text-xs tracking-[0.05em] text-ink-3">{meta}</p>}
                        </div>
                      </div>
                      <a
                        href={f.file}
                        download
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white hover:bg-accent-hover"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
                        </svg>
                        {t.download}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
