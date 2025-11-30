'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

export default function ImageComparison({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = (event) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))

    setSliderPosition(percent)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  // specific for touch devices
  const handleTouchMove = (event) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1A1A]">
          See the difference in one spray.
        </h2>
        <p className="text-lg text-gray-600">
          From unhygienic to fresh — in seconds. <br/>
          That's the power of Hygena.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER Image (Background - The "Clean" one) */}
        <img 
          src={afterImage} 
          alt="Clean Helmet" 
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" 
        />
        
        {/* Label for After */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10 pointer-events-none">
          Hygienic & Fresh
        </div>

        {/* BEFORE Image (Foreground - The "Dirty" one, clipped) */}
        <div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={beforeImage} 
            alt="Dirty Helmet" 
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none" 
            style={{ width: '100%', height: '100%' }}
          />
           {/* Label for Before */}
           <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-[#D2691E] px-3 py-1 rounded-full text-sm font-bold z-10">
            Unhygienic
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
             <GripVertical className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
