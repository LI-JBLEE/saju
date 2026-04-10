import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "사주 리포트",
  description: "생년월일시를 입력하면 AI 기반 사주 리포트를 생성하는 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={`${sans.variable} ${serif.variable}`} lang="ko">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
