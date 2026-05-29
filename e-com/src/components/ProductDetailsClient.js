"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Plus, Minus, ShoppingCart, Truck, ShieldAlert, Award, ArrowLeft, Heart, RotateCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailsClient({ product, relatedProducts }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock secondary angles using filters/transforms for showcase
  const images = [
    { url: product.image, label: "Front View" },
    { url: product.image, label: "Detail View", style: "scale-125 translate-y-2" },
    { url: product.image, label: "Alternative Angle", style: "rotate-12 translate-x-2" },
  ];

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  // Generate mock rating counts
  const reviewCount = Math.floor((product.id * 37) % 150) + 15;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-16">
      
      {/* Breadcrumbs & Back Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-550 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-xs text-zinc-400 font-semibold capitalize hidden sm:inline-block">
          Products / {product.category} / {product.title.split(" ")[0]}
        </span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white p-8 md:p-12 overflow-hidden flex items-center justify-center shadow-md">
            <img
              src={images[selectedImageIndex].url}
              alt={product.title}
              className={`max-h-[350px] w-auto object-contain transition-all duration-500 ${
                images[selectedImageIndex].style || ""
              }`}
            />

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute right-4 top-4 p-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-450 hover:text-rose-500 hover:scale-105 active:scale-95 transition shadow-sm"
              aria-label="Add to wishlist"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-square rounded-xl border p-2 bg-white flex items-center justify-center overflow-hidden transition-all duration-200 ${
                  selectedImageIndex === idx
                    ? "border-indigo-650 ring-2 ring-indigo-500/20"
                    : "border-zinc-200/55 dark:border-zinc-800/55 hover:border-zinc-350"
                }`}
              >
                <img
                  src={img.url}
                  alt={`${product.title} thumb ${idx}`}
                  className={`h-full max-h-16 w-auto object-contain ${img.style || ""}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Meta */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-indigo-550/10 dark:bg-indigo-400/10 px-3 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="h-4.5 w-4.5 fill-amber-500" />
                <span className="ml-1 font-bold text-zinc-900 dark:text-white">
                  {product.rating?.rate || "4.5"}
                </span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{reviewCount} reviews</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-emerald-600 dark:text-emerald-450 font-bold">In Stock</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="py-4 border-y border-zinc-200/50 dark:border-zinc-800/50 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-zinc-400 line-through">
              ${(product.price * 1.15).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-100/40 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
              Save 15%
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Description</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & Cart Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              
              {/* Quantity selector */}
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 overflow-hidden self-start">
                <button
                  onClick={handleDecrement}
                  className="px-4 py-3 text-zinc-500 hover:text-indigo-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-bold text-zinc-800 dark:text-zinc-250 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="px-4 py-3 text-zinc-500 hover:text-indigo-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-6 text-base font-bold shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>

          {/* Features and trust list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-zinc-550 dark:text-zinc-400 border-t border-zinc-150 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <span>Free Delivery over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <span>30 Day Easy Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <span>Genuine Product</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Related Products</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Browse other highly sought after items in the <span className="font-semibold">{product.category}</span> category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 transition duration-300 hover:shadow-lg"
              >
                {/* Related product image */}
                <div className="relative aspect-square w-full overflow-hidden bg-white p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="h-full max-h-40 w-auto object-contain transition group-hover:scale-105 duration-205"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-450">
                    <Star className="h-2.5 w-2.5 fill-amber-500" />
                    {prod.rating?.rate || "4.5"}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-[11px] text-zinc-450 mt-0.5">${prod.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-medium capitalize">
                      {prod.category.split(" ")[0]}
                    </span>
                    <AddToCartButton product={prod} showText={false} className="py-1.5 px-2.5 rounded-lg" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
