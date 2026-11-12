"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import type { Item, ListSchema } from "@/data/admin-schema";
import { Field, btnLine, btnMain, type Ui } from "./Field";

// Table of records with Edit / Delete, plus a form (schema fields) to add or edit one record.
// onChange must return false when the data could not be stored (browser storage full).
export function ListEditor({
  items,
  onChange,
  schema,
  lang,
  ui,
  ids,
  prepend,
  normalize,
}: {
  items: Item[];
  onChange: (items: Item[]) => boolean;
  schema: ListSchema;
  lang: Lang;
  ui: Ui;
  ids?: { next: () => number }; // records carry a numeric id: new ones get the next free id
  prepend?: boolean; // new records go to the top (newest first lists)
  normalize?: (item: Item) => Item; // applied to a record before it is stored
}) {
  const [edit, setEdit] = useState<{ index: number | null; draft: Item } | null>(null);
  const [failed, setFailed] = useState(false);

  const commit = (next: Item[]) => {
    const ok = onChange(next);
    setFailed(!ok);
    return ok;
  };
  const save = () => {
    if (!edit) return;
    const rec = normalize ? normalize(edit.draft) : edit.draft;
    const next =
      edit.index === null
        ? prepend
          ? [{ ...rec, ...(ids && { id: ids.next() }) }, ...items]
          : [...items, { ...rec, ...(ids && { id: ids.next() }) }]
        : items.map((x, i) => (i === edit.index ? rec : x));
    if (commit(next)) setEdit(null);
  };

  return (
    <div>
      {edit && (
        <form
          className="mb-8 rounded-xl border border-accent/40 bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <h3 className="text-lg font-medium">{edit.index === null ? ui.newItem : ui.editItem}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {schema.fields.map((f) => (
              <Field key={f.path} f={f} item={edit.draft} onChange={(d) => setEdit({ ...edit, draft: d })} lang={lang} ui={ui} />
            ))}
          </div>
          {failed && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {ui.storageFull}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button className={btnMain}>{ui.saveItem}</button>
            <button type="button" onClick={() => { setEdit(null); setFailed(false); }} className={btnLine}>
              {ui.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEdit({ index: null, draft: schema.blank() })} className={btnMain}>
          + {ui.add}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink-3">{ui.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10 bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-raised/60 text-ink-2">
              <tr>
                {schema.columns.map((c) => (
                  <th key={c.label.en} className="px-4 py-3 font-medium">
                    {c.label[lang]}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">{ui.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {items.map((it, i) => (
                <tr key={i}>
                  {schema.columns.map((c, ci) => (
                    <td key={c.label.en} className={`px-4 py-3 ${ci === 0 ? "whitespace-nowrap tabular-nums" : "max-w-md"}`}>
                      <span className="line-clamp-2">{c.get(it, lang)}</span>
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button type="button" onClick={() => setEdit({ index: i, draft: structuredClone(it) })} className={`${btnLine} h-8`}>
                      {ui.edit}
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => confirm(ui.confirmDelete) && commit(items.filter((_, j) => j !== i))}
                      className={`${btnLine} h-8`}
                    >
                      {ui.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
