// Mock data ทั้งหมดเป็นข้อมูลสมมติ ไม่ใช่บุคคลหรือเหตุการณ์จริง (ชื่อบุคคลสุ่มจับคู่จากรายการชื่อทั่วไป)
type L = { th: string; en: string };
const firsts: [string, string][] = [["สมชาย", "Somchai"], ["วิภา", "Wipa"], ["ธนากร", "Thanakorn"], ["พิมพ์ชนก", "Pimchanok"], ["อนุชา", "Anucha"], ["กัญญา", "Kanya"], ["ปรีชา", "Preecha"], ["สุนิสา", "Sunisa"], ["ณัฐพล", "Nattaphon"], ["รัตนา", "Rattana"], ["ชัยวัฒน์", "Chaiwat"], ["มาลี", "Malee"], ["ภานุ", "Phanu"], ["อรทัย", "Orathai"]];
const lasts: [string, string][] = [["ใจดี", "Jaidee"], ["ศรีสุข", "Srisuk"], ["แก้วมณี", "Kaewmanee"], ["วงศ์ไทย", "Wongthai"], ["บุญมา", "Boonma"], ["พรหมวงศ์", "Phromwong"], ["สุวรรณ", "Suwan"], ["ทองดี", "Thongdee"], ["จันทร์เพ็ญ", "Chanphen"], ["เจริญผล", "Charoenphon"], ["รุ่งเรือง", "Rungrueang"]];
const units: [string, string][] = [["คณะวิทยาศาสตร์", "School of Science"], ["คณะพยาบาลศาสตร์", "School of Nursing"], ["คณะเทคโนโลยีสารสนเทศและการสื่อสาร", "School of Information and Communication Technology"], ["คณะบริหารธุรกิจและนิเทศศาสตร์", "School of Business and Communication Arts"], ["คณะศิลปศาสตร์", "School of Liberal Arts"], ["คณะแพทยศาสตร์", "School of Medicine"], ["คณะสถาปัตยกรรมศาสตร์และศิลปกรรมศาสตร์", "School of Architecture and Fine Arts"]];
// คนที่ n: ก้าวของดัชนีต่างกัน ชื่อจึงไม่ซ้ำกันในช่วง 24 คน
const person = (n: number, levelNo: number, year: L) => ({
  id: n,
  name: { th: `อ.${firsts[(n * 5) % firsts.length][0]} ${lasts[(n * 3) % lasts.length][0]}`, en: `${firsts[(n * 5) % firsts.length][1]} ${lasts[(n * 3) % lasts.length][1]}` },
  unit: { th: units[n % units.length][0], en: units[n % units.length][1] },
  level: { th: `ระดับ ${levelNo}`, en: `Level ${levelNo}` },
  year,
});
export const passers = Array.from({ length: 18 }, (_, i) => {
  const yearCE = i % 2 === 0 ? 2025 : 2026;
  return person(i + 1, (i % 3) + 1, { th: String(yearCE + 543), en: String(yearCE) });
});

