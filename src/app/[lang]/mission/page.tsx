"use client";

import { WithLang } from "@/components/WithLang";

// Mission (menu: About > Mission): dark photo band, three numbered mission cards, the vision as a full-width quote band,
// philosophy and pledge, four value cards, three links onward. Vision, philosophy, pledge and values come from does.up.ac.th.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const t = content[lang];
        const a = t.about;
        const next = [
          { href: `/${lang}/history`, label: a.links.history },
          { href: `/${lang}/process`, label: a.links.process },
          { href: `/${lang}/documents/forms`, label: a.links.apply },
        ];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-signing.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">
                  {t.nav.about} / {t.nav.mission}
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.nav.mission}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-page/80">{a.intro}</p>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <h2 className="text-3xl md:text-5xl">{a.missionTitle}</h2>
              <ol className="mt-10 grid gap-4 md:grid-cols-3">
                {a.mission.map((m, i) => (
                  <li key={m} className="flex flex-col rounded-xl border border-ink/10 bg-card p-6 md:p-8">
                    <span aria-hidden="true" className="font-serif text-6xl font-light tabular-nums text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-8 font-serif text-2xl font-light leading-snug">{m}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-forest text-page">
              <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
                <p className="font-mono text-xs tracking-[0.05em] text-page/60">{a.visionTitle}</p>
                <blockquote className="mt-6 max-w-4xl font-serif text-3xl font-light leading-[1.4] md:text-5xl md:leading-[1.35]">“{a.vision}”</blockquote>
                <dl className="mt-12 grid gap-8 border-t border-page/20 pt-8 md:grid-cols-2">
                  <div>
                    <dt className="font-mono text-xs tracking-[0.05em] text-page/60">{a.philosophyLabel}</dt>
                    <dd className="mt-3 font-serif text-2xl font-light leading-snug">{a.philosophy}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs tracking-[0.05em] text-page/60">{a.pledgeLabel}</dt>
                    <dd className="mt-3 font-serif text-2xl font-light leading-snug">{a.pledge}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
              <h2 className="text-3xl md:text-5xl">{a.valuesTitle}</h2>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {a.values.map((v, i) => (
                  <li key={v.title} className="rounded-xl border border-ink/10 bg-card p-6">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ display: "inline-block", background: `var(--color-level-${(i % 3) + 1})` }} />
                    <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-ink-2">{v.desc}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-ink/10 bg-card">
              <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
                <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{a.links.title}</p>
                <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  {next.map((n) => (
                    <li key={n.href}>
                      <a href={n.href} className="group flex items-center justify-between gap-6 py-6 font-serif text-2xl font-light hover:text-accent-ink md:text-3xl">
                        {n.label}
                        <span aria-hidden="true" className="text-ink-3 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-accent-ink">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-10 max-w-3xl text-sm leading-6 text-ink-3">{a.note}</p>
              </div>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
