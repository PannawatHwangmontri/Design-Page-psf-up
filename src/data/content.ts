export type Lang = "th" | "en";

// ข้อความตัวอย่างทั้งหมด (Claude ร่างตามที่ผู้ใช้อนุญาต) แก้ได้ที่ไฟล์นี้
export const content = {
  th: {
    siteName: "PSF มหาวิทยาลัยพะเยา",
    siteSub: "Professional Standards Framework",
    logo: "โลโก้",
    nav: { home: "หน้าแรก", process: "ขั้นตอน", about: "เกี่ยวกับ / พันธกิจ", news: "ประกาศ", passers: "ผู้ยื่นผ่านเกณฑ์" },
    hero: {
      eyebrow: "Professional Standards Framework",
      title: "รับรองมาตรฐานวิชาชีพของบุคลากรด้านการเรียนการสอน",
      desc: "กรอบประเมินสมรรถนะของบุคลากร มหาวิทยาลัยพะเยา พร้อมประกาศรายชื่อผู้ที่ผ่านการรับรอง",
      cta: "ดูผู้ยื่นผ่านเกณฑ์",
      cta2: "ประกาศ",
      imageAlt: "ภาพแบนเนอร์ (ตัวอย่าง)",
    },
    // label เป็น mono อังกฤษเหมือนกันทั้งสองภาษา ข้อความขั้นตอนเป็นข้อความสมมติ
    process: {
      title: "ขั้นตอน PSF",
      tiles: [
        { label: "01 / FRAMEWORK", title: "กรอบสมรรถนะ", desc: "กำหนดสิ่งที่บุคลากรต้องแสดงให้เห็นในแต่ละระดับ" },
        { label: "02 / SUBMIT", title: "ยื่นคำขอ", desc: "ส่งเอกสารและหลักฐานการปฏิบัติงาน" },
        { label: "03 / REVIEW", title: "พิจารณา", desc: "คณะกรรมการประเมินตามเกณฑ์" },
        { label: "04 / RECOGNISE", title: "รับรอง", desc: "แจ้งผลและออกหนังสือรับรอง" },
        { label: "05 / PUBLISH", title: "ประกาศ", desc: "เผยแพร่รายชื่อผู้ผ่านการรับรอง" },
      ],
    },
    about: {
      title: "เกี่ยวกับ / พันธกิจ",
      intro:
        "PSF คือกรอบมาตรฐานวิชาชีพที่ใช้เป็นแนวทางพัฒนาและรับรองสมรรถนะของบุคลากรด้านการเรียนการสอนและการสนับสนุนการเรียนรู้",
      missionTitle: "พันธกิจ",
      mission: [
        "ส่งเสริมการพัฒนาวิชาชีพอย่างต่อเนื่อง",
        "สร้างมาตรฐานที่โปร่งใสและน่าเชื่อถือ",
        "เผยแพร่และยกย่องผู้ที่ผ่านการรับรอง",
      ],
      note: "ข้อความตัวอย่างเพื่อการสาธิต",
    },
    news: { title: "ประกาศ", imageAlt: "ภาพประกาศ (ตัวอย่าง)" },
    passers: {
      title: "ประชาสัมพันธ์ผู้ยื่นผ่านเกณฑ์ PSF",
      desc: "รายชื่อตัวอย่างของผู้ที่ผ่านการรับรอง",
      level: "ระดับ PSF",
      year: "ปีที่ผ่าน",
      photoAlt: "รูปผู้ยื่น (ตัวอย่าง)",
    },
    footer: "© PSF มหาวิทยาลัยพะเยา — เว็บตัวอย่างเพื่อการสาธิต ข้อมูลทั้งหมดเป็นข้อมูลสมมติ",
    langBtn: "EN",
    langLabel: "Switch to English",
  },
  en: {
    siteName: "PSF — University of Phayao",
    siteSub: "Professional Standards Framework",
    logo: "Logo",
    nav: { home: "Home", process: "Process", about: "About / Mission", news: "Announcements", passers: "Recognised Staff" },
    hero: {
      eyebrow: "Professional Standards Framework",
      title: "Recognising professional standards in teaching and learning support",
      desc: "A framework for assessing staff competence at the University of Phayao, with a public list of recognised staff",
      cta: "View recognised staff",
      cta2: "Announcements",
      imageAlt: "Banner image (sample)",
    },
    process: {
      title: "PSF process",
      tiles: [
        { label: "01 / FRAMEWORK", title: "Competence framework", desc: "Defines what staff must show at each level" },
        { label: "02 / SUBMIT", title: "Submit", desc: "Send documents and evidence of practice" },
        { label: "03 / REVIEW", title: "Review", desc: "A panel assesses against the criteria" },
        { label: "04 / RECOGNISE", title: "Recognise", desc: "Results issued with a certificate" },
        { label: "05 / PUBLISH", title: "Publish", desc: "Recognised staff are listed publicly" },
      ],
    },
    about: {
      title: "About / Mission",
      intro:
        "PSF is a professional standards framework that guides the development and recognition of staff competence in teaching and learning support.",
      missionTitle: "Mission",
      mission: [
        "Support continuous professional development",
        "Maintain transparent and credible standards",
        "Publicise and honour recognised staff",
      ],
      note: "Sample text for demonstration",
    },
    news: { title: "Announcements", imageAlt: "Announcement image (sample)" },
    passers: {
      title: "Recognised PSF Staff",
      desc: "Sample list of staff who have been recognised.",
      level: "PSF level",
      year: "Year",
      photoAlt: "Applicant photo (sample)",
    },
    footer: "© PSF University of Phayao — demo site. All data is fictional.",
    langBtn: "TH",
    langLabel: "สลับเป็นภาษาไทย",
  },
} as const;