export type NewsItem = { id: number; date: string; title: { th: string; en: string }; excerpt: { th: string; en: string }; image?: string; file?: string };
export const news = [
  { id: 1, image: "/img/does/activity-meeting.webp", date: "2026-11-03", title: { th: "เปิดรับคำขอรับการประเมินระดับอาจารย์มืออาชีพ รอบที่ 2", en: "Applications for the second assessment round" }, excerpt: { th: "รับคำขอตั้งแต่วันที่ 2 ถึง 30 พฤศจิกายน ผ่านแบบฟอร์มและแนบหลักฐานการปฏิบัติงานให้ครบถ้วน", en: "Applications run from 2 to 30 November. Submit the form with complete evidence of teaching practice." } },
  { id: 2, image: "/img/does/activity-award.jpg", date: "2026-10-24", title: { th: "ประกาศผลผู้ผ่านเกณฑ์ PSF รอบที่ 1 ประจำปี 2569", en: "Round 1 PSF results announced for 2026" }, excerpt: { th: "คณะกรรมการประกาศรายชื่อผู้ผ่านเกณฑ์ทั้ง 3 ระดับ ตรวจสอบรายชื่อได้ที่หน้าผู้ผ่านเกณฑ์", en: "The committee has announced those who met the criteria at all 3 levels. See the list on the passers page." } },
  { id: 3, image: "/img/does/activity-workshop.webp", date: "2026-09-12", title: { th: "เสวนาแลกเปลี่ยนประสบการณ์: การเขียนบันทึกสะท้อนผลการสอน", en: "Panel: writing reflective teaching statements" }, excerpt: { th: "ผู้ผ่านเกณฑ์ร่วมแบ่งปันแนวทางเตรียมหลักฐานและเรียบเรียงบันทึกสะท้อนผล", en: "Lecturers who passed share how they prepared evidence and wrote their reflections." } },
  { id: 4, image: "/img/does/activity-up-backdrop.webp", date: "2026-08-20", title: { th: "ชี้แจงกรอบสมรรถนะและเกณฑ์การประเมินสำหรับผู้สนใจ", en: "Briefing on the competence framework and criteria" }, excerpt: { th: "เปิดให้ผู้สนใจสอบถามเกณฑ์ ขั้นตอน และตัวอย่างหลักฐานที่ใช้ในแต่ละระดับ", en: "Open session on the criteria, the process and sample evidence for each level." } },
  { id: 5, image: "/img/does/activity-team.webp", date: "2026-07-08", title: { th: "ปรับปรุงแบบฟอร์มขอรับการประเมิน ฉบับปี 2569", en: "Updated assessment application form, 2026 edition" }, excerpt: { th: "แบบฟอร์มใหม่ลดความซ้ำซ้อนของข้อมูลและเพิ่มช่องแนบหลักฐานดิจิทัล", en: "The new form removes duplicate fields and adds a slot for digital evidence." } },
  { id: 6, image: "/img/does/campus-statue.webp", date: "2026-06-16", title: { th: "เปิดรับสมัครอาจารย์ดีเด่นด้านการสอน ประจำปีการศึกษาใหม่", en: "Outstanding Teaching Lecturer applications open" }, excerpt: { th: "อาจารย์ที่สนใจสามารถดาวน์โหลดใบสมัครและตรวจสอบคุณสมบัติได้ที่หน้าโครงการ", en: "Interested lecturers can download the application and check eligibility on the project page." } },
  { id: 7, image: "/img/commons/kwan-phayao-sunset.webp", date: "2026-05-22", title: { th: "ประกาศปฏิทินการประเมินระดับอาจารย์มืออาชีพ ประจำปี 2569", en: "Assessment calendar for 2026 announced" }, excerpt: { th: "สรุปกำหนดการรับสมัคร ประเมิน และประกาศผลทั้ง 2 รอบของปีนี้ พร้อมไฟล์ปฏิทินให้ดาวน์โหลด", en: "Application, assessment and result dates for both rounds this year, with the calendar file to download." } },
  { id: 8, image: "/img/does/activity-signing.webp", date: "2026-04-30", title: { th: "ลงนามความร่วมมือพัฒนาสมรรถนะอาจารย์ระหว่างส่วนงาน", en: "Units sign cooperation to develop lecturer competence" }, excerpt: { th: "ส่วนงานวิชาการร่วมกำหนดแนวทางสนับสนุนอาจารย์ที่ยื่นขอรับการประเมินอย่างต่อเนื่อง", en: "Academic units agree on continued support for lecturers applying for assessment." } },
  { id: 9, image: "/img/commons/kwan-phayao-morning.webp", date: "2026-04-10", title: { th: "อบรมเชิงปฏิบัติการ: การออกแบบการเรียนรู้เชิงรุก", en: "Workshop: designing active learning" }, excerpt: { th: "ผู้เข้าร่วมฝึกออกแบบกิจกรรมการเรียนรู้เชิงรุกและเก็บหลักฐานเพื่อใช้ประกอบการประเมิน", en: "Participants practise designing active learning activities and collecting evidence for assessment." } },
  { id: 10, image: "/img/does/activity-gifts.webp", date: "2026-03-18", title: { th: "แลกเปลี่ยนเรียนรู้: เคล็ดลับการเตรียมแฟ้มหลักฐานเชิงประจักษ์", en: "Sharing session: tips for preparing the evidence portfolio" }, excerpt: { th: "ผู้ผ่านเกณฑ์รอบก่อนแนะนำการจัดโครงสร้างแฟ้มและตัวอย่างหลักฐานที่คณะกรรมการมองหา", en: "Past passers explain how to structure the portfolio and what evidence the committee looks for." } },
  { id: 11, image: "/img/commons/ce-building-dusk.webp", date: "2026-02-26", title: { th: "เปิดรับคำขอรับการประเมินระดับอาจารย์มืออาชีพ รอบที่ 1", en: "Applications open for the first assessment round" }, excerpt: { th: "รับคำขอตั้งแต่วันที่ 2 ถึง 27 กุมภาพันธ์ ตรวจสอบแบบฟอร์มและคุณสมบัติก่อนยื่น", en: "Applications run from 2 to 27 February. Check the forms and eligibility before you apply." } },
  { id: 12, date: "2026-01-20", title: { th: "ชี้แจงขั้นตอนการอุทธรณ์ผลการประเมิน", en: "How to appeal an assessment result" }, excerpt: { th: "อธิบายช่องทาง เงื่อนไข และระยะเวลาการยื่นอุทธรณ์ พร้อมแบบฟอร์มที่เกี่ยวข้อง", en: "Explains the channel, conditions and time limit for an appeal, with the related form." } },
  { id: 13, image: "/img/commons/up-sign.webp", date: "2025-12-12", title: { th: "สรุปผลการดำเนินงาน PSF ประจำปี 2568", en: "PSF progress summary for 2025" }, excerpt: { th: "รวบรวมจำนวนผู้ยื่นและผู้ผ่านเกณฑ์ตามระดับ พร้อมข้อเสนอแนะเพื่อปรับปรุงปีถัดไป", en: "Numbers of applicants and passers by level, with suggestions for next year." } },
  { id: 14, image: "/img/does/activity-meeting.webp", date: "2025-11-05", title: { th: "ประชุมคณะกรรมการพิจารณาเกณฑ์การประเมิน ครั้งที่ 3", en: "Assessment criteria committee, meeting 3" }, excerpt: { th: "ที่ประชุมพิจารณาปรับถ้อยคำของเกณฑ์ระดับ 2 และ 3 ให้ชัดเจนขึ้น", en: "The committee reviews clearer wording for the level 2 and 3 criteria." } },
] as NewsItem[];

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
  people: Array.from({ length: 6 }, (_, i): Passer => person(yi * 6 + i + 1, (i % 3) + 1, { th: String(year), en: String(year - 543) })),
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
  {
    year: 2568, // วันที่จากโปสเตอร์ปฏิทินจริง (does.up.ac.th) ผลประกาศระบุเป็นเดือนจึงใช้ note
    events: [
      { round: 1, type: "apply", start: "2025-01-02", end: "2025-01-31" },
      { round: 1, type: "assess", start: "2025-02-01", end: "2025-02-28" },
      { round: 1, type: "result", start: "2025-04-30", note: { th: "ภายในเดือนเมษายน 2568", en: "Within April 2025" } },
      { round: 2, type: "apply", start: "2025-05-01", end: "2025-05-30" },
      { round: 2, type: "assess", start: "2025-06-02", end: "2025-06-30" },
      { round: 2, type: "result", start: "2025-08-31", note: { th: "ภายในเดือนสิงหาคม 2568", en: "Within August 2025" } },
    ],
  },
] as { year: number; events: { round: number; type: "apply" | "assess" | "result"; start: string; end?: string; note?: { th: string; en: string } }[] }[];

