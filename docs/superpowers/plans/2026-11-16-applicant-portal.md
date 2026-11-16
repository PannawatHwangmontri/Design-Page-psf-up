# ระบบบัญชีอาจารย์ผู้ยื่นขอ PSF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** อาจารย์สมัคร ล็อกอิน ดูสถานะ อัปโหลดหลักฐาน และกรอกแบบฟอร์มยื่นขอ โดยเก็บในเบราว์เซอร์เดียว (demo)

**Architecture:** โมดูลใหม่ `src/lib/applicant.ts` เก็บบัญชีและใบสมัครใน localStorage คนละ key กับ `psf-data` และ `psf-admin` หน้าใหม่อยู่ใต้ `/[lang]/applicant` ทุกข้อความแยกไปที่ `src/data/content.ts`

**Tech Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, SubtleCrypto (SHA-256) สำหรับ hash รหัสผ่าน

**Spec:** `docs/superpowers/specs/2026-11-16-applicant-portal-design.md`

## Global Constraints

- ข้อความบนเว็บต้องมีทั้งไทยและอังกฤษ ห้ามฝังข้อความในคอมโพเนนต์ ใส่ใน `content.ts` เท่านั้น
- ห้ามแก้ `src/lib/site.tsx` และหน้า `/admin` `/login`
- ไฟล์ PDF จำกัดไม่เกิน 2 MB ต่อไฟล์ (2 * 1024 * 1024 bytes ของไฟล์ต้นฉบับ)
- สถานะการยื่นมี 4 ค่าเท่านั้น: `none`, `pending`, `passed1`, `failed`
- ไม่มี commit ในแผนนี้ (ผู้ใช้ยังไม่สั่ง commit)
- ตรวจด้วย `npx tsc --noEmit` และ `npx eslint src` (ต้องไม่มี error ใหม่) และ `npm run build`

## Review Focus

1. รหัสผ่านซ้ำหรือชื่อผู้ใช้ซ้ำตอนสมัคร: ต้องแจ้งว่าชื่อผู้ใช้นี้มีแล้ว ไม่เขียนทับบัญชีเดิม
2. ล็อกอินด้วยชื่อผู้ใช้ที่ไม่มี หรือรหัสผ่านผิด: ต้องแสดงข้อความผิดพลาด ไม่เข้าหน้าอาจารย์
3. อัปโหลดไฟล์ที่ไม่ใช่ PDF หรือเกิน 2 MB: ต้องปฏิเสธพร้อมข้อความแจ้ง ไม่บันทึก
4. localStorage เต็มตอนบันทึกใบสมัคร: ต้องแจ้งผู้ใช้ ไม่หายเงียบ
5. เปิดหน้า `/th/applicant` โดยยังไม่ล็อกอิน: ต้อง redirect ไปหน้าล็อกอิน ไม่แสดงข้อมูลบัญชีอื่น

---

### Task 1: ข้อความสองภาษาของระบบอาจารย์

**Files:**
- Modify: `src/data/content.ts` (เพิ่มคีย์ `applicant` ทั้งใน `th` และ `en` ข้างคีย์ `login`)
- Modify: `src/data/content.ts` ส่วน `nav` เพิ่มคีย์ `applicantLogin` ทั้งสองภาษา

**Interfaces:**
- Consumes: โครงเดิมของ `content` (`content[lang].login` เป็นตัวอย่างรูปแบบ)
- Produces: `content[lang].applicant` มีคีย์ `loginTitle`, `loginIntro`, `user`, `pass`, `signup`, `login`, `toggleToSignup`, `toggleToLogin`, `errExists`, `errBad`, `title`, `statusTitle`, `statusNone`, `statusPending`, `statusPassed1`, `statusFailed`, `evidenceTitle`, `evidenceHint`, `evidenceTooBig`, `evidenceNotPdf`, `evidenceFull`, `formTitle`, `fName`, `fFaculty`, `fPosition`, `fLevel`, `save`, `saved`, `logout`, `levels` (อาร์เรย์ของ `{ value, label }`) และ `content[lang].nav.applicantLogin`

