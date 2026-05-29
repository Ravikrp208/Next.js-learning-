"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, Search, SlidersHorizontal, ArrowUpDown, X, ListFilter } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductsClient({ initialProducts }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL search states
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // Local state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("featured");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync state with URL when search params change
  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam || "");
  }, [searchParam]);

  // Find dynamic price ranges from product dataset
  const absoluteMaxPrice = useMemo(() => {
    if (initialProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...initialProducts.map((p) => p.price)));
  }, [initialProducts]);

  // Set default max price on load
  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
  }, [absoluteMaxPrice]);

  // Categories list with counts
  const categoriesList = useMemo(() => {
    const counts = { all: initialProducts.length };
    initialProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [initialProducts]);

  // Handle category filter click
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price <= maxPrice;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        return 0; // Default featured order
      });
  }, [initialProducts, selectedCategory, searchQuery, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(absoluteMaxPrice);
    setSortBy("featured");
    router.push("/products");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Title Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Our Catalog</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Displaying {filteredProducts.length} of {initialProducts.length} premium products
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-1.5 px-3 text-sm text-zinc-700 dark:text-zinc-300 outline-none focus:border-indigo-500"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFiltersMobile(true)}
            className="lg:hidden inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-1.5 px-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* SIDEBAR FILTERS - Desktop */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24">
          
          {/* Search box */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Find item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categories</h3>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition capitalize ${
                    selectedCategory === cat.name
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full font-bold">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Max Price</h3>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={absoluteMaxPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
            <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
              <span>$0</span>
              <span>${absoluteMaxPrice}</span>
            </div>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={handleResetFilters}
            className="w-full text-center py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Clear Filters
          </button>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-3">
          
          {/* Active Filter Tags */}
          {(selectedCategory !== "all" || searchQuery !== "" || maxPrice < absoluteMaxPrice) && (
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Active Filters:</span>
              
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 py-1 px-3 text-xs font-medium capitalize border border-indigo-200/50 dark:border-indigo-800/50">
                  {selectedCategory}
                  <button onClick={() => handleCategorySelect("all")}>
                    <X className="h-3.5 w-3.5 hover:text-indigo-800 dark:hover:text-indigo-200" />
                  </button>
                </span>
              )}

              {searchQuery !== "" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 py-1 px-3 text-xs font-medium border border-indigo-200/50 dark:border-indigo-800/50">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3.5 w-3.5 hover:text-indigo-800 dark:hover:text-indigo-200" />
                  </button>
                </span>
              )}

              {maxPrice < absoluteMaxPrice && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 py-1 px-3 text-xs font-medium border border-indigo-200/50 dark:border-indigo-800/50">
                  Under ${maxPrice}
                  <button onClick={() => setMaxPrice(absoluteMaxPrice)}>
                    <X className="h-3.5 w-3.5 hover:text-indigo-800 dark:hover:text-indigo-200" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition"
              >
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            /* Empty Search Results */
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <SlidersHorizontal className="h-10 w-10 text-zinc-400 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No products found</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                Your filter selection matched no items in our catalog. Try clearing some options or searching for something else.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-2 px-5 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Catalog Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 transition duration-300 hover:shadow-lg"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square w-full overflow-hidden bg-white p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="h-full max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-450 border border-amber-500/20">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {prod.rating?.rate || "4.5"}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {prod.category}
                    </span>
                  </div>

                  {/* Details block */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-5">
                      <span className="text-base font-bold text-zinc-950 dark:text-white">
                        ${prod.price.toFixed(2)}
                      </span>
                      <AddToCartButton product={prod} showText={false} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-zinc-950 py-4 pb-12 px-6 shadow-xl border-l border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900 pb-4 mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <ListFilter className="h-5 w-5" /> Filters
              </h2>
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Content */}
            <div className="space-y-6">
              
              {/* Search box */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Find item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-white outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              {/* Categories list */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categories</h3>
                <div className="flex flex-col gap-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        handleCategorySelect(cat.name);
                        setShowFiltersMobile(false);
                      }}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm capitalize ${
                        selectedCategory === cat.name
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Max Price</h3>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    ${maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              {/* Clear button */}
              <button
                onClick={() => {
                  handleResetFilters();
                  setShowFiltersMobile(false);
                }}
                className="w-full py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-350 rounded-lg text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
