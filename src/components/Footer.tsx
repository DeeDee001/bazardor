import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          {/* Left Side */}
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛒</span>
            <p className="text-sm font-semibold text-slate-800">
              বাজার দর{" "}
              <span className="font-normal text-slate-500">
                — প্রয়োজনীয় পণ্যের দাম এক নজরে।
              </span>
            </p>
          </div>

          {/* Right Side */}
          <p className="text-xs text-slate-500 italic max-w-md sm:text-right">
            “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”
          </p>
        </div>

        {/* Bottom subtle copyright row */}
        <div className="mt-6 flex flex-col items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 sm:flex-row">
          <p>© ২০২৬ বাজার দর (BazarDor). সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="mt-2 flex space-x-4 sm:mt-0">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              হোম
            </Link>
            <Link href="/signin" className="hover:text-emerald-600 transition-colors">
              সাইন ইন
            </Link>
            <Link href="/signup" className="hover:text-emerald-600 transition-colors">
              নিবন্ধন
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
