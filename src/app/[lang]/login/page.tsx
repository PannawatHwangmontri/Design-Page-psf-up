"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WithLang } from "@/components/WithLang";
import type { Lang } from "@/data/content";
import { login, useSite } from "@/lib/site";

// Demo login: checks fixed credentials in src/lib/site.tsx and opens /admin
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <Login lang={lang} />}</WithLang>;
}

function Login({ lang }: { lang: Lang }) {
  const t = useSite().content[lang].login;
  const router = useRouter();
  const [bad, setBad] = useState(false);
  const input = "mt-1 h-12 w-full rounded-lg border border-ink/20 bg-card px-4 text-ink";
  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-28 md:pb-24">
      <h1 className="text-3xl font-medium">{t.title}</h1>
      <p className="mt-2 text-ink-2">{t.intro}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (login(String(f.get("user")), String(f.get("pass")))) router.push(`/${lang}/admin`);
          else setBad(true);
        }}
      >
        <label className="block text-sm">
          {t.user}
          <input name="user" autoComplete="username" required className={input} />
        </label>
        <label className="block text-sm">
          {t.pass}
          <input name="pass" type="password" autoComplete="current-password" required className={input} />
        </label>
        {bad && (
          <p role="alert" className="text-sm text-red-700">
            {t.error}
          </p>
        )}
        <button className="h-12 w-full rounded-full bg-accent font-medium text-white hover:bg-accent-hover">{t.submit}</button>
      </form>
      <p className="mt-6 text-sm text-ink-3">{t.demo}</p>
    </main>
  );
}
