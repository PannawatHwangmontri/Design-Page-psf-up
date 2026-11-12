"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { content } from "@/data/content";
import { announcements, assessmentCalendars, calendarDocs, forms, news, passers, publicity } from "@/data/mock";

// Demo "backend": data edited in /admin lives in localStorage (this browser only) and overrides the defaults in src/data.
export const defaults = { content, news, passers, announcements, publicity, assessmentCalendars, forms, calendarDocs };
export type SiteData = typeof defaults;
export type SiteKey = keyof SiteData;

const DATA_KEY = "psf-data";
const AUTH_KEY = "psf-admin";
// shortcut: fake login, credentials sit in the client bundle; replace with a real auth service before any real use
const USER = "admin";
const PASS = "admin1234";

type J = unknown;
const isObj = (v: J): v is Record<string, J> => !!v && typeof v === "object" && !Array.isArray(v);
// objects merge key by key (so keys added to the defaults later still show); arrays and strings are replaced
const merge = (d: J, s: J): J => (isObj(d) && isObj(s) ? Object.fromEntries(Object.entries(d).map(([k, v]) => [k, k in s ? merge(v, s[k]) : v])) : (s ?? d));

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
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};

let raw: string | null = null;
let cached: SiteData = defaults;
const getData = () => {
  const r = read(DATA_KEY);
  if (r !== raw) {
    raw = r;
    try {
      cached = r ? (merge(defaults, JSON.parse(r)) as SiteData) : defaults;
    } catch {
      cached = defaults;
    }
  }
  return cached;
};

// state + effect (not useSyncExternalStore): the first client render must equal the server HTML, then the stored data is applied
export function useSite() {
  const [d, setD] = useState<SiteData>(defaults);
  useEffect(() => {
    const f = () => setD(getData());
    f();
    return subscribe(f);
  }, []);
  return d;
}

// returns false when the browser storage is full (uploaded images / PDFs are stored as data URLs)
export function saveData(key: SiteKey, value: unknown) {
  let o: Record<string, unknown> = {};
  try {
    o = JSON.parse(read(DATA_KEY) ?? "{}");
  } catch {}
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify({ ...o, [key]: value }));
  } catch {
    return false;
  }
  emit();
  return true;
}

export function resetData() {
  localStorage.removeItem(DATA_KEY);
  emit();
}

export const useAdmin = () => useSyncExternalStore(subscribe, () => read(AUTH_KEY) === "1", () => false);

export function login(user: string, pass: string) {
  const ok = user === USER && pass === PASS;
  if (ok) {
    localStorage.setItem(AUTH_KEY, "1");
    emit();
  }
  return ok;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  emit();
}
