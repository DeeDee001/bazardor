"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { User as UserIcon, ArrowLeft, Save, Lock } from "lucide-react";

interface UserData {
  id?: string;
  name?: string | null;
  email?: string | null;
}

function EditProfileForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      // BetterAuth update-user API
      const res = await updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে।");
      } else {
        toast.success("আপনার তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "তথ্য আপডেট করতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          ব্যবহারকারীর তথ্য পরিবর্তন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          আপনার নাম পরিবর্তন করে নিচের বাটনে ক্লিক করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            নাম (Name)
          </label>
          <div className="relative mt-1.5">
            <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="আপনার নতুন নাম লিখুন"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            ইমেইল (Email - অপরিবর্তনযোগ্য)
          </label>
          <div className="mt-1.5">
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-2.5 px-3.5 text-sm text-slate-500 select-none"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            অ্যাকাউন্টের নিরাপত্তার স্বার্থে নিবন্ধিত ইমেইল পরিবর্তন করা যায় না।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <Link
            href="/profile"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            বাতিল করুন
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>আপডেট হচ্ছে...</span>
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>তথ্য আপডেট করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  const isAuthPending = session?.isPending;

  useEffect(() => {
    if (!isAuthPending && !user) {
      toast.error("তথ্য পরিবর্তন করতে সাইন ইন করুন।");
      router.push("/signin?callbackUrl=/profile/edit");
    }
  }, [isAuthPending, user, router]);

  if (isAuthPending || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Lock className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            যাচাইকরণ চলছে...
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link
              href="/profile"
              className="inline-flex items-center space-x-1 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>প্রোফাইলে ফিরুন</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">তথ্য পরিবর্তন</span>
          </div>

          <EditProfileForm key={user.id || user.email} user={user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
