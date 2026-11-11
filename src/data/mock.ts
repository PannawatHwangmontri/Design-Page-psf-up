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

export const news = Array.from({ length: 6 }, (_, i) => {
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

// เรียงใหม่ไปเก่า (id 1 = ล่าสุด) หน้าเว็บแสดงทีละ 4 รายการ
export const announcements = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    date: `2026-${String(12 - i).padStart(2, "0")}-20`,
    href: "/announcement", // หน้าตัวอย่างหน้าเดียว TODO: แยกหน้าจริงของแต่ละประกาศ
    title: { th: `หัวข้อประกาศตัวอย่าง ${n}`, en: `Sample announcement title ${n}` },
  };
});

// ประกาศผลแยกตามปี (พ.ศ. 2567-2570) ใหม่ไปเก่า สำหรับหน้าข่าวประชาสัมพันธ์ ข้อมูลสมมติทั้งหมด
export type Passer = (typeof passers)[number];
export const publicity = [2570, 2569, 2568, 2567].map((year, yi) => ({
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
    year: 2570,
    events: [
      { round: 1, type: "apply", start: "2027-01-15", end: "2027-02-28" },
      { round: 1, type: "assess", start: "2027-03-15", end: "2027-04-30" },
      { round: 1, type: "result", start: "2027-05-20" },
      { round: 2, type: "apply", start: "2027-07-01", end: "2027-08-15" },
      { round: 2, type: "assess", start: "2027-09-01", end: "2027-10-15" },
      { round: 2, type: "result", start: "2027-11-20" },
    ],
  },
] as { year: number; events: { round: number; type: "apply" | "assess" | "result"; start: string; end?: string }[] }[];

// แบบฟอร์ม PDF สำหรับหน้า "แบบฟอร์มอื่น ๆ" ไฟล์จริงยังไม่มี ลิงก์เป็น # ชั่วคราว
export const forms = [1, 2, 3, 4].map((n) => ({
  id: n,
  title: { th: `แบบฟอร์มตัวอย่างที่ ${n}`, en: `Sample form ${n}` },
  file: "#", // TODO: ไฟล์ PDF จริง
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
