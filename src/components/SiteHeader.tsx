"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import { nav, type NavItem } from "@/data/nav";
import { SiteSearch } from "@/components/SiteSearch";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const link = "block min-h-11 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-2 hover:text-accent-ink";
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
  // a parent with a dropdown is "current" when the page is inside its section (it is a button, so no aria-current)
  const inSection = (item: NavItem) => item.href !== "" && pathname.startsWith(href(item.href));
  const swap = (l: Lang) => pathname.replace(/^\/(th|en)/, `/${l}`);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const movePill = (e: { currentTarget: HTMLElement }) =>
    setPill({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });
  const [menu, setMenu] = useState(false);
  // search field open: the main menu fades out and the field takes its place (SiteSearch reports this)
  const [searchOpen, setSearchOpen] = useState(false);
  // below md the open field covers the whole bar, so the bar's other controls go inert while it is open
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);
  const overlay = searchOpen && narrow;
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
    <div className="font-ui sticky top-0 z-30 h-0">
      <div className="mx-auto max-w-6xl px-4 pt-3 md:px-8">
        <header className="rounded-[30px] border border-ink/10 bg-page/95 px-4 shadow-[0_10px_30px_-12px_rgba(29,22,48,0.35)] backdrop-blur-md md:px-6">
          <div className="relative flex h-14 items-center gap-2 pl-2 pr-2 sm:gap-3 sm:pl-5 sm:pr-3 lg:gap-4 xl:gap-5">
            <Link href={base} inert={overlay} className="flex h-10 w-10 shrink-0 items-center justify-center">
              <img src="/brand/logo-up-mark.png" alt={t.siteOrg} width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
              <span className="min-w-0 leading-tight">
                <span className="hidden whitespace-nowrap text-sm font-semibold text-ink min-[1800px]:block min-[1800px]:text-base">{t.siteName}</span>
                <span className="hidden whitespace-nowrap text-[11px] font-semibold text-ink min-[1800px]:block">{t.siteOrg}</span>
              </span>
            </Link>

            <div className="relative flex min-w-0 flex-1 items-center justify-end max-md:static">
            <nav aria-label="main" className={`ml-auto hidden md:block transition-[opacity,visibility] motion-reduce:transition-none ${searchOpen ? "invisible opacity-0 duration-[120ms]" : "visible opacity-100 duration-[140ms]"}`} onMouseLeave={() => { setPill(null); setOpen(null); }} onBlur={() => setPill(null)} onKeyDown={(e) => e.key === "Escape" && setOpen(null)} inert={searchOpen} aria-hidden={searchOpen || undefined}>
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
                        aria-haspopup="true"
                        aria-expanded={open === item.key}
                        onClick={() => setOpen(item.key)}
                        onKeyDown={(e) => {
                          // ArrowDown opens the menu and moves focus to its first link (Enter/Space already click)
                          if (e.key !== "ArrowDown") return;
                          e.preventDefault();
                          setOpen(item.key);
                          (e.currentTarget.nextElementSibling?.querySelector("a") as HTMLElement | null)?.focus();
                        }}
                        className={`${link} relative flex items-center gap-1 ${open === item.key ? "bg-accent text-white hover:text-white" : inSection(item) ? "font-medium text-accent-ink" : ""}`}
                      >
                        {t.nav[item.key]}
                        <span className={`inline-flex transition-transform duration-200 ${open === item.key ? "rotate-180" : ""}`}>{caret("down")}</span>
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
                      <ul
                        onKeyDown={(e) => {
                          // ArrowUp/ArrowDown move between the links of this menu; Esc is handled on <nav>
                          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                          e.preventDefault();
                          const links = [...e.currentTarget.querySelectorAll<HTMLElement>(":scope > li > a")];
                          const k = links.indexOf(document.activeElement as HTMLElement);
                          links[(k + (e.key === "ArrowDown" ? 1 : links.length - 1)) % links.length]?.focus();
                        }}
                        className={`menu-stagger absolute top-full z-20 min-w-64 rounded-xl border border-ink/10 bg-page p-1 ${open === item.key ? "block" : "hidden"} ${i === nav.length - 1 ? "right-0" : "left-0"}`}
                      >
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

            {/* search: an icon, or the field that takes the bar's space; on mobile it covers the whole bar */}
            {/* fixed 44px slot: the open field overlays the menu box, so this never shrinks and the menu does not move */}
            <div className="size-11 shrink-0">
              <SiteSearch lang={lang} onOpenChange={setSearchOpen} />
            </div>
            </div>
            {/* shown only where the bar has room: login from 1024px, the apply button from 1280px (both are also at the end of the mobile menu) */}
            <Link href={`${base}/login`} className="hidden min-h-11 shrink-0 items-center whitespace-nowrap text-sm text-ink-2 hover:text-accent-ink lg:inline-flex">
              {t.nav.login}
            </Link>
            <Link href={`${base}/documents/forms`} className="hidden h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover xl:inline-flex">
              {t.nav.apply}
            </Link>
            <div inert={overlay} className="ml-auto hidden items-center gap-1 font-mono text-xs tracking-[0.05em] min-[480px]:flex md:ml-0">
              <ThemeToggle lang={lang} />
              {(["th", "en"] as const).map((l) => (
                <Link
                  key={l}
                  href={swap(l)}
                  aria-current={lang === l ? "true" : undefined}
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 hover:text-accent-ink ${lang === l ? "bg-ink/5 font-medium text-ink" : "text-ink-3"}`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>

            <Link href={`${base}/documents/forms`} aria-label={t.nav.searchApplyLabel} inert={overlay} className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-accent px-4 text-xs font-medium text-white md:hidden">
              {t.nav.applyShort}
            </Link>
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label={t.menu}
              inert={overlay}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink-2 hover:bg-raised md:hidden"
            >
              <Icon size={18}>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </Icon>
            </button>
          </div>
          {menu && (
            <nav id="mobile-menu" aria-label="main mobile" className="max-h-[70vh] overflow-y-auto border-t border-ink/10 px-1 py-2 md:hidden">
              <ul className="menu-stagger">{mobileList(nav)}</ul>
              {/* below 480px the theme switch and language links move here (they are hidden in the bar) */}
              <div className="flex items-center justify-end gap-2 px-3 pt-3 min-[480px]:hidden">
                <ThemeToggle lang={lang} />
                {(["th", "en"] as const).map((l) => (
                  <Link
                    key={l}
                    href={swap(l)}
                    aria-current={lang === l ? "true" : undefined}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 hover:text-accent-ink ${lang === l ? "bg-ink/5 font-medium text-ink" : "text-ink-3"}`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
              <div className="px-3 pt-3">
                <SiteSearch lang={lang} wide />
              </div>
              <div className="flex flex-col gap-2 px-3 pb-3 pt-3">
                <Link href={`${base}/documents/forms`} onClick={() => setMenu(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover">
                  {t.nav.apply}
                </Link>
                <Link href={`${base}/login`} onClick={() => setMenu(false)} className="py-2 text-center text-sm text-ink-2 hover:text-accent-ink">
                  {t.nav.login}
                </Link>
              </div>
            </nav>
          )}
        </header>
      </div>
    </div>
  );
}