// แบบฟอร์ม PDF สำหรับหน้า "แบบฟอร์มอื่น ๆ" ไฟล์จริงยังไม่มี ลิงก์เป็น # ชั่วคราว
export const forms = [
  { id: 1, title: { th: "แบบคำขอรับการประเมินระดับอาจารย์มืออาชีพ", en: "Application form for lecturer assessment" }, file: "#" /* TODO: ไฟล์ PDF จริง */, updated: "2026-03-10" },
  { id: 2, title: { th: "แบบบันทึกสะท้อนผลการปฏิบัติงานด้านการเรียนการสอน", en: "Reflective teaching practice record" }, file: "#" /* TODO: ไฟล์ PDF จริง */, updated: "2026-04-10" },
  { id: 3, title: { th: "แบบรวบรวมหลักฐานเชิงประจักษ์ประกอบการประเมิน", en: "Evidence portfolio checklist" }, file: "#" /* TODO: ไฟล์ PDF จริง */, updated: "2026-05-10" },
  { id: 4, title: { th: "แบบอุทธรณ์ผลการประเมิน", en: "Assessment appeal form" }, file: "#" /* TODO: ไฟล์ PDF จริง */, updated: "2026-06-10" },
];

// เอกสารประกาศปฏิทินการประเมินรายปี (พ.ศ.) หน้าปฏิทิน poster = รูปโปสเตอร์ (มีจริงเฉพาะ 2568)
// ยังไม่มีไฟล์ PDF ปฏิทินจริงของปีใด (ปุ่มดูเอกสาร/ดาวน์โหลดในหน้า /calendar จะแสดงเมื่อ file ไม่ใช่ "#") ประกาศหลักเกณฑ์ 2569 (psf-criteria-2569.pdf) ไม่ใช่ปฏิทิน จึงอยู่เฉพาะหน้าคู่มือ
export const calendarDocs = [
  {
    id: 1,
    year: 2569,
    title: { th: "ปฏิทินการดำเนินงานการประเมินระดับอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา พ.ศ. 2569 (ตัวอย่าง)", en: "Professional Lecturer assessment calendar, University of Phayao, B.E. 2569 (sample)" },
    file: "#", // TODO: ไฟล์ PDF ปฏิทินจริง
    poster: undefined as string | undefined,
  },
  {
    id: 2,
    year: 2568,
    title: { th: "ปฏิทินการดำเนินงานการประเมินระดับอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา พ.ศ. 2568", en: "Professional Lecturer assessment calendar, University of Phayao, B.E. 2568" },
    file: "#", // TODO: ไฟล์ PDF จริง (เว็บต้นทางมีแต่รูปโปสเตอร์)
    poster: "/img/does/calendar-poster-2568.webp" as string | undefined,
  },
  {
    id: 3,
    year: 2567,
    title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ปฏิทินการประเมินระดับอาจารย์มืออาชีพ พ.ศ. 2567 (ตัวอย่าง)", en: "University of Phayao announcement: assessment calendar, B.E. 2567 (sample)" },
    file: "#", // TODO: ไฟล์ PDF จริง
    poster: undefined as string | undefined,
  },
];