- [ ] **Step 1: เพิ่มข้อความ**

ใส่ค่าภาษาไทยและอังกฤษทั้งคู่ เช่น `loginTitle: "เข้าสู่ระบบอาจารย์"` / `loginTitle: "Lecturer login"` และ `nav.applicantLogin: "เข้าสู่ระบบอาจารย์"` / `"Lecturer login"` ค่า `levels` ให้ใช้ `[{ value: "basic", label: "ระดับพื้นฐาน" }, { value: "intermediate", label: "ระดับกลาง" }, { value: "advanced", label: "ระดับสูง" }]` (ผู้ใช้ยังไม่ได้ระบุระดับจริง ให้ใส่ TODO ไว้ข้างค่า)

- [ ] **Step 2: ตรวจชนิดข้อมูล**

Run: `npx tsc --noEmit`
Expected: ไม่มี error

---

### Task 2: โมดูลบัญชีและใบสมัคร

**Files:**
- Create: `src/lib/applicant.ts`

**Interfaces:**
- Consumes: ไม่มี
- Produces:
  - `type Status = "none" | "pending" | "passed1" | "failed"`
  - `type Application = { name: string; faculty: string; position: string; level: string; status: Status; evidence?: { name: string; dataUrl: string }; updated: string }`
  - `register(user: string, pass: string): Promise<"ok" | "exists" | "empty">`
  - `login(user: string, pass: string): Promise<boolean>`
  - `logout(): void`
  - `useApplicant(): { user: string | null; app: Application | null }` (state + effect ตามรูปแบบ `useSite`)
  - `saveApplication(fields: Pick<Application, "name" | "faculty" | "position" | "level">): boolean` คืน false เมื่อ localStorage เต็ม
  - `uploadEvidence(file: File): Promise<"ok" | "notPdf" | "tooBig" | "full">`

- [ ] **Step 1: เขียน self-check แบบ assert ก่อน**

สร้าง `scripts/applicant-check.ts` ที่เรียก `hashPassword` (export จาก applicant.ts) สองครั้งด้วยรหัสเดียวกันแล้ว assert ว่าได้ค่าเท่ากัน และได้ค่าไม่เท่ากับรหัสต่างกัน รันด้วย `npx tsx scripts/applicant-check.ts`
Expected: FAIL เพราะยังไม่มีฟังก์ชัน

- [ ] **Step 2: เขียน `src/lib/applicant.ts`**

- key: `psf-applicants` (object: ชื่อผู้ใช้ → `{ hash, app? }`), `psf-applicant-session` (ชื่อผู้ใช้ที่ล็อกอินอยู่)
- `hashPassword` ใช้ `crypto.subtle.digest("SHA-256", ...)` แล้วแปลงเป็น hex
- ทุกการอ่านและเขียน localStorage อยู่ใน try/catch
- `uploadEvidence`: ตรวจ `file.type === "application/pdf"` และ `file.size <= 2 * 1024 * 1024` แล้วอ่านเป็น data URL เก็บใน `app.evidence`
- ใช้ `emit()` และ `subscribe` แบบเดียวกับ `site.tsx` เพื่อให้หน้าอัปเดต

- [ ] **Step 3: รัน self-check**

Run: `npx tsx scripts/applicant-check.ts`
Expected: PASS (ไม่พิมพ์ error)

- [ ] **Step 4: ตรวจชนิดข้อมูล**

Run: `npx tsc --noEmit`
Expected: ไม่มี error

---

### Task 3: หน้าล็อกอินและสมัคร

**Files:**
- Create: `src/app/[lang]/applicant/login/page.tsx`

