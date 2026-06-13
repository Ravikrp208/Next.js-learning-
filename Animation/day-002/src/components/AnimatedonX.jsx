import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const AnimatedonX = ({ 
  children, 
  direction = 'left', 
  distance = 150, 
  duration = 1.2, 
  ease = 'back.out(1.7)', 
  delay = 0,
  trigger = 0 
}) => {
  const elementRef = useRef(null)

  useGSAP(() => {
    if (!elementRef.current) return

    const startX = direction === 'left' ? -distance : distance
    
    // Kill existing animations on this element
    gsap.killTweensOf(elementRef.current)
    
    // Set initial state
    gsap.set(elementRef.current, { 
      x: startX, 
      opacity: 0, 
      scale: 0.9,
      rotateY: direction === 'left' ? -15 : 15
    })

    // Animate in
    gsap.to(elementRef.current, {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      duration: duration,
      delay: delay,
      ease: ease,
      transformOrigin: direction === 'left' ? 'left center' : 'right center',
      clearProps: 'transform' // Clear inline styles once complete to avoid layout issues
    })
  }, { dependencies: [trigger, direction, distance, duration, ease, delay], scope: elementRef })

  return (
    <div 
      ref={elementRef} 
      className="w-full h-full flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {children}
    </div>
  )
}

export default AnimatedonX