"use client";

import Link from "next/link";
import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";

// Path line above the title of the inner pages: Home / group / page. Items without href are plain text (menu groups have no page).
export function Breadcrumb({ lang, items }: { lang: Lang; items: { label: string; href?: string }[] }) {
  const nav = useSite().content[lang].nav;
  const all = [{ label: nav.home, href: `/${lang}` }, ...items];
  return (
    <nav aria-label={nav.breadcrumb}>
      <ol className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink-3">
        {all.map((it, i) => (
          <li key={i} className="flex items-center gap-2" aria-current={i === all.length - 1 ? "page" : undefined}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href && i < all.length - 1 ? (
              <Link href={it.href} className="underline decoration-ink/25 underline-offset-4 hover:text-accent-ink">
                {it.label}
              </Link>
            ) : (
              <span>{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
