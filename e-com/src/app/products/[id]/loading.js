import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-16 animate-pulse">
      
      {/* Breadcrumb Back Button Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-4 w-48 rounded hidden sm:block" />
      </div>

      {/* Main Details Loading Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column - Image & Thumbnails */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Column - Product Meta */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>

          <div className="py-4 border-y border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex gap-4 items-center pt-4">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-150 dark:border-zinc-900">
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} className="h-5 w-full rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <section className="space-y-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 p-4 h-[260px]"
            >
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
