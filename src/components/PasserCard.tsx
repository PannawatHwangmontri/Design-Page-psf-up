"use client";

import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import type { Passer } from "@/data/mock";

// การ์ดผู้ผ่านเกณฑ์ของหน้าข่าวประชาสัมพันธ์: รูปบน ป้ายระดับ/ปีแบบ mono ชื่อเซอริฟบาง ไม่มีลิงก์ไปหน้าอื่น
// initial-letter avatar colour follows the PSF level (1 / 2 / 3)
const AVATAR: Record<string, string> = { "1": "bg-level-1/15 text-level-1", "2": "bg-level-2/15 text-level-2", "3": "bg-level-3/15 text-level-3" };
const DOT: Record<string, string> = { "1": "bg-level-1", "2": "bg-level-2", "3": "bg-level-3" };
export function PasserCard({ p, lang, style }: { p: Passer; lang: Lang; style?: React.CSSProperties }) {
  const t = useSite().content[lang];
  const lv = p.level.en.slice(-1);
  return (
    <li style={style} className="lift overflow-hidden rounded-xl border border-ink/10 bg-card">
      {p.photo ? <img src={p.photo} alt={p.name[lang]} className="aspect-[4/3] w-full object-cover" /> : <span aria-hidden="true" className={`flex aspect-[4/3] items-center justify-center font-ui text-5xl font-semibold ${AVATAR[lv]}`}>{p.name[lang].trim().charAt(0)}</span>}
      <div className="p-6">
        <p className="flex items-center gap-2 font-mono text-xs tabular-nums tracking-[0.05em] text-ink-3">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOT[lv]}`} />
          {p.level[lang]} · {t.passers.year} {p.year[lang]}
        </p>
        <h3 className="mt-3 line-clamp-2 font-ui font-semibold text-xl font-light leading-snug">{p.name[lang]}</h3>
        <p className="mt-1 text-sm text-ink-2">{p.unit[lang]}</p>
      </div>
    </li>
  );
}

// หน้าแรก: การ์ดทั้งใบกดได้ (ยังไม่มีหน้ารายละเอียดรายคน TODO ชี้ไปหน้าประชาสัมพันธ์ก่อน) จุดสีแยกตามระดับ 1-3
const LEVEL_DOT: Record<string, string> = { "1": "bg-level-1", "2": "bg-level-2", "3": "bg-level-3" };
export function PasserTile({ p, lang, style }: { p: Passer; lang: Lang; style?: React.CSSProperties }) {
  const t = useSite().content[lang];
  const lv = p.level.en.slice(-1);
  return (
    <li style={style}>
      <a href={`/${lang}/publicity`} className="block overflow-hidden rounded-xl border border-ink/10 bg-page transition-colors hover:border-accent/40">
        {p.photo ? <img src={p.photo} alt={p.name[lang]} className="aspect-[4/3] w-full object-cover" /> : <span aria-hidden="true" className={`flex aspect-[4/3] items-center justify-center font-ui text-5xl font-semibold ${AVATAR[lv]}`}>{p.name[lang].trim().charAt(0)}</span>}
        <div className="p-4">
          <p className="line-clamp-2 font-medium">{p.name[lang]}</p>
          <p className="mt-1 text-sm text-ink-2">{p.unit[lang]}</p>
          <p className="mt-3 flex items-center gap-2 text-sm tabular-nums text-ink-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${LEVEL_DOT[lv]}`} />
            {p.level[lang]} · {t.passers.year} {p.year[lang]}
          </p>
        </div>
      </a>
    </li>
  );
}
