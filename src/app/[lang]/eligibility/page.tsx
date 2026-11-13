"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { WithLang } from "@/components/WithLang";

// Eligibility and criteria (menu: About > Eligibility and criteria). Dark photo band, then a sticky contents column beside five numbered sections.
// Sections 1-4 are summaries of the university's own announcements (each cites its PDF in /docs); section 5 is sample text and is tagged as such.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const c = content[lang];
        const t = c.pages.eligibility;
        const sample = c.pages.faq.sample;
        const sections = [
          { id: "who", title: t.who.title },
          { id: "components", title: t.components.title },
          { id: "levels", title: t.levels.title },
          { id: "equivalence", title: t.equivalence.title },
          { id: "evidence", title: t.evidence.title },
        ];
        const tagCls = "rounded-full border px-3 py-1 text-xs";
        const real = <span className={`${tagCls} border-accent/40 text-accent-ink`}>{t.real}</span>;
        const sampleTag = <span className={`${tagCls} border-ink/15 text-ink-3`}>{sample}</span>;
        const head = (i: number, title: string, tag: React.ReactNode) => (
          <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="font-mono text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="text-3xl md:text-4xl">{title}</h2>
            <span className="self-center">{tag}</span>
          </header>
        );
        const source = (s: { label: string; href: string }) => (
          <p className="mt-6 text-sm text-ink-3">
            {t.source}:{" "}
            <a href={s.href} target="_blank" rel="noreferrer" className="text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
              {s.label}
            </a>
          </p>
        );
        const sec = "scroll-mt-28 border-t border-ink/10 pt-10";
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <Breadcrumb lang={lang} items={[{ label: c.nav.about }, { label: c.nav.eligibility }]} />
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-2xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
              <aside className="min-w-0 md:col-span-3">
                <div className="space-y-6 md:sticky md:top-28">
                  <nav aria-label={t.toc}>
                    <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.toc}</p>
                    <ol className="mt-3 space-y-1">
                      {sections.map((s, i) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="flex gap-3 rounded-lg py-1.5 text-sm text-ink-2 hover:text-accent-ink">
                            <span className="font-mono text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                  <p className="rounded-xl border border-ink/10 bg-card p-4 text-sm leading-6 text-ink-2">{t.notice}</p>
                </div>
              </aside>

              <div className="min-w-0 space-y-16 md:col-span-9">
                <section id="who" className={sec}>
                  {head(0, t.who.title, real)}
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.who.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {t.who.items.map((it) => (
                      <li key={it} className="rounded-full border border-ink/15 bg-card px-4 py-1.5 text-sm">
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-ink-2">{t.who.note}</p>
                  {source(t.who.src)}
                </section>

                <section id="components" className={sec}>
                  {head(1, t.components.title, real)}
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.components.intro}</p>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {t.components.groups.map((g, gi) => (
                      <div key={g.en} className="rounded-3xl border border-ink/10 bg-card p-6">
                        <p className="font-serif text-5xl font-light tabular-nums text-accent-ink">{gi + 1}</p>
                        <h3 className="mt-4 text-xl">{g.title}</h3>
                        <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{g.en}</p>
                        <ul className="mt-5 divide-y divide-ink/10 border-t border-ink/10">
                          {g.items.map((it, ii) => (
                            <li key={it} className="flex gap-3 py-3 text-sm leading-6 text-ink-2">
                              <span className="shrink-0 font-mono text-xs tabular-nums text-ink-3">
                                {gi + 1}.{ii + 1}
                              </span>
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {source(t.components.src)}
                </section>

                <section id="levels" className={sec}>
                  {head(2, t.levels.title, real)}
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.levels.intro}</p>
                  <ol className="mt-8 border-b border-ink/10">
                    {t.levels.items.map((l, i) => (
                      <li key={l.code} className="grid gap-4 border-t border-ink/10 py-8 md:grid-cols-12 md:gap-8">
                        <div className="md:col-span-3">
                          <p className="font-serif text-6xl font-light leading-none tabular-nums">{i + 1}</p>
                          <p className="mt-3 font-mono text-xs tracking-[0.05em] text-ink-3">{l.code}</p>
                        </div>
                        <div className="md:col-span-9">
                          <h3 className="text-2xl">{l.title}</h3>
                          <p className="mt-3 max-w-3xl leading-8 text-ink-2">{l.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  {source(t.levels.src)}
                </section>

                <section id="equivalence" className={sec}>
                  {head(3, t.equivalence.title, real)}
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.equivalence.intro}</p>
                  <div className="mt-8 overflow-x-auto rounded-3xl border border-ink/10 bg-card">
                    <table className="w-full min-w-[28rem] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-ink/10 font-mono text-xs tracking-[0.05em] text-ink-3">
                          {t.equivalence.headers.map((h) => (
                            <th key={h} scope="col" className="px-6 py-4 font-normal">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {t.equivalence.rows.map((r) => (
                          <tr key={r.a}>
                            <td className="px-6 py-5 align-top text-ink-2">{r.a}</td>
                            <th scope="row" className="px-6 py-5 text-left align-top font-medium">
                              {r.b}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 max-w-2xl text-ink-2">{t.equivalence.note}</p>
                  {source(t.equivalence.src)}
                </section>

                <section id="evidence" className={sec}>
                  {head(4, t.evidence.title, sampleTag)}
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t.evidence.intro}</p>
                  <ol className="mt-8 space-y-4">
                    {t.evidence.steps.map((s, i) => (
                      <li key={s} className="flex gap-5 leading-7 text-ink-2">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-xs tabular-nums text-accent-ink">{i + 1}</span>
                        <span className="pt-1">{s}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={`/${lang}/documents/forms`} className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white hover:bg-accent-hover">
                      {t.evidence.ctaForms}
                    </a>
                    <a href={`/${lang}/process`} className="inline-flex h-11 items-center rounded-full border border-ink/20 px-6 text-sm font-medium hover:border-ink/50">
                      {t.evidence.ctaProcess}
                    </a>
                    <a href={`/${lang}/calendar`} className="inline-flex h-11 items-center rounded-full border border-ink/20 px-6 text-sm font-medium hover:border-ink/50">
                      {t.evidence.ctaCalendar}
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
