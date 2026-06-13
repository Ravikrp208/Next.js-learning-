import React, { useState } from 'react'
import { 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Code, 
  MoveRight, 
  MousePointer, 
  Maximize2, 
  Zap
} from 'lucide-react'
import AnimatedonX from './components/AnimatedonX'
import MagneticBox from './components/MagneticBox'
import TiltBox from './components/TiltBox'
import ExplodeBox from './components/ExplodeBox'
import DragBox from './components/DragBox'
import './App.css'

function App() {
  // Config state for X-axis animation
  const [direction, setDirection] = useState('left')
  const [distance, setDistance] = useState(150)
  const [duration, setDuration] = useState(1.2)
  const [ease, setEase] = useState('back.out(1.7)')
  const [delay, setDelay] = useState(0)
  const [trigger, setTrigger] = useState(0)
  
  // Selected tab for the Code Viewer ('xaxis', 'magnetic', 'tilt', 'explode')
  const [activeTab, setActiveTab] = useState('xaxis')

  // Helper to re-trigger the X-axis animation
  const replayXAnimation = () => {
    setTrigger(prev => prev + 1)
  }

  // Code snippets to display
  const codeSnippets = {
    xaxis: `// GSAP X-Axis Reveal
gsap.fromTo(element, 
  { 
    x: ${direction === 'left' ? -distance : distance}, 
    opacity: 0, 
    scale: 0.9,
    rotateY: ${direction === 'left' ? -15 : 15}
  },
  { 
    x: 0, 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    duration: ${duration},
    delay: ${delay},
    ease: "${ease}"
  }
)`,
    magnetic: `// GSAP Magnetic Effect
// On Mouse Move
gsap.to(container, {
  x: mouseX * 0.4, // strength
  y: mouseY * 0.4,
  duration: 0.4,
  ease: "power3.out"
})

// On Mouse Leave
gsap.to(container, {
  x: 0,
  y: 0,
  duration: 1,
  ease: "elastic.out(1, 0.3)" // snap-back
})`,
    tilt: `// GSAP 3D Orbit Tilt
// On Mouse Move
gsap.to(card, {
  rotateX: -yPct * 15, // maxRotation
  rotateY: xPct * 15,
  scale: 1.05,
  duration: 0.3,
  ease: "power2.out"
})

// Move radial glow spotlight
gsap.to(glow, {
  x: xCoordinate,
  y: yCoordinate,
  opacity: 1,
  duration: 0.1
})`,
    explode: `// GSAP Click Particle Burst
// Spawn 24 physical dots at click coordinates
gsap.to(particle, {
  x: targetX,
  y: targetY + 120, // gravity drop
  rotation: randomSpin,
  scale: 0,
  opacity: 0,
  duration: randomDuration,
  ease: "power2.out",
  onComplete: () => particle.remove()
})`
  }

  // Format code display with simple coloring helpers
  const renderCode = (code) => {
    return code.split('\n').map((line, idx) => {
      if (line.startsWith('//')) {
        return <div key={idx} className="code-comment">{line}</div>
      }
      
      // Basic keyword replacements
      let content = line
      const keywords = ['const', 'let', 'function', 'return', 'import', 'export', 'default']
      
      // A simple syntax coloring parsing
      return (
        <div key={idx} className="whitespace-pre">
          {line.split(/(\bgsap\b|\bfromTo\b|\bto\b|\bset\b|[{}[\](),:;])/).map((part, pIdx) => {
            if (part === 'gsap') return <span key={pIdx} className="text-purple-400 font-semibold">{part}</span>
            if (['to', 'fromTo', 'set'].includes(part)) return <span key={pIdx} className="text-emerald-400">{part}</span>
            if (['{', '}', '(', ')', '[', ']', ':', ','].includes(part)) return <span key={pIdx} className="text-neutral-500">{part}</span>
            if (part.match(/^\d+(\.\d+)?$/)) return <span key={pIdx} className="text-amber-400">{part}</span>
            if (part.startsWith('"') || part.startsWith("'") || part.includes('mouseX') || part.includes('mouseY')) {
              return <span key={pIdx} className="text-sky-300">{part}</span>
            }
            return <span key={pIdx}>{part}</span>
          })}
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#080710] text-[#a1a0b3] bg-dot-grid relative overflow-x-hidden flex flex-col font-sans">
      
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-10 pb-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
            <span className="font-bold text-lg">02</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white m-0 leading-none">Day 002</h1>
            <p className="text-xs text-neutral-500 mt-1">GSAP Interactive Box Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-xs rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            GSAP & React
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            Interactive Controls
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 z-10 flex-1">
        
        {/* Left Column: Controls & Info (5 columns) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Panel 1: Configuration */}
          <div className="bg-[#12111a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 m-0">
                <Sliders className="w-5 h-5 text-violet-400" />
                Parameters Control
              </h2>
              <button 
                onClick={replayXAnimation}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer flex items-center gap-1 text-sm font-medium shadow-md shadow-violet-600/20"
                title="Replay slide animation"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            </div>

            {/* Sliders and Selects */}
            <div className="flex flex-col gap-4 text-sm">
              {/* Direction selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex justify-between">
                  <span>Entrance Direction</span>
                  <span className="text-violet-400 font-mono lowercase">{direction}</span>
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#1b1926] p-1.5 rounded-xl border border-white/5">
                  <button 
                    onClick={() => { setDirection('left'); replayXAnimation(); }}
                    className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${direction === 'left' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
                  >
                    From Left
                  </button>
                  <button 
                    onClick={() => { setDirection('right'); replayXAnimation(); }}
                    className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${direction === 'right' ? 'bg-violet-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
                  >
                    From Right
                  </button>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Slide Distance</span>
                  <span className="font-mono text-white">{distance}px</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="400" 
                  value={distance} 
                  onChange={(e) => { setDistance(Number(e.target.value)); }}
                  onMouseUp={replayXAnimation}
                  onTouchEnd={replayXAnimation}
                />
              </div>

              {/* Duration Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Duration</span>
                  <span className="font-mono text-white">{duration}s</span>
                </div>
                <input 
                  type="range" 
                  min="0.2" 
                  max="3" 
                  step="0.1"
                  value={duration} 
                  onChange={(e) => { setDuration(Number(e.target.value)); }}
                  onMouseUp={replayXAnimation}
                  onTouchEnd={replayXAnimation}
                />
              </div>

              {/* Delay Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Delay</span>
                  <span className="font-mono text-white">{delay}s</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1.5" 
                  step="0.1"
                  value={delay} 
                  onChange={(e) => { setDelay(Number(e.target.value)); }}
                  onMouseUp={replayXAnimation}
                  onTouchEnd={replayXAnimation}
                />
              </div>

              {/* Ease selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex justify-between">
                  <span>Easing Preset</span>
                  <span className="text-violet-400 font-mono">{ease}</span>
                </label>
                <select 
                  value={ease} 
                  onChange={(e) => { setEase(e.target.value); }}
                  className="bg-[#1b1926] border border-white/5 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="back.out(1.7)">Back Out (Overshoot)</option>
                  <option value="elastic.out(1, 0.55)">Elastic Out (Spring)</option>
                  <option value="bounce.out">Bounce Out (Bouncy)</option>
                  <option value="power4.out">Power4 Out (Strong Ease)</option>
                  <option value="power1.out">Power1 Out (Subtle Ease)</option>
                  <option value="circ.out">Circular Out (Sudden Snap)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Panel 2: Code Viewer */}
          <div className="bg-[#12111a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 m-0">
                <Code className="w-5 h-5 text-emerald-400" />
                Under the Hood
              </h2>
              <div className="flex gap-1.5 bg-[#1b1926] p-1 rounded-lg border border-white/5">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 rounded">GSAP</span>
              </div>
            </div>

            {/* Code Selection Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#1b1926] rounded-xl border border-white/5 text-xs text-center">
              <button 
                onClick={() => setActiveTab('xaxis')}
                className={`py-1.5 px-1 rounded-lg cursor-pointer truncate transition-all ${activeTab === 'xaxis' ? 'bg-neutral-900 text-white font-medium shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                Slide X
              </button>
              <button 
                onClick={() => setActiveTab('magnetic')}
                className={`py-1.5 px-1 rounded-lg cursor-pointer truncate transition-all ${activeTab === 'magnetic' ? 'bg-neutral-900 text-white font-medium shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                Magnetic
              </button>
              <button 
                onClick={() => setActiveTab('tilt')}
                className={`py-1.5 px-1 rounded-lg cursor-pointer truncate transition-all ${activeTab === 'tilt' ? 'bg-neutral-900 text-white font-medium shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                3D Tilt
              </button>
              <button 
                onClick={() => setActiveTab('explode')}
                className={`py-1.5 px-1 rounded-lg cursor-pointer truncate transition-all ${activeTab === 'explode' ? 'bg-neutral-900 text-white font-medium shadow' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                Burst
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="flex-1 min-h-[200px] code-container rounded-2xl p-4 overflow-y-auto text-xs leading-relaxed border border-white/5 font-mono shadow-inner select-all">
              {renderCode(codeSnippets[activeTab])}
            </div>
          </div>
        </section>

        {/* Right Column: Animation Box Grid (7 columns) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#12111a]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Interactive Box Grid
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Interact with each div box below to see GSAP in action. The X-axis reveal can be adjusted in real-time using the parameters sidebar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Slide on X (Customizable) */}
              <div 
                className="bg-[#12111a]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-h-[240px] justify-between cursor-pointer"
                onClick={() => setActiveTab('xaxis')}
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  <span>01. Slide on X Axis</span>
                  <span className="w-2 h-2 rounded-full bg-violet-500 pulse-indicator" />
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <AnimatedonX
                    direction={direction}
                    distance={distance}
                    duration={duration}
                    ease={ease}
                    delay={delay}
                    trigger={trigger}
                  >
                    <div className="w-full max-w-[200px] h-32 bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl shadow-lg shadow-violet-600/20 border border-violet-500/30 flex flex-col items-center justify-center text-white text-center gap-1.5 p-4">
                      <MoveRight className={`w-6 h-6 transition-transform ${direction === 'left' ? '' : 'rotate-180'}`} />
                      <span className="font-bold text-sm">Slide & Stretch</span>
                      <span className="text-[10px] text-violet-200">Replays on setting change</span>
                    </div>
                  </AnimatedonX>
                </div>
                
                <div className="text-[10px] text-neutral-500 text-center">
                  Adjust parameters on the left and click Replay to run.
                </div>
              </div>

              {/* Box 2: Magnetic Box */}
              <div 
                className="bg-[#12111a]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-h-[240px] justify-between cursor-pointer"
                onClick={() => setActiveTab('magnetic')}
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  <span>02. Magnetic Box</span>
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center">
                  <MagneticBox strength={35} textStrength={15}>
                    <MousePointer className="w-6 h-6 text-violet-400 group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-sm text-white">Magnetic pull</span>
                    <span className="text-[10px] text-neutral-400">Hover mouse over box</span>
                  </MagneticBox>
                </div>

                <div className="text-[10px] text-neutral-500 text-center">
                  Subtle mouse attraction with elastic release.
                </div>
              </div>

              {/* Box 3: 3D Orbit Tilt Card */}
              <div 
                className="bg-[#12111a]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-h-[240px] justify-between cursor-pointer"
                onClick={() => setActiveTab('tilt')}
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  <span>03. 3D Tilt Spotlight</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center">
                  <TiltBox maxRotation={15}>
                    <Maximize2 className="w-6 h-6 text-violet-400 group-hover:rotate-45 transition-transform" />
                    <span className="font-bold text-sm">3D Card Tilt</span>
                    <span className="text-[10px] text-neutral-400">Move mouse inside bounds</span>
                  </TiltBox>
                </div>

                <div className="text-[10px] text-neutral-500 text-center">
                  Card tilts in 3D with cursor-tracking spotlight.
                </div>
              </div>

              {/* Box 4: Click to Explode */}
              <div 
                className="bg-[#12111a]/80 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 min-h-[240px] justify-between cursor-pointer"
                onClick={() => setActiveTab('explode')}
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  <span>04. Physics Explode</span>
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center">
                  <ExplodeBox>
                    <Zap className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-white">Click to shatter</span>
                    <span className="text-[10px] text-neutral-400">Click anywhere on box</span>
                  </ExplodeBox>
                </div>

                <div className="text-[10px] text-neutral-500 text-center">
                  Generates glowing physics particles from click origin.
                </div>
              </div>

            </div>
          </div>

          {/* Bonus component: Drag and wobble spring box */}
          <div className="bg-[#12111a]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-white m-0">05. Dynamic Drag & Wobble Box</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Drag the card below. It stretches and skews according to speed, then snap-wobbles back on release.
              </p>
            </div>
            
            <div className="w-full flex justify-center items-center py-4">
              <DragBox>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm text-white">Spring-Back Drag Card</span>
                    <span className="block text-[10px] text-neutral-400">Drag me in any direction</span>
                  </div>
                </div>
              </DragBox>
            </div>
          </div>
        </section>
      </main>

        {/* Footer */}
        <footer className="w-full border-t border-neutral-900 mt-auto py-8 text-xs text-neutral-600">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              © 2026 day-002 GSAP Box Animations. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-neutral-400 transition-colors">Vite + React 19</span>
              <span>•</span>
              <span className="hover:text-neutral-400 transition-colors">Tailwind CSS v4</span>
              <span>•</span>
              <span className="hover:text-neutral-400 transition-colors">Smooth GSAP core</span>
            </div>
          </div>
        </footer>
    </div>
  )
}

export default App
