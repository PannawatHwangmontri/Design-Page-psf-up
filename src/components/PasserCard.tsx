import { content, type Lang } from "@/data/content";
import type { Passer } from "@/data/mock";
import { Placeholder } from "./Placeholder";

// การ์ดผู้ผ่านเกณฑ์ (ใช้ทั้งหน้าแรกและหน้าข่าวประชาสัมพันธ์) ไม่มีลิงก์ไปหน้าอื่น
export function PasserCard({ p, lang, style, tall, hidden }: { p: Passer; lang: Lang; style?: React.CSSProperties; tall?: boolean; hidden?: boolean }) {
  const t = content[lang];
  return (
    <li style={style} aria-hidden={hidden || undefined} className={`rounded-xl border border-ink/10 ${tall ? "w-64 shrink-0 overflow-hidden bg-page" : "flex gap-4 bg-card p-4"}`}>
      <Placeholder
        label={t.passers.photoAlt}
        className={tall ? "h-44 w-full" : "h-16 w-16 shrink-0 rounded-lg p-1 text-center text-[11px] leading-tight"}
      />
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

