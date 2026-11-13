"use client";

import { useEffect, useRef } from "react";

// A number that counts up from 0 once it scrolls into view. The server renders the final value (no flash without JS);
// the effect writes into the DOM directly. Off when the user prefers reduced motion.
export function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = "0";
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = () => {
          const p = Math.min((performance.now() - t0) / duration, 1);
          el.textContent = String(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        // safety net: if frames are throttled (background tab) the final value still lands
        timer = setTimeout(() => (el.textContent = String(value)), duration + 200);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      el.textContent = String(value);
    };
  }, [value, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
