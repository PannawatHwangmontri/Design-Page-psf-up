"use client";

import Link from "next/link";
import { useState } from "react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { btnLine, btnMain } from "@/components/admin/Field";
import { GroupedEditor } from "@/components/admin/GroupedEditor";
import { ListEditor } from "@/components/admin/ListEditor";
import { WithLang } from "@/components/WithLang";
import { schemas, type Item } from "@/data/admin-schema";
import type { Lang } from "@/data/content";
import { logout, resetData, saveData, useAdmin, useSite, type SiteKey } from "@/lib/site";

// Admin: one tab per kind of data. Lists save straight to localStorage (the site shows the change at once).
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <Admin lang={lang} />}</WithLang>;
}

const maxId = (lists: Item[][]) => Math.max(0, ...lists.flat().map((x) => (typeof x.id === "number" ? x.id : 0)));
const ymd = (year: number) => ({ th: String(year), en: String(year - 543) });

function Admin({ lang }: { lang: Lang }) {
  const site = useSite();
  const ui = site.content[lang].admin;
  const ok = useAdmin();
  const [key, setKey] = useState<SiteKey>("news");

  if (!ok)
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 md:pb-24">
        <p className="text-lg">{ui.needLogin}</p>
        <Link href={`/${lang}/login`} className={`${btnMain} mt-6`}>
          {ui.goLogin}
        </Link>
      </main>
    );

  const save = (k: SiteKey) => (v: unknown) => saveData(k, v);
  const common = { lang, ui };
  const people = site.publicity.flatMap((g) => g.people);

  let body: React.ReactNode;
  switch (key) {
    case "news":
      body = <ListEditor {...common} items={site.news} schema={schemas.news} onChange={save("news")} ids={{ next: () => maxId([site.news]) + 1 }} prepend />;
      break;
    case "announcements":
      body = <ListEditor {...common} items={site.announcements} schema={schemas.announcements} onChange={save("announcements")} ids={{ next: () => maxId([site.announcements]) + 1 }} prepend />;
      break;
    case "passers":
      body = <ListEditor {...common} items={site.passers} schema={schemas.passers} onChange={save("passers")} ids={{ next: () => maxId([site.passers]) + 1 }} />;
      break;
    case "publicity":
      body = (
        <GroupedEditor
          {...common}
          groups={site.publicity}
          itemsKey="people"
          schema={schemas.people}
          onChange={save("publicity")}
          ids={{ next: () => maxId([people]) + 1 }}
          normalize={(p, year) => ({ ...p, year: ymd(year) })}
        />
      );
      break;
    case "assessmentCalendars":
      body = <GroupedEditor {...common} groups={site.assessmentCalendars} itemsKey="events" schema={schemas.events} onChange={save("assessmentCalendars")} />;
      break;
    case "calendarDocs":
      body = <ListEditor {...common} items={site.calendarDocs} schema={schemas.calendarDocs} onChange={save("calendarDocs")} ids={{ next: () => maxId([site.calendarDocs]) + 1 }} prepend />;
      break;
    case "forms":
      body = <ListEditor {...common} items={site.forms} schema={schemas.forms} onChange={save("forms")} ids={{ next: () => maxId([site.forms]) + 1 }} />;
      break;
    case "content":
      body = <ContentEditor content={site.content} onSave={save("content")} ui={ui} lang={lang} />;
      break;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:px-8 md:pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">{ui.title}</h1>
          <p className="mt-2 text-ink-2">{ui.intro}</p>
        </div>
        <button type="button" onClick={logout} className={btnLine}>
          {ui.logout}
        </button>
      </div>

      <div role="tablist" className="mt-8 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {(Object.keys(ui.tabs) as SiteKey[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={k === key}
            onClick={() => setKey(k)}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium ${k === key ? "bg-accent text-white" : "border border-ink/20 text-ink-2 hover:bg-raised"}`}
          >
            {ui.tabs[k]}
          </button>
        ))}
      </div>

      <div key={key} className="mt-8">
        {body}
      </div>

      <div className="mt-12 border-t border-ink/10 pt-6">
        <button
          type="button"
          onClick={() => {
            if (confirm(ui.resetConfirm)) {
              resetData();
              setKey("news");
            }
          }}
          className={btnLine}
        >
          {ui.reset}
        </button>
      </div>
    </main>
  );
}
