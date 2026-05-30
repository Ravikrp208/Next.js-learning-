import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
      
      {/* Title Header Skeleton */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg lg:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Skeleton (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Search box */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Reset Button */}
          <Skeleton className="h-9 w-full rounded-lg" />
        </aside>

        {/* Product Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 p-5 h-[380px] space-y-4"
              >
                {/* Image Area */}
                <Skeleton className="aspect-square w-full rounded-xl" />

                {/* Details */}
                <div className="space-y-2 flex-1 pt-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4.5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-9 w-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
