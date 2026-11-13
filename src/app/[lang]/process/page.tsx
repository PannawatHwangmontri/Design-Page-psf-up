"use client";

import Link from "next/link";
import { WithLang } from "@/components/WithLang";

// PSF process (menu: About > PSF process). Dark photo band, then sticky sample note (left) and the four steps as a vertical timeline (right).
// Step text is sample text from content.ts (process.tiles); every tile on the home page links here.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <WithLang params={params}>
      {(lang, { content }) => {
        const t = content[lang];
        return (
          <main>
            <section className="relative isolate overflow-hidden bg-forest text-page">
              <img src="/img/does/activity-up-backdrop.webp" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
              <div className="mx-auto max-w-6xl px-4 pb-14 pt-44 md:px-8 md:pb-20">
                <h1 className="max-w-4xl text-4xl leading-[1.25] md:text-6xl md:leading-[1.2]">{t.process.title}</h1>
              </div>
            </section>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
              <aside className="md:col-span-4 lg:col-span-3">
                <div className="space-y-3 text-sm leading-7 text-ink-2 md:sticky md:top-28">
                  <div className="space-y-3 rounded-xl border border-ink/10 bg-card p-5">
                    {t.detail.process.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <Link href={`/${lang}#process`} className="inline-block text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink">
                    {t.detail.process.back}
                  </Link>
                </div>
              </aside>

              <ol className="relative md:col-span-8 lg:col-span-9">
                <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-ink/15" />
                {t.process.tiles.map((s, i) => (
                  <li key={s.title} className="relative pb-12 pl-16 last:pb-0">
                    <span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full border border-accent bg-card font-mono text-sm tabular-nums text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="rounded-xl border border-ink/10 bg-card p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl">{s.title}</h2>
                      <p className="mt-3 text-lg leading-8 text-ink-2">{s.desc}</p>
                      <Link href={`/${lang}${s.href}`} className="mt-5 inline-block text-sm font-medium text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink">
                        {s.link} →
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </main>
        );
      }}
    </WithLang>
  );
}
