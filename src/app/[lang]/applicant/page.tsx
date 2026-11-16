"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WithLang } from "@/components/WithLang";
import type { Lang, content } from "@/data/content";
import { fmtDate } from "@/lib/lang";
import {
  checklistOf,
  DOC_TYPES,
  logout,
  saveApplication,
  submitApplication,
  uploadDoc,
  useApplicant,
  withdrawApplication,
  type Application,
  type DocType,
  type Result,
  type Status,
} from "@/lib/applicant";
import type { SiteData } from "@/lib/site";

// Lecturer portal (demo). Dark band, then a sticky column (status, checklist, submit, round, history, messages) beside numbered cards.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang, site) => <Portal lang={lang} t={site.content[lang].applicant} site={site} />}</WithLang>;
}

type Texts = (typeof content)["th"]["applicant"] | (typeof content)["en"]["applicant"];
type DocLabel = "docForm" | "docSelfAssess" | "docProfile" | "docLessonPlan" | "docSupervisor";

const DOC_LABEL: Record<DocType, DocLabel> = {
  form: "docForm",
  selfAssess: "docSelfAssess",
  profile: "docProfile",
  lessonPlan: "docLessonPlan",
  supervisor: "docSupervisor",
};

const DOC_HINT: Record<DocType, "hintForm" | "hintSelfAssess" | "hintProfile" | "hintLessonPlan" | "hintSupervisor"> = {
  form: "hintForm",
  selfAssess: "hintSelfAssess",
  profile: "hintProfile",
  lessonPlan: "hintLessonPlan",
  supervisor: "hintSupervisor",
};

// whole days from a to b (YYYY-MM-DD, both read as UTC)
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const statusText = (s: Status, t: Texts) =>
  ({ none: t.statusNone, pending: t.statusPending, passed1: t.statusPassed1, refer: t.statusRefer, failed: t.statusFailed })[s];

const resultText = (r: Result, t: Texts) =>
  ({
    ok: t.evidenceSaved,
    notPdf: t.evidenceNotPdf,
    tooBig: t.evidenceTooBig,
    full: t.evidenceFull,
    exists: t.errExists,
    empty: t.errEmpty,
    noSession: "",
    locked: t.locked,
    incomplete: t.submitIncomplete,
    notSubmitted: t.reviewNotSubmitted,
    limit: t.resubmitLimit,
  })[r];

// local calendar date as YYYY-MM-DD (the calendar data uses the same format)
const pad = (n: number) => String(n).padStart(2, "0");
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const card = "rounded-xl border border-ink/10 bg-card p-6 md:p-8";
const field = "mt-2 h-12 w-full rounded-lg border border-ink/20 bg-page px-4 text-ink disabled:opacity-60";
const area = `${field} h-32 py-3`;
const label = "block text-sm font-medium text-ink-2";

