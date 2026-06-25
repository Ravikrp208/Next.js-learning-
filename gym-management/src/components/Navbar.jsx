"use client";
import React, { useState } from "react";
import { Dumbbell, Users, CheckSquare, DollarSign, Settings, Menu, X, Cloud, CloudOff } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, gymName, isSynced }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: Dumbbell },
    { id: "members", name: "Members", icon: Users },
    { id: "attendance", name: "Attendance", icon: CheckSquare },
    { id: "payments", name: "Payments", icon: DollarSign },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-zinc-950 glow-lime">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">{gymName}</span>
              <span className="block text-[10px] uppercase tracking-wider text-lime-400 font-semibold text-glow-lime">FitOS</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-800 text-lime-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-lime-400" : ""}`} />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Right Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isSynced
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                  : "bg-amber-950/60 text-amber-400 border border-amber-800/50"
              }`}
            >
              {isSynced ? (
                <>
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Google Sheets Synced</span>
                </>
              ) : (
                <>
                  <CloudOff className="h-3.5 w-3.5" />
                  <span>Local Mode</span>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <div
              className={`flex items-center justify-center p-1.5 rounded-full ${
                isSynced ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isSynced ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-lime-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
