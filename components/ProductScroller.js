'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductScroller() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const features = [
    {
      title: "Stops odour at the source",
      description: "Pauses odour-causing bacteria inside helmet padding instead of covering smell with perfume"
    },
    {
      title: "Works within minutes",
      description: "Quick-dry formula that freshens your helmet before your next ride"
    },
    {
      title: "Safe for daily use",
      description: "Gentle on scalp contact areas and helmet liners—no irritation, no damage"
    },
    {
      title: "Freshness between washes",
      description: "Keeps your helmet hygienic even when frequent washing isn't practical"
    },
    {
      title: "No heavy fragrance",
      description: "Clean, neutral freshness without that overpowering deodorant smell"
    }
  ]

  return (
    <div className="mt-6 relative">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center md:text-left">
          REAL HELMET HYGIENE. NO MASKING. NO PERFUME.
        </h3>
        <h4 className="text-lg md:text-xl font-bold text-[#D2691E] text-center md:text-left">
          JUST ODOUR CONTROL.
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT: Static Image */}
        <div className="md:col-span-4 hidden md:block">
          <div className="sticky top-4">
            <img
              src="/images/1.webp"
              alt="Hygena Helmet Deodorant"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* RIGHT: Scrollable Content */}
        <div className="md:col-span-8 relative group">
          {/* Scroll Buttons - Desktop Only */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4"
          >
            <div className="flex gap-4 min-w-max">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="w-72 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow flex-shrink-0"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#D2691E] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <h5 className="font-bold text-gray-900 text-base leading-tight">
                      {feature.title}
                    </h5>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator - Mobile */}
          <div className="md:hidden text-center mt-2 text-xs text-gray-500">
            ← Swipe to explore →
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-8 text-center">
        <p className="text-base text-gray-900 font-medium">
          Ride without second thoughts. Make helmet hygiene part of your daily routine.
        </p>
        <p className="text-lg font-bold text-[#D2691E] mt-2">
          Choose Hygena.
        </p>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}ProductScroller
