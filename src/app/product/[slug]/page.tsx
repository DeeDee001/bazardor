"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import { Product } from "@/lib/types";
import { getProductBySlug, getProducts } from "@/lib/api";
import {
  formatPrice,
  formatUnit,
  formatPercentage,
  toBengaliDigits,
} from "@/lib/utils";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Store,
  MapPin,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Search,
  Lock,
} from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const session = useSession();
  const user = session?.data?.user;
  const isAuthPending = session?.isPending;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [marketSearch, setMarketSearch] = useState<string>("");

  // Check Protected Route
  useEffect(() => {
    if (!isAuthPending && !user) {
      toast.error("পণ্যটির বিস্তারিত দেখতে অনুগ্রহ করে সাইন ইন করুন।", {
        id: "protected-route-toast",
      });
      router.push(`/signin?callbackUrl=/product/${encodeURIComponent(slug)}`);
    }
  }, [isAuthPending, user, router, slug]);

  // Load product data
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const [prod, prods] = await Promise.all([
          getProductBySlug(slug),
          getProducts(),
        ]);
        setProduct(prod);
        setAllProducts(prods);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  // Extract unique divisions from markets
  const divisions = useMemo(() => {
    if (!product?.markets) return [];
    return Array.from(new Set(product.markets.map((m) => m.division)));
  }, [product]);

  // Filtered markets
  const filteredMarkets = useMemo(() => {
    if (!product?.markets) return [];
    let list = [...product.markets];

    if (selectedDivision !== "all") {
      list = list.filter((m) => m.division === selectedDivision);
    }

    if (marketSearch.trim()) {
      const q = marketSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.market.toLowerCase().includes(q) ||
          m.division.toLowerCase().includes(q)
      );
    }

    return list;
  }, [product, selectedDivision, marketSearch]);

  // Price calculations
  const priceMetrics = useMemo(() => {
    if (!product) return { min: 0, max: 0, avg: 0 };
    if (!product.markets || product.markets.length === 0) {
      return { min: product.today, max: product.today, avg: product.today };
    }
    const mins = product.markets.map((m) => m.min);
    const maxs = product.markets.map((m) => m.max);
    const minVal = Math.min(...mins);
    const maxVal = Math.max(...maxs);
    const avgVal = product.today || Math.round((minVal + maxVal) / 2);
    return { min: minVal, max: maxVal, avg: avgVal };
  }, [product]);

  // Show authentication redirect placeholder while checking session
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
          <p className="mt-1 text-sm text-slate-500">
            এই পেজটি দেখতে সাইন ইন প্রয়োজন। রিডাইরেক্ট করা হচ্ছে...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />
      <PriceTicker products={allProducts} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>হোমে ফিরুন</span>
            </Link>
            <span>/</span>
            {product && (
              <>
                <Link
                  href={`/category/${product.category}`}
                  className="hover:text-emerald-700 transition-colors"
                >
                  {product.categoryNameBn}
                </Link>
                <span>/</span>
                <span className="font-semibold text-slate-800">
                  {product.nameBn}
                </span>
              </>
            )}
          </div>

          {isLoading ? (
            /* Loading Skeleton */
            <div className="space-y-6">
              <div className="h-36 rounded-3xl bg-slate-200 animate-pulse" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
              </div>
              <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            </div>
          ) : !product ? (
            /* Product Not Found */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <span className="text-4xl">❌</span>
              <h2 className="mt-4 text-2xl font-bold text-slate-800">
                পণ্যটি খুঁজে পাওয়া যায়নি
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                অনুরোধকৃত পণ্যটির তথ্য এই মুহূর্তে ডাটাবেসে নেই।
              </p>
              <Link
                href="/"
                className="mt-6 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. Top Summary Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                    {/* Big Emoji Illustration */}
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-4xl sm:text-5xl shadow-md ring-1 ring-emerald-500/20">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                          {product.categoryNameBn}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                          {formatUnit(product.unit)}
                        </span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                        {product.nameBn}
                      </h1>

                      <p className="text-xs sm:text-sm text-slate-600">
                        আজকের বাজারে সংগৃহীত তথ্যের ভিত্তিতে পণ্যটির সামগ্রিক
                        দর পর্যবেক্ষণ ও বাজারভিত্তিক তুলনামূলক বিশ্লেষণ।
                      </p>
                    </div>
                  </div>

                  {/* Today's Price & Trend badge */}
                  <div className="flex flex-col sm:items-end justify-center rounded-2xl bg-white p-4 shadow-xs border border-slate-100 min-w-[180px]">
                    <span className="text-xs font-medium text-slate-400">
                      জাতীয় গড় দর
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {formatPrice(product.today)}
                    </span>
                    <div className="mt-1 flex items-center space-x-1.5">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          product.change?.dir === "up"
                            ? "bg-emerald-100 text-emerald-700"
                            : product.change?.dir === "down"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.change?.dir === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : product.change?.dir === "down" ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                        <span>
                          {formatPercentage(product.change?.pct || 0)}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        গতকালের তুলনায়
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Price - Summary Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                {/* Minimum Price */}
                <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      সর্বনিম্ন দাম
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      সাশ্রয়ী
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                      {formatPrice(priceMetrics.min)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      দেশের বিভিন্ন বাজারের সর্বনিম্ন দর
                    </p>
                  </div>
                </div>

                {/* Maximum Price */}
                <div className="flex flex-col justify-between rounded-2xl border border-rose-100 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      সর্বোচ্চ দাম
                    </span>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                      সর্বোচ্চ
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-extrabold text-rose-700">
                      {formatPrice(priceMetrics.max)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      দেশের বিভিন্ন বাজারের সর্বোচ্চ দর
                    </p>
                  </div>
                </div>

                {/* Average Price */}
                <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      গড় দাম
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                      স্ট্যান্ডার্ড
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">
                      {formatPrice(priceMetrics.avg)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      সারাদেশের বাজার সমূহের গড় মূল্য
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. বাজারভিত্তিক আজকের দাম (Market-wise Today's Price) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        বাজারভিত্তিক আজকের দাম
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        বিভিন্ন বিভাগের খুচরা ও পাইকারি বাজারের নির্ভরযোগ্য তথ্য
                      </p>
                    </div>
                  </div>

                  {/* Market Search Box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={marketSearch}
                      onChange={(e) => setMarketSearch(e.target.value)}
                      placeholder="বাজার বা বিভাগ খুঁজুন..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Division Filter Pills */}
                {divisions.length > 0 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSelectedDivision("all")}
                      className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                        selectedDivision === "all"
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      সকল বিভাগ ({product.markets.length})
                    </button>
                    {divisions.map((div) => {
                      const count = product.markets.filter(
                        (m) => m.division === div
                      ).length;
                      const isSelected = selectedDivision === div;

                      return (
                        <button
                          key={div}
                          type="button"
                          onClick={() => setSelectedDivision(div)}
                          className={`shrink-0 inline-flex items-center space-x-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-emerald-700 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{div}</span>
                          <span className="text-[11px] opacity-75">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Market Price Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-700">
                      <tr>
                        <th scope="col" className="px-5 py-3.5">
                          বাজারের নাম
                        </th>
                        <th scope="col" className="px-5 py-3.5">
                          বিভাগ
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-right">
                          সর্বনিম্ন দর
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-right">
                          সর্বোচ্চ দর
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-center">
                          পার্থক্য
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredMarkets.length > 0 ? (
                        filteredMarkets.map((m, idx) => {
                          const diff = m.max - m.min;
                          return (
                            <tr
                              key={`${m.market}-${idx}`}
                              className="transition-colors hover:bg-emerald-50/40"
                            >
                              <td className="px-5 py-4 font-semibold text-slate-900 flex items-center space-x-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                <span>{m.market}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span>{m.division}</span>
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-bold text-emerald-700">
                                {formatPrice(m.min)}
                              </td>
                              <td className="px-5 py-4 text-right font-bold text-rose-700">
                                {formatPrice(m.max)}
                              </td>
                              <td className="px-5 py-4 text-center text-xs text-slate-500">
                                ± {toBengaliDigits(diff)} টাকা
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-8 text-center text-slate-400"
                          >
                            কোনো বাজার পাওয়া যায়নি।
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>নিয়মিত মাঠ পর্যায় থেকে সংগৃহীত বাজার দর</span>
                  </span>
                  <span>
                    মোট বাজার: {toBengaliDigits(filteredMarkets.length)} টি
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
