import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/LocaleProvider";
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
  title: "Saju Report",
  description: "An AI-guided saju report app with Korean and English interface support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={`${sans.variable} ${serif.variable}`} lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
