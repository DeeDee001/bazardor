import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import {
  formatPercentage,
  formatPrice,
  formatUnit,
} from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn} এর বিস্তারিত বাজার দর দেখুন`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10"
    >
      {/* Top Header: Icon & Category Tag */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl sm:text-3xl shadow-inner transition-transform group-hover:scale-110">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {product.categoryNameBn || "সাধারণ"}
          </span>
        </div>

        {/* Product Title & Unit */}
        <div className="mt-3.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {formatUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Bottom Price Row & Change Badge */}
      <div className="mt-5 border-t border-slate-100 pt-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400">
              আজকের দাম
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatPrice(product.today)}
            </p>
          </div>

          {/* Change Badge */}
          <div className="flex flex-col items-end">
            <span
              className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                isUp
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                  : isDown
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>{formatPercentage(product.change?.pct || 0)}</span>
            </span>
          </div>
        </div>

        {/* View Details Prompt on hover */}
        <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
          <span>বিস্তারিত দেখুন</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
