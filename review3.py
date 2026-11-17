import sys
root = r"D:/MyData/psf doc/design/design1/"


def edit(path, pairs):
    s = open(root + path, encoding="utf-8").read()
    for a, b in pairs:
        n = s.count(a)
        if n != 1:
            print("MISS", path, n, a[:90])
            sys.exit(1)
        s = s.replace(a, b)
    open(root + path, "w", encoding="utf-8").write(s)


edit("src/components/PsfSite.tsx", [
    # H1: keep "อาจารย์มืออาชีพ" and "มหาวิทยาลัยพะเยา" each on one line; balanced wrap
    ('''          <h1 className="rise mx-auto block max-w-[20ch] text-balance text-center text-[2.4rem] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[5rem]">
            {t.hero.title.split("มืออาชีพ").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="whitespace-nowrap">มืออาชีพ</span>}
              </span>
            ))}
          </h1>''',
     '''          <h1 className="rise mx-auto block max-w-[22ch] text-balance text-center text-[2.4rem] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[5rem]">
            {t.hero.title.split(/(อาจารย์มืออาชีพ|มหาวิทยาลัยพะเยา)/).map((part, i) =>
              part === "อาจารย์มืออาชีพ" || part === "มหาวิทยาลัยพะเยา" ? (
                <span key={i} className="whitespace-nowrap">{part}</span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h1>'''),
    # hero description on a soft dark panel so it reads over the white uniforms
    ('''<TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 26} step={10} className="mx-auto mt-8 block max-w-2xl text-center text-lg font-medium leading-8 text-page [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]" />''',
     '''<TextEffect as="p" text={t.hero.desc} delay={200 + [...t.hero.title].length * 26} step={10} className="mx-auto mt-8 block max-w-2xl rounded-2xl bg-forest/55 px-5 py-3 text-center text-lg font-medium leading-8 text-page [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]" />'''),
    # touch targets: apply / menu / filter chips / process links
    ('''          <div role="tablist" aria-label={t.passers.title} className="no-scrollbar mt-10 flex gap-3 overflow-x-auto">''',
     '''          <div role="tablist" aria-label={t.passers.title} className="no-scrollbar mt-10 flex gap-3 overflow-x-auto py-1">'''),
    ('''                className={`shrink-0 rounded-full border px-5 py-2 text-sm transition-colors ${
                  lvl === n ? "border-forest bg-forest font-semibold text-page" : "border-forest/25 hover:bg-raised"''',
     '''                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-5 text-sm transition-colors ${
                  lvl === n ? "bg-ink font-medium text-page" : "bg-card text-ink-2 hover:bg-raised"'''),
    # news: shorter cards on mobile (16:9)
    ('''                  {pic(lead.image, t.news.imageAlt, "aspect-[4/3] w-full")}''',
     '''                  {pic(lead.image, t.news.imageAlt, "aspect-[16/9] w-full md:aspect-[4/3]")}'''),
    # split panel: a statement instead of a second "PSF คืออะไร" heading; photo hidden on mobile
    ('''            <h2 data-reveal className={H2}>{t.levels.title}</h2>
            <p className="mt-6 max-w-md text-lg text-page/80">{t.levels.desc}</p>''',
     '''            <p data-reveal className="text-3xl font-semibold leading-tight md:text-5xl">{t.levels.desc}</p>'''),
    ('''        <div className={`${DARK} flex flex-col items-start justify-center rounded-[32px] p-8 text-left md:p-16`}>''',
     '''        <div className={`${DARK} flex flex-col items-start justify-start rounded-[32px] p-8 text-left md:p-16`}>'''),
    ('''          <div className="relative min-h-[240px] overflow-hidden rounded-[32px] md:min-h-[520px]">
            <img src="/img/commons/kwan-phayao-morning.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />''',
     '''          <div className="relative hidden min-h-[520px] overflow-hidden rounded-[32px] md:block">
            <img src="/img/commons/up-sign.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />'''),
    # back-to-top, after the footer band
    ('''      </section>
    </main>''',
     '''      </section>
      <a href="#home" className="fixed bottom-4 right-4 z-40 inline-flex min-h-11 items-center rounded-full bg-page px-5 text-sm font-medium text-ink shadow-[0_10px_30px_-12px_rgba(23,21,31,0.4)] hover:bg-card">
        ↑ {t.home.backTop}
      </a>
    </main>'''),
])

edit("src/components/SiteHeader.tsx", [
    ('className={`flex size-11 items-center justify-center rounded-full px-0', 'className={`flex size-11 items-center justify-center rounded-full px-0'),
])
print("ok")
