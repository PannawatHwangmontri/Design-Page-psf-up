import type { Metadata } from "next";
import { Sarabun, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="th" className={`${sarabun.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
