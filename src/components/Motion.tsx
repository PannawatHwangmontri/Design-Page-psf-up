"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Site-wide motion, mounted once in the root layout:
// - thin progress bar at the top that follows scroll
// - [data-magnetic] buttons drift slightly toward the pointer and spring back on leave
// Re-runs on route change so elements of the new page get attached. Off with reduced motion.
export function Motion() {
  const path = usePathname();

  // reveal groups on every page: each [data-reveal] / [data-stagger] / [data-lines] plays once when it scrolls into view.
  // Attached only after the first load (+200 ms) so no attribute is written while React is still hydrating the page.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    // React attaches a __reactFiber$ key to every DOM node it has hydrated. Writing data-in to a node before that
    // is exactly what causes the hydration mismatch, so wait (frame by frame, capped) until every target is hydrated.
    const hydrated = (el: HTMLElement) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
    let tries = 0;
    let retry = 0;
    const start = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>("[data-stagger],[data-lines],[data-reveal]"));
      const ready = all.filter(hydrated);
      if (ready.length < all.length && tries < 180) {
        tries++;
        retry = requestAnimationFrame(start);
        return;
      }
      if (reduced) {
        ready.forEach((el) => (el.dataset.in = ""));
        return;
      }
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            (e.target as HTMLElement).dataset.in = "";
            io?.unobserve(e.target);
          }),
        { threshold: 0.1 },
      );
      ready.forEach((el) => {
        if (!el.dataset.in) io?.observe(el);
      });
    };
    // Streamed (Suspense) parts of the page can still be hydrating after the load event. Two animation frames
    // after load give React a chance to finish, so [data-in] is written only once the page is hydrated.
    let raf1 = 0;
    let raf2 = 0;
    const onLoad = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(start);
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(retry);
      io?.disconnect();
    };
  }, [path]);

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
      cancelAnimationFrame(frame);
      cleanups.forEach((f) => f());
    };
  }, [path]);

  return <div id="scroll-progress" aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />;
}
