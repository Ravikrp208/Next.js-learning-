"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Flame, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NEW_WORKOUTS = [
  {
    id: "w1",
    title: "HIIT Core Shredder",
    category: "Cardio & Core",
    trainer: "Vikram Rathore",
    duration: "35 mins",
    calories: "450 kcal",
    level: "Intermediate",
    intensity: 4,
    description: "High-intensity interval training designed to burn fat and sculpt core muscles in record time.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "w2",
    title: "Powerlifting Fundamentals",
    category: "Strength",
    trainer: "Kabir Dev",
    duration: "50 mins",
    calories: "600 kcal",
    level: "Advanced",
    intensity: 5,
    description: "Master deadlifts, squats, and bench press under personal guidance to maximize absolute power.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "w3",
    title: "Vinyasa Flow Yoga",
    category: "Flexibility & Mindfulness",
    trainer: "Ananya Roy",
    duration: "45 mins",
    calories: "280 kcal",
    level: "All Levels",
    intensity: 2,
    description: "Flow through dynamic postures linking breath to movement to build strength and clear the mind.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "w4",
    title: "Combat Boxing & MMA",
    category: "Combat & Cardio",
    trainer: "Rocky Balani",
    duration: "40 mins",
    calories: "550 kcal",
    level: "Intermediate",
    intensity: 5,
    description: "Learn high-impact punching combinations, footwork, and core training for a full-body workout.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "w5",
    title: "Hypertrophy Arms & Chest",
    category: "Strength",
    trainer: "Sher Singh",
    duration: "60 mins",
    calories: "500 kcal",
    level: "Advanced",
    intensity: 4,
    description: "Targeted resistance training specifically engineered to trigger muscle hypertrophy and upper body pump.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop"
  }
];

export default function WorkoutSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlay]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? NEW_WORKOUTS.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === NEW_WORKOUTS.length - 1 ? 0 : prevIndex + 1));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  const currentWorkout = NEW_WORKOUTS[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[420px]">
        
        {/* Left Side: Animated Workout Card */}
        <div className="relative w-full lg:w-1/2 h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={currentWorkout.image} 
                alt={currentWorkout.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-lime-400 text-zinc-950 px-3.5 py-1 text-xs font-black tracking-wider uppercase glow-lime">
                  {currentWorkout.category}
                </span>
              </div>

              {/* Level indicator */}
              <div className="absolute top-4 right-4 z-10">
                <span className="rounded-full bg-black/60 border border-zinc-700/60 backdrop-blur-md text-white px-3 py-1 text-xs font-semibold">
                  {currentWorkout.level}
                </span>
              </div>

              {/* Workout Details on Card */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-4 text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-lime-400" />
                    {currentWorkout.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    {currentWorkout.calories}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{currentWorkout.title}</h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Details & Interaction */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-lime-400 text-glow-lime">
              Newly Added Workouts
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {currentWorkout.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed min-h-[72px]">
              {currentWorkout.description}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                <User className="h-5 w-5 text-lime-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Trainer</p>
                <p className="text-sm font-bold text-white">{currentWorkout.trainer}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Intensity</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`h-2.5 w-2 rounded-full ${
                        star <= currentWorkout.intensity ? "bg-lime-400" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slider Actions */}
          <div className="flex items-center justify-between pt-2">
            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition-all hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNext}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition-all hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {NEW_WORKOUTS.map((workout, idx) => (
                <button
                  key={workout.id}
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
        </div>
      </div>
    </div>
  );
}
