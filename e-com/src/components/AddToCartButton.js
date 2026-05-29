"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product, className = "", showText = true }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-300 active:scale-[0.97] cursor-pointer ${
        added
          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10"
          : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-zinc-950/15"
      } shadow-md ${className}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 stroke-[3px]" />
          {showText && <span>Added!</span>}
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          {showText && <span>Add to Cart</span>}
        </>
      )}
    </button>
  );
}
