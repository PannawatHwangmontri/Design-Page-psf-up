"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Site-wide motion, mounted once in the root layout:
// - thin progress bar at the top that follows scroll
// - [data-magnetic] buttons drift slightly toward the pointer and spring back on leave
// Re-runs on route change so elements of the new page get attached. Off with reduced motion.
export function Motion() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bar = document.getElementById("scroll-progress");
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        // hero photo drifts slower than the page: CSS reads --hero-shift (set on <html>, so React-rendered markup is never touched)
        document.documentElement.style.setProperty("--hero-shift", `${Math.min(window.scrollY, 900) * 0.35}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // pointer position on <html> for the hero glow (CSS variables, React markup untouched)
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      };
      const leave = () => {
        el.style.transform = "";
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
        el.style.transform = "";
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      cleanups.forEach((f) => f());
    };
  }, [path]);

  return <div id="scroll-progress" aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />;
}
