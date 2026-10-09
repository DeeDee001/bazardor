import React from "react";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import HomeProductList from "@/components/HomeProductList";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/api";
import { TrendingUp, TrendingDown, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "বাজার দর (BazarDor) — নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজার দর",
  description:
    "প্রতিদিনের পাইকারি ও খুচরা বাজার দর এক নজরে। চাল, ডাল, তেল, সবজি, মাছ ও মাংসের সর্বশেষ বাজার দর হালনাগাদ।",
};

export default async function HomePage() {
  const products = await getProducts();

  // Section A: Top 6 risers (আজ দাম বেড়েছে ▲)
  const topRisers = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Section B: Top 6 fallers (আজ দাম কমেছে ▼)
  const topFallers = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (a.change?.pct || 0) - (b.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* 1. Navbar */}
      <Navbar />

      {/* Price Ticker Strip below Navbar */}
      <PriceTicker products={products} />

      <main className="flex-1">
        {/* 2. Hero Banner */}
        <HeroBanner />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-14">
          {/* 3. Section A — “আজ দাম বেড়েছে ▲” */}
          <section className="space-y-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    আজ দাম বেড়েছে ▲
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    গতকালের তুলনায় সর্বাধিক দর বৃদ্ধি পাওয়া ৬টি পণ্য
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                শীর্ষ দর বৃদ্ধি
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-6">
              {topRisers.map((product) => (
                <ProductCard key={`riser-${product.id}`} product={product} />
              ))}
            </div>
          </section>

          {/* 3. Section B — “আজ দাম কমেছে ▼” */}
          <section className="space-y-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    আজ দাম কমেছে ▼
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    গতকালের তুলনায় দর হ্রাস পাওয়া সাশ্রয়ী ৬টি পণ্য
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
                শীর্ষ দর পতন
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-6">
              {topFallers.map((product) => (
                <ProductCard key={`faller-${product.id}`} product={product} />
              ))}
            </div>
          </section>

          {/* 3. Section C — “সব পণ্য” (Target of Hero CTA anchor link) */}
          <section id="সব-পণ্য" className="space-y-6 pt-4 scroll-mt-24">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    সব পণ্য
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    নিত্যপ্রয়োজনীয় সকল খাদ্যদ্রব্যের তালিকা ও বিস্তারিত বাজার দর
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive product grid with category filter & search */}
            <HomeProductList initialProducts={products} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
