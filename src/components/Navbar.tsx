"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { getBengaliDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  User,
  LogOut,
  Edit,
  LogIn,
  UserPlus,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  { slug: "", nameBn: "সব পণ্য", icon: "🧺" },
  { slug: "chal", nameBn: "চাল", icon: "🍚" },
  { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

function emptySubscribe() {
  return () => {};
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const banglaDate = useSyncExternalStore(
    emptySubscribe,
    getBengaliDate,
    () => ""
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন!");
      setProfileDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  const user = session?.data?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-md">
      {/* Top Navbar Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo & Bengali Date */}
        <Link href="/" className="group flex flex-col items-start transition-transform">
          <div className="flex items-center space-x-2">
            <span className="text-2xl sm:text-3xl">🛒</span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-800 transition-colors group-hover:text-emerald-600">
              বাজার দর
            </span>
          </div>
          {banglaDate && (
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 pl-8 -mt-1">
              {banglaDate}
            </span>
          )}
        </Link>

        {/* Right: Auth Buttons / Profile */}
        <div className="flex items-center space-x-3">
          {session?.isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            /* Logged in state */
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 rounded-full border border-emerald-200 bg-emerald-50/60 py-1.5 pl-2 pr-3 transition-colors hover:bg-emerald-100/80 focus:outline-hidden"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-emerald-500/30">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "ব্যবহারকারী"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                    {user.name || "ব্যবহারকারী"}
                  </p>
                  <p className="text-[10px] text-emerald-700">লগইন আছেন</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="border-b border-slate-100 px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-slate-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        <span>আমার প্রোফাইল</span>
                      </Link>

                      <Link
                        href="/profile/edit"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Edit className="h-4 w-4 text-slate-500" />
                        <span>তথ্য পরিবর্তন করুন</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>সাইন আউট</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged out state */
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/signin"
                className="inline-flex items-center space-x-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-700"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>সাইন ইন</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>সাইন আপ</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Second Row: Category Links (Desktop) */}
      <nav className="hidden border-t border-slate-100 bg-slate-50/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center space-x-1 overflow-x-auto px-4 py-1.5 sm:px-6 lg:px-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isHome = cat.slug === "";
            const href = isHome ? "/" : `/category/${cat.slug}`;
            const isActive = isHome
              ? pathname === "/"
              : pathname === `/category/${cat.slug}`;

            return (
              <Link
                key={cat.slug || "all"}
                href={href}
                className={`inline-flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer/Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg md:hidden">
          <p className="px-2 pt-1 pb-2 text-xs font-semibold text-slate-400">
            ক্যাটাগরি সমূহ
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const isHome = cat.slug === "";
              const href = isHome ? "/" : `/category/${cat.slug}`;
              const isActive = isHome
                ? pathname === "/"
                : pathname === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.slug || "all-mobile"}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
