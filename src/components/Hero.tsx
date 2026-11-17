"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { roundStatus } from "@/lib/rounds";
import { ripple } from "./ripple";

// Home hero: headline and two actions on the left, the round card on the right, the campus photo behind.
export function Hero({ lang }: { lang: Lang }) {
  const { content, assessmentCalendars } = useSite();
  const t = content[lang];
  // read the clock once on mount; the round text can differ between server and browser, so hydration warnings are muted
  const [now] = useState(() => Date.now());
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const cal = [...assessmentCalendars].sort((a, b) => b.year - a.year)[0];
  const round = roundStatus(cal ? cal.events : [], today.getTime());
  const loc = lang === "th" ? "th-TH" : "en-GB";
  const dateLong = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
  const fill = (tpl: string, v: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-[min(100svh,720px)] flex-col overflow-hidden bg-forest text-page">
      <img src="/img/commons/ce-building-dusk.webp" alt={t.hero.photoAlt} className="hero-drift absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/75 to-forest/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-transparent to-forest/50" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-5 pb-12 pt-28 md:grid-cols-12 md:gap-12 md:px-8 md:pb-16 md:pt-36">
        <div className="md:col-span-7">
          <p className="flex items-center gap-3 text-base font-medium text-[#efe6f6]">
            <span aria-hidden="true" className="h-px w-8 bg-[#c79bef]" />
            {t.hero.seqAEyebrow}
          </p>
          <h1 id="hero-title" className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight md:mt-6 md:text-7xl md:leading-[1.05]">
            {t.hero.titleLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-page/90 md:mt-6">{t.hero.seqADesc}</p>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
            <a href={`/${lang}/documents/forms`} data-magnetic onClick={ripple} className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-white transition-colors hover:bg-accent-hover md:h-13 md:px-8">
              {t.nav.apply}
            </a>
            <a href={`/${lang}/calendar`} className="inline-flex h-12 items-center rounded-full border border-page/50 px-7 text-base font-medium text-page transition-colors hover:bg-page/10 md:h-13 md:px-8">
              {t.hero.heroCalendar}
            </a>
          </div>
        </div>

        <div suppressHydrationWarning className="md:col-span-5 md:col-start-8">
          <div className="rounded-[24px] border border-page/15 bg-forest/70 p-6 backdrop-blur-md md:p-9">
            {round.kind === "none" ? (
              <>
                <p className="text-2xl font-bold">{t.home.heroNone}</p>
                <a href={`/${lang}/calendar`} className="mt-6 inline-flex min-h-11 items-center text-base font-medium text-page underline decoration-page/50 underline-offset-4 hover:decoration-page">
                  {t.home.allCalendar}
                </a>
              </>
            ) : (
              <>
                <p className="text-base text-page/85">{round.kind === "open" ? fill(t.home.roundOpenLabel, { r: round.round }) : fill(t.home.heroRound, { r: round.round })}</p>
                <p className="mt-2 text-6xl font-bold leading-none tabular-nums md:mt-3 md:text-7xl">{round.days}</p>
                <p className="mt-3 text-lg md:mt-4">
                  {fill(t.home.heroDays, { n: round.days })} · {fill(round.kind === "open" ? t.home.heroCloses : t.home.heroOpens, { date: dateLong(round.date) })}
                </p>
                {round.kind === "open" && (
                  <div
                    role="progressbar"
                    aria-label={fill(t.home.progressLabel, { x: round.elapsed, y: round.total })}
                    aria-valuemin={0}
                    aria-valuemax={round.total}
                    aria-valuenow={round.elapsed}
                    className="mt-5 h-1.5 overflow-hidden rounded-full bg-page/20"
                  >
                    <div className="h-full rounded-full bg-[#c79bef]" style={{ width: `${round.total ? (round.elapsed / round.total) * 100 : 0}%` }} />
                  </div>
                )}
                <a href={`/${lang}/documents/forms`} className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-white transition-colors hover:bg-accent-hover md:mt-8">
                  {t.home.applyNow}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="absolute bottom-3 right-4 z-0 text-[13px] text-page/80">{t.home.heroCredit}</p>
    </section>
  );
}
