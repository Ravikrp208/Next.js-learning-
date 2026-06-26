"use client";
import React from "react";
import { Dumbbell, ShieldCheck, Trophy, Sparkles, Flame, Users, Calendar, ArrowRight, Check } from "lucide-react";
import WorkoutSlider from "./WorkoutSlider";

export default function LandingPage({ plans, onOpenLogin, onOpenRegister, gymName }) {
  
  const features = [
    {
      icon: ShieldCheck,
      title: "Elite Certified Coaches",
      desc: "Our trainers are certified professionals ready to guide your posture, nutrition, and workout schedules."
    },
    {
      icon: Trophy,
      title: "State-Of-The-Art Equipment",
      desc: "Work out with industry-leading cardio systems, isolated weight machines, and specialized Olympic platforms."
    },
    {
      icon: Sparkles,
      title: "Premium Steam & Spa",
      desc: "Recover faster with clean steam baths, hot saunas, personal lockers, and dynamic massage stations."
    },
    {
      icon: Flame,
      title: "Dynamic Group Classes",
      desc: "Join high-energy classes including HIIT circuits, Vinyasa yoga, boxing combat, and powerlifting seminars."
    }
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6 sm:p-12 md:p-20 flex flex-col items-center text-center space-y-6">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-lime-400/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-lime-400/5 blur-[100px]" />

        <span className="rounded-full bg-lime-400/10 border border-lime-400/20 px-4 py-1 text-xs font-black uppercase tracking-widest text-lime-400 text-glow-lime animate-pulse-glow">
          ⚡ Welcome to {gymName}
        </span>
        
        <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none uppercase">
          Build Your <span className="text-lime-400 text-glow-lime">Ultimate Self</span> & Conquer Limits
        </h1>
        
        <p className="max-w-2xl text-sm sm:text-base text-zinc-400 font-medium">
          Step into a state-of-the-art gym environment where elite trainers, premium equipment, and syncable workout logs help you unleash your absolute physical peak. No login required to browse!
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 relative z-10 w-full justify-center sm:w-auto">
          <button
            onClick={() => onOpenRegister()}
            className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-8 py-4 text-sm font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime"
          >
            <span>Join Now & Log Workouts</span>
            <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
          </button>
          
          <a
            href="#workouts-section"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/80 px-8 py-4 text-sm font-bold text-white transition-all cursor-pointer"
          >
            <span>Explore Workouts</span>
          </a>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-zinc-900/80 w-full mt-12">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-white">500+</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Active Members</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-lime-400 text-glow-lime">15+</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Pro Trainers</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-white">30+</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">New Workouts</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-lime-400 text-glow-lime">99.8%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Workout Slider Section */}
      <section id="workouts-section" className="space-y-6">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase sm:text-4xl">
            Featured Workout Programs
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Browse our new workout additions. Login or register to check-in and track your progress.
          </p>
        </div>
        
        {/* Render our custom slider */}
        <WorkoutSlider />
      </section>

      {/* Core Services Section */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400 text-glow-lime">
            Our Features
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase sm:text-4xl">
            Why Choose {gymName}?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            We provide custom facilities and tools to help you hit your peak safely and systematically.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card glass-card-hover rounded-2xl p-6 space-y-4"
              >
                <div className="h-10 w-10 rounded-xl bg-lime-950/20 text-lime-400 border border-lime-800/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Membership Pricing Section */}
      <section id="pricing-section" className="space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400 text-glow-lime">
            Pricing Plans
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase sm:text-4xl">
            Choose Your Level
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Flexible membership plans made to accommodate your schedule and focus.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isElite = p.id === "p3"; // Highlight Annual Elite
            return (
              <div 
                key={p.id}
                className={`glass-card rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                  isElite 
                    ? "border-2 border-lime-400/80 shadow-lime shadow-xl scale-102 lg:scale-105" 
                    : "border border-zinc-800"
                }`}
              >
                {isElite && (
                  <span className="absolute -top-3.5 right-6 rounded-full bg-lime-400 text-zinc-950 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest glow-lime">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{p.name}</h3>
                    <div className="mt-2 flex items-baseline text-white">
                      <span className="text-3xl sm:text-4xl font-black">₹{p.price}</span>
                      <span className="ml-1 text-xs text-zinc-500 font-semibold">
                        / {p.durationMonths} {p.durationMonths === 1 ? "month" : "months"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">{p.description}</p>
                  
                  <div className="border-t border-zinc-900/80 pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="h-4 w-4 text-lime-400 stroke-[2.5]" />
                      <span>Standard Gym Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="h-4 w-4 text-lime-400 stroke-[2.5]" />
                      <span>Locker & Shower Access</span>
                    </div>
                    {isElite && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-lime-400 stroke-[2.5]" />
                          <span>Steam Bath Access Included</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-lime-400 stroke-[2.5]" />
                          <span>2 Personal Trainer Sessions</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onOpenRegister(p.id)}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all cursor-pointer mt-6 flex items-center justify-center gap-1.5 ${
                    isElite 
                      ? "bg-lime-400 text-zinc-950 hover:bg-lime-300 glow-lime" 
                      : "bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
                  }`}
                >
                  <span>Select Plan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Final conversion Section */}
      <section className="relative overflow-hidden rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight sm:text-3xl">
            Start logging your fitness streak today
          </h2>
          <p className="text-xs text-zinc-400 max-w-lg">
            Create an account to track your sessions, manage memberships, and sync your attendance directly.
          </p>
        </div>
        <button
          onClick={() => onOpenRegister()}
          className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-8 py-3.5 text-xs font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime shrink-0"
        >
          <span>Claim Your Account</span>
        </button>
      </section>

    </div>
  );
}
