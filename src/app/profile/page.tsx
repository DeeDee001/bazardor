"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession, signOut } from "@/lib/auth-client";
import { toBengaliDigits } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const isAuthPending = session?.isPending;

  useEffect(() => {
    if (!isAuthPending && !user) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন।");
      router.push("/signin?callbackUrl=/profile");
    }
  }, [isAuthPending, user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন!");
      router.push("/");
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  if (isAuthPending || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Lock className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            প্রোফাইল যাচাইকরণ চলছে...
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  const createdAtDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("bn-BD")
    : "আজ";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>হোমে ফিরুন</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">আমার প্রোফাইল</span>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            {/* Header Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 sm:px-8 relative">
              <div className="absolute -bottom-12 left-6 sm:left-8">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "ব্যবহারকারী"}
                    fill
                    unoptimized={!!user.image}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 pt-16 pb-8 sm:px-8 space-y-6">
              {/* Name & Role */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {user.name || "ব্যবহারকারী"}
                  </h1>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                {/* Challenge C3: Update Information Button */}
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>তথ্য পরিবর্তন করুন</span>
                </Link>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3.5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">নাম</span>
                    <p className="text-sm font-bold text-slate-800">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">ইমেইল</span>
                    <p className="text-sm font-bold text-slate-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">
                      যুক্ত হয়েছেন
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {toBengaliDigits(createdAtDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">স্ট্যাটাস</span>
                    <p className="text-sm font-bold text-emerald-700">
                      সক্রিয় গ্রাহক
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center space-x-2 rounded-xl border border-rose-200 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>সাইন আউট</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
