import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KKUDS Press Center 49",
  description: "เว็บไซต์รวบรวมข้อมูลจากฝ่ายต่าง ๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <title>KKUDS Press Center 49</title>
        <meta name="description" content="เว็บไซต์รวบรวมข้อมูลจากฝ่ายต่าง ๆ" />
        <meta property="og:title" content="KKUDS Press Center 49" />
        <meta property="og:description" content="เว็บไซต์รวบรวมข้อมูลจากฝ่ายต่าง ๆ" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}