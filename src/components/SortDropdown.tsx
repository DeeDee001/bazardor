"use client";

import React, { useState } from "react";
import { SortOption } from "@/lib/types";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "default", label: "ডিফল্ট" },
  { id: "price-asc", label: "দাম: কম থেকে বেশি" },
  { id: "price-desc", label: "দাম: বেশি থেকে কম" },
];

export default function SortDropdown({
  currentSort,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.id === currentSort)?.label || "ডিফল্ট";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="পণ্য সাজানোর অপশন নির্বাচন করুন"
        className="inline-flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs transition-colors hover:border-emerald-500 hover:bg-slate-50 focus:outline-hidden"
      >
        <ArrowUpDown className="h-4 w-4 text-emerald-600" />
        <span>সাজান:</span>
        <span className="font-semibold text-emerald-800">{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
            {SORT_OPTIONS.map((option) => {
              const isSelected = currentSort === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
