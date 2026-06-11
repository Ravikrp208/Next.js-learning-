"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Trophy,
  Shield,
  Timer,
  Volume2,
  VolumeX,
  Flame,
  RefreshCw,
  Play,
  Zap,
  Terminal as TerminalIcon,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  Code,
  Undo,
  Cpu,
  Layers,
  Heart
} from "lucide-react";

// Default high scores if none are stored in localStorage
const DEFAULT_SCORES = [
  { name: "NEO", score: 25000, level: 8, mode: "sequence" },
  { name: "TRN", score: 18400, level: 6, mode: "sequence" },
  { name: "LEX", score: 15000, level: 5, mode: "reflex" },
  { name: "MOR", score: 12200, level: 4, mode: "sequence" },
  { name: "CYB", score: 9800, level: 3, mode: "reflex" }
];

// Cyberpunk neon palettes
const colors = [
  "#06b6d4", "#ec4899", "#a855f7", "#f59e0b",
  "#10b981", "#6366f1", "#f43f5e", "#84cc16",
  "#14b8a6", "#f97316", "#8b5cf6", "#0ea5e9",
  "#d946ef", "#eab308", "#ef4444", "#3b82f6"
];

const neonColors = [
  "rgba(6, 182, 212, 0.8)",   // 0 Cyan
  "rgba(236, 72, 153, 0.8)",  // 1 Pink
  "rgba(168, 85, 247, 0.8)",  // 2 Purple
  "rgba(245, 158, 11, 0.8)",  // 3 Amber
  "rgba(16, 185, 129, 0.8)",  // 4 Emerald
  "rgba(99, 102, 241, 0.8)",  // 5 Indigo
  "rgba(244, 63, 94, 0.8)",   // 6 Rose
  "rgba(132, 204, 22, 0.8)",  // 7 Lime
  "rgba(20, 184, 166, 0.8)",  // 8 Teal
  "rgba(249, 115, 22, 0.8)",  // 9 Orange
  "rgba(139, 92, 246, 0.8)",  // 10 Violet
  "rgba(14, 165, 233, 0.8)",  // 11 Sky
  "rgba(217, 70, 239, 0.8)",  // 12 Fuchsia
  "rgba(234, 179, 8, 0.8)",   // 13 Yellow
  "rgba(239, 68, 68, 0.8)",   // 14 Red
  "rgba(59, 130, 246, 0.8)"   // 15 Blue
];

const freqs = [
  261.63, 293.66, 329.63, 392.00, 
  440.00, 523.25, 587.33, 659.25, 
  783.99, 880.00, 1046.50, 1174.66, 
  1318.51, 1567.98, 1760.00, 2093.00
];

