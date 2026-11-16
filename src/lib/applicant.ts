"use client";

import { useEffect, useState } from "react";

// Demo applicant accounts (lecturers). Stored in this browser's localStorage only; separate keys from the admin store (site.tsx).
// "refer" = revise and resubmit once (same as the Advance HE outcome); the lecturer may then edit and submit again
export type Status = "none" | "pending" | "passed1" | "refer" | "failed";
// evidence types the lecturer uploads, one file each
export const DOC_TYPES = ["form", "selfAssess", "profile", "lessonPlan", "supervisor"] as const;
export type DocType = (typeof DOC_TYPES)[number];
export type Evidence = { name: string; dataUrl: string };
export type Application = {
  name: string;
  faculty: string;
  position: string;
  level: string;
  // written explanation for the three UP-PSF components: knowledge, teaching skill, teacher's value
  explain: string[];
  serviceStart: string;
  serviceHistory: string;
  works: string;
  // submitted applications are locked until withdrawn (only while status is still pending)
  submitted?: boolean;
  // how many times the lecturer resubmitted after a "refer" (max 1)
  resubmits?: number;
  // set by staff: the faculty / department has endorsed this application
  endorsed?: boolean;
  status: Status;
  docs?: Partial<Record<DocType, Evidence>>;
  history?: { status: Status; at: string }[];
  messages?: { text: string; at: string }[];
  updated: string;
};
type Account = { hash: string; app?: Application };
type Accounts = Record<string, Account>;
export type Result =
  | "ok"
  | "exists"
  | "empty"
  | "full"
  | "notPdf"
  | "tooBig"
  | "noSession"
  | "locked"
  | "incomplete"
  | "notSubmitted"
  | "limit";

// the resubmission allowed after a "refer"
const MAX_RESUBMITS = 1;

const ACCOUNTS_KEY = "psf-applicants";
const SESSION_KEY = "psf-applicant-session";
const MAX_PDF = 2 * 1024 * 1024;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
    return true;
  } catch {
    return false;
  }
};
const remove = (k: string) => {
  try {
    localStorage.removeItem(k);
  } catch {}
};

const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => {
  subs.add(f);
  window.addEventListener("storage", f);
  return () => {
    subs.delete(f);
    window.removeEventListener("storage", f);
  };
};

