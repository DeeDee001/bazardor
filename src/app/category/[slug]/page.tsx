"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import SortDropdown from "@/components/SortDropdown";
import Footer from "@/components/Footer";
import { Product, SortOption } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/api";
import { ArrowLeft, Home, PackageX } from "lucide-react";

function CategoryContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [allProductsForTicker, setAllProductsForTicker] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryIcon, setCategoryIcon] = useState<string>("🧺");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catList, allProds, catProducts] = await Promise.all([
          getCategories(),
          getProducts(),
          getProducts(slug),
        ]);

        setAllProductsForTicker(allProds);

        const currentCat = catList.find(
          (c) => c.slug === slug || c.id === slug
        );

        if (currentCat) {
          setCategoryName(currentCat.nameBn);
          setCategoryIcon(currentCat.icon);
        } else if (catProducts.length > 0) {
          setCategoryName(catProducts[0].categoryNameBn || slug);
          setCategoryIcon(catProducts[0].categoryIcon || "🧺");
        } else {
          setCategoryName("");
        }

        setProducts(catProducts);
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Handle Sort Option numerically
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => a.today - b.today);
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => b.today - a.today);
    }
    return list;
  }, [products, sortOption]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />
      <PriceTicker products={allProductsForTicker} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 space-y-8">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 hover:text-emerald-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>হোম</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">
              {categoryName || slug}
            </span>
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
              <ProductSkeleton count={8} />
            </div>
          ) : products.length === 0 ? (
            /* Empty State / Invalid category slug */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-xs">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <PackageX className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-800">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                ক্যাটাগরিটি বর্তমানে খালি অথবা ঠিকানাটি সঠিক নয়। অনুগ্রহ করে অন্য
                ক্যাটাগরি নির্বাচন করুন বা হোম পেজে ফিরে যান।
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center space-x-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>হোম পেজে ফিরে যান</span>
              </Link>
            </div>
          ) : (
            /* Category Product Listing */
            <div className="space-y-6">
              {/* Category Header & Sort control */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-inner">
                    {categoryIcon}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {categoryName}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      মোট {products.length} টি পণ্য পাওয়া গেছে
                    </p>
                  </div>
                </div>

                {/* Sort Control Dropdown (C1) */}
                <div className="self-end sm:self-auto">
                  <SortDropdown
                    currentSort={sortOption}
                    onSortChange={(sort) => setSortOption(sort)}
                  />
                </div>
              </div>

              {/* Product Cards List */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