export default function Home() {
  const containerRef = useRef(null);
  const gridContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const timerTweenRef = useRef(null);
  const logsEndRef = useRef(null);
  const audioCtxRef = useRef(null);

  // States
  const [gameMode, setGameMode] = useState("sequence"); // sequence | reflex
  const [gameState, setGameState] = useState("idle"); // idle | countdown | showing_sequence | playing | level_up | game_over
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [activeTile, setActiveTile] = useState(null);
  const [targetTile, setTargetTile] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [chamberRotation, setChamberRotation] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [countdownVal, setCountdownVal] = useState(3);
  
  const [highScores, setHighScores] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [showHighScoreInput, setShowHighScoreInput] = useState(false);

  const [sequence, setSequence] = useState([]);
  const [userSeqIdx, setUserSeqIdx] = useState(0);
  
  const [gsapCode, setGsapCode] = useState(`// Welcome to the GSAP Arcade!
// GSAP code will generate dynamically here as actions are executed in real time.
// Engage a system module to begin auditing code.`);

  const [logs, setLogs] = useState([
    { id: 1, text: "SYSTEM: Neon Grid Hack V1.0 initialized.", type: "system" },
    { id: 2, text: "SYSTEM: Choose high-score module and click ENGAGE MATRIX to deploy.", type: "system" }
  ]);

  // Load High Scores
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gsap_arcade_scores");
      if (stored) {
        setHighScores(JSON.parse(stored));
      } else {
        localStorage.setItem("gsap_arcade_scores", JSON.stringify(DEFAULT_SCORES));
        setHighScores(DEFAULT_SCORES);
      }
    }
  }, []);

  // Cleanup timers/tweens on unmount
  useEffect(() => {
    return () => {
      if (timerTweenRef.current) timerTweenRef.current.kill();
    };
  }, []);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // GSAP initial load entrance & background float bubble animations
  useGSAP(() => {
    const entranceTl = gsap.timeline();
    
    entranceTl
      .from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })
      .from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      }, "-=0.35")
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
      }, "-=0.35")
      .from(".operations-deck, .grid-matrix, .terminal-deck", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }, "-=0.4");

    // Slow back-drops floating elements
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
  }, { scope: containerRef });

  // Web Audio Synth Controller
  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSynthTone = (freq, duration, type = "sine") => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Synth tone execution skipped:", e);
    }
  };

  const playSuccessSound = () => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSynthTone(freq, 0.1, "sine");
      }, idx * 60);
    });
  };

  const playFailureSound = () => {
    playSynthTone(180, 0.4, "sawtooth");
    setTimeout(() => {
      playSynthTone(120, 0.45, "sawtooth");
    }, 120);
  };

  const playLevelUpSound = () => {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playSynthTone(freq, 0.08, "triangle");
      }, idx * 55);
    });
  };

  const playTickSound = () => {
    playSynthTone(880, 0.04, "sine");
  };

  // Particle Canvas system loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // moderate gravity
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      animId = requestAnimationFrame(update);
    };
    
    update();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  const spawnParticles = (lx, ly, color) => {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x: lx,
        y: ly,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.5,
        radius: Math.random() * 2.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
        color: color
      });
    }
  };

  // Add Log text helper
  const addLog = (text, type = "info") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      ...prev,
      { id: Math.random(), text: `[${timestamp}] ${type.toUpperCase()}: ${text}`, type }
    ].slice(-10));
  };

  // Floating text spawn helper
  const spawnFloatingText = (lx, ly, text, colorClass) => {
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) return;
    
    const el = document.createElement("div");
    el.className = `absolute pointer-events-none text-xs sm:text-sm font-black font-mono tracking-wider ${colorClass} z-30 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,1)]`;
    el.innerText = text;
    el.style.left = `${lx}px`;
    el.style.top = `${ly}px`;
    el.style.transform = "translate(-50%, -50%)";
    
    gridContainer.appendChild(el);
    
    gsap.fromTo(el,
      { y: 0, opacity: 1, scale: 0.8 },
      {
        y: -60,
        opacity: 0,
        scale: 1.4,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => {
          el.remove();
        }
      }
    );
  };

  // Tile flash bounce animation helper
  const animateTilePress = (element, index) => {
    const neonColor = neonColors[index];
    gsap.fromTo(element,
      { 
        scale: 0.9,
        backgroundColor: neonColor,
        boxShadow: `0 0 25px ${neonColor}, inset 0 0 10px rgba(255,255,255,0.5)`
      },
      { 
        scale: 1, 
        backgroundColor: "",
        boxShadow: "",
        duration: 0.3, 
        ease: "power2.out",
        clearProps: "all"
      }
    );
  };

  // Shake Grid animation helper
  const shakeGrid = () => {
    setGsapCode(`// Error: Grid Chamber Shaking
gsap.to('.game-grid', {
  x: 'random(-10, 10)',
  y: 'random(-10, 10)',
  duration: 0.08,
  repeat: 5,
  yoyo: true,
  clearProps: 'x,y'
});`);

    gsap.to(".game-grid", {
      x: "random(-10, 10)",
      y: "random(-10, 10)",
      duration: 0.08,
      repeat: 5,
      yoyo: true,
      clearProps: "x,y"
    });
  };

  // General Countdown mechanism
  const runCountdown = (callback) => {
    setGameState("countdown");
    setCountdownVal(3);
    
    setGsapCode(`// Countdown transition scale
gsap.fromTo('.countdown-number', 
  { scale: 2.5, opacity: 0 }, 
  { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out' }
);`);

    let currentVal = 3;
    const tick = () => {
      if (!isMuted) playTickSound();
      
      gsap.fromTo(".countdown-number", 
        { scale: 2.5, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
      );
      
      if (currentVal > 1) {
        setTimeout(() => {
          currentVal -= 1;
          setCountdownVal(currentVal);
          tick();
        }, 1000);
      } else {
        setTimeout(() => {
          callback();
        }, 1000);
      }
    };
    
    tick();
  };

  // Game Initializer
  const startGame = () => {
    // Enable AudioContext on first interaction
    getAudioContext();
    
    setPlayerName("");
    setShowHighScoreInput(false);
    
    if (gameMode === "sequence") {
      startSequenceMode();
    } else {
      startReflexMode();
    }
  };

  // ==================== SEQUENCE MODE LOGIC ====================
  const startSequenceMode = () => {
    addLog("Initializing Memory Sequence Hack...", "system");
    setScore(0);
    setLevel(1);
    setCombo(1);
    setRotationAngle(0);
    gsap.set(".game-grid", { rotate: 0 });
    
    // Generate initial step
    const firstSeq = [Math.floor(Math.random() * 16)];
    setSequence(firstSeq);
    
    runCountdown(() => {
      playSequence(firstSeq, 1);
    });
  };

  const playSequence = (seqToPlay, currentLvl = level) => {
    setGameState("showing_sequence");
    addLog(`System displaying sequence of length ${seqToPlay.length}.`, "system");
    
    // Calculate speed based on current level
    const duration = Math.max(0.2, 0.45 - (currentLvl * 0.02));
    const delay = Math.max(0.08, 0.2 - (currentLvl * 0.01));
    
    setGsapCode(`// GSAP Timeline playback sequence
const tl = gsap.timeline({ onComplete: enableUserGrid });
${seqToPlay.map((tIdx, idx) => `tl.to('.tile-${tIdx}', { 
  scale: 0.93, 
  backgroundColor: '${colors[tIdx]}', 
  boxShadow: '0 0 25px ${colors[tIdx]}', 
  duration: ${duration} 
}).to('.tile-${tIdx}', { 
  scale: 1, 
  backgroundColor: '', 
  boxShadow: '', 
  duration: 0.12 
}, '+=${delay}')`).join("\n")}`);

    const tl = gsap.timeline({
      onComplete: () => {
        setGameState("playing");
        setUserSeqIdx(0);
        addLog("System ready. Mirror the verification sequence.", "system");
      }
    });

    seqToPlay.forEach((tIdx) => {
      const selector = `.tile-${tIdx}`;
      const neonColor = neonColors[tIdx];
      const freq = freqs[tIdx];
      
      tl.to(selector, {
        scale: 0.93,
        backgroundColor: neonColor,
        boxShadow: `0 0 25px ${neonColor}, inset 0 0 10px rgba(255,255,255,0.4)`,
        duration: duration,
        ease: "power2.out",
        onStart: () => {
          setActiveTile(tIdx);
          if (!isMuted) playSynthTone(freq, duration - 0.04, "sine");
        }
      })
      .to(selector, {
        scale: 1,
        backgroundColor: "",
        boxShadow: "",
        duration: 0.12,
        ease: "power2.in",
        onStart: () => {
          setActiveTile(null);
        }
      }, `+=${delay}`);
    });
  };

  const checkSequenceInput = (clickedIdx) => {
    const expectedIdx = sequence[userSeqIdx];
    
    if (clickedIdx === expectedIdx) {
      const nextIdx = userSeqIdx + 1;
      setUserSeqIdx(nextIdx);
      
      // Points allocation
      const pointsGained = 100 * level * combo;
      setScore(prev => {
        const newScore = prev + pointsGained;
        gsap.fromTo(".score-value", 
          { scale: 1.25, color: "#22c55e" }, 
          { scale: 1, color: "#ffffff", duration: 0.3 }
        );
        return newScore;
      });
      
      setCombo(prev => Math.min(10, prev + 1));
      addLog(`Node ${clickedIdx} matched correctly! (${nextIdx}/${sequence.length})`, "user");
      
      if (nextIdx === sequence.length) {
        handleSequenceLevelUp();
      }
    } else {
      handleGameOver();
    }
  };

  const handleSequenceLevelUp = () => {
    setGameState("level_up");
    if (!isMuted) playLevelUpSound();
    addLog(`Level ${level} complete! System matrix synchronized.`, "system");
    
    setGsapCode(`// Level Up Flash
gsap.fromTo('.level-clear-title', 
  { scale: 0.8, opacity: 0 }, 
  { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out' }
);`);

    const nextLvl = level + 1;
    const shouldRotate = chamberRotation && (level % 2 === 1);
    let nextAngle = rotationAngle;
    
    if (shouldRotate) {
      nextAngle = rotationAngle + 90;
      setRotationAngle(nextAngle);
      addLog(`WARNING: Grid chamber rotation module engaged! Rotating +90°`, "warning");
      
      gsap.to(".game-grid", {
        rotate: nextAngle,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.3
      });
      
      setGsapCode(`// Chamber Rotation Triggered
gsap.to('.game-grid', { 
  rotate: ${nextAngle}, 
  duration: 0.8, 
  ease: 'back.out(1.4)' 
});`);
    }
    
    setTimeout(() => {
      setLevel(nextLvl);
      const nextSeq = [...sequence, Math.floor(Math.random() * 16)];
      setSequence(nextSeq);
      
      runCountdown(() => {
        playSequence(nextSeq, nextLvl);
      });
    }, 1800);
  };


  // ==================== REFLEX MODE LOGIC ====================
  const startReflexMode = () => {
    addLog("Initializing Reflex Strike Matrix...", "system");
    setScore(0);
    setLevel(1);
    setCombo(1);
    setLives(3);
    setRotationAngle(0);
    gsap.set(".game-grid", { rotate: 0 });
    
    runCountdown(() => {
      spawnReflexTarget(true, 1);
    });
  };

  const spawnReflexTarget = (isFirst = false, currentLvl = level) => {
    setGameState("playing");
    
    let nextTarget = Math.floor(Math.random() * 16);
    while (nextTarget === targetTile) {
      nextTarget = Math.floor(Math.random() * 16);
    }
    
    setTargetTile(nextTarget);
    setActiveTile(nextTarget);
    
    // speedLimit starting at 1800ms down to 400ms
    const speedLimit = Math.max(400, 1800 - (currentLvl * 100));
    
    if (timerTweenRef.current) timerTweenRef.current.kill();
    
    gsap.set(".timer-bar", { width: "100%", backgroundColor: "#06b6d4" });
    
    setGsapCode(`// Reflex mode Timer bar count-down using GSAP
gsap.fromTo('.timer-bar', 
  { width: '100%', backgroundColor: '#06b6d4' }, 
  { 
    width: '0%', 
    backgroundColor: '#ef4444', 
    duration: ${speedLimit / 1000}, 
    ease: 'none', 
    onComplete: handleReflexTimeOut 
  }
);`);

    timerTweenRef.current = gsap.fromTo(".timer-bar", 
      { width: "100%", backgroundColor: "#06b6d4" }, 
      { 
        width: "0%", 
        backgroundColor: "#ef4444", 
        duration: speedLimit / 1000, 
        ease: "none", 
        onComplete: () => {
          handleReflexTimeOut();
        }
      }
    );
  };

  const handleReflexClick = (clickedIdx) => {
    if (clickedIdx === targetTile) {
      if (timerTweenRef.current) timerTweenRef.current.kill();
      
      const pointsGained = 150 * combo;
      const nextScore = score + pointsGained;
      
      setScore(nextScore);
      gsap.fromTo(".score-value", 
        { scale: 1.25, color: "#22c55e" }, 
        { scale: 1, color: "#ffffff", duration: 0.3 }
      );
      
      setCombo(prev => Math.min(10, prev + 1));
      addLog(`Target node ${clickedIdx} intercepted successfully.`, "user");
      
      // Calculate Reflex Level Up (each 1000 points increments levels)
      const nextLvlThreshold = level * 1000;
      if (nextScore >= nextLvlThreshold) {
        const nextLvl = level + 1;
        setLevel(nextLvl);
        if (!isMuted) playLevelUpSound();
        addLog(`System throttle speed increased! Level ${nextLvl} active.`, "system");
        
        if (chamberRotation) {
          const nextAngle = rotationAngle + 90;
          setRotationAngle(nextAngle);
          gsap.to(".game-grid", {
            rotate: nextAngle,
            duration: 0.8,
            ease: "back.out(1.4)"
          });
          
          setGsapCode(`// Chamber Rotation triggered on Level Up
gsap.to('.game-grid', { 
  rotate: ${nextAngle}, 
  duration: 0.8, 
  ease: 'back.out(1.4)' 
});`);
        }
        
        // Short pause before spawning next target to acknowledge level clear
        setGameState("level_up");
        setTimeout(() => {
          spawnReflexTarget(false, nextLvl);
        }, 1000);
        return;
      }
      
      spawnReflexTarget();
    } else {
      if (timerTweenRef.current) timerTweenRef.current.kill();
      handleReflexMiss();
    }
  };

  const handleReflexMiss = () => {
    shakeGrid();
    if (!isMuted) playFailureSound();
    
    setLives(prev => {
      const nextLives = prev - 1;
      addLog(`Missed Target! Shield compromised. Lives: ${nextLives}`, "warning");
      
      if (nextLives <= 0) {
        handleGameOver();
        return 0;
      } else {
        setCombo(1);
        spawnReflexTarget();
        return nextLives;
      }
    });
  };

  const handleReflexTimeOut = () => {
    shakeGrid();
    if (!isMuted) playFailureSound();
    
    setLives(prev => {
      const nextLives = prev - 1;
      addLog(`TIME OUT! Lost network socket. Lives: ${nextLives}`, "warning");
      
      if (nextLives <= 0) {
        handleGameOver();
        return 0;
      } else {
        setCombo(1);
        spawnReflexTarget();
        return nextLives;
      }
    });
  };


  // ==================== COMMON GAME OVER ====================
  const handleGameOver = () => {
    setGameState("game_over");
    setActiveTile(null);
    setTargetTile(null);
    if (timerTweenRef.current) timerTweenRef.current.kill();
    if (!isMuted) playFailureSound();
    
    addLog(`HACK TERMINATED. Score: ${score}, Level: ${level}`, "error");
    
    setGsapCode(`// Game Over Screen visual load
gsap.fromTo('.game-over-panel', 
  { y: 80, opacity: 0, scale: 0.95 }, 
  { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' }
);`);

    const minHighScore = highScores.length < 5 ? 0 : highScores[highScores.length - 1].score;
    if (score > minHighScore) {
      setShowHighScoreInput(true);
      addLog("Local database high score qualified! Register credentials.", "system");
    }
  };

  const handleSaveScore = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    const name = playerName.trim().toUpperCase().substring(0, 3);
    const newScore = {
      name,
      score,
      level,
      mode: gameMode,
      date: new Date().toLocaleDateString()
    };
    
    const updated = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
      
    setHighScores(updated);
    localStorage.setItem("gsap_arcade_scores", JSON.stringify(updated));
    setShowHighScoreInput(false);
    addLog(`Credentials accepted. ${name} registered in matrix.`, "system");
  };

  const handleAbortGame = () => {
    if (timerTweenRef.current) timerTweenRef.current.kill();
    setGameState("idle");
    setActiveTile(null);
    setTargetTile(null);
    setScore(0);
    setLevel(1);
    setCombo(1);
    setRotationAngle(0);
    gsap.set(".game-grid", { rotate: 0 });
    addLog("Matrix operation aborted by user.", "system");
  };

  const handleTileClick = (e, idx) => {
    if (gameState === "showing_sequence" || gameState === "level_up" || gameState === "countdown") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) return;
    const gridRect = gridContainer.getBoundingClientRect();
    
    const clickX = rect.left - gridRect.left + rect.width / 2;
    const clickY = rect.top - gridRect.top + rect.height / 2;
    
    const particleColor = colors[idx];
    
    // Play synthesizer tone matching index
    playSynthTone(freqs[idx], 0.25, "triangle");
    
    // Draw canvas explosions
    spawnParticles(clickX, clickY, particleColor);
    
    // Spring scaling tween on tile
    animateTilePress(e.currentTarget, idx);
    
    if (gameState === "idle") {
      spawnFloatingText(clickX, clickY, `🎵 ${Math.round(freqs[idx])}Hz`, "text-cyan-400 font-mono text-xs");
      addLog(`Synthesized Tone frequency: ${freqs[idx]} Hz.`, "synth");
      return;
    }
    
    if (gameState === "playing") {
      if (gameMode === "sequence") {
        spawnFloatingText(clickX, clickY, `+${100 * level * combo}`, "text-pink-500 font-extrabold");
        checkSequenceInput(idx);
      } else if (gameMode === "reflex") {
        spawnFloatingText(clickX, clickY, `+${150 * combo}`, "text-cyan-400 font-extrabold");
        handleReflexClick(idx);
      }
    }
  };

  // Sandbox widget tween tester
  const handleSandboxTween = (action) => {
    gsap.killTweensOf(".sandbox-box");
    gsap.set(".sandbox-box", { clearProps: "all" });
    
    switch (action) {
      case "spin":
        setGsapCode(`gsap.to('.sandbox-box', { rotate: '+=360', duration: 0.8, ease: 'power2.out' })`);
        gsap.to(".sandbox-box", { rotate: "+=360", duration: 0.8, ease: "power2.out" });
        break;
      case "bounce":
        setGsapCode(`gsap.to('.sandbox-box', { y: -50, yoyo: true, repeat: 1, duration: 0.4, ease: 'power1.out' })`);
        gsap.to(".sandbox-box", { y: -50, yoyo: true, repeat: 1, duration: 0.4, ease: "power1.out" });
        break;
      case "pulse":
        setGsapCode(`gsap.to('.sandbox-box', { scale: 1.3, yoyo: true, repeat: 1, duration: 0.3 })`);
        gsap.to(".sandbox-box", { scale: 1.3, yoyo: true, repeat: 1, duration: 0.3, ease: "power1.inOut" });
        break;
      case "glow":
        setGsapCode(`gsap.to('.sandbox-box', { filter: 'hue-rotate(180deg) brightness(1.2)', duration: 0.8 })`);
        gsap.to(".sandbox-box", { 
          filter: "hue-rotate(180deg) brightness(1.2)", 
          duration: 0.8, 
          yoyo: true, 
          repeat: 1 
        });
        break;
      default:
        break;
    }
  };

  const getTileStyles = (index, isActive) => {
    const activeColor = neonColors[index];
    if (isActive) {
      return {
        style: {
          backgroundColor: activeColor,
          boxShadow: `0 0 30px ${activeColor}, inset 0 0 12px rgba(255,255,255,0.6)`
        },
        className: `scale-95 border-white text-white z-10`
      };
    }
    
    return {
      style: {},
      className: `border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-500 hover:text-slate-200`
    };
  };

  const renderTiles = () => {
    const tiles = [];
    for (let i = 0; i < 16; i++) {
      const isTarget = gameMode === "reflex" && gameState === "playing" && i === targetTile;
      const isActive = activeTile === i || isTarget;
      const { className, style } = getTileStyles(i, isActive);
      
      const targetBorderClass = isTarget ? "border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" : "";
      
      tiles.push(
        <button
          key={i}
          id={`tile-button-${i}`}
          onClick={(e) => handleTileClick(e, i)}
          style={style}
          className={`relative flex flex-col items-center justify-center aspect-square border rounded-xl font-mono text-[10px] md:text-xs select-none transition-all duration-200 cursor-pointer overflow-hidden ${className} ${targetBorderClass} tile-${i} group`}
          title={`Grid index ${i}`}
          disabled={gameState === "showing_sequence" || gameState === "countdown"}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="absolute top-1.5 left-1.5 w-1 h-1 border-t border-l border-slate-700/80 group-hover:border-cyan-500/40 pointer-events-none transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-1 h-1 border-t border-r border-slate-700/80 group-hover:border-cyan-500/40 pointer-events-none transition-colors" />
          <div className="absolute bottom-1.5 left-1.5 w-1 h-1 border-b border-l border-slate-700/80 group-hover:border-cyan-500/40 pointer-events-none transition-colors" />
          <div className="absolute bottom-1.5 right-1.5 w-1 h-1 border-b border-r border-slate-700/80 group-hover:border-cyan-500/40 pointer-events-none transition-colors" />
          
          <span className="font-semibold transition-colors duration-200">{`0x${i.toString(16).toUpperCase()}`}</span>
        </button>
      );
    }
    return tiles;
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden relative scanlines"
    >
      <div className="scanline-beam" />

      {/* Background neon blurs */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[110px] bg-bubble-1 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[130px] bg-bubble-2 pointer-events-none" />
      <div className="absolute top-[35%] right-[25%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] bg-bubble-3 pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-10 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-violet-500/30">
            N
          </div>
          <span className="font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
            NEON.ARCADE
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
              ONLINE
            </span>
          </span>
        </div>
        
        <div className="creator-tag px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-900/80 border border-slate-800 text-slate-400">
          Created by <span className="text-violet-400 font-bold">Ravi Kumar Pandit</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-10 pb-6 text-center z-10 flex flex-col items-center">
        <div className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next.js + GSAP Series: Day 001</span>
        </div>

        <h1 className="hero-title text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4 max-w-3xl leading-tight">
          Neon Hack: Synced Game Arena
        </h1>

        <p className="hero-desc text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed mb-1">
          A high-fidelity reflex and memorization grid built with GreenSock. Click tiles in Idle mode to synthetically generate tones, or engage the matrix in live challenge modules.
        </p>
      </section>

      {/* Game columns grid */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Stats & Operations (3 Cols) */}
        <div className="operations-deck lg:col-span-3 flex flex-col gap-6 w-full">
          
          {/* Module Selector */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <h2 className="font-extrabold text-sm text-slate-300 tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              SYSTEM MODULES
            </h2>
            
            <div className="flex flex-col gap-2">
              <button
                id="module-sequence-btn"
                onClick={() => {
                  if (gameState === "idle") setGameMode("sequence");
                }}
                disabled={gameState !== "idle"}
                className={`w-full px-4 py-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                  gameMode === "sequence"
                    ? "bg-violet-600/15 border-violet-500 text-violet-300 shadow-md shadow-violet-500/10"
                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                } ${gameState !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div>
                  <div className="font-bold">Sequence Recall</div>
                  <div className="text-[10px] opacity-70 mt-0.5">Test cryptographic recall capacity</div>
                </div>
                <Layers className="w-4 h-4 shrink-0" />
              </button>
              
              <button
                id="module-reflex-btn"
                onClick={() => {
                  if (gameState === "idle") setGameMode("reflex");
                }}
                disabled={gameState !== "idle"}
                className={`w-full px-4 py-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                  gameMode === "reflex"
                    ? "bg-cyan-600/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10"
                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                } ${gameState !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div>
                  <div className="font-bold">Reflex Strike</div>
                  <div className="text-[10px] opacity-70 mt-0.5">Test execution velocity matrix</div>
                </div>
                <Zap className="w-4 h-4 shrink-0" />
              </button>
            </div>
            
            {/* Setting: Chamber Rotation */}
            <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                Chamber Rotation
              </span>
              <button
                id="toggle-rotation-btn"
                onClick={() => setChamberRotation(prev => !prev)}
                className={`px-2 py-1 rounded border font-bold text-[10px] transition-colors cursor-pointer ${
                  chamberRotation
                    ? "bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400"
                    : "bg-slate-950/60 border-slate-800 text-slate-500"
                }`}
              >
                {chamberRotation ? "ACTIVE" : "OFF"}
              </button>
            </div>
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-violet-400" />}
                Audio Synths
              </span>
              <button
                id="toggle-sound-btn"
                onClick={() => setIsMuted(prev => !prev)}
                className={`px-2 py-1 rounded border font-bold text-[10px] transition-colors cursor-pointer ${
                  !isMuted
                    ? "bg-violet-500/10 border-violet-500/40 text-violet-400"
                    : "bg-slate-950/60 border-slate-800 text-slate-500"
                }`}
              >
                {!isMuted ? "MUTED: NO" : "MUTED: YES"}
              </button>
            </div>
          </div>
          
          {/* High Score Deck */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <h2 className="font-extrabold text-sm text-slate-300 tracking-wider font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              HIGH SCORES
            </h2>
            
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {highScores.map((hScore, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-black ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-slate-500"}`}>
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-200">{hScore.name}</span>
                    <span className={`text-[9px] px-1 rounded ${hScore.mode === "sequence" ? "bg-violet-500/10 text-violet-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                      {hScore.mode.substring(0, 3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">L{hScore.level}</span>
                    <span className="font-bold text-emerald-400">{hScore.score.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: The Game Matrix Grid (5 Cols) */}
        <div className="grid-matrix lg:col-span-5 flex flex-col gap-4 w-full">
          
          {/* Game Score panel */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-md text-center font-mono">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">SCORE</span>
              <span className="score-value text-base font-black text-white mt-1">{score}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">LEVEL</span>
              <span className="text-base font-black text-violet-400 mt-1">{level}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">COMBO</span>
              <span className="text-base font-black text-pink-500 mt-1 flex items-center justify-center gap-0.5">
                <Flame className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                x{combo}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                {gameMode === "sequence" ? "STEPS" : "SHIELDS"}
              </span>
              <span className="text-base font-black mt-1 flex items-center justify-center gap-0.5 text-slate-200">
                {gameMode === "sequence" ? (
                  `${userSeqIdx}/${sequence.length}`
                ) : (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < lives ? "text-rose-500 fill-rose-500" : "text-slate-800"}`} 
                    />
                  ))
                )}
              </span>
            </div>
          </div>

          {/* Interactive Timer bar */}
          {gameMode === "reflex" && gameState === "playing" && (
            <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden relative shadow-inner">
              <div className="timer-bar h-full w-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
            </div>
          )}

          {/* Main Grid Chamber */}
          <div 
            ref={gridContainerRef}
            className="w-full aspect-square relative rounded-2xl border border-slate-800 bg-slate-950 p-6 flex items-center justify-center overflow-hidden shadow-2xl"
          >
            {/* Particle Canvas layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

            {/* Matrix Cells Grid */}
            <div className="game-grid grid grid-cols-4 gap-3.5 w-full h-full relative z-10">
              {renderTiles()}
            </div>

            {/* OVERLAYS */}
            
            {/* 1. Idle system module cover */}
            {gameState === "idle" && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-6 border border-white/10">
                  <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                </div>
                
                <h3 className="font-extrabold tracking-tight text-xl mb-2 bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent">
                  DEPLOY MATRIX CHALLENGE
                </h3>
                
                <p className="text-xs text-slate-400 max-w-[280px] mb-8 leading-relaxed font-mono">
                  {gameMode === "sequence" 
                    ? "Cryptographic Sequence: Mimic flashing nodes in consecutive sequence steps."
                    : "Reflex Strike Matrix: Rapidly locate and detonate neon green targets within velocity windows."
                  }
                </p>
                
                <button
                  id="engage-matrix-btn"
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-xs tracking-widest font-mono shadow-lg shadow-violet-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  ENGAGE MATRIX
                </button>
              </div>
            )}

            {/* 2. Countdown sequence */}
            {gameState === "countdown" && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex items-center justify-center">
                <div className="countdown-number text-7xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  {countdownVal}
                </div>
              </div>
            )}

            {/* 3. Level Clear synchronizer */}
            {gameState === "level_up" && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6">
                <div className="level-clear-title w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-black font-mono text-emerald-400 tracking-wider">
                  DECRYPTION SYNCHRONIZED
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  LOADING NEXT NODE IN CONDUIT...
                </p>
              </div>
            )}

            {/* 4. Game Over deck */}
            {gameState === "game_over" && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-black font-mono text-rose-500 tracking-wider uppercase">
                  DECRYPTION FAILED
                </h3>
                
                <p className="text-xs text-slate-400 mt-1 font-mono max-w-[280px]">
                  Neural sync terminated due to index deviation.
                </p>
                
                <div className="grid grid-cols-2 gap-6 my-6 border-y border-slate-900 py-4 w-full max-w-[240px] font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">FINAL SCORE</div>
                    <div className="text-lg font-bold text-white mt-1">{score}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">MAX LEVEL</div>
                    <div className="text-lg font-bold text-violet-400 mt-1">{level}</div>
                  </div>
                </div>

                {showHighScoreInput ? (
                  <form onSubmit={handleSaveScore} className="w-full max-w-[260px] flex flex-col gap-2 font-mono text-xs">
                    <span className="text-yellow-400 text-[10px] font-bold animate-pulse uppercase tracking-wider">
                      ★ Qualified High Score! ★
                    </span>
                    <div className="flex gap-2">
                      <input
                        id="player-initials-input"
                        type="text"
                        placeholder="ENTER INITIALS (3)"
                        maxLength={3}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold text-center placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                        required
                      />
                      <button
                        id="submit-score-btn"
                        type="submit"
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold cursor-pointer"
                      >
                        SAVE
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-3">
                    <button
                      id="retry-game-btn"
                      onClick={startGame}
                      className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold font-mono text-xs tracking-wider cursor-pointer"
                    >
                      TRY AGAIN
                    </button>
                    <button
                      id="exit-game-btn"
                      onClick={() => setGameState("idle")}
                      className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold font-mono text-xs tracking-wider cursor-pointer"
                    >
                      EXIT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Abort button display */}
          {gameState !== "idle" && (
            <button
              id="abort-hack-btn"
              onClick={handleAbortGame}
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-950/40 hover:text-rose-400 transition-colors font-mono text-[10px] font-bold text-slate-400 tracking-widest cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Undo className="w-3.5 h-3.5" />
              ABORT GAME MODULE
            </button>
          )}

        </div>

        {/* Right Column: Kernel terminal logs & Code Viewer (4 Cols) */}
        <div className="terminal-deck lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Active GSAP Code display */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl shadow-xl flex flex-col gap-3">
            <h2 className="font-extrabold text-sm text-slate-300 tracking-wider font-mono flex items-center gap-2">
              <Code className="w-4 h-4 text-violet-400" />
              LIVE GSAP EXECUTOR
            </h2>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900/80 font-mono text-[10px] text-cyan-400/90 min-h-[140px] max-h-[180px] overflow-y-auto leading-relaxed scrollbar">
              <span className="whitespace-pre-wrap select-all">{gsapCode}</span>
            </div>
          </div>

          {/* Sys logger output console */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl shadow-xl flex flex-col gap-3">
            <h2 className="font-extrabold text-sm text-slate-300 tracking-wider font-mono flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              KERNEL LOGS
            </h2>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900/80 font-mono text-[9px] min-h-[140px] max-h-[180px] overflow-y-auto flex flex-col gap-1.5 scrollbar">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={
                    log.type === "system" 
                      ? "text-slate-500" 
                      : log.type === "warning" 
                      ? "text-yellow-500" 
                      : log.type === "error" 
                      ? "text-rose-500" 
                      : log.type === "user"
                      ? "text-emerald-400"
                      : "text-violet-400"
                  }
                >
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Standalone Tween sandbox block (Original Day 001 compatibility) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-slate-300 tracking-wider font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                SANDBOX TWEENS
              </h2>
              <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded">
                LAB COMPAT
              </span>
            </div>

            {/* Sandbox element preview */}
            <div className="w-full h-24 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-center relative p-3">
              <div className="sandbox-box w-12 h-12 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/10 relative z-10 cursor-pointer">
                <Sparkles className="w-5 h-5 text-white/90" />
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
              <button 
                id="sandbox-spin-btn"
                onClick={() => handleSandboxTween("spin")}
                className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer font-semibold transition-colors"
              >
                SPIN
              </button>
              <button 
                id="sandbox-bounce-btn"
                onClick={() => handleSandboxTween("bounce")}
                className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer font-semibold transition-colors"
              >
                BOUNCE
              </button>
              <button 
                id="sandbox-pulse-btn"
                onClick={() => handleSandboxTween("pulse")}
                className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer font-semibold transition-colors"
              >
                PULSE
              </button>
              <button 
                id="sandbox-glow-btn"
                onClick={() => handleSandboxTween("glow")}
                className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer font-semibold transition-colors"
              >
                GLOW
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Footer credits block */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 mt-auto border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-mono z-10 bg-slate-950/20 backdrop-blur-sm">
        <div>
          &copy; {new Date().getFullYear()} GSAP NEON ARCADE. All rights reserved.
        </div>
        <div className="flex gap-4 items-center">
          <span>DAY 001 HACK MATRIX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span>STAGGER RIPPLE ENGINE ACTIVE</span>
        </div>
      </footer>
    </main>
  );
}