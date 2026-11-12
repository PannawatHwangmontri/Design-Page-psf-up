"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import { contentGroups, type Item } from "@/data/admin-schema";
import { btnMain, input, setPath, type Ui } from "./Field";

type Row = { path: string; th: string; en: string };

// walk th and en in parallel (same structure) and collect every text as one row
function rows(th: Item, en: Item, path: string): Row[] {
  if (typeof th === "string") return [{ path, th, en: typeof en === "string" ? en : "" }];
  if (th && typeof th === "object") return Object.keys(th).flatMap((k) => rows(th[k], en?.[k], path ? `${path}.${k}` : k));
  return [];
}
const at = (o: Item, path: string) => path.split(".").reduce((a, k) => a?.[k], o);

// General text of the whole site, grouped by page. Thai (left) and English (right) of every text side by side.
export function ContentEditor({ content, onSave, ui, lang }: { content: Item; onSave: (c: Item) => boolean; ui: Ui; lang: Lang }) {
  const [group, setGroup] = useState(contentGroups[0].key);
  const [draft, setDraft] = useState<Item>(null);
  const [state, setState] = useState<"" | "saved" | "full">("");
  const data = draft ?? content;
  const g = contentGroups.find((x) => x.key === group)!;
  const list = g.paths.flatMap((p) => rows(at(data.th, p), at(data.en, p), p));
  const edit = (path: string, l: "th" | "en", v: string) => {
    setDraft(setPath(data, `${l}.${path}`, v));
    setState("");
  };
  const area = `${input} h-auto py-2`;

  return (
    <div>
      <label className="block text-sm">
        <span className="mb-1 block text-ink-2">{ui.groupLabel}</span>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${input} max-w-md`}>
          {contentGroups.map((x) => (
            <option key={x.key} value={x.key}>
              {ui.groups[x.key as keyof typeof ui.groups]}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 text-sm text-ink-3">{ui.contentHint}</p>

      <div className="mt-6 hidden grid-cols-2 gap-4 text-sm font-medium text-ink-2 md:grid">
        <span>{ui.thHead}</span>
        <span>{ui.enHead}</span>
      </div>
      <ul className="mt-2 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-card">
        {list.map((r) => (
          <li key={r.path} className="p-4">
            <p className="mb-2 font-mono text-xs text-ink-3">{r.path}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {(["th", "en"] as const).map((l) => {
                const v = r[l];
                const props = { value: v, lang: l, "aria-label": `${r.path} ${l}`, onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => edit(r.path, l, e.target.value) };
                return v.length > 60 ? <textarea key={l} rows={Math.min(6, Math.ceil(v.length / 60))} className={area} {...props} /> : <input key={l} className={input} {...props} />;
              })}
            </div>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 mt-6 flex items-center gap-4 border-t border-ink/10 bg-page py-4">
        <button
          type="button"
          disabled={!draft}
          onClick={() => {
            if (onSave(draft)) {
              setDraft(null);
              setState("saved");
            } else setState("full");
          }}
          className={btnMain}
        >
          {ui.save}
        </button>
        {state === "saved" && <span role="status" className="text-sm text-accent-ink">{ui.saved}</span>}
        {state === "full" && <span role="alert" className="text-sm text-red-700">{ui.storageFull}</span>}
      </div>
    </div>
  );
}
