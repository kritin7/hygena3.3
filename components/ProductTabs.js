'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('why-it-works')

  const tabs = [
    { id: 'why-it-works', label: 'WHY IT WORKS' },
    { id: 'whats-inside', label: "WHAT'S INSIDE" },
    { id: 'how-to-use', label: 'HOW TO USE' }
  ]

  const whyItWorksImages = [
    { src: '/images/1_Helmet_Deodorant_Control.webp', alt: 'Odour Control' },
    { src: '/images/2_Helmet_Deodorant_No_Masking.webp', alt: 'No Masking' },
    { src: '/images/3_Helmet_Deodorant_Bacteriostatic.webp', alt: 'Bacteriostatic Tech' },
    { src: '/images/4_Helmet_Deodorant_Daily.webp', alt: 'Daily Use Safe' }
  ]

  const ingredientsImages = [
    { src: '/images/1_Helmet_Deodorant_Neem.webp', alt: 'Neem Extract' },
    { src: '/images/2_Helmet_Deodorant_Aloevera.webp', alt: 'Aloe Vera' },
    { src: '/images/3_Helmet_Deodorant_Tea_Tree.webp', alt: 'Tea Tree Oil' },
    { src: '/images/4_Helmet_Deodorant_Chamomile.webp', alt: 'Chamomile' }
  ]

  const howToUseImages = [
    { src: '/images/Helmet_Deodorant_How_To_Use.webp', alt: 'How to Use' }
  ]

  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Tabs Navigation */}
        <div className="flex justify-center gap-4 md:gap-8 mb-12 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 px-4 text-sm md:text-base font-bold tracking-wide transition-all relative",
                activeTab === tab.id
                  ? "text-[#D2691E] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#D2691E]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Clean, no boxes */}
        <div className="relative">
          {/* Why It Works */}
          {activeTab === 'why-it-works' && (
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-0 min-w-max md:grid md:grid-cols-4 md:gap-0 md:min-w-0">
                {whyItWorksImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-64 md:w-auto">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Inside */}
          {activeTab === 'whats-inside' && (
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-0 min-w-max md:grid md:grid-cols-4 md:gap-0 md:min-w-0">
                {ingredientsImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-64 md:w-auto">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use */}
          {activeTab === 'how-to-use' && (
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <img
                  src={howToUseImages[0].src}
                  alt={howToUseImages[0].alt}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Scroll Indicator for Mobile */}
        <div className="md:hidden text-center mt-4 text-sm text-gray-500">
          ← Scroll to see more →
        </div>
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
}  
