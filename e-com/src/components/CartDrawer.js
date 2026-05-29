"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingCart, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
      setCheckoutComplete(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col h-full border-l border-zinc-200/50 dark:border-zinc-800/50">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-indigo-500" />
              Your Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 rounded-full transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {checkoutComplete ? (
            /* Checkout Success Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center animate-bounce">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Order Confirmed!</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                Thank you for your purchase. We are preparing your premium items. Your order details have been emailed.
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Cart is empty</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                Looks like you haven't added any luxury items to your cart yet.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 px-6 text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 shadow-md transition duration-200"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Items List */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4 divide-y divide-zinc-100 dark:divide-zinc-900">
                
                {/* Free Shipping Progress bar */}
                <div className="pb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    <span>
                      {remainingForFreeShipping > 0
                        ? `Add $${remainingForFreeShipping.toFixed(2)} more for FREE shipping`
                        : "You've unlocked FREE shipping!"}
                    </span>
                    <span>{progressToFreeShipping.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 pt-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex py-4 gap-4 items-start">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white p-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-white">
                          <h4 className="line-clamp-1 pr-4">{item.title}</h4>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-400 capitalize">{item.category}</p>

                        <div className="flex flex-1 items-end justify-between text-xs mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-150 dark:hover:bg-zinc-800 transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 font-medium text-zinc-800 dark:text-zinc-200">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-150 dark:hover:bg-zinc-800 transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Delete Action */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-rose-500 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Card */}
              <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-6 sm:px-6 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span>{remainingForFreeShipping > 0 ? "$9.99" : "Free"}</span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-800 my-2 pt-2 flex justify-between font-semibold text-zinc-900 dark:text-white text-base">
                    <span>Total</span>
                    <span>
                      ${(cartTotal + (remainingForFreeShipping > 0 ? 9.99 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-4 text-base font-semibold shadow-lg hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition duration-150"
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    or Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
