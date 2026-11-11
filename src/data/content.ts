export type Lang = "th" | "en";

// ข้อความตัวอย่างทั้งหมด (Claude ร่างตามที่ผู้ใช้อนุญาต) แก้ได้ที่ไฟล์นี้
export const content = {
  th: {
    siteName: "มาตรฐานอาจารย์มืออาชีพ",
    siteOrg: "มหาวิทยาลัยพะเยา",
    logo: "โลโก้",
    menu: "เมนู",
    // TODO: ข้อมูลติดต่อจริงของหน่วยงาน (ตอนนี้เป็นข้อมูลสมมติ)
    contact: { address: "ที่อยู่หน่วยงาน (ตัวอย่าง)", email: "email@example.com", phone: "0 0000 0000" },
    nav: {
      home: "หน้าแรก",
      about: "เกี่ยวกับ",
      history: "ความเป็นมา",
      mission: "พันธกิจ",
      publicity: "ประชาสัมพันธ์",
      publicityNews: "ข่าวประชาสัมพันธ์",
      outstanding: "อาจารย์ดีเด่นด้านการสอน",
      outstandingProject: "โครงการ",
      outstandingAnnouncement: "ประกาศ",
      outstandingProcess: "ขั้นตอน",
      outstandingApply: "ใบสมัคร",
      calendar: "ปฏิทิน",
      submitReview: "ยื่นคำขอพิจารณา",
      certify: "รับรอง",
      documents: "เอกสาร",
      relatedAnnouncements: "อื่น ๆ",
      otherForms: "แบบฟอร์ม",
    },
    hero: {
      eyebrow: "UP PSF",
      title: "มาตรฐานอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา",
      desc: "กรอบประเมินสมรรถนะของอาจารย์ มหาวิทยาลัยพะเยา พร้อมประกาศผลรายชื่อผู้ที่ผ่านเกณฑ์การประเมิน",
      cta: "ดูผู้ยื่นผ่านเกณฑ์",
      cta2: "ประกาศ",
      imageAlt: "ภาพแบนเนอร์ (ตัวอย่าง)",
    },
    // label เป็น mono อังกฤษเหมือนกันทั้งสองภาษา ข้อความขั้นตอนเป็นข้อความสมมติ
    process: {
      title: "ขั้นตอน PSF",
      tiles: [
        { label: "01 / FRAMEWORK", title: "กรอบสมรรถนะ", desc: "กำหนดสิ่งที่อาจารย์ต้องแสดงให้เห็นในแต่ละระดับ" },
        { label: "02 / SUBMIT", title: "ยื่นคำขอ", desc: "ส่งเอกสารและหลักฐานการปฏิบัติงาน" },
        { label: "03 / REVIEW", title: "พิจารณา", desc: "คณะกรรมการประเมินตามเกณฑ์" },
        { label: "04 / RESULT", title: "ประกาศผล", desc: "เผยแพร่ผลและรายชื่อผู้ผ่านเกณฑ์" },
      ],
    },
    about: {
      title: "เกี่ยวกับ / พันธกิจ",
      intro:
        "มาตรฐานอาจารย์มืออาชีพ (UP PSF) คือกรอบมาตรฐานที่ใช้เป็นแนวทางพัฒนาและประเมินสมรรถนะของอาจารย์ มหาวิทยาลัยพะเยา",
      missionTitle: "พันธกิจ",
      mission: [
        "ส่งเสริมการพัฒนาวิชาชีพอย่างต่อเนื่อง",
        "สร้างมาตรฐานที่โปร่งใสและน่าเชื่อถือ",
        "ประกาศผลและยกย่องผู้ที่ผ่านเกณฑ์",
      ],
      note: "ข้อความตัวอย่างเพื่อการสาธิต",
    },
    news: { title: "ข่าว / กิจกรรม", announcements: "ประกาศ", older: "ประกาศเก่ากว่า", newer: "ใหม่กว่า", readMore: "อ่านรายละเอียดเพิ่มเติม", close: "ปิด", imageAlt: "ภาพข่าว (ตัวอย่าง)" },
    passers: {
      title: "ประชาสัมพันธ์ผู้ยื่นผ่านเกณฑ์ PSF",
      desc: "ประกาศผลรายชื่อตัวอย่างของผู้ที่ผ่านเกณฑ์",
      level: "ระดับ PSF",
      year: "ปีที่ผ่าน",
      photoAlt: "รูปผู้ยื่น (ตัวอย่าง)",
      prev: "หน้าก่อนหน้า",
      next: "หน้าถัดไป",
    },
    // หน้าตัวอย่างปลายทางของลิงก์บนหน้าแรก ข้อความสมมติ ทุกรายการในกลุ่มเดียวกันลิงก์มาหน้าเดียว
    detail: {
      announcement: {
        back: "กลับไปหน้าประกาศ",
        body: [
          "ข้อความตัวอย่างของหน้าประกาศ ใช้แสดงรูปแบบการจัดวางเนื้อหาเมื่อผู้ใช้กดเข้ามาอ่านรายละเอียดจากรายการประกาศ",
          "เนื้อหาจริงของแต่ละประกาศจะถูกเพิ่มภายหลัง ปัจจุบันทุกประกาศในรายการเชื่อมมาที่หน้าตัวอย่างหน้านี้",
        ],
      },
      news: {
        back: "กลับไปหน้าข่าว / กิจกรรม",
        body: [
          "ข้อความตัวอย่างของหน้าข่าวหรือกิจกรรม ใช้แสดงรูปแบบการจัดวางเนื้อหาเมื่อผู้ใช้กดการ์ดข่าว",
          "เนื้อหาจริงของแต่ละข่าวจะถูกเพิ่มภายหลัง ปัจจุบันทุกการ์ดข่าวเชื่อมมาที่หน้าตัวอย่างหน้านี้",
        ],
      },
      process: {
        back: "กลับไปหน้าขั้นตอน PSF",
        body: [
          "ข้อความตัวอย่างของหน้ารายละเอียดขั้นตอน PSF ใช้แสดงรูปแบบการจัดวางเมื่อผู้ใช้กดช่องในส่วนขั้นตอน",
          "รายละเอียดจริงของแต่ละขั้นตอนจะถูกเพิ่มภายหลัง ปัจจุบันทุกช่องเชื่อมมาที่หน้าตัวอย่างหน้านี้",
        ],
      },
    },
    // หน้าใหม่ตามความเห็นผู้มีส่วนได้ส่วนเสีย ข้อความทั้งหมดเป็นตัวอย่าง
    pages: {
      assessment: {
        title: "การประเมินระดับอาจารย์มืออาชีพ",
        intro: "ข้อมูลการประเมินสมรรถนะระดับอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา (ข้อมูลตัวอย่าง)",
        calendarTitle: "ปฏิทินการประเมินประจำปี",
        round: "รอบที่",
        types: { apply: "รับสมัคร", assess: "ประเมิน", result: "ประกาศผล" },
        noEvents: "ไม่มีกิจกรรม",
        formTitle: "แบบฟอร์มขอรับการประเมิน",
        formDesc: "ดาวน์โหลดแบบฟอร์มขอรับการประเมิน กรอกข้อมูลและส่งพร้อมหลักฐานตามรอบที่เปิดรับสมัคร",
        formBtn: "ดาวน์โหลดแบบฟอร์ม (ตัวอย่าง)",
      },
      publicity: {
        title: "ข่าวประชาสัมพันธ์",
        intro: "ประกาศผลรายชื่อผู้ที่ผ่านเกณฑ์การประเมิน แยกตามปี (ข้อมูลตัวอย่าง)",
        yearTab: "ปี",
        resultTitle: "ประกาศผลประจำปี",
        count: "ราย",
      },
      outstanding: {
        title: "อาจารย์ดีเด่นด้านการสอน",
        intro: "โครงการยกย่องอาจารย์ดีเด่นด้านการสอน (ข้อมูลตัวอย่าง)",
        back: "กลับไปอาจารย์ดีเด่นด้านการสอน",
        download: "ดาวน์โหลดใบสมัคร (ตัวอย่าง)",
        pages: {
          project: {
            body: [
              "ข้อความตัวอย่างของหน้าโครงการอาจารย์ดีเด่นด้านการสอน อธิบายวัตถุประสงค์และเป้าหมายของโครงการ",
              "เนื้อหาจริงของโครงการจะถูกเพิ่มภายหลัง",
            ],
          },
          announcement: {
            body: [
              "ข้อความตัวอย่างของหน้าประกาศที่เกี่ยวข้องกับโครงการอาจารย์ดีเด่นด้านการสอน",
              "รายการประกาศจริงจะถูกเพิ่มภายหลัง",
            ],
          },
          process: {
            body: [
              "1. ผู้สมัครกรอกใบสมัครและแนบหลักฐานการสอน (ตัวอย่าง)",
              "2. คณะกรรมการพิจารณาตามเกณฑ์ (ตัวอย่าง)",
              "3. ประกาศผลและเผยแพร่รายชื่อ (ตัวอย่าง)",
            ],
          },
          apply: {
            body: [
              "ข้อความตัวอย่างของหน้าใบสมัครอาจารย์ดีเด่นด้านการสอน ดาวน์โหลดใบสมัครแล้วกรอกข้อมูลตามที่กำหนด",
            ],
          },
        },
      },
      documents: {
        title: "ประกาศที่เกี่ยวข้อง",
        intro: "รวมประกาศที่เกี่ยวข้องทั้งหมด เรียงจากใหม่ไปเก่า (ข้อมูลตัวอย่าง)",
      },
      forms: {
        title: "แบบฟอร์ม",
        intro: "ดาวน์โหลดแบบฟอร์มในรูปแบบ PDF (ข้อมูลตัวอย่าง)",
        download: "ดาวน์โหลด PDF",
      },
      // TODO: เนื้อหาความเป็นมาจริงของ UP PSF (ตอนนี้เป็นข้อความตัวอย่าง)
      history: {
        title: "ความเป็นมา",
        back: "กลับไปหน้าแรก",
        body: [
          "ข้อความตัวอย่างความเป็นมาของมาตรฐานอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา",
          "เนื้อหาจริงจะถูกเพิ่มภายหลัง",
        ],
      },
    },
    footer: "© มาตรฐานอาจารย์มืออาชีพ มหาวิทยาลัยพะเยา — เว็บตัวอย่างเพื่อการสาธิต ข้อมูลทั้งหมดเป็นข้อมูลสมมติ",
  },
  en: {
    siteName: "Professional Lecturer Standards",
    siteOrg: "University of Phayao",
    logo: "Logo",
    menu: "Menu",
    contact: { address: "Office address (sample)", email: "email@example.com", phone: "0 0000 0000" },
    nav: {
      home: "Home",
      about: "About",
      history: "History",
      mission: "Mission",
      publicity: "Public Relations",
      publicityNews: "PR News",
      outstanding: "Outstanding Teaching Lecturers",
      outstandingProject: "Project",
      outstandingAnnouncement: "Announcements",
      outstandingProcess: "Process",
      outstandingApply: "Application",
      calendar: "Calendar",
      submitReview: "Submit & Review",
      certify: "Recognise",
      documents: "Documents",
      relatedAnnouncements: "Other",
      otherForms: "Forms",
    },
    hero: {
      eyebrow: "UP PSF",
      title: "Professional Lecturer Standards, University of Phayao",
      desc: "A framework for assessing lecturer competence at the University of Phayao, with the results announced publicly",
      cta: "View applicants who met the criteria",
      cta2: "Announcements",
      imageAlt: "Banner image (sample)",
    },
    process: {
      title: "PSF process",
      tiles: [
        { label: "01 / FRAMEWORK", title: "Competence framework", desc: "Defines what lecturers must show at each level" },
        { label: "02 / SUBMIT", title: "Submit", desc: "Send documents and evidence of practice" },
        { label: "03 / REVIEW", title: "Review", desc: "A panel assesses against the criteria" },
        { label: "04 / RESULT", title: "Announce results", desc: "Results and the list of those who met the criteria are published" },
      ],
    },
    about: {
      title: "About / Mission",
      intro:
        "Professional Lecturer Standards (UP PSF) is a standards framework that guides the development and assessment of lecturer competence at the University of Phayao.",
      missionTitle: "Mission",
      mission: [
        "Support continuous professional development",
        "Maintain transparent and credible standards",
        "Announce results and honour those who met the criteria",
      ],
      note: "Sample text for demonstration",
    },
    news: { title: "News / Events", announcements: "Announcements", older: "Older", newer: "Newer", readMore: "Read more", close: "Close", imageAlt: "News image (sample)" },
    passers: {
      title: "PR: Applicants Who Met the PSF Criteria",
      desc: "Sample results announcement of those who met the criteria.",
      level: "PSF level",
      year: "Year",
      photoAlt: "Applicant photo (sample)",
      prev: "Previous page",
      next: "Next page",
    },
    detail: {
      announcement: {
        back: "Back to announcements",
        body: [
          "Sample text for an announcement page, showing how content is laid out when a user opens the details from the announcement list.",
          "The real content of each announcement will be added later. For now every announcement in the list links to this sample page.",
        ],
      },
      news: {
        back: "Back to news / events",
        body: [
          "Sample text for a news or event page, showing how content is laid out when a user opens a news card.",
          "The real content of each news item will be added later. For now every news card links to this sample page.",
        ],
      },
      process: {
        back: "Back to the PSF process",
        body: [
          "Sample text for a PSF process detail page, showing the layout when a user opens a tile in the process section.",
          "The real detail of each step will be added later. For now every tile links to this sample page.",
        ],
      },
    },
    pages: {
      assessment: {
        title: "Professional Lecturer Assessment",
        intro: "Information on the professional lecturer competence assessment at the University of Phayao (sample data).",
        calendarTitle: "Assessment calendar",
        round: "Round",
        types: { apply: "Applications", assess: "Assessment", result: "Results" },
        noEvents: "No activities",
        formTitle: "Assessment request form",
        formDesc: "Download the assessment request form, fill it in and submit it with evidence during the open round.",
        formBtn: "Download the form (sample)",
      },
      publicity: {
        title: "PR News",
        intro: "Announced results of those who met the assessment criteria, by year (sample data).",
        yearTab: "Year",
        resultTitle: "Results announced for",
        count: "people",
      },
      outstanding: {
        title: "Outstanding Teaching Lecturers",
        intro: "The project honouring outstanding teaching lecturers (sample data).",
        back: "Back to Outstanding Teaching Lecturers",
        download: "Download the application (sample)",
        pages: {
          project: {
            body: [
              "Sample text for the Outstanding Teaching Lecturers project page, describing its purpose and goals.",
              "The real project content will be added later.",
            ],
          },
          announcement: {
            body: [
              "Sample text for the announcements related to the Outstanding Teaching Lecturers project.",
              "The real announcements will be added later.",
            ],
          },
          process: {
            body: [
              "1. Applicants fill in the application and attach teaching evidence (sample)",
              "2. A panel reviews against the criteria (sample)",
              "3. Results are announced and the list is published (sample)",
            ],
          },
          apply: {
            body: [
              "Sample text for the Outstanding Teaching Lecturers application page. Download the application and fill it in as required.",
            ],
          },
        },
      },
      documents: {
        title: "Related Announcements",
        intro: "All related announcements, newest first (sample data).",
      },
      forms: {
        title: "Forms",
        intro: "Download forms in PDF format (sample data).",
        download: "Download PDF",
      },
      // TODO: real history content of UP PSF (sample text for now)
      history: {
        title: "History",
        back: "Back to home",
        body: [
          "Sample text about the history of the Professional Lecturer Standards at the University of Phayao.",
          "The real content will be added later.",
        ],
      },
    },
    footer: "© Professional Lecturer Standards, University of Phayao — demo site. All data is fictional.",
  },
} as const;

