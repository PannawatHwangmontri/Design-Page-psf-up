"use client";

import type { Lang } from "@/data/content";

// avatar placeholder: a person silhouette in the level colour (replaces the initial letter)
function PersonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-20" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
  );
}
import { useSite } from "@/lib/site";
import type { Passer } from "@/data/mock";

// การ์ดผู้ผ่านเกณฑ์ของหน้าข่าวประชาสัมพันธ์: รูปบน ป้ายระดับ/ปีแบบ mono ชื่อเซอริฟบาง ไม่มีลิงก์ไปหน้าอื่น
// initial-letter avatar colour follows the PSF level (1 / 2 / 3)
const AVATAR: Record<string, string> = { "1": "bg-level-1/15 text-level-1", "2": "bg-level-2/15 text-level-2-ink", "3": "bg-level-3/15 text-level-3-ink", "4": "bg-level-4/15 text-level-4" };
const DOT: Record<string, string> = { "1": "bg-level-1", "2": "bg-level-2", "3": "bg-level-3", "4": "bg-level-4" };
// shape per level, so the dot is not colour-only: circle, diamond, triangle
const SHAPE: Record<string, string> = { "1": "rounded-full", "2": "rotate-45 rounded-[2px]", "3": "[clip-path:polygon(50%_0%,100%_100%,0%_100%)]", "4": "rounded-none" };
export function PasserCard({ p, lang, style }: { p: Passer; lang: Lang; style?: React.CSSProperties }) {
  const t = useSite().content[lang];
  const lv = p.level.en.slice(-1);
  return (
    <li style={style} className="lift overflow-hidden rounded-xl border border-ink/10 bg-card">
      {p.photo ? <img src={p.photo} alt={p.name[lang]} className="photo-dim aspect-[4/3] w-full object-cover" /> : <span aria-hidden="true" className={`flex aspect-[4/3] items-center justify-center font-ui text-5xl font-semibold ${AVATAR[lv]}`}><PersonIcon /></span>}
      <div className="p-6">
        <p className="flex items-center gap-2 font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">
          <span aria-hidden="true" className={`h-2 w-2 ${DOT[lv]} ${SHAPE[lv]}`} />
          {p.level[lang]} · {t.passers.year} {p.year[lang]}
        </p>
        <h3 className="mt-3 line-clamp-2 font-ui font-semibold text-xl font-light leading-snug">{p.name[lang]}</h3>
        <p className="mt-1 text-sm text-ink-2">{p.unit[lang]}</p>
      </div>
    </li>
  );
}

// หน้าแรก: การ์ดทั้งใบกดได้ (ยังไม่มีหน้ารายละเอียดรายคน TODO ชี้ไปหน้าประชาสัมพันธ์ก่อน) จุดสีแยกตามระดับ 1-3
const LEVEL_DOT: Record<string, string> = { "1": "bg-level-1", "2": "bg-level-2", "3": "bg-level-3", "4": "bg-level-4" };
export function PasserTile({ p, lang, style }: { p: Passer; lang: Lang; style?: React.CSSProperties }) {
  const t = useSite().content[lang];
  const lv = p.level.en.slice(-1);
  return (
    <li style={style}>
      <a href={`/${lang}/publicity`} className="block overflow-hidden rounded-xl border border-ink/10 bg-page transition-colors hover:border-accent/40">
        {p.photo ? <img src={p.photo} alt={p.name[lang]} className="photo-dim aspect-[4/3] w-full object-cover" /> : <span aria-hidden="true" className={`flex aspect-[4/3] items-center justify-center font-ui text-5xl font-semibold ${AVATAR[lv]}`}><PersonIcon /></span>}
        <div className="p-4">
          <p className="line-clamp-2 font-medium">{p.name[lang]}</p>
          <p className="mt-1 text-sm text-ink-2">{p.unit[lang]}</p>
          <p className="mt-3 flex items-center gap-2 text-sm tabular-nums text-ink-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 ${LEVEL_DOT[lv]} ${SHAPE[lv]}`} />
            {p.level[lang]} · {t.passers.year} {p.year[lang]}
          </p>
        </div>
      </a>
    </li>
  );
}