export async function hashPassword(pass: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function loadAccounts(): Accounts {
  try {
    const v = JSON.parse(read(ACCOUNTS_KEY) ?? "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Accounts) : {};
  } catch {
    return {};
  }
}

export async function register(user: string, pass: string): Promise<Result> {
  const name = user.trim();
  if (!name || !pass) return "empty";
  const accounts = loadAccounts();
  if (accounts[name]) return "exists";
  accounts[name] = { hash: await hashPassword(pass) };
  if (!write(ACCOUNTS_KEY, JSON.stringify(accounts))) return "full";
  return "ok";
}

export async function login(user: string, pass: string): Promise<boolean> {
  const acc = loadAccounts()[user.trim()];
  if (!acc || acc.hash !== (await hashPassword(pass))) return false;
  if (!write(SESSION_KEY, user.trim())) return false;
  emit();
  return true;
}

export function logout() {
  remove(SESSION_KEY);
  emit();
}

// state + effect (same pattern as useSite): first client render matches the server HTML, then stored data is applied.
// ready turns true only after the stored session has been read, so pages can redirect without a false "logged out" first render.
export function useApplicant() {
  const [s, setS] = useState<{ ready: boolean; user: string | null; app: Application | null }>({ ready: false, user: null, app: null });
  useEffect(() => {
    const f = () => {
      const user = read(SESSION_KEY);
      const acc = user ? loadAccounts()[user] : undefined;
      setS({ ready: true, user: acc ? user : null, app: acc?.app ?? null });
    };
    f();
    return subscribe(f);
  }, []);
  return s;
}

// every account with its application (admin review); same store pattern as useApplicant
export function useApplicantList() {
  const [list, setList] = useState<{ user: string; app: Application | null }[]>([]);
  useEffect(() => {
    const f = () => setList(Object.entries(loadAccounts()).map(([user, acc]) => ({ user, app: acc.app ?? null })));
    f();
    return subscribe(f);
  }, []);
  return list;
}

const blankApp = (): Application => ({
  name: "",
  faculty: "",
  position: "",
  level: "",
  explain: ["", "", ""],
  serviceStart: "",
  serviceHistory: "",
  works: "",
  status: "none",
  updated: new Date().toISOString(),
});

// the four groups that must be complete before submitting
export function checklistOf(app: Application | null) {
  const a = app ?? blankApp();
  return {
    fields: !!a.name.trim() && !!a.faculty.trim() && !!a.position.trim() && !!a.level,
    explain: a.explain.length === 3 && a.explain.every((x) => x.trim() !== ""),
    profile: !!a.serviceStart && !!a.serviceHistory.trim() && !!a.works.trim(),
    docs: DOC_TYPES.every((t) => !!a.docs?.[t]),
  };
}

const withApp = (user: string, accounts: Accounts, app: Application) => {
  accounts[user] = { ...accounts[user], app };
  return write(ACCOUNTS_KEY, JSON.stringify(accounts));
};

// saves the draft form; locked once submitted. returns "full" when browser storage is full.
export function saveApplication(fields: Pick<Application, "name" | "faculty" | "position" | "level" | "explain" | "serviceStart" | "serviceHistory" | "works">): Result {
  const user = read(SESSION_KEY);
  const accounts = loadAccounts();
  const acc = user ? accounts[user] : undefined;
  if (!user || !acc) return "noSession";
  const prev = acc.app ?? blankApp();
  if (prev.submitted) return "locked";
  if (!withApp(user, accounts, { ...prev, ...fields, updated: new Date().toISOString() })) return "full";
  emit();
  return "ok";
}

// checks the checklist, then locks the application and sets status pending
export function submitApplication(): Result {
  const user = read(SESSION_KEY);
  const accounts = loadAccounts();
  const acc = user ? accounts[user] : undefined;
  if (!user || !acc) return "noSession";
  const prev = acc.app ?? blankApp();
  if (prev.submitted) return "locked";
  const resubmitting = prev.status === "refer";
  if (resubmitting && (prev.resubmits ?? 0) >= MAX_RESUBMITS) return "limit";
  const c = checklistOf(prev);
  if (!(c.fields && c.explain && c.profile && c.docs)) return "incomplete";
  const now = new Date().toISOString();
  const app: Application = {
    ...prev,
    submitted: true,
    status: "pending",
    resubmits: (prev.resubmits ?? 0) + (resubmitting ? 1 : 0),
    history: [...(prev.history ?? []), { status: "pending", at: now }],
    updated: now,
  };
  if (!withApp(user, accounts, app)) return "full";
  emit();
  return "ok";
}

// only while nothing has been decided yet; unlocks the form again
export function withdrawApplication(): Result {
  const user = read(SESSION_KEY);
  const accounts = loadAccounts();
  const acc = user ? accounts[user] : undefined;
  if (!user || !acc?.app?.submitted || acc.app.status !== "pending") return "locked";
  const now = new Date().toISOString();
  const app: Application = { ...acc.app, submitted: false, status: "none", history: [...(acc.app.history ?? []), { status: "none", at: now }], updated: now };
  if (!withApp(user, accounts, app)) return "full";
  emit();
  return "ok";
}

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export async function uploadDoc(type: DocType, file: File): Promise<Result> {
  if (file.type !== "application/pdf") return "notPdf";
  if (file.size > MAX_PDF) return "tooBig";
  const user = read(SESSION_KEY);
  if (!user || !loadAccounts()[user]) return "noSession";
  const dataUrl = await readAsDataUrl(file);
  // re-read after the await: a form save made meanwhile must not be overwritten
  const accounts = loadAccounts();
  const acc = accounts[user];
  if (!acc) return "noSession";
  const prev = acc.app ?? blankApp();
  if (prev.submitted) return "locked";
  if (!withApp(user, accounts, { ...prev, docs: { ...(prev.docs ?? {}), [type]: { name: file.name, dataUrl } } })) return "full";
  emit();
  return "ok";
}

// admin: set a decision (status) and/or a note for a submitted application. Note becomes a message the applicant sees.
export function reviewApplication(user: string, status: Status, note: string, endorsed: boolean): Result {
  const accounts = loadAccounts();
  const acc = accounts[user];
  if (!acc?.app?.submitted) return "notSubmitted";
  const prev = acc.app;
  if (status === "refer" && (prev.resubmits ?? 0) >= MAX_RESUBMITS) return "limit";
  const now = new Date().toISOString();
  const changed = status !== prev.status;
  const app: Application = {
    ...prev,
    status,
    // a refer unlocks the form so the lecturer can revise it
    submitted: status === "refer" ? false : prev.submitted,
    endorsed,
    history: changed ? [...(prev.history ?? []), { status, at: now }] : prev.history,
    messages: note.trim() ? [...(prev.messages ?? []), { text: note.trim(), at: now }] : prev.messages,
  };
  if (!withApp(user, accounts, app)) return "full";
  emit();
  return "ok";
}
