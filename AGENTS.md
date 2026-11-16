# AGENTS.md — กฎสำหรับ AI agent ทั่วไป

ใช้กับ AI agent ทุกตัวที่แก้โค้ดในโปรเจกต์นี้ กฎทั้งหมดของโปรเจกต์อยู่ใน CLAUDE.md (ภาษา, ข้อมูล mock, บันทึก prompt, git, คำสั่งตรวจโค้ด, โครงสร้างโค้ด, เส้นทางหน้า) และการออกแบบอยู่ใน DESIGN.md ไฟล์นี้สรุปเฉพาะข้อที่ห้ามพลาด

## ก่อนเริ่มงาน

- อ่าน CLAUDE.md และ DESIGN.md ก่อนทุกครั้ง
- ถ้าคำขอไม่ชัดเจนหรือขาดข้อมูล ให้ถามผู้ใช้ก่อน ห้ามเดาเอง

## ขอบเขตการแก้ไข

- แก้เฉพาะไฟล์ที่เกี่ยวกับงานที่ได้รับมอบหมาย
- ห้ามเพิ่มฟีเจอร์ ไลบรารี หรือหน้าใหม่ที่ผู้ใช้ไม่ได้ขอ
- ห้ามลบหรือเขียนทับไฟล์เดิมโดยไม่ตรวจดูเนื้อหาก่อน
- ห้ามแก้ GEMINI.md โดยตรง ให้แก้ที่ CLAUDE.md
- ห้าม commit หรือ push ถ้าผู้ใช้ไม่ได้สั่ง

## มาตรฐานโค้ด

- ใช้ TypeScript และ Tailwind CSS ตามสแตกของโปรเจกต์
- ใช้ค่าสี ฟอนต์ และระยะห่างจาก DESIGN.md และ COLORS.md เท่านั้น ห้ามใส่ค่าสีตายตัวในคอมโพเนนต์
- ข้อความบนเว็บต้องมีไทยและอังกฤษ และอยู่ใน `src/data/content.ts` ไม่ฝังในคอมโพเนนต์
- ข้อมูลตัวอย่างต้องเป็น mock data ห้ามใช้ชื่อบุคคลจริง

## ก่อนส่งงาน

- รัน `npx tsc --noEmit` และ `npx eslint src` ต้องไม่มี error ใหม่ (error เดิม 1 จุดดูใน CLAUDE.md)
- ถ้า prompt ของผู้ใช้ทำให้หน้าเว็บเปลี่ยน ให้เพิ่มแถวใน PROMPT_LOG.md
- สรุปสิ่งที่เปลี่ยน และบอกสิ่งที่ยังไม่ได้ตรวจหรือยังไม่ได้ทำ

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
