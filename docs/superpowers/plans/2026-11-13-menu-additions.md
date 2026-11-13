# เพิ่มรายการในเมนูบาร์ — แผนงาน

> สำหรับผู้ลงมือ: ทำทีละงาน ตรวจด้วย `npx tsc --noEmit` และภาพหน้าจอ (โปรเจกต์นี้ไม่มีชุดทดสอบอัตโนมัติ)

**เป้าหมาย:** เพิ่มรายการเมนู 4 กลุ่มตาม spec พร้อมหน้าใหม่ `/documents/manuals`, `/faq`, `/contact`

**โครงสร้าง:** เมนูอยู่ใน `src/data/nav.ts` ป้ายอยู่ใน `content.ts` (ไทย/อังกฤษ) หน้าใหม่ใช้แถบรูปมืดแบบเดียวกับหน้าอื่นใน branch `design/editorial-serif`

**เทคโนโลยี:** Next.js App Router, TypeScript, Tailwind (ตามโปรเจกต์)

**Spec:** `docs/superpowers/specs/2026-11-13-menu-additions-design.md`

## ข้อกำหนดทั่วไป (จาก spec และกฎโปรเจกต์)

- ข้อความบนเว็บต้องมีไทยและอังกฤษ อยู่ใน `content.ts` ห้ามฝังในคอมโพเนนต์
- ห้ามเดาข้อมูล: FAQ และติดต่อต้องติดป้าย "ตัวอย่าง"; ไฟล์ PDF ใช้ของจริงจาก does.up.ac.th เท่านั้น
- ไม่ทำฟอร์มส่งข้อความ ไม่ทำระบบสมัครภายนอก ไม่ทำช่องค้นหา
- อัปเดต `DESIGN.md` และ `PROMPT_LOG.md` ก่อนจบ

## จุดที่ต้องระวัง (Review Focus)

- แถบเมนูกว้างเกินบนจอ 1024–1280px: ปุ่มยื่นขอแสดงที่ ≥1280px, ลิงก์เข้าสู่ระบบที่ ≥1024px
- ปุ่มและลิงก์เข้าสู่ระบบต้องอยู่ในเมนูมือถือด้วย
- PDF ที่ iframe เปิดไม่ได้ ต้องมีปุ่มดาวน์โหลดสำรอง
- ลิงก์เมนูเก่า `/login` ต้องยังใช้ได้

## งาน

### งาน 1: เมนู ป้าย ปุ่ม (Files: `nav.ts`, `content.ts`, `SiteHeader.tsx`)
- [ ] ป้าย `nav.apply|processPage|assessment|manuals|help|faq|contact` ไทย+อังกฤษ ลบ `nav.other`
- [ ] `nav.ts`: เกี่ยวกับ + (processPage `/process`, assessment `/assessment`); เอกสาร + (manuals `/documents/manuals`); กลุ่ม `help` (faq `/faq`, contact `/contact`) แทนกลุ่ม `other`
- [ ] `SiteHeader.tsx`: ปุ่ม `apply` (ไป `/documents/forms`) + ลิงก์ `login` ก่อนปุ่ม TH/EN; เพิ่มทั้งสองท้ายเมนูมือถือ
- [ ] ตรวจ: `npx tsc --noEmit` ผ่าน

### งาน 2: คู่มือ (Files: `src/data/mock.ts`, `public/docs/*.pdf`, `PdfRow.tsx`, `documents/manuals/page.tsx`)
- [ ] ดาวน์โหลด PDF 8 ไฟล์ (ประกาศปี 2566–2569) จาก `https://does.up.ac.th/announce/file/document/<id>`; ไฟล์แรก "แบบฟอร์ม อื่นๆ" ไม่ใส่ (เป็นแบบฟอร์ม)
- [ ] `manuals: { id:number; year:number; title:{th,en}; file:string }[]` ใน `mock.ts`
- [ ] `PdfRow({lang, item})`: ชื่อ ปี ปุ่มดูในหน้า/ซ่อน ปุ่มดาวน์โหลด iframe `#view=FitH`
- [ ] ตรวจ: หน้าโหลด ไฟล์ตอบ 200 `application/pdf`

### งาน 3: คำถามที่พบบ่อย และติดต่อเรา (Files: `content.ts`, `faq/page.tsx`, `contact/page.tsx`)
- [ ] `pages.faq`: title, intro, sample, note, items[{q,a}] 5 ข้อ ไทย+อังกฤษ; หน้าใช้ `<details>`
- [ ] `pages.contact`: title, intro, ป้ายที่อยู่/อีเมล/โทร, note; ข้อมูลจาก `content.contact`
- [ ] ตรวจ: ทั้งสองหน้าขึ้นในภาพหน้าจอ

### งาน 4: เอกสาร (Files: `DESIGN.md`, `PROMPT_LOG.md`)
- [ ] อัปเดตส่วนเมนูและ Header ใน `DESIGN.md`; เพิ่มแถว `PROMPT_LOG.md`
- [ ] ตรวจครั้งสุดท้าย: `npx tsc --noEmit` และ `npx eslint src`
