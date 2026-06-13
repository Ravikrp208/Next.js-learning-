import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const ExplodeBox = ({ children }) => {
  const containerRef = useRef(null)
  const colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f43f5e']

  const triggerExplosion = (e) => {
    const container = containerRef.current
    if (!container) return

    // Get click location relative to the container
    const rect = container.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Trigger container scale bounce
    gsap.timeline()
      .to(container, { scale: 0.93, duration: 0.08, ease: 'power2.out' })
      .to(container, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' })

    // Generate 24 particles
    const particleCount = 24
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      
      // Select a random color and size
      const size = gsap.utils.random(6, 14)
      const color = gsap.utils.random(colors)
      const isCircle = gsap.utils.random([true, false])

      // Apply initial styling
      Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '3px',
        left: `${clickX}px`,
        top: `${clickY}px`,
        pointerEvents: 'none',
        zIndex: '20',
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 10px ${color}`
      })

      container.appendChild(particle)

      // Calculate random trajectories
      // Spread angle across 360 degrees
      const angle = gsap.utils.random(0, Math.PI * 2)
      const velocity = gsap.utils.random(80, 160)
      
      const targetX = Math.cos(angle) * velocity
      const targetY = Math.sin(angle) * velocity - gsap.utils.random(30, 70) // upward push bias

      // Animate particle
      gsap.to(particle, {
        x: targetX,
        y: targetY + 120, // gravity drop
        rotation: gsap.utils.random(-360, 360),
        scale: 0,
        opacity: 0,
        duration: gsap.utils.random(0.8, 1.4),
        ease: 'power2.out',
        onComplete: () => {
          // Cleanup
          particle.remove()
        }
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      onClick={triggerExplosion}
      className="relative flex items-center justify-center w-full h-48 bg-radial from-pink-600/10 to-transparent border border-pink-500/20 rounded-2xl cursor-pointer shadow-lg hover:shadow-pink-500/10 hover:border-pink-500/40 transition-all duration-300 select-none overflow-hidden group"
    >
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
        {children}
      </div>

      {/* Ripple wave elements on hover */}
      <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

export default ExplodeBox
