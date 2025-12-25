'use client'
import { useEffect, useRef } from 'react'

export function ScrollingBanner({ 
  items = [], 
  speed = 30,
  backgroundColor = '#D2691E',
  textColor = '#ffffff'
}) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const scrollerInner = scroller.querySelector('.scroller-inner')
    const scrollerContent = Array.from(scrollerInner.children)

    // Clone items twice for extra smooth infinite scroll
    for (let i = 0; i < 2; i++) {
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        duplicatedItem.setAttribute('aria-hidden', true)
        scrollerInner.appendChild(duplicatedItem)
      })
    }
  }, [items])

  return (
    <div 
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 my-12"
      style={{ backgroundColor }}
      ref={scrollerRef}
    >
      <div className="scroller-inner flex items-center gap-8 animate-scroll will-change-transform">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-8 flex-shrink-0">
            <span 
              className="text-sm md:text-base font-semibold tracking-wide uppercase whitespace-nowrap"
              style={{ color: textColor }}
            >
              {item}
            </span>
            <span className="text-xl font-bold" style={{ color: textColor }}>•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / 3));
          }
        }
        
        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
          display: flex;
        }
        
        .scroller-inner:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
