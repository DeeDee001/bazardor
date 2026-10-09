import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
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
  title: "বাজার দর (BazarDor) — নিত্যপ্রয়োজনীয় পণ্যের বাজার দর এক নজরে",
  description:
    "প্রতিদিনের পাইকারি ও খুচরা বাজার দর পর্যবেক্ষণ ও তুলনামূলক বিশ্লেষণ। চাল, ডাল, তেল, সবজি, মাছ, মাংসের রিয়েল-টাইম দর।",
  keywords: [
    "বাজার দর",
    "bazardor",
    "commodity prices bd",
    "market prices bangladesh",
    "daily market price",
    "নিত্যপণ্য",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
