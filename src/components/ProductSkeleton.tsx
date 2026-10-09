import React from "react";

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-5 w-3/4 rounded-md bg-slate-200" />
              <div className="h-3 w-1/3 rounded-md bg-slate-200" />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-3">
            <div className="flex items-end justify-between">
              <div className="space-y-1.5">
                <div className="h-3 w-12 rounded bg-slate-200" />
                <div className="h-6 w-20 rounded-md bg-slate-200" />
              </div>
              <div className="h-6 w-14 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
