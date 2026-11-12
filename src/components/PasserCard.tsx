"use client";

import type { Lang } from "@/data/content";
import { useSite } from "@/lib/site";
import type { Passer } from "@/data/mock";
import { Placeholder } from "./Placeholder";

// การ์ดผู้ผ่านเกณฑ์ (ใช้ทั้งหน้าแรกและหน้าข่าวประชาสัมพันธ์) ไม่มีลิงก์ไปหน้าอื่น
export function PasserCard({ p, lang, style, tall, hidden }: { p: Passer; lang: Lang; style?: React.CSSProperties; tall?: boolean; hidden?: boolean }) {
  const t = useSite().content[lang];
  return (
    <li style={style} aria-hidden={hidden || undefined} className={`rounded-xl border border-ink/10 ${tall ? "w-64 shrink-0 overflow-hidden bg-page" : "flex gap-4 bg-card p-4"}`}>
      {p.photo ? (
        <img src={p.photo} alt={p.name[lang]} className={tall ? "h-44 w-full object-cover" : "h-16 w-16 shrink-0 rounded-lg object-cover"} />
      ) : (
        <Placeholder
          label={t.passers.photoAlt}
          className={tall ? "h-44 w-full" : "h-16 w-16 shrink-0 rounded-lg p-1 text-center text-[11px] leading-tight"}
        />
      )}
      <div className={`min-w-0 ${tall ? "p-4" : ""}`}>
        <p className="font-medium">{p.name[lang]}</p>
        <p className="text-sm text-ink-2">{p.unit[lang]}</p>
        <p className="mt-2 flex items-center gap-2 text-sm tabular-nums text-ink-3">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-medium text-ink-2">{p.level[lang]}</span> · {t.passers.year} {p.year[lang]}
        </p>
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
        {p.photo ? <img src={p.photo} alt={p.name[lang]} className="aspect-[4/3] w-full object-cover" /> : <Placeholder label={t.passers.photoAlt} className="aspect-[4/3]" />}
        <div className="p-4">
          <p className="line-clamp-2 font-medium">{p.name[lang]}</p>
          <p className="mt-1 line-clamp-1 text-sm text-ink-2">{p.unit[lang]}</p>
          <p className="mt-3 flex items-center gap-2 text-sm tabular-nums text-ink-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${LEVEL_DOT[lv]}`} />
            {p.level[lang]} · {t.passers.year} {p.year[lang]}
          </p>
        </div>
      </a>
    </li>
  );
}
