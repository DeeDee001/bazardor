"use client";

import React, { useState, useMemo } from "react";
import { Product, SortOption } from "@/lib/types";
import ProductCard from "./ProductCard";
import SortDropdown from "./SortDropdown";
import { Search } from "lucide-react";

interface HomeProductListProps {
  initialProducts: Product[];
}

export default function HomeProductList({
  initialProducts,
}: HomeProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Extract unique categories
  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; nameBn: string; icon: string }>();
    initialProducts.forEach((p) => {
      if (p.category && !map.has(p.category)) {
        map.set(p.category, {
          slug: p.category,
          nameBn: p.categoryNameBn || p.category,
          icon: p.categoryIcon || "📦",
        });
      }
    });
    return Array.from(map.values());
  }, [initialProducts]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.categoryNameBn && p.categoryNameBn.toLowerCase().includes(q))
      );
    }

    // Sort by numeric price value
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortOption]);

  return (
    <div className="space-y-6">
      {/* Search, Filter chips, and Sort Row */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য খুঁজুন (যেমন: চাল, পেঁয়াজ, আলু)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <SortDropdown
            currentSort={sortOption}
            onSortChange={(sort) => setSortOption(sort)}
          />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-emerald-700 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          সব ({initialProducts.length})
        </button>
        {categories.map((cat) => {
          const count = initialProducts.filter(
            (p) => p.category === cat.slug
          ).length;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 inline-flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameBn}</span>
              <span className="text-[11px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <span className="text-4xl">🔍</span>
          <h4 className="mt-3 text-lg font-bold text-slate-800">
            কোনো পণ্য পাওয়া যায়নি
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য খুঁজে পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSortOption("default");
            }}
            className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
}
