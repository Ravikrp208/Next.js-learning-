import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const DragBox = ({ children }) => {
  const boxRef = useRef(null)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  useGSAP(() => {
    const box = boxRef.current
    if (!box) return

    const handleMouseDown = (e) => {
      isDragging.current = true
      startPos.current = {
        x: e.clientX - currentPos.current.x,
        y: e.clientY - currentPos.current.y
      }
      
      // Scale down slightly to look "picked up"
      gsap.to(box, {
        scale: 0.95,
        shadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
        duration: 0.2,
        overwrite: 'auto'
      })
      
      box.style.cursor = 'grabbing'
      
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      // Implement rubber-banding (resistance increases with distance)
      const resistance = 0.6
      const posX = deltaX * resistance
      const posY = deltaY * resistance

      // Calculate velocity for dynamic skewing
      const vx = posX - currentPos.current.x
      const skew = gsap.utils.clamp(-20, 20, vx * 0.8)

      currentPos.current = { x: posX, y: posY }

      gsap.to(box, {
        x: posX,
        y: posY,
        skewX: skew,
        duration: 0.1,
        ease: 'power1.out',
        overwrite: 'auto'
      })
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      
      box.style.cursor = 'grab'

      // Reset coordinates tracker
      currentPos.current = { x: 0, y: 0 }

      // Snap back with a wobbly elastic rebound
      gsap.to(box, {
        x: 0,
        y: 0,
        skewX: 0,
        scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      })

      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    box.addEventListener('mousedown', handleMouseDown)

    return () => {
      box.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, { scope: boxRef })

  return (
    <div 
      ref={boxRef}
      className="relative flex items-center justify-center w-full h-48 bg-radial from-emerald-600/10 to-transparent border border-emerald-500/20 rounded-2xl cursor-grab shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/40 select-none overflow-hidden group"
    >
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
        {children}
      </div>

      {/* Grid lines inside dragging box */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-2xl" />
    </div>
  )
}

export default DragBox
