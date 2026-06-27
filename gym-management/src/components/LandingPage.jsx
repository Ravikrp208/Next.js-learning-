"use client";
import React from "react";
import { Dumbbell, ShieldCheck, Trophy, Sparkles, Flame, Users, Calendar, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import WorkoutSlider from "./WorkoutSlider";
import HeroImageSlider from "./HeroImageSlider";

const cardStagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: (idx) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: idx * 0.1,
      ease: "easeOut"
    }
  }),
  viewport: { once: true, margin: "-80px" }
};

export default function LandingPage({ plans, onOpenLogin, onOpenRegister, gymName }) {
  
  const features = [
    {
      icon: ShieldCheck,
      title: "Elite Certified Coaches",
      desc: "Our trainers are certified professionals ready to guide your posture, nutrition, and workout schedules."
    },
    {
      icon: Trophy,
      title: "State-Of-Running-Art Equipment",
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
      {/* Full-width advertisement / background image slider */}
      <HeroImageSlider onOpenRegister={onOpenRegister} gymName={gymName} />

      {/* Workout Slider Section */}
      <motion.section 
        id="workouts-section" 
        className="space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
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
      </motion.section>

      {/* Core Services Section */}
      <section className="space-y-10">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400 text-glow-lime">
            Our Features
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase sm:text-4xl">
            Why Choose {gymName}?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            We provide custom facilities and tools to help you hit your peak safely and systematically.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                custom={idx}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-80px" }}
                variants={cardStagger}
                className="glass-card glass-card-hover rounded-2xl p-6 space-y-4"
              >
                <div className="h-10 w-10 rounded-xl bg-lime-950/20 text-lime-400 border border-lime-800/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Membership Pricing Section */}
      <section id="pricing-section" className="space-y-10">
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-lime-400 text-glow-lime">
            Pricing Plans
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase sm:text-4xl">
            Choose Your Level
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Flexible membership plans made to accommodate your schedule and focus.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, idx) => {
            const isElite = p.id === "p3"; // Highlight Annual Elite
            return (
              <motion.div 
                key={p.id}
                custom={idx}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-80px" }}
                variants={cardStagger}
                className={`glass-card rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                  isElite 
                    ? "border-2 border-lime-400/80 shadow-lime shadow-xl scale-102 lg:scale-105" 
                    : "border border-zinc-800"
                }`}
              >
                {isElite && (
                  <span className="absolute -top-3.5 right-6 rounded-full bg-lime-400 text-zinc-950 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest glow-lime z-[5]">
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
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Final conversion Section */}
      <motion.section 
        className="relative overflow-hidden rounded-3xl border border-lime-400/20 bg-lime-400/5 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
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
      </motion.section>

    </div>
  );
}
