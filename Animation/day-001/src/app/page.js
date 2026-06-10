"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Cpu, 
  Layers, 
  Grid3X3, 
  ArrowRight,
  Code,
  Undo
} from "lucide-react";

export default function Home() {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  
  // States
  const [tlProgress, setTlProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastTweenAction, setLastTweenAction] = useState("gsap.to('.tween-box', { ... })");
  const [waveSeed, setWaveSeed] = useState("Center");

  // Grid size
  const rows = 6;
  const cols = 6;
  const gridDots = Array.from({ length: rows * cols });

  // GSAP animations
  useGSAP(() => {
    // 1. Initial Page Load Stagger Entrance
    const entranceTl = gsap.timeline();
    
    entranceTl
      .from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })
      .from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      }, "-=0.3")
      .from(".hero-desc", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .from(".creator-tag", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.5)"
      }, "-=0.3")
      .from(".dashboard-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }, "-=0.4");

    // 2. Slow Background Floating Elements
    gsap.to(".bg-bubble-1", {
      x: "random(-60, 60)",
      y: "random(-60, 60)",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".bg-bubble-2", {
      x: "random(-80, 80)",
      y: "random(-80, 80)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".bg-bubble-3", {
      x: "random(-50, 50)",
      y: "random(-50, 50)",
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 3. Set up the Timeline Demo
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        setTlProgress(tl.progress());
      },
      onComplete: () => {
        setIsPlaying(false);
      },
      onReverseComplete: () => {
        setIsPlaying(false);
      }
    });

    tl.to(".tl-shape-1", { y: -35, scale: 1.15, duration: 0.5, ease: "power2.out" })
      .to(".tl-shape-2", { y: -35, scale: 1.15, rotate: 45, duration: 0.5, ease: "power2.out" }, "-=0.35")
      .to(".tl-shape-3", { y: -35, scale: 1.15, borderRadius: "20%", duration: 0.5, ease: "power2.out" }, "-=0.35")
      .to(".tl-shape-1, .tl-shape-2, .tl-shape-3", { rotation: "+=360", duration: 0.8, ease: "back.out(1.2)" })
      .to(".tl-shape-1", { x: -24, backgroundColor: "#ec4899", duration: 0.4, ease: "power2.inOut" })
      .to(".tl-shape-3", { x: 24, backgroundColor: "#06b6d4", duration: 0.4, ease: "power2.inOut" }, "-=0.4")
      .to(".tl-shape-1, .tl-shape-2, .tl-shape-3", { 
        x: 0, 
        y: 0, 
        rotate: 0, 
        scale: 1, 
        backgroundColor: "", 
        borderRadius: "", 
        duration: 0.6, 
        ease: "power3.inOut" 
      });

    tlRef.current = tl;
  }, { scope: containerRef });

  // --- Handlers for Tween Section ---
  const handleTween = (actionType) => {
    gsap.killTweensOf(".tween-box");
    // Clear any previous transformations
    gsap.set(".tween-box", { clearProps: "all" });

    switch (actionType) {
      case "spin":
        setLastTweenAction("gsap.to('.tween-box', { rotate: '+=360', duration: 0.8, ease: 'power2.out' })");
        gsap.to(".tween-box", { rotate: "+=360", duration: 0.8, ease: "power2.out" });
        break;
      case "bounce":
        setLastTweenAction("gsap.to('.tween-box', { y: -60, yoyo: true, repeat: 1, duration: 0.4, ease: 'power1.out' })");
        gsap.to(".tween-box", { y: -60, yoyo: true, repeat: 1, duration: 0.4, ease: "power1.out" });
        break;
      case "pulse":
        setLastTweenAction("gsap.to('.tween-box', { scale: 1.35, yoyo: true, repeat: 1, duration: 0.3 })");
        gsap.to(".tween-box", { scale: 1.35, yoyo: true, repeat: 1, duration: 0.3, ease: "power1.inOut" });
        break;
      case "glow":
        setLastTweenAction("gsap.to('.tween-box', { filter: 'hue-rotate(180deg) brightness(1.2)', duration: 0.8 })");
        gsap.to(".tween-box", { 
          filter: "hue-rotate(180deg) brightness(1.2)", 
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
        break;
      case "flip":
        setLastTweenAction("gsap.to('.tween-box', { rotateY: '+=180', duration: 0.7, ease: 'back.out(1.5)' })");
        gsap.to(".tween-box", { rotateY: "+=180", duration: 0.7, ease: "back.out(1.5)" });
        break;
      default:
        break;
    }
  };

  // --- Handlers for Timeline Section ---
  const toggleTimeline = () => {
    if (!tlRef.current) return;
    if (isPlaying) {
      tlRef.current.pause();
      setIsPlaying(false);
    } else {
      if (tlRef.current.progress() === 1) {
        tlRef.current.restart();
      } else {
        tlRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const reverseTimeline = () => {
    if (!tlRef.current) return;
    tlRef.current.reverse();
    setIsPlaying(true);
  };

  const restartTimeline = () => {
    if (!tlRef.current) return;
    tlRef.current.restart();
    setIsPlaying(true);
  };

  const handleScrubChange = (e) => {
    if (!tlRef.current) return;
    const progressVal = parseFloat(e.target.value);
    tlRef.current.progress(progressVal);
    setTlProgress(progressVal);
  };

  // --- Handlers for Stagger Wave Section ---
  const triggerStaggerWave = (index) => {
    setWaveSeed(`Index ${index}`);
    
    // Stop any active animations on dots
    gsap.killTweensOf(".grid-dot");
    
    // Reset base properties quickly
    gsap.set(".grid-dot", { clearProps: "all" });

    // Trigger grid ripple wave
    gsap.to(".grid-dot", {
      scale: 0.2,
      rotate: 90,
      backgroundColor: "#ec4899", // fuchsia pink
      borderRadius: "50%",
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      stagger: {
        grid: [rows, cols],
        from: index,
        amount: 0.7
      },
      ease: "power2.inOut"
    });
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden relative"
    >
      {/* Background Decorative Gradients (Animated via GSAP) */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[110px] bg-bubble-1 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[130px] bg-bubble-2 pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] bg-bubble-3 pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-slate-900/80 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-violet-500/20">
            G
          </div>
          <span className="font-bold tracking-tight text-slate-100">GSAP.Lab</span>
        </div>
        <div className="creator-tag px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          Created by <span className="text-violet-400 font-bold">Ravi Kumar Pandit</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-16 pb-12 text-center z-10 flex flex-col items-center">
        <div className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next.js + GSAP Series</span>
        </div>

        <h1 className="hero-title text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6 max-w-3xl leading-tight">
          Day 001: The Magic of GreenSock
        </h1>

        <p className="hero-desc text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
          Welcome to the lab! Today, we explore core concepts: Tweens, choreographic Timelines, and Grid-based stagger ripples, brought to life through beautiful interactive playgrounds.
        </p>
      </section>

      {/* Interactive Playground Cards Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24 z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Tweens Playground */}
        <div className="dashboard-card flex flex-col p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-200">1. Basic Tweens</h2>
              <p className="text-xs text-slate-400">Interactive gsap.to() control</p>
            </div>
          </div>

          {/* Visual Display */}
          <div className="flex-1 min-h-[200px] flex items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/40 p-4 relative mb-6">
            <div className="tween-box w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/10 relative cursor-pointer select-none group/box">
              <Sparkles className="w-7 h-7 text-white/90" />
            </div>
          </div>

          {/* Code Viewer */}
          <div className="mb-6 p-3 rounded-lg bg-slate-950/80 border border-slate-900 font-mono text-[10px] text-violet-400/90 flex gap-2 items-start">
            <Code className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
            <span className="break-all">{lastTweenAction}</span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button 
              onClick={() => handleTween("spin")}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            >
              Spin 360°
            </button>
            <button 
              onClick={() => handleTween("bounce")}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            >
              Bounce
            </button>
            <button 
              onClick={() => handleTween("pulse")}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            >
              Pulse
            </button>
            <button 
              onClick={() => handleTween("glow")}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            >
              Color Cycle
            </button>
            <button 
              onClick={() => handleTween("flip")}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors col-span-2"
            >
              3D Flip
            </button>
          </div>
        </div>

        {/* Card 2: Timeline Magic */}
        <div className="dashboard-card flex flex-col p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-200">2. Timeline Sequencer</h2>
              <p className="text-xs text-slate-400">Choreograph multiple objects</p>
            </div>
          </div>

          {/* Visual Display */}
          <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/40 p-4 gap-6 mb-6">
            <div className="flex items-center justify-center gap-6 h-16 w-full">
              <div className="tl-shape-1 w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-pink-500/20">
                1
              </div>
              <div className="tl-shape-2 w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-violet-500/20">
                2
              </div>
              <div className="tl-shape-3 w-10 h-10 rounded bg-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-cyan-500/20">
                3
              </div>
            </div>

            {/* Scrubber slider */}
            <div className="w-full px-2 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>timeline.progress()</span>
                <span>{Math.round(tlProgress * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.001" 
                value={tlProgress}
                onChange={handleScrubChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>
          </div>

          {/* Code Header */}
          <div className="mb-6 p-3 rounded-lg bg-slate-950/80 border border-slate-900 font-mono text-[10px] text-fuchsia-400/90 flex gap-2 items-start">
            <Code className="w-4 h-4 text-fuchsia-500 shrink-0 mt-0.5" />
            <span className="break-all">gsap.timeline() .to(s1) .to(s2) .to(s3)</span>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-auto">
            <button 
              onClick={toggleTimeline}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button 
              onClick={reverseTimeline}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              title="Reverse Playback"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Reverse</span>
            </button>
            <button 
              onClick={restartTimeline}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors flex items-center justify-center"
              title="Restart Timeline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Stagger Grid Wave */}
        <div className="dashboard-card flex flex-col p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-200">3. Grid Stagger Wave</h2>
              <p className="text-xs text-slate-400">Spatial coordinate animations</p>
            </div>
          </div>

          {/* Visual Display: 6x6 Grid */}
          <div className="flex-1 flex items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/40 p-5 mb-6">
            <div className="grid grid-cols-6 gap-2.5">
              {gridDots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => triggerStaggerWave(i)}
                  className="grid-dot w-7 h-7 rounded bg-slate-800 hover:bg-slate-700/80 transition-colors cursor-pointer flex items-center justify-center text-[8px] text-slate-500 font-mono font-bold hover:scale-110 active:scale-90"
                  title={`Trigger ripple from index ${i}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Info Badge */}
          <div className="mb-6 p-3 rounded-lg bg-slate-950/80 border border-slate-900 font-mono text-[10px] text-cyan-400/90 flex gap-2 items-center">
            <Code className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>Ripple Center: <strong className="text-white">{waveSeed}</strong></span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-400 leading-normal mb-0 mt-auto">
            Click any cell in the 6x6 grid. GSAP calculates the distance dynamically using the <strong>stagger</strong> configuration, spawning a ripple originating from that point.
          </p>
        </div>

      </section>

      {/* Bottom Footer Credit Area */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 mt-auto border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <div>
          &copy; {new Date().getFullYear()} GSAP Animation Lab. All rights reserved.
        </div>
        <div className="flex gap-4 items-center">
          <span>Day 001 of 100</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span>Interactive Showcase</span>
        </div>
      </footer>
    </main>
  );
}