"use client";

import { WithLang } from "@/components/WithLang";

// FAQ (menu: Help > FAQ): dark photo band, then a sticky count/sample-label column beside an accordion of <details> cards.
// The questions are sample text; the "sample" label sits in the left column and applies to every item.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const c = content[lang];
        const t = c.pages.faq;
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-workshop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <p className="font-mono text-xs tracking-[0.05em] text-page/70">{c.nav.help} / {c.nav.faq}</p>
                <h1 className="mt-5 max-w-3xl text-5xl leading-[1.2] md:text-7xl md:leading-[1.15]">{t.title}</h1>
                <p className="mt-6 max-w-xl text-lg text-page/80">{t.intro}</p>
              </div>
            </section>
            <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
              <div className="md:col-span-4">
                <div className="md:sticky md:top-28">
                  <p className="font-serif text-7xl font-light tabular-nums">{t.items.length}</p>
                  <p className="mt-2 font-mono text-xs tracking-[0.05em] text-ink-3">{t.title}</p>
                  <span className="mt-6 inline-block rounded-full border border-ink/15 px-2 py-0.5 text-xs text-ink-3">{t.sample}</span>
                  <p className="mt-4 text-sm text-ink-3">{t.note}</p>
                </div>
              </div>

              <ul className="space-y-3 md:col-span-8">
                {t.items.map((it, i) => (
                  <li key={it.q}>
                    <details className="group rounded-xl border border-ink/10 bg-card px-6 py-5 md:px-8 md:py-6">
                      <summary className="flex cursor-pointer list-none items-start gap-5 [&::-webkit-details-marker]:hidden">
                        <span aria-hidden="true" className="mt-1.5 font-mono text-xs tabular-nums text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-serif text-xl font-light leading-snug md:text-2xl">{it.q}</span>
                        <span aria-hidden="true" className="mt-1 shrink-0 text-2xl leading-none text-ink-3 transition-transform duration-150 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 pl-9 text-lg leading-8 text-ink-2">{it.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        );
      }}
    </WithLang>
  );
}
