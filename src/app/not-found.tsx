import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-inner">
            <SearchX className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase">
              ৪০৪ — পেজ পাওয়া যায়নি
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              দুঃখিত! এই পেজটি খুঁজে পাওয়া যায়নি
            </h1>
            <p className="mx-auto max-w-md text-sm sm:text-base text-slate-600">
              আপনি যে পেজটিতে প্রবেশের চেষ্টা করছেন তা মুছে ফেলা হয়েছে, নাম
              পরিবর্তন করা হয়েছে অথবা ঠিকানাটি সঠিক নয়।
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2.5 rounded-full bg-emerald-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
