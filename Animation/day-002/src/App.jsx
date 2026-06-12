import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { RotateCcw, Sparkles } from 'lucide-react'
import './App.css'

function App() {
  const containerRef = useRef(null)
  const text = "Ravi Kumar Pandit as a developer !"
  const words = text.split(" ")

  const { contextSafe } = useGSAP({ scope: containerRef })

  const playAnimation = contextSafe(() => {
    // Animate each word in sequence
    gsap.fromTo('.word',
      { 
        y: 50, 
        opacity: 0, 
        scale: 0.8, 
        filter: 'blur(10px)',
        rotateX: -45
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        rotateX: 0,
        duration: 0.9, 
        ease: 'back.out(1.6)', 
        stagger: 0.15 
      }
    )
  })

  // Auto-play the animation once on component mount
  useGSAP(() => {
    playAnimation()
  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden font-sans"
    >
      {/* Premium background styling */}
      {/* Glow Backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center gap-8 max-w-4xl px-6 text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/30 text-purple-300 text-xs font-semibold uppercase tracking-wider select-none animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Word Animation Pipeline
        </div>

        {/* The Text to Animate - Split into words */}
        <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight flex flex-wrap justify-center gap-x-3.5 gap-y-3.5 py-4">
          {words.map((word, index) => (
            <span 
              key={index} 
              className="inline-block overflow-hidden pb-1"
            >
              <span 
                className="word inline-block origin-bottom-left text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200"
                style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              >
                {word}
              </span>
            </span>
          ))}
        </p>

        {/* Replay Controls */}
        <button
          onClick={playAnimation}
          className="group mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-950/20 focus:outline-none cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
          <span className="text-sm font-semibold tracking-wide">Replay Animation</span>
        </button>
      </div>
    </div>
  )
}

export default App