// ประกาศ/หลักเกณฑ์ PSF จริงจาก https://does.up.ac.th/announce/info/33 (ไฟล์อยู่ใน public/docs) ชื่ออังกฤษเป็นคำแปลไม่เป็นทางการ
// ไม่อยู่ใน defaults ของ /admin จึงแก้ที่ไฟล์นี้
export type Manual = { id: number; year: number; title: { th: string; en: string }; file: string };
export const manuals: Manual[] = [
  { id: 1, year: 2569, file: "/docs/psf-criteria-2569.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง หลักเกณฑ์และวิธีการประเมินระดับอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา พ.ศ. 2569", en: "Announcement: criteria and methods of the Professional Lecturer assessment, B.E. 2569" } },
  { id: 2, year: 2569, file: "/docs/psf-support-2569.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง เงินสนับสนุนสำหรับส่วนงานที่ส่งเสริมการขอรับการรับรองระดับอาจารย์มืออาชีพ พ.ศ. 2569", en: "Announcement: funding for units that promote applications for Professional Lecturer recognition, B.E. 2569" } },
  { id: 3, year: 2569, file: "/docs/psf-awards-2569.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รางวัลสำหรับอาจารย์ที่ผ่านการประเมินระดับอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา พ.ศ. 2569", en: "Announcement: awards for lecturers who passed the Professional Lecturer assessment, B.E. 2569" } },
  { id: 4, year: 2568, file: "/docs/psf-standard-2568.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง มาตรฐานอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา พ.ศ. 2568", en: "Announcement: the Professional Lecturer Standards, University of Phayao, B.E. 2568" } },
  { id: 5, year: 2568, file: "/docs/psf-faculty-result-2568.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการพิจารณาส่วนงานที่ส่งเสริมการขอรับการรับรองระดับอาจารย์มืออาชีพ ประจำปีงบประมาณ พ.ศ. 2568", en: "Announcement: results for units that promote Professional Lecturer recognition, fiscal year B.E. 2568" } },
  { id: 6, year: 2567, file: "/docs/psf-competency-2567.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง การพัฒนาสมรรถนะอาจารย์ มหาวิทยาลัยพะเยา พ.ศ. 2567", en: "Announcement: developing lecturer competence, University of Phayao, B.E. 2567" } },
  { id: 7, year: 2567, file: "/docs/psf-faculty-result-2567.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการพิจารณาส่วนงานที่ส่งเสริมการขอรับการรับรองระดับอาจารย์มืออาชีพ ประจำปีงบประมาณ พ.ศ. 2567", en: "Announcement: results for units that promote Professional Lecturer recognition, fiscal year B.E. 2567" } },
  { id: 8, year: 2566, file: "/docs/psf-faculty-result-2566.pdf", title: { th: "ประกาศมหาวิทยาลัยพะเยา เรื่อง ผลการพิจารณาส่วนงานที่ส่งเสริมการขอรับการรับรองระดับอาจารย์มืออาชีพ ประจำปีงบประมาณ พ.ศ. 2566", en: "Announcement: results for units that promote Professional Lecturer recognition, fiscal year B.E. 2566" } },
];
