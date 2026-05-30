"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Prevent hydration mismatch by rendering only after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 animate-pulse" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition duration-300 active:scale-95 focus:outline-none cursor-pointer border border-transparent hover:border-zinc-200/30 dark:hover:border-zinc-800/30"
        aria-label="Theme options"
        aria-expanded={isOpen}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-indigo-400 rotate-0 transition-all duration-300" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 rotate-0 transition-all duration-300" />
        )}
      </button>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-100">
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  <span>{opt.label}</span>
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-indigo-500" : "text-zinc-400"}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
