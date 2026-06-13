import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const MagneticBox = ({ children, strength = 40, textStrength = 20 }) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useGSAP(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      // Calculate cursor position relative to the center of the card
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Animate card towards the mouse
      gsap.to(container, {
        x: mouseX * (strength / 100),
        y: mouseY * (strength / 100),
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      })

      // Animate text/inner element with a slightly different speed (parallax)
      if (text) {
        gsap.to(text, {
          x: mouseX * (textStrength / 100),
          y: mouseY * (textStrength / 100),
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto'
        })
      }
    }

    const handleMouseLeave = () => {
      // Snap back with a bouncy elastic effect
      gsap.to(container, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto'
      })

      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto'
        })
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, { scope: containerRef })

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-48 bg-radial from-violet-600/10 to-transparent border border-violet-500/20 rounded-2xl cursor-pointer shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/40 transition-all duration-300 select-none overflow-hidden group"
    >
      <div 
        ref={textRef} 
        className="flex flex-col items-center justify-center gap-2 pointer-events-none"
      >
        {children}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-violet-400/30 group-hover:border-violet-400 transition-colors"></div>
      <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-violet-400/30 group-hover:border-violet-400 transition-colors"></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-violet-400/30 group-hover:border-violet-400 transition-colors"></div>
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-violet-400/30 group-hover:border-violet-400 transition-colors"></div>
    </div>
  )
}

export default MagneticBox
