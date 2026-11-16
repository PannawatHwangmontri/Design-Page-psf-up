"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { WithLang } from "@/components/WithLang";
import type { Lang } from "@/data/content";
import { login as applicantLogin, register } from "@/lib/applicant";
import { login as adminLogin, useSite } from "@/lib/site";

// One login for every account. The username decides the destination: the admin credentials open /admin,
// a lecturer account opens /applicant. Admin is checked first, so admin credentials always win.
export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <WithLang params={params}>{(lang) => <Login lang={lang} />}</WithLang>;
}

function Login({ lang }: { lang: Lang }) {
  const site = useSite();
  const t = site.content[lang].login;
  const ta = site.content[lang].applicant;
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = "mt-1 h-12 w-full rounded-lg border border-ink/20 bg-card px-4 text-ink";

  return (
    <main className="font-ui mx-auto max-w-md px-4 pb-16 pt-32 md:pb-24">
      <h1 className="text-3xl font-medium">{t.title}</h1>
      <p className="mt-2 text-ink-2">{t.intro}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const user = String(f.get("user") ?? "").trim();
          const pass = String(f.get("pass") ?? "");
          if (!user || !pass) return setErr(ta.errEmpty);
          if (signup) {
            const r = await register(user, pass);
            if (r === "exists") return setErr(ta.errExists);
            if (r === "full") return setErr(ta.evidenceFull);
            if (r !== "ok") return setErr(ta.errEmpty);
          } else if (adminLogin(user, pass)) {
            return router.push(`/${lang}/admin`);
          }
          if (await applicantLogin(user, pass)) router.push(`/${lang}/applicant`);
          else setErr(t.error);
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
        {err && (
          <p role="alert" className="text-sm text-red-700">
            {err}
          </p>
        )}
        <button className="h-12 w-full rounded-full bg-accent font-medium text-white hover:bg-accent-hover">{signup ? ta.signup : t.submit}</button>
      </form>
      <button
        type="button"
        onClick={() => {
          setErr(null);
          setSignup((s) => !s);
        }}
        className="mt-6 text-sm text-accent-ink underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink"
      >
        {signup ? ta.toggleToLogin : ta.toggleToSignup}
      </button>
      <p className="mt-6 text-sm text-ink-3">{t.demo}</p>
    </main>
  );
}
