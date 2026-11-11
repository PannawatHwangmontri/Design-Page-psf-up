// Mock data ทั้งหมดเป็นข้อมูลสมมติ ไม่ใช่บุคคลหรือเหตุการณ์จริง
export const passers = Array.from({ length: 9 }, (_, i) => {
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
    title: { th: `หัวข้อประกาศตัวอย่าง ${n}`, en: `Sample announcement title ${n}` },
    excerpt: {
      th: "ข้อความย่อตัวอย่างของประกาศ สำหรับแสดงในการ์ด",
      en: "Sample excerpt of an announcement, shown on the card.",
    },
  };
});
