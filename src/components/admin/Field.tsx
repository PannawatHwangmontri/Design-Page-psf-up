"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { BE_YEARS, type Field as FieldDef, type Item } from "@/data/admin-schema";
import type { SiteData } from "@/lib/site";

export type Ui = SiteData["content"]["th"]["admin"] | SiteData["content"]["en"]["admin"];

export const input = "h-10 w-full rounded-lg border border-ink/20 bg-card px-3 text-ink focus:outline-accent";
export const btn = "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium";
export const btnLine = `${btn} border border-ink/20 text-ink-2 hover:bg-raised`;
export const btnMain = `${btn} bg-accent text-white hover:bg-accent-hover disabled:opacity-40`;

const MAX_BYTES = 1024 * 1024;

export const getPath = (o: Item, path: string): Item => path.split(".").reduce((a, k) => a?.[k], o);
export function setPath(o: Item, path: string, v: unknown): Item {
  const c = structuredClone(o);
  const ks = path.split(".");
  let t = c;
  for (const k of ks.slice(0, -1)) t = t[k] ??= {};
  if (v === undefined) delete t[ks[ks.length - 1]];
  else t[ks[ks.length - 1]] = v;
  return c;
}

// One form control for a schema field. `item` is the whole record being edited; onChange returns the updated record.
export function Field({ f, item, onChange, lang, ui }: { f: FieldDef; item: Item; onChange: (item: Item) => void; lang: Lang; ui: Ui }) {
  const [err, setErr] = useState("");
  const value = getPath(item, f.path);
  const put = (v: unknown) => onChange(setPath(item, f.path, v));
  const wide = f.type === "area" || f.type === "image" || f.type === "file";

  let control: React.ReactNode;
  switch (f.type) {
    case "text":
      control = <input value={value ?? ""} onChange={(e) => put(e.target.value)} className={input} />;
      break;
    case "area":
      control = <textarea value={value ?? ""} rows={3} onChange={(e) => put(e.target.value)} className={`${input} h-auto py-2`} />;
      break;
    case "number":
      control = <input type="number" value={value ?? ""} onChange={(e) => put(Number(e.target.value))} className={input} />;
      break;
    case "date":
      control = (
        <div className="flex gap-2">
          <input type="date" value={value ?? ""} onChange={(e) => put(e.target.value || undefined)} className={input} />
          {f.optional && value && (
            <button type="button" onClick={() => put(undefined)} className={btnLine}>
              {ui.remove}
            </button>
          )}
        </div>
      );
      break;
    case "year":
    case "yearPair": {
      const cur = f.type === "year" ? Number(value) : Number(value?.th);
      const years = BE_YEARS.includes(cur) || !cur ? BE_YEARS : [...BE_YEARS, cur].sort((a, b) => a - b);
      control = (
        <select
          value={cur || ""}
          onChange={(e) => {
            const y = Number(e.target.value);
            put(f.type === "year" ? y : { th: String(y), en: String(y - 543) });
          }}
          className={input}
        >
          {!cur && <option value="" />}
          {years.map((y) => (
            <option key={y} value={y}>
              {lang === "th" ? y : `${y - 543} (B.E. ${y})`}
            </option>
          ))}
        </select>
      );
      break;
    }
    case "level":
    case "select": {
      const cur = f.type === "level" ? String(value?.en ?? "").slice(-1) : String(value ?? "");
      control = (
        <select
          value={cur}
          onChange={(e) => {
            const o = f.options!.find((x) => x.value === e.target.value)!;
            put(f.type === "level" ? { th: o.label.th, en: o.label.en } : f.numeric ? Number(o.value) : o.value);
          }}
          className={input}
        >
          {f.options!.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label[lang]}
            </option>
          ))}
        </select>
      );
      break;
    }
    case "image":
    case "file": {
      const has = !!value && value !== "#";
      const read = (file: File | undefined) => {
        if (!file) return;
        if (file.size > MAX_BYTES) return setErr(ui.tooBig);
        setErr("");
        const r = new FileReader();
        r.onload = () => put(r.result as string);
        r.readAsDataURL(file);
      };
      control = (
        <div className="flex flex-wrap items-center gap-3">
          {f.type === "image" && has && <img src={value} alt="" className="h-20 w-20 rounded-lg border border-ink/10 object-cover" />}
          {f.type === "file" && <span className="text-sm text-ink-2">{has ? "✓ PDF" : ui.noFile}</span>}
          <label className={`${btnLine} cursor-pointer`}>
            {ui.chooseFile}
            <input type="file" accept={f.type === "image" ? "image/*" : "application/pdf"} className="sr-only" onChange={(e) => read(e.target.files?.[0])} />
          </label>
          {has && (
            <button type="button" onClick={() => put(f.type === "image" ? undefined : "#")} className={btnLine}>
              {ui.removeFile}
            </button>
          )}
          {err && (
            <span role="alert" className="text-sm text-red-700">
              {err}
            </span>
          )}
        </div>
      );
      break;
    }
  }

  // file pickers hold their own <label>, so they get a div (labels do not nest)
  const Wrap = f.type === "image" || f.type === "file" ? "div" : "label";
  return (
    <Wrap className={`block text-sm ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-ink-2">{f.label[lang]}</span>
      {control}
    </Wrap>
  );
}
