"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { content, type Lang } from "@/data/content";
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

const link = "block rounded-lg px-3 py-2 text-sm text-ink-2 hover:text-accent-ink";
// display:none (not visibility) so closed panels add no horizontal scroll width
const panel = "absolute z-20 hidden min-w-64 rounded-xl border border-ink/10 bg-card p-1";
const panelItem = "flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-accent/10 hover:text-accent-ink";

// Top bar (purple: contact + language, scrolls away) and the white menu bar (sticky). Menu = src/data/nav.ts.
export function SiteHeader({ lang }: { lang: Lang }) {
  const t = content[lang];
  const pathname = usePathname();
  const base = `/${lang}`;
  const href = (h: string) => `${base}${h}`;
  const active = (item: NavItem) => (item.href === "" ? pathname === base : pathname.startsWith(href(item.href)));
  const swap = (l: Lang) => pathname.replace(/^\/(th|en)/, `/${l}`);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const movePill = (e: { currentTarget: HTMLElement }) =>
    setPill({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });
  const [menu, setMenu] = useState(false);

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
    <>
      {/* top bar: contact + language; scrolls away, the white menu bar below stays sticky */}
      <div className="bg-accent text-sm text-white">
        <div className="mx-auto flex h-10 max-w-6xl items-center gap-6 px-4 md:px-8">
          <span className="hidden items-center gap-2 md:flex">
            <Icon>
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
              <circle cx="12" cy="10" r="3" />
            </Icon>
            {t.contact.address}
          </span>
          <a href={`mailto:${t.contact.email}`} className="hidden items-center gap-2 hover:underline md:flex">
            <Icon>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </Icon>
            {t.contact.email}
          </a>
          <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:underline">
            <Icon>
              <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
            </Icon>
            {t.contact.phone}
          </a>
          <div className="ml-auto flex items-center gap-1">
            {(["th", "en"] as const).map((l) => (
              <Link
                key={l}
                href={swap(l)}
                aria-current={lang === l ? "true" : undefined}
                className={`flex h-8 items-center rounded-lg px-2 hover:bg-white/15 ${lang === l ? "font-semibold underline underline-offset-4" : "text-white/80"}`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-10 border-b border-ink/10 bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-8">
          <Link href={base} className="flex items-center gap-3">
            <Placeholder label={t.logo} className="h-8 w-8 shrink-0 rounded-lg" />
            <span className="leading-tight">
              <span className="block text-base font-medium text-ink">{t.siteName}</span>
              <span className="block text-xs text-ink-3">{t.siteOrg}</span>
            </span>
          </Link>

          <nav aria-label="main" className="relative ml-auto hidden md:block" onMouseLeave={() => setPill(null)} onBlur={() => setPill(null)}>
            <span
              aria-hidden="true"
              className="nav-pill absolute inset-y-0 rounded-lg bg-accent/10"
              style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
            />
            <ul className="flex gap-1">
              {nav.map((item, i) => (
                <li key={item.key} className="group relative" onMouseEnter={movePill} onFocus={movePill}>
                  <Link
                    href={href(item.href)}
                    aria-current={active(item) ? "page" : undefined}
                    className={`${link} relative flex items-center gap-1 ${active(item) ? "font-medium text-accent-ink" : ""}`}
                  >
                    {t.nav[item.key]}
                    {item.children && caret("down")}
                  </Link>
                  {item.children && (
                    <ul className={`${panel} top-full group-focus-within:block group-hover:block ${i === nav.length - 1 ? "right-0" : "left-0"}`}>
                      {item.children.map((c) => (
                        <li key={`${c.key}-${c.href}`} className="group/sub relative">
                          <Link href={href(c.href)} className={panelItem}>
                            {t.nav[c.key]}
                            {c.children && caret("right")}
                          </Link>
                          {c.children && (
                            <ul className={`${panel} right-full top-0 group-focus-within/sub:block group-hover/sub:block`}>
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

          <button
            type="button"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu(!menu)}
            className="ml-auto flex h-10 items-center rounded-lg border border-ink/10 bg-card px-4 text-sm font-medium text-ink-2 hover:bg-raised md:hidden"
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
    </>
  );
}
