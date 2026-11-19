"use client";

import { useSyncExternalStore } from "react";
import { content, type Lang } from "@/data/content";

// Light / dark switch in the header. No stored choice = follow the device (CSS media query in globals.css).
// The choice is kept in localStorage so the next visit opens in the same mode (see the script in layout.tsx).
const KEY = "psf-theme";
const EVENT = "psf-theme-change";
const media = "(prefers-color-scheme: dark)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(media);
  window.addEventListener(EVENT, cb);
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener("change", cb);
  };
};
const isDark = () => {
  const m = document.documentElement.dataset.theme;
  return m ? m === "dark" : window.matchMedia(media).matches;
};

export function ThemeToggle({ lang }: { lang: Lang }) {
  const t = content[lang].theme;
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const mode = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = mode;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      // private mode or blocked storage: the switch still works for this page view
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const label = dark ? t.toLight : t.toDark;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-raised hover:text-accent-ink"
    >
      {dark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