**Interfaces:**
- Consumes: `register`, `login` จาก Task 2; `content[lang].applicant` จาก Task 1; `WithLang` จาก `src/components/WithLang.tsx`
- Produces: หน้า `/[lang]/applicant/login` มีโหมดล็อกอินกับสมัคร สลับด้วยปุ่ม ล็อกอินสำเร็จแล้ว `router.push("/[lang]/applicant")`

- [ ] **Step 1: เขียนหน้า**

ใช้โครงเดียวกับ `src/app/[lang]/login/page.tsx` เพิ่มปุ่มสลับโหมด แสดง `errExists` หรือ `errBad` ตามผลลัพธ์ ห้ามเก็บข้อความใดในคอมโพเนนต์

- [ ] **Step 2: ตรวจ**

Run: `npx tsc --noEmit && npx eslint src`
Expected: ไม่มี error ใหม่

---

### Task 4: หน้าอาจารย์ (สถานะ, อัปโหลด, ฟอร์ม)

**Files:**
- Create: `src/app/[lang]/applicant/page.tsx`

**Interfaces:**
- Consumes: `useApplicant`, `logout`, `saveApplication`, `uploadEvidence` จาก Task 2; ข้อความจาก Task 1
- Produces: หน้า `/[lang]/applicant` แสดงสามส่วน ถ้า `user` เป็น null ให้ `router.replace("/[lang]/applicant/login")`

- [ ] **Step 1: ส่วนสถานะ** แสดงข้อความตาม `app.status` (ค่าเริ่มต้น `none`)
- [ ] **Step 2: ส่วนอัปโหลด** input type file accept `application/pdf` แสดงข้อความผิดพลาดตามผล `uploadEvidence`
- [ ] **Step 3: ส่วนฟอร์ม** เมื่อบันทึกสำเร็จให้ตั้ง `status` เป็น `pending` ถ้า `saveApplication` คืน false แสดง `evidenceFull`
- [ ] **Step 4: ปุ่มออกจากระบบ** เรียก `logout()` แล้ว redirect ไปหน้า login
- [ ] **Step 5: ตรวจ**

Run: `npx tsc --noEmit && npx eslint src`
Expected: ไม่มี error ใหม่

---

### Task 5: ลิงก์เข้าสู่ระบบอาจารย์ในแถบเมนู

**Files:**
- Modify: `src/components/SiteHeader.tsx:132-133` และ `:168-169` (เพิ่มลิงก์ถัดจาก `login` ทั้งเดสก์ท็อปและมือถือ) ใช้ `t.nav.applicantLogin` และ `${base}/applicant/login`

**Interfaces:**
- Consumes: `content[lang].nav.applicantLogin` จาก Task 1

- [ ] **Step 1: เพิ่มลิงก์** ตามรูปแบบเดิมของลิงก์ `login` (ซ่อนบนหน้าจอเล็กเหมือนกัน)
- [ ] **Step 2: ตรวจ**

Run: `npx tsc --noEmit && npx eslint src`
Expected: ไม่มี error ใหม่

---

### Task 6: ตรวจรวมและบันทึก prompt

**Files:**
- Modify: `PROMPT_LOG.md` (เพิ่มแถวใหม่ตามกฎโปรเจกต์)

- [ ] **Step 1: build**

Run: `npm run build`
Expected: สร้างทุกหน้าสำเร็จ รวม `/th/applicant/login` และ `/en/applicant/login`

- [ ] **Step 2: ตรวจด้วยเบราว์เซอร์** ไปที่ `http://localhost:3001/th/applicant/login` สมัคร ล็อกอิน อัปโหลด PDF ทดสอบ (และไฟล์ที่ไม่ใช่ PDF) กรอกฟอร์ม ออกจากระบบ
- [ ] **Step 3: บันทึก PROMPT_LOG.md** เพิ่มแถวใหม่ข้อความ prompt ของผู้ใช้ตามที่พิมพ์ สิ่งที่ทำ และไฟล์ที่แก้
