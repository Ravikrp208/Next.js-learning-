"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
    tag: "Limitless Power",
    title: "Transform Your Physique",
    desc: "Train with heavy weights, Olympic bars, and professional strength programs to build lean muscle mass."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1600&auto=format&fit=crop",
    tag: "Cardio Endurance",
    title: "Push Past Your Limits",
    desc: "Increase lung capacity, stamina, and burn fat on our premium mechanical and curved cardio runs."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop",
    tag: "Hypertrophy Arena",
    title: "Unleash The Beast Mode",
    desc: "Target specific muscle groups using high-intensity isolated weight training and optimal reps."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop",
    tag: "Mind & Mobility",
    title: "Align Strength & Focus",
    desc: "Master vinyasa flows, flexibility sequences, and mental conditioning to balance heavy strength regimes."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop",
    tag: "Metabolic HIIT",
    title: "High Energy Conditioning",
    desc: "Explosive routines featuring battle ropes, plyometrics, and kettlebell conditioning for rapid calorie burn."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1600&auto=format&fit=crop",
    tag: "Core & Deadlift",
    title: "Build True Absolute Power",
    desc: "Master proper deadlift mechanics and lower back bracing to establish heavy structural strength."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1600&auto=format&fit=crop",
    tag: "Combat Cardio",
    title: "Heavy Boxing Sparring",
    desc: "Improve hand-eye coordination, quick footwork, and upper body agility with professional punch pads."
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1600&auto=format&fit=crop",
    tag: "Agility & Focus",
    title: "Speed Training Programs",
    desc: "High velocity training drills engineered to increase response rates, calf power, and core balance."
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop",
    tag: "Athletic Conditioning",
    title: "Run Faster, Train Harder",
    desc: "Specialized sprint and agility schedules designed to transform you into an active, functional athlete."
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1600&auto=format&fit=crop",
    tag: "Functional Kettlebells",
    title: "Kettlebell Swing Circuit",
    desc: "Activate your posterior chain, glutes, and grip with continuous kettlebell routines and core support."
  }
];

export default function HeroImageSlider({ onOpenRegister, gymName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlay]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 28 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.8, ease: "easeOut" }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 28 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.6, ease: "easeIn" }
      }
    })
  };

  return (
    <div 
      className="relative w-full h-[65vh] sm:h-[75vh] md:h-[80vh] min-h-[500px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <motion.img 
              src={SLIDES[currentIndex].image} 
              alt={SLIDES[currentIndex].title}
              className="w-full h-full object-cover object-center"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 6, ease: "easeOut" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/50 z-[2]" />
      <div className="absolute inset-0 bg-black/35 z-[2]" />

      {/* Content Card Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-4xl space-y-4 z-10 text-left">
        <div className="overflow-hidden py-0.5">
          <motion.span
            key={`tag-${currentIndex}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex rounded-full bg-lime-400/20 border border-lime-400/30 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-lime-400 text-glow-lime"
          >
            ⚡ {SLIDES[currentIndex].tag}
          </motion.span>
        </div>
        
        <div className="overflow-hidden py-1">
          <motion.h1 
            key={`title-${currentIndex}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none uppercase max-w-3xl"
          >
            {SLIDES[currentIndex].title}
          </motion.h1>
        </div>
        
        <div className="overflow-hidden pb-1">
          <motion.p
            key={`desc-${currentIndex}`}
            initial={{ y: "50%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-zinc-300 font-medium max-w-2xl leading-relaxed"
          >
            {SLIDES[currentIndex].desc}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          key={`buttons-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 pt-2 relative z-20"
        >
          <button
            onClick={() => onOpenRegister()}
            className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-zinc-950 hover:bg-lime-300 transition-all cursor-pointer glow-lime uppercase tracking-wider"
          >
            <span>Start Training Today</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
          
          <a
            href="#workouts-section"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/80 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer uppercase tracking-wider backdrop-blur-sm"
          >
            <span>Browse Workouts</span>
          </a>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <button
          onClick={handlePrev}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl bg-black/40 border border-zinc-800/60 backdrop-blur-md text-white/80 hover:text-white transition-all hover:bg-zinc-900 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl bg-black/40 border border-zinc-800/60 backdrop-blur-md text-white/80 hover:text-white transition-all hover:bg-zinc-900 cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Indicators - 10 Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex ? "w-6 bg-lime-400" : "w-2 bg-zinc-700 hover:bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
