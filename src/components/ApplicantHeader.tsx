"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { Lang } from "@/data/content";
import { logout, useApplicant } from "@/lib/applicant";
import { useSite } from "@/lib/site";

// Header for the lecturer portal: no public menu, only home, the signed-in account and log out.
export function ApplicantHeader({ lang }: { lang: Lang }) {
  const t = useSite().content[lang];
  const { user } = useApplicant();
  const router = useRouter();
  const pathname = usePathname();
  const base = `/${lang}`;
  const swap = (l: Lang) => pathname.replace(/^\/(th|en)/, `/${l}`);

  return (
    <div className="font-ui sticky top-0 z-30 h-0">
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
        <header className="rounded-[30px] border border-ink/10 bg-page/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 pl-5 pr-3 lg:gap-5">
            <Link href={`${base}/applicant`} className="flex min-w-0 shrink items-center gap-3">
              <img src="/brand/logo-up-mark.png" alt={t.siteOrg} width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-base font-medium text-ink">{t.applicant.title}</span>
                <span className="hidden font-mono text-xs tracking-[0.05em] text-ink-3 sm:block">{t.siteName}</span>
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-4 text-sm">
              <Link href={base} className="hidden whitespace-nowrap text-ink-2 hover:text-accent-ink sm:block">
                {t.nav.home}
              </Link>
              {user && <span className="hidden max-w-40 truncate text-ink-3 md:block">{user}</span>}
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push(`${base}/login`);
                }}
                className="h-9 whitespace-nowrap rounded-full border border-ink/15 px-4 text-ink-2 hover:bg-raised"
              >
                {t.applicant.logout}
              </button>
              <div className="flex items-center gap-1 font-mono text-xs tracking-[0.05em]">
                {(["th", "en"] as const).map((l) => (
                  <Link
                    key={l}
                    href={swap(l)}
                    aria-current={lang === l ? "true" : undefined}
                    className={`flex h-8 items-center rounded-full px-2 hover:text-accent-ink ${lang === l ? "bg-ink/5 font-medium text-ink" : "text-ink-3"}`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
