"use client";

import Link from "next/link";
import { useState } from "react";
import { WithLang } from "@/components/WithLang";
import type { Lang, content } from "@/data/content";
import { reviewApplication, useApplicantList, type Application, type Status } from "@/lib/applicant";
import { useAdmin, useSite } from "@/lib/site";

// Admin review of lecturer applications (demo). Same browser storage as the lecturer portal.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <Review lang={lang} />}</WithLang>;
}

type Texts = (typeof content)["th"]["applicant"] | (typeof content)["en"]["applicant"];
const STATUSES: Status[] = ["pending", "passed1", "refer", "failed", "none"];

function Review({ lang }: { lang: Lang }) {
  const site = useSite();
  const t = site.content[lang].applicant;
  const ui = site.content[lang].admin;
  const ok = useAdmin();
  const list = useApplicantList();

  if (!ok)
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32 md:pb-24">
        <p className="text-lg">{ui.needLogin}</p>
        <Link href={`/${lang}/login`} className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 font-medium text-white">
          {ui.goLogin}
        </Link>
      </main>
    );

  return (
    <main className="font-ui mx-auto max-w-6xl px-4 pb-16 pt-32 md:px-8 md:pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">{t.reviewTitle}</h1>
          <p className="mt-2 text-ink-2">{t.reviewIntro}</p>
        </div>
        <Link href={`/${lang}/admin`} className="inline-flex h-10 items-center rounded-full border border-ink/20 px-5 text-sm text-ink-2 hover:bg-raised">
          {t.reviewBack}
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {list.length === 0 && <p className="text-ink-2">{t.reviewEmpty}</p>}
        {list.map(({ user, app }) => (
          <ReviewCard key={user} user={user} app={app} t={t} />
        ))}
      </div>
    </main>
  );
}

function ReviewCard({ user, app, t }: { user: string; app: Application | null; t: Texts }) {
  const [msg, setMsg] = useState<string | null>(null);
  const field = "mt-2 h-11 w-full rounded-lg border border-ink/20 bg-page px-4 text-ink";
  const statusLabel = (s: Status) => ({ none: t.statusNone, pending: t.statusPending, passed1: t.statusPassed1, refer: t.statusRefer, failed: t.statusFailed })[s];
  // "refer" is offered only once: after one resubmission the next decision is final
  const options = STATUSES.filter((s) => s !== "refer" || (app?.resubmits ?? 0) < 1);

  return (
    <article className="rounded-xl border border-ink/10 bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-ui font-semibold text-2xl font-light">{user}</h2>
        <span className="font-mono text-xs text-ink-3">{app ? statusLabel(app.status) : t.reviewNotSubmitted}</span>
      </div>
      {app?.status === "refer" && !app.submitted && <p className="mt-4 text-sm text-ink-2">{t.statusRefer}</p>}
      {app?.submitted && (
        <>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-3">{t.fName}</dt>
              <dd className="text-ink">{app.name}</dd>
            </div>
            <div>
              <dt className="text-ink-3">{t.fFaculty}</dt>
              <dd className="text-ink">{app.faculty}</dd>
            </div>
            <div>
              <dt className="text-ink-3">{t.fPosition}</dt>
              <dd className="text-ink">{app.position}</dd>
            </div>
            <div>
              <dt className="text-ink-3">{t.fLevel}</dt>
              <dd className="text-ink">{t.levels.find((l) => l.value === app.level)?.label ?? app.level}</dd>
            </div>
          </dl>
          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const r = reviewApplication(user, String(f.get("status")) as Status, String(f.get("note") ?? ""), f.get("endorsed") === "on");
              if (r === "ok") (e.currentTarget.elements.namedItem("note") as HTMLTextAreaElement).value = "";
              setMsg(r === "ok" ? t.reviewSaved : r === "limit" ? t.resubmitLimit : r === "full" ? t.evidenceFull : t.reviewNotSubmitted);
            }}
          >
            <label className="block text-sm font-medium text-ink-2">
              {t.reviewStatus}
              <select name="status" defaultValue={app.status} className={field}>
                {options.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink-2 md:col-span-2">
              {t.reviewNote}
              <textarea name="note" className={`${field} h-24 py-3`} />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-ink-2 md:col-span-2">
              <input type="checkbox" name="endorsed" defaultChecked={app.endorsed} className="h-4 w-4" />
              {t.reviewEndorsed}
            </label>
            <div className="flex items-center gap-4 md:col-span-2">
              <button className="h-11 rounded-full bg-accent px-6 font-medium text-white hover:bg-accent-hover">{t.reviewSave}</button>
            </div>
          </form>
        </>
      )}
      {msg && <p role="status" className="mt-4 text-sm text-ink-2">{msg}</p>}
    </article>
  );
}
