'use client'

import { useEffect, useRef } from 'react'

export function ScrollingBanner({ 
  items = [], 
  speed = 20, 
  backgroundColor = '#D2691E', // Orange brand color
  textColor = '#ffffff' // White text
}) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    // Duplicate items for seamless loop
    const scrollerInner = scroller.querySelector('.scroller-inner')
    const scrollerContent = Array.from(scrollerInner.children)

    // Clone items to create infinite effect
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
      <div className="scroller-inner flex gap-8 animate-scroll">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap px-4"
            style={{ color: textColor }}
          >
            <span className="text-sm md:text-base font-semibold tracking-wide uppercase">
              {item}
            </span>
            {/* White dot separator */}
            <span className="text-2xl text-white">•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll ${speed}s linear infinite;
        }

        .scroller-inner:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
