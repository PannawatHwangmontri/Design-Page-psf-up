"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { nav, type NavItem } from "@/data/nav";
import { Placeholder } from "./Placeholder";

function Icon({ children, size = 16 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const caret = (dir: "down" | "right") => (
  <Icon size={14}>
    <path d={dir === "down" ? "m6 9 6 6 6-6" : "m9 6 6 6-6 6"} />
  </Icon>
);

const link = "block rounded-full px-3 py-2 text-sm text-ink-2 hover:text-accent-ink";
// display:none (not visibility) so closed panels add no horizontal scroll width
const panel = "absolute z-20 hidden min-w-64 rounded-xl border border-ink/10 bg-card p-1";
const panelItem = "flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-accent/10 hover:text-accent-ink";

// Floating capsule menu with the language switch. Contact details live in the footer. Menu = src/data/nav.ts.
export function SiteHeader({ lang }: { lang: Lang }) {
  const t = useSite().content[lang];
  const pathname = usePathname();
  const base = `/${lang}`;
  const href = (h: string) => `${base}${h}`;
  const active = (item: NavItem) => (item.href === "" ? pathname === base : pathname.startsWith(href(item.href)));
  const swap = (l: Lang) => pathname.replace(/^\/(th|en)/, `/${l}`);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const movePill = (e: { currentTarget: HTMLElement }) =>
    setPill({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });
  const [menu, setMenu] = useState(false);
  // one top-level dropdown open at a time; leaving the nav or pressing Esc closes it
  const [open, setOpen] = useState<string | null>(null);

  // mobile: every level as one indented list
  const mobileList = (items: NavItem[], depth = 0): React.ReactNode =>
    items.map((item) => (
      <li key={`${item.key}-${item.href}`}>
        <Link
          href={href(item.href)}
          onClick={() => setMenu(false)}
          style={{ paddingLeft: 12 + depth * 16 }}
          className={`block py-2 pr-3 text-sm hover:text-accent-ink ${depth === 0 ? "font-medium text-ink" : "text-ink-2"}`}
        >
          {t.nav[item.key]}
        </Link>
        {item.children && <ul>{mobileList(item.children, depth + 1)}</ul>}
      </li>
    ));

  return (
    // zero-height sticky wrapper: the capsule floats over the page (and over the hero image) without pushing content down
    <div className="sticky top-0 z-30 h-0">
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8">
        <header className="rounded-[30px] border border-ink/10 bg-page/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 pl-5 pr-3 md:gap-6">
            <Link href={base} className="flex min-w-0 items-center gap-3">
              <Placeholder label={t.logo} className="h-8 w-8 shrink-0 rounded-lg" />
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-base font-medium text-ink">{t.siteName}</span>
                <span className="block font-mono text-[11px] tracking-[0.05em] text-ink-3">{t.siteOrg}</span>
              </span>
            </Link>

            <nav aria-label="main" className="relative ml-auto hidden md:block" onMouseLeave={() => { setPill(null); setOpen(null); }} onBlur={() => setPill(null)} onKeyDown={(e) => e.key === "Escape" && setOpen(null)}>
              <span
                aria-hidden="true"
                className="nav-pill absolute inset-y-0 rounded-full bg-accent/10"
                style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
              />
              <ul className="flex gap-1">
                {nav.map((item, i) => (
                  <li key={item.key} className="group relative" onMouseEnter={(e) => { movePill(e); setOpen(item.key); }} onFocus={(e) => { movePill(e); setOpen(item.key); }}>
                    {item.children ? (
                      // parent with a dropdown only opens it; it does not navigate
                      <button
                        type="button"
                        aria-expanded={open === item.key}
                        onClick={() => setOpen(item.key)}
                        className={`${link} relative flex items-center gap-1 ${open === item.key ? "text-accent-ink" : ""}`}
                      >
                        {t.nav[item.key]}
                        {caret("down")}
                      </button>
                    ) : (
                      <Link
                        href={href(item.href)}
                        aria-current={active(item) ? "page" : undefined}
                        className={`${link} relative flex items-center gap-1 ${active(item) ? "font-medium text-accent-ink" : ""}`}
                      >
                        {t.nav[item.key]}
                      </Link>
                    )}
                    {item.children && (
                      <ul className={`absolute top-full z-20 min-w-64 rounded-xl border border-ink/10 bg-page p-1 ${open === item.key ? "block" : "hidden"} ${i === nav.length - 1 ? "right-0" : "left-0"}`}>
                        {item.children.map((c) => (
                          <li key={`${c.key}-${c.href}`} className="group/sub relative">
                            <Link href={href(c.href)} className={panelItem}>
                              {t.nav[c.key]}
                              {c.children && caret("right")}
                            </Link>
                            {c.children && (
                              <ul className={`${panel} left-full top-0 group-focus-within/sub:block group-hover/sub:block`}>
                                {c.children.map((g) => (
                                  <li key={g.key}>
                                    <Link href={href(g.href)} className={panelItem}>
                                      {t.nav[g.key]}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-1 font-mono text-xs tracking-[0.05em] md:ml-0">
              {(["th", "en"] as const).map((l) => (
                <Link
                  key={l}
                  href={swap(l)}
                  aria-current={lang === l ? "true" : undefined}
                  className={`flex h-8 items-center rounded-full px-2 hover:text-accent-ink ${lang === l ? "bg-ink/5 font-medium text-ink" : "text-ink-3"}`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(!menu)}
              className="flex h-10 shrink-0 items-center rounded-full border border-ink/10 px-4 text-sm font-medium text-ink-2 hover:bg-raised md:hidden"
            >
              {t.menu}
            </button>
          </div>
          {menu && (
            <nav id="mobile-menu" aria-label="main mobile" className="max-h-[70vh] overflow-y-auto border-t border-ink/10 px-1 py-2 md:hidden">
              <ul>{mobileList(nav)}</ul>
            </nav>
          )}
        </header>
      </div>
    </div>
  );
}
