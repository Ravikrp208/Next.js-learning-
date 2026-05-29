"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Send, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Bio */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              LuxeMarket
            </span>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Curating premium products tailored to fit your high standards. Elevate your everyday lifestyle with our top-tier catalog.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Camera">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Send">
                <Send className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Globe">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Chat">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Shop Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=jewelery" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Jewelery
                </Link>
              </li>
              <li>
                <Link href="/products?category=men's clothing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link href="/products?category=women's clothing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Women's Clothing
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ & Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Stay Updated
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2 px-3.5 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-950 dark:bg-zinc-550 dark:bg-white text-white dark:text-zinc-950 py-2 px-4 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition duration-200"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
                {!subscribed && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} LuxeMarket. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
