"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPercentage, formatPrice, formatShortUnit } from "@/lib/utils";

interface PriceTickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  if (!products || products.length === 0) return null;

  // Duplicate the list to ensure seamless infinite scroll
  const tickerItems = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden border-y border-emerald-100 bg-emerald-50/70 py-2.5 backdrop-blur-sm select-none">
      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-16" />

      <div className="animate-ticker flex items-center space-x-6 sm:space-x-8">
        {tickerItems.map((item, idx) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";

          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/product/${item.slug}`}
              className="inline-flex shrink-0 items-center space-x-2 text-xs sm:text-sm font-medium transition-transform hover:scale-105"
            >
              <span className="text-base sm:text-lg">{item.image || item.categoryIcon}</span>
              <span className="font-semibold text-slate-800">{item.nameBn}</span>
              <span className="text-slate-600">
                {formatPrice(item.today)}/{formatShortUnit(item.unit)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  isUp
                    ? "bg-emerald-100 text-emerald-700"
                    : isDown
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {formatPercentage(item.change?.pct || 0)}
              </span>
              <span className="text-slate-300">|</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
