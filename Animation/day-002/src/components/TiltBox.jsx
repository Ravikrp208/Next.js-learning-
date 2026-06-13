import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const TiltBox = ({ children, maxRotation = 15 }) => {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  useGSAP(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    // Ensure 3D rendering setup
    gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' })

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left // Mouse position X within card
      const y = e.clientY - rect.top  // Mouse position Y within card

      // Calculate tilt angles (normalize to -0.5 to 0.5)
      const xPct = (x / rect.width) - 0.5
      const yPct = (y / rect.height) - 0.5

      // Rotate around Y-axis for X-movement, and X-axis for Y-movement
      // Negative yPct to tilt UP when mouse is at the top
      const rotateX = -yPct * maxRotation
      const rotateY = xPct * maxRotation

      // Smoothly tilt card
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      // Move the glowing spotlight
      gsap.to(glow, {
        x: x,
        y: y,
        opacity: 1,
        duration: 0.1,
        overwrite: 'auto'
      })
    }

    const handleMouseLeave = () => {
      // Return to original state smoothly
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto'
      })

      // Fade out the spotlight
      gsap.to(glow, {
        opacity: 0,
        duration: 0.5,
        overwrite: 'auto'
      })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: cardRef })

  return (
    <div 
      ref={cardRef}
      className="relative flex items-center justify-center w-full h-48 bg-neutral-900 border border-white/10 rounded-2xl cursor-pointer shadow-xl overflow-hidden select-none group"
    >
      {/* Glow spotlight element */}
      <div 
        ref={glowRef}
        className="absolute w-64 h-64 bg-radial from-violet-500/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 mix-blend-screen"
        style={{ left: 0, top: 0 }}
      />
      
      {/* Premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-2xl" />

      {/* Content wrapper with depth */}
      <div 
        className="flex flex-col items-center justify-center gap-2 pointer-events-none text-white z-10"
        style={{ transform: 'translateZ(30px)' }}
      >
        {children}
      </div>
    </div>
  )
}

export default TiltBox