function Portal({ lang, t, site }: { lang: Lang; t: Texts; site: SiteData }) {
  const router = useRouter();
  const { ready, user, app } = useApplicant();
  const [msg, setMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);
  const seen = useRef<{ status: Status; msgs: number } | null>(null);

  // redirect only after the stored session has been read (see useApplicant)
  useEffect(() => {
    if (ready && !user) router.replace(`/${lang}/login`);
  }, [ready, user, lang, router]);

  // a decision or a new staff message arriving while the page is open (other tab or staff action)
  useEffect(() => {
    const cur = { status: app?.status ?? "none", msgs: app?.messages?.length ?? 0 };
    const before = seen.current;
    seen.current = cur;
    const decided = cur.status !== before?.status && (cur.status === "passed1" || cur.status === "refer" || cur.status === "failed");
    if (before && (decided || cur.msgs > before.msgs)) setNotice(true);
  }, [app?.status, app?.messages?.length]);

  if (!ready || !user) return null;

  const status: Status = app?.status ?? "none";
  const locked = !!app?.submitted;
  const check = checklistOf(app);
  const today = todayIso();
  const openRounds = site.assessmentCalendars.flatMap((c) =>
    c.events.filter((e) => e.type === "apply" && e.start <= today && today <= (e.end ?? e.start)).map((e) => ({ year: c.year, ...e })),
  );
  const history = app?.history ?? [];
  const messages = app?.messages ?? [];
  const say = (r: Result, ok: string) => setMsg(r === "ok" ? ok : resultText(r, t));

  return (
    <main className="font-ui">
      <section className="bg-forest text-page">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-14 pt-40 md:flex-row md:items-end md:justify-between md:px-8 md:pb-16">
          <div>
            <h1 className="text-5xl leading-[1.2] md:text-6xl">{t.title}</h1>
            <p className="mt-5 max-w-xl text-lg text-page/80">{t.intro}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push(`/${lang}/login`);
            }}
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-page/30 px-6 text-sm font-medium text-page hover:bg-page/10"
          >
            {t.logout}
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
        <aside className="md:col-span-4">
          <div className="space-y-10 md:sticky md:top-28">
            {notice && (
              <p role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-accent/30 bg-raised px-4 py-3 text-sm text-ink">
                <span>{t.decisionNotice}</span>
                <button type="button" onClick={() => setNotice(false)} className="shrink-0 text-accent-ink underline underline-offset-4">
                  {t.dismiss}
                </button>
              </p>
            )}
            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.statusTitle}</p>
              <p className="mt-3 font-serif text-4xl font-light leading-snug text-accent-ink">{statusText(status, t)}</p>
            </div>

            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.checklistTitle}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {(
                  [
                    ["ckFields", check.fields],
                    ["ckExplain", check.explain],
                    ["ckProfile", check.profile],
                    ["ckDocs", check.docs],
                  ] as const
                ).map(([k, ok]) => (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span className="text-ink-2">{t[k]}</span>
                    <span className={ok ? "text-accent-ink" : "text-red-700"}>{ok ? t.ckOk : t.ckMissing}</span>
                  </li>
                ))}
              </ul>
              <p className={`mt-4 text-sm ${app?.endorsed ? "text-accent-ink" : "text-ink-3"}`}>{app?.endorsed ? t.endorsedYes : t.endorsedNo}</p>
              {!locked && (status === "none" || status === "refer") && (
                <button
                  type="button"
                  onClick={() => say(submitApplication(), status === "refer" ? t.resubmitDone : t.submitDone)}
                  className="mt-5 h-11 w-full rounded-full bg-accent px-6 font-medium text-white hover:bg-accent-hover"
                >
                  {status === "refer" ? t.resubmit : t.submit}
                </button>
              )}
              {locked && status === "pending" && (
                <button
                  type="button"
                  onClick={() => say(withdrawApplication(), t.withdrawDone)}
                  className="mt-5 h-11 w-full rounded-full border border-ink/20 px-6 font-medium text-ink-2 hover:bg-raised"
                >
                  {t.withdraw}
                </button>
              )}
            </div>

            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.roundTitle}</p>
              {openRounds.length > 0 ? (
                openRounds.map((r) => (
                  <div key={`${r.year}-${r.round}`} className="mt-3">
                    <p className="text-sm font-medium text-ink">
                      {t.roundOpen} · {t.round} {r.round} / {r.year}
                    </p>
                    <p className="mt-1 font-mono text-xs text-ink-3">
                      {fmtDate(r.start, lang)}
                      {r.end ? ` – ${fmtDate(r.end, lang)}` : ""}
                    </p>
                    {(() => {
                      const n = daysBetween(today, r.end ?? r.start);
                      return (
                        <p className={`mt-2 text-sm ${n <= 3 ? "text-red-700" : "text-ink-2"}`}>
                          {n <= 3 ? `${t.closingSoon} · ` : ""}
                          {t.daysLeft ? `${t.daysLeft} ${n} ${t.daysUnit}` : `${n} ${t.daysUnit}`}
                        </p>
                      );
                    })()}
                  </div>
                ))
              ) : (
                <p className="mt-3 text-sm text-ink-2">{t.roundNone}</p>
              )}
            </div>

            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.messagesTitle}</p>
              {messages.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {messages.map((m, i) => (
                    <li key={i} className="rounded-lg bg-raised px-4 py-3 text-sm text-ink-2">
                      {m.text}
                      <span className="mt-2 block font-mono text-xs text-ink-3">{fmtDate(m.at, lang)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-2">{t.messagesEmpty}</p>
              )}
            </div>

            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.historyTitle}</p>
              {history.length > 0 ? (
                <ol className="mt-3 space-y-3 border-l border-ink/15 pl-4">
                  {history.map((h, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-ink">{statusText(h.status, t)}</span>
                      <span className="block font-mono text-xs text-ink-3">{fmtDate(h.at, lang)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-ink-2">{t.historyEmpty}</p>
              )}
            </div>

            <div>
              <p className="font-mono text-xs tracking-[0.05em] text-ink-3">{t.helpTitle}</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href={`/${lang}/faq`} className="text-accent-ink underline underline-offset-4">
                    {t.helpFaq}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/contact`} className="text-accent-ink underline underline-offset-4">
                    {t.helpContact}
                  </Link>
                </li>
              </ul>
            </div>

            {msg && (
              <p role="status" className="rounded-lg bg-raised px-4 py-3 text-sm text-ink-2">
                {msg}
              </p>
            )}
          </div>
        </aside>

        <div className="space-y-8 md:col-span-8">
          <article className={card}>
            <p className="font-serif text-4xl font-light tabular-nums text-accent-ink/60">01</p>
            <h2 className="mt-3 font-serif text-2xl font-light">{t.evidenceTitle}</h2>
            <p className="mt-2 text-sm text-ink-3">{t.evidenceHint}</p>
            <ul className="mt-6 divide-y divide-ink/10">
              {DOC_TYPES.map((type) => {
                const doc = app?.docs?.[type];
                return (
                  <li key={type} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{t[DOC_LABEL[type]]}</p>
                      <p className="mt-1 text-xs text-ink-2">{t[DOC_HINT[type]]}</p>
                      <p className="mt-1 truncate text-xs text-ink-3">{doc?.name ?? "—"}</p>
                    </div>
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={locked}
                      aria-label={t[DOC_LABEL[type]]}
                      className="block max-w-full text-sm file:mr-4 file:h-10 file:rounded-full file:border-0 file:bg-accent file:px-5 file:text-sm file:font-medium file:text-white hover:file:bg-accent-hover disabled:opacity-50"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        say(await uploadDoc(type, file), t.evidenceSaved);
                        e.target.value = "";
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </article>

          <article className={card}>
            <p className="font-serif text-4xl font-light tabular-nums text-accent-ink/60">02</p>
            <h2 className="mt-3 font-serif text-2xl font-light">{t.formTitle}</h2>
            <ApplicationForm key={app?.updated ?? "new"} app={app} t={t} locked={locked} onResult={(r) => say(r, t.saved)} />
          </article>

          <article className={card}>
            <p className="font-serif text-4xl font-light tabular-nums text-accent-ink/60">03</p>
            <h2 className="mt-3 font-serif text-2xl font-light">{t.formsTitle}</h2>
            <ul className="mt-6 divide-y divide-ink/10">
              {site.forms.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-ink-2">{f.title[lang]}</span>
                  {f.file === "#" ? (
                    <span className="shrink-0 text-sm text-ink-3">{t.notYet}</span>
                  ) : (
                    <a href={f.file} download className="shrink-0 text-sm font-medium text-accent-ink underline underline-offset-4 hover:decoration-accent-ink">
                      {t.download}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

function ApplicationForm({ app, t, locked, onResult }: { app: Application | null; t: Texts; locked: boolean; onResult: (r: Result) => void }) {
  return (
    <form
      className="mt-6 grid gap-5 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onResult(
          saveApplication({
            name: String(f.get("name") ?? ""),
            faculty: String(f.get("faculty") ?? ""),
            position: String(f.get("position") ?? ""),
            level: String(f.get("level") ?? ""),
            explain: [String(f.get("ex1") ?? ""), String(f.get("ex2") ?? ""), String(f.get("ex3") ?? "")],
            serviceStart: String(f.get("serviceStart") ?? ""),
            serviceHistory: String(f.get("serviceHistory") ?? ""),
            works: String(f.get("works") ?? ""),
          }),
        );
      }}
    >
      <fieldset disabled={locked} className="contents">
        <label className={label}>
          {t.fName}
          <input name="name" required defaultValue={app?.name} className={field} />
        </label>
        <label className={label}>
          {t.fFaculty}
          <input name="faculty" required defaultValue={app?.faculty} className={field} />
        </label>
        <label className={label}>
          {t.fPosition}
          <input name="position" required defaultValue={app?.position} className={field} />
        </label>
        <label className={label}>
          {t.fLevel}
          <select name="level" required defaultValue={app?.level ?? ""} className={field}>
            <option value="" disabled>
              —
            </option>
            {t.levels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-ink-2">{t.explainTitle}</p>
          <div className="mt-3 grid gap-5">
            <label className={label}>
              {t.ex1}
              <textarea name="ex1" required defaultValue={app?.explain?.[0]} className={area} />
            </label>
            <label className={label}>
              {t.ex2}
              <textarea name="ex2" required defaultValue={app?.explain?.[1]} className={area} />
            </label>
            <label className={label}>
              {t.ex3}
              <textarea name="ex3" required defaultValue={app?.explain?.[2]} className={area} />
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-ink-2">{t.profileTitle}</p>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            <label className={label}>
              {t.fServiceStart}
              <input type="date" name="serviceStart" required defaultValue={app?.serviceStart} className={field} />
            </label>
            <label className={`${label} md:row-span-1`}>
              {t.fServiceHistory}
              <textarea name="serviceHistory" required defaultValue={app?.serviceHistory} className={area} />
            </label>
            <label className={`${label} md:col-span-2`}>
              {t.fWorks}
              <textarea name="works" required defaultValue={app?.works} className={area} />
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <button className="h-12 rounded-full bg-accent px-8 font-medium text-white hover:bg-accent-hover disabled:opacity-50">{t.save}</button>
        </div>
      </fieldset>
    </form>
  );
}
