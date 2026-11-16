"use client";

import { useEffect, useState } from "react";

// Opening panel: a full-screen purple sheet with the university mark slides up to reveal the page.
// Shown on every full page load. It starts at first paint and does not wait for the site to finish loading.
export function Intro() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const leave = window.setTimeout(() => setPhase("out"), 1100);
    const done = window.setTimeout(() => setPhase("done"), 2100);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-forest transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        phase === "out" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <img src="/brand/logo-up-mark.png" alt="" width={96} height={96} className="h-24 w-24 object-contain" />
    </div>
  );
}
