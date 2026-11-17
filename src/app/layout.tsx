import type { Metadata } from "next";
import { Sarabun, IBM_Plex_Mono, IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Intro } from "@/components/Intro";
import { Motion } from "@/components/Motion";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

// หัวข้อ: เซอริฟบางน้ำหนัก 300 ตามสไตล์ editorial (มีทั้งไทยและละติน)
const serifTh = Noto_Serif_Thai({
  variable: "--font-serif-th",
  subsets: ["thai", "latin"],
  weight: ["300", "400"],
});

// ตัวควบคุม (ปุ่ม ช่องกรอก) และแถบหัว รวมถึงส่วนสถานะของระบบอาจารย์
const plexSansTh = IBM_Plex_Sans_Thai({
  variable: "--font-plex-sans-th",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

// ใช้เฉพาะป้ายใน bento (ตัวอังกฤษ/ตัวเลข) ฟอนต์นี้ไม่มีตัวอักษรไทย
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PSF — มหาวิทยาลัยพะเยา",
  description: "Professional Standards Framework, University of Phayao (demo)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${sarabun.variable} ${plexSansTh.variable} ${plexMono.variable} ${serifTh.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Intro />
        <Suspense fallback={null}>
          <Motion />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
