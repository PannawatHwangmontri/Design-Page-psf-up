// Mock data ทั้งหมดเป็นข้อมูลสมมติ ไม่ใช่บุคคลหรือเหตุการณ์จริง
export const passers = Array.from({ length: 18 }, (_, i) => {
  const n = i + 1;
  const levelNo = (i % 3) + 1;
  const unit = String.fromCharCode(65 + (i % 3)); // A, B, C
  const yearCE = i % 2 === 0 ? 2025 : 2026;
  return {
    id: n,
    name: { th: `ชื่อ นามสกุล ตัวอย่าง ${n}`, en: `Sample Name ${n}` },
    unit: { th: `คณะ/หน่วยงาน ตัวอย่าง ${unit}`, en: `Faculty/Unit Sample ${unit}` },
    level: { th: `ระดับ ${levelNo}`, en: `Level ${levelNo}` },
    year: { th: String(yearCE + 543), en: String(yearCE) },
  };
});

export type NewsItem = { id: number; date: string; title: { th: string; en: string }; excerpt: { th: string; en: string }; image?: string; file?: string };
export const news = Array.from({ length: 6 }, (_, i): NewsItem => {
  const n = i + 1;
  return {
    id: n,
    date: `2026-0${n}-15`,
    title: { th: `หัวข้อข่าว/กิจกรรมตัวอย่าง ${n}`, en: `Sample news / event title ${n}` },
    excerpt: {
      th: "ข้อความย่อตัวอย่างของข่าวหรือกิจกรรม สำหรับแสดงในการ์ด",
      en: "Sample excerpt of a news item or event, shown on the card.",
    },
  };
});

// ประกาศจริงจากเว็บปัจจุบัน (ผู้ใช้ให้มา) เรียงใหม่ไปเก่า หน้าเว็บแสดงทีละ 4 รายการ ไม่มีวันที่ระบุ มีแต่ปี พ.ศ. คำแปลอังกฤษเป็นคำแปลชั่วคราว TODO ตรวจกับต้นฉบับ
export type Announcement = { id: number; year: number; href: string; title: { th: string; en: string }; file?: string };
export const announcements: Announcement[] = [
  { id: 1, year: 2568, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน ประจำปี พ.ศ. 2568", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, B.E. 2568" } },
  { id: 2, year: 2567, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน ประจำปี พ.ศ. 2567", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, B.E. 2567" } },
  { id: 3, year: 2566, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง หลักเกณฑ์และวิธีการคัดเลือกอาจารย์ดีเด่น ด้านการสอน พ.ศ. 2566", en: "University of Phayao Announcement: Criteria and Procedure for the Outstanding Teaching Lecturer Selection, B.E. 2566" } },
  { id: 4, year: 2566, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน ประจำปี พ.ศ. 2566", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, B.E. 2566" } },
  { id: 5, year: 2565, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน มหาวิทยาลัยพะเยา ประจำปี พ.ศ. 2565", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, University of Phayao, B.E. 2565" } },
  { id: 6, year: 2564, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน มหาวิทยาลัยพะเยา ประจำปี พ.ศ. 2564", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, University of Phayao, B.E. 2564" } },
  { id: 7, year: 2563, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน มหาวิทยาลัยพะเยา ประจำปี พ.ศ. 2563", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, University of Phayao, B.E. 2563" } },
  { id: 8, year: 2562, href: "/announcement", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการคัดเลือกอาจารย์ดีเด่น ด้านการสอน มหาวิทยาลัยพะเยา ประจำปี พ.ศ. 2562", en: "University of Phayao Announcement: Results of the Outstanding Teaching Lecturer Selection, University of Phayao, B.E. 2562" } },
];

// ประกาศผลแยกตามปี (พ.ศ. 2566-2569) ใหม่ไปเก่า สำหรับหน้าข่าวประชาสัมพันธ์ ข้อมูลสมมติทั้งหมด
export type Passer = (typeof passers)[number] & { photo?: string }; // photo: data URL uploaded in /admin
export const publicity = [2569, 2568, 2567, 2566].map((year, yi) => ({
  year, // พ.ศ.
  people: Array.from({ length: 6 }, (_, i): Passer => {
    const n = yi * 6 + i + 1;
    const levelNo = (i % 3) + 1;
    const unit = String.fromCharCode(65 + (i % 3));
    return {
      id: n,
      name: { th: `ชื่อ นามสกุล ตัวอย่าง ${n}`, en: `Sample Name ${n}` },
      unit: { th: `คณะ/หน่วยงาน ตัวอย่าง ${unit}`, en: `Faculty/Unit Sample ${unit}` },
      level: { th: `ระดับ ${levelNo}`, en: `Level ${levelNo}` },
      year: { th: String(year), en: String(year - 543) },
    };
  }),
}));

// ปฏิทินการประเมินรายปี (พ.ศ.) หน้าเว็บแสดงปีล่าสุด 2 รอบ/ปี: รับสมัคร -> ประเมิน -> ประกาศผล
export const assessmentCalendars = [
  {
    year: 2569,
    events: [
      { round: 1, type: "apply", start: "2026-02-02", end: "2026-02-27" },
      { round: 1, type: "assess", start: "2026-03-09", end: "2026-04-24" },
      { round: 1, type: "result", start: "2026-05-20" },
      { round: 2, type: "apply", start: "2026-11-02", end: "2026-11-30" },
      { round: 2, type: "assess", start: "2026-12-07", end: "2027-01-15" },
      { round: 2, type: "result", start: "2027-02-10" },
    ],
  },
] as { year: number; events: { round: number; type: "apply" | "assess" | "result"; start: string; end?: string }[] }[];

// แบบฟอร์ม PDF สำหรับหน้า "แบบฟอร์มอื่น ๆ" ไฟล์จริงยังไม่มี ลิงก์เป็น # ชั่วคราว
export const forms = [1, 2, 3, 4].map((n) => ({
  id: n,
  title: { th: `แบบฟอร์มตัวอย่างที่ ${n}`, en: `Sample form ${n}` },
  file: "#", // TODO: ไฟล์ PDF จริง
  updated: `2026-0${n}-10`, // วันที่อัปเดต (ตัวอย่าง)
}));

// เอกสารประกาศปฏิทินการประเมินรายปี (พ.ศ.) หน้าปฏิทิน ข้อมูลตัวอย่างทั้งหมด
export const calendarDocs = [2569, 2568, 2567].map((year, i) => ({
  id: i + 1,
  year,
  title: {
    th: `ประกาศมหาวิทยาลัยพะเยา เรื่อง ปฏิทินการประเมินระดับอาจารย์มืออาชีพ พ.ศ. ${year} (ตัวอย่าง)`,
    en: `University of Phayao announcement: assessment calendar, B.E. ${year} (sample)`,
  },
  file: "#", // TODO: ไฟล์ PDF จริง
}));
