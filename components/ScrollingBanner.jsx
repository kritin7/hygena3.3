'use client'
import { useEffect, useRef } from 'react'

export function ScrollingBanner({ 
  items = [], 
  speed = 30, // Adjusted default speed
  backgroundColor = '#D2691E', // Orange brand color
  textColor = '#ffffff' // White text
}) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const scrollerInner = scroller.querySelector('.scroller-inner')
    const scrollerContent = Array.from(scrollerInner.children)

    // Clone items multiple times for seamless infinite scroll
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true)
      duplicatedItem.setAttribute('aria-hidden', true)
      scrollerInner.appendChild(duplicatedItem)
    })
  }, [])

  return (
    <div 
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 my-12"
      style={{ backgroundColor }}
      ref={scrollerRef}
    >
      <div className="scroller-inner flex items-center animate-scroll">
        {items.map((item, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <span 
              className="text-sm md:text-base font-semibold tracking-wide uppercase px-6"
              style={{ color: textColor }}
            >
              {item}
            </span>
            {/* Centered dot separator */}
            <span className="text-2xl" style={{ color: textColor }}>•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
          width: max-content;
        }
        
        .scroller-inner:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
