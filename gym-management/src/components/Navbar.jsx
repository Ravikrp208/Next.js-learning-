"use client";
import React, { useState } from "react";
import { Dumbbell, Users, CheckSquare, DollarSign, Settings, Menu, X, Cloud, CloudOff, LogOut, LogIn, User, Shield } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, gymName, isSynced, currentUser, onLoginClick, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Navigation Items based on roles
  const getNavItems = () => {
    const items = [{ id: "home", name: "Home", icon: Dumbbell }];

    if (currentUser?.role === "admin") {
      items.push(
        { id: "dashboard", name: "Analytics", icon: Dumbbell },
        { id: "members", name: "Members", icon: Users },
        { id: "attendance", name: "Attendance", icon: CheckSquare },
        { id: "payments", name: "Payments", icon: DollarSign },
        { id: "settings", name: "Settings", icon: Settings }
      );
    } else if (currentUser?.role === "member") {
      items.push({ id: "member-portal", name: "My Portal", icon: CheckSquare });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Gym Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-zinc-950 glow-lime">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black tracking-tight text-white block uppercase">{gymName}</span>
              <span className="block text-[9px] uppercase tracking-widest text-lime-400 font-extrabold text-glow-lime leading-none">Fitness Club</span>
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
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-zinc-800/80 text-lime-400 border border-zinc-700/30"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-lime-400" : ""}`} />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Right Area: Sync indicator + User Session */}
          <div className="hidden md:flex items-center gap-4">
            {/* Sync badge */}
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isSynced
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                  : "bg-amber-950/60 text-amber-400 border border-amber-800/40"
              }`}
            >
              {isSynced ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
              <span>{isSynced ? "Sheets Synced" : "Local Sync"}</span>
            </div>

            {/* Login / Profile badge */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
                {currentUser.role === "admin" ? (
                  <div className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 border border-zinc-800">
                    <Shield className="h-3.5 w-3.5 text-lime-400" />
                    <span className="text-xs font-bold text-white">Admin Panel</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <img 
                      src={currentUser.memberData?.photo || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=100"} 
                      alt={currentUser.name} 
                      className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                    />
                    <span className="text-xs font-bold text-zinc-300 truncate max-w-[100px]">{currentUser.name}</span>
                  </div>
                )}
                
                <button
                  onClick={onLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/60 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-800/50 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 px-4 py-2 text-xs font-extrabold text-zinc-950 transition-all cursor-pointer glow-lime uppercase tracking-wider"
              >
                <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Login / Register</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
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
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-3 pt-2 pb-4 space-y-3">
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-lime-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </button>
            );
          })}

          <div className="border-t border-zinc-900 pt-3 space-y-3">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-lime-400" />
                  <span className="text-xs font-bold text-white">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-800/50 bg-rose-950/20 px-3 py-1.5 text-xs font-bold text-rose-400 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-extrabold text-zinc-950 glow-lime cursor-pointer uppercase tracking-wider"
              >
                <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
