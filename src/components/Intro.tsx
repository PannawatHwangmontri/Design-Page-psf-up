"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { content, type Lang } from "@/data/content";

// Opening splash: the university mark and the site name sit on the cream page for a moment,
// then the two halves slide apart from the centre, so the page opens from the middle out to the edges.
// Shown on every full page load. Reduced motion skips it.
export function Intro() {
  const pathname = usePathname();
  const lang: Lang = pathname?.startsWith("/en") ? "en" : "th";
  const t = content[lang];
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => setPhase("out"), reduce ? 0 : 600);
    const done = window.setTimeout(() => setPhase("done"), reduce ? 0 : 1200);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;
  const out = phase === "out";
  const move = "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  // Each half renders a full-width copy of the splash, anchored to its outer edge, so the two halves join at the centre line.
  const splash = (
    <div className="flex h-full w-full items-center justify-center gap-5 px-6 md:gap-8">
      <img src="/brand/logo-up-mark.png" alt="" className="h-20 w-20 shrink-0 object-contain md:h-32 md:w-32" />
      <div className="flex flex-col items-center gap-2 md:gap-3">
        <p className="font-ui text-2xl font-bold text-[#4a1d6b] md:text-5xl">{t.siteName}</p>
        <span className="block h-px w-full bg-gradient-to-r from-transparent via-[#c9a24d] to-transparent" />
        <p className="font-ui text-lg font-semibold text-[#4a1d6b] md:text-3xl">{t.siteOrg}</p>
      </div>
    </div>
  );


  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-page ${move} ${out ? "-translate-x-full" : "translate-x-0"}`}>
        <div className="absolute inset-y-0 left-0 w-[200%]">{splash}</div>
      </div>
      <div className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-page ${move} ${out ? "translate-x-full" : "translate-x-0"}`}>
        <div className="absolute inset-y-0 right-0 w-[200%]">{splash}</div>
      </div>
    </div>
  );
}
