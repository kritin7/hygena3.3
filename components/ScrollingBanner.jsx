'use client'

import { useEffect, useRef } from 'react'

export function ScrollingBanner({ 
  items = [], 
  speed = 20, 
  backgroundColor = '#1f2937', // gray-900 to match DiscountWidget
  textColor = '#ffffff' 
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
      className="w-full overflow-hidden py-4 my-12"
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
            {/* Orange dot separator matching brand color */}
            <span className="text-2xl" style={{ color: '#D2691E' }}>•</span>
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
