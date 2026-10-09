import React from "react";
import Image from "next/image";
import { ArrowDown, TrendingUp, ShieldCheck } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-emerald-100/40 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text & CTA */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>দৈনিক বাজার দর পর্যবেক্ষণ</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">লাইভ আপডেট</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:leading-[1.2]">
              নিত্যপ্রয়োজনীয় পণ্যের{" "}
              <span className="relative inline-block text-emerald-700">
                সঠিক বাজার দর
                <svg
                  className="absolute -bottom-2 left-0 w-full text-emerald-400"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 3 180 3 247 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg lg:mx-0">
              দেশের প্রধান প্রধান পাইকারি ও খুচরা বাজারের পণ্যের দামের সর্বশেষ
              আপডেট। প্রতিদিনের বাজারের সঠিক দাম জানুন এবং সচেতনভাবে কেনাকাটা করুন।
            </p>

            {/* CTA Button and Features */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#সব-পণ্য"
                className="group inline-flex items-center space-x-2.5 rounded-full bg-emerald-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
              >
                <span>আজকের বাজার দর দেখুন</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </a>

              <div className="flex items-center space-x-4 text-xs sm:text-sm font-medium text-slate-600">
                <span className="inline-flex items-center space-x-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>দর বৃদ্ধির হালনাগাদ</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>যাচাইকৃত তথ্য</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Banner Image from Figma */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 animate-in fade-in zoom-in duration-500">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50/50 filter blur-xl" />
              <Image
                src="/hero-basket.png"
                alt="বাজার দর গ্রোসারি বাস্কেট"
                fill
                priority
                className="object-contain drop-shadow-xl transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
