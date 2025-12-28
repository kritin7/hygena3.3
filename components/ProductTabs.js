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
        {/* Header Text */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            REAL HELMET HYGIENE. NO MASKING. NO PERFUME.<br />
            JUST ODOUR CONTROL.
          </h2>
          
          <ul className="text-left space-y-4 text-gray-700 leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-[#D2691E] font-bold text-xl">•</span>
              <span><strong>Stops odour at the source:</strong> pauses odour-causing bacteria inside helmet padding instead of covering smell with perfume</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D2691E] font-bold text-xl">•</span>
              <span><strong>Works within minutes:</strong> quick-dry formula that freshens your helmet before your next ride</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D2691E] font-bold text-xl">•</span>
              <span><strong>Safe for daily use:</strong> gentle on scalp contact areas and helmet liners—no irritation, no damage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D2691E] font-bold text-xl">•</span>
              <span><strong>Freshness between washes:</strong> keeps your helmet hygienic even when frequent washing isn't practical</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D2691E] font-bold text-xl">•</span>
              <span><strong>No heavy fragrance:</strong> clean, neutral freshness without that overpowering deodorant smell</span>
            </li>
          </ul>

          <p className="mt-8 text-lg text-gray-900 font-medium">
            Ride without second thoughts. Make helmet hygiene part of your daily routine.<br />
            <span className="text-[#D2691E] font-bold">Choose Hygena.</span>
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center gap-4 md:gap-8 mb-8 border-b border-gray-200">
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

        {/* Tab Content - Horizontal Scroll */}
        <div className="relative">
          {/* Why It Works */}
          {activeTab === 'why-it-works' && (
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max md:grid md:grid-cols-4 md:gap-6 md:min-w-0">
                {whyItWorksImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-64 md:w-auto bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 md:h-72 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Inside */}
          {activeTab === 'whats-inside' && (
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max md:grid md:grid-cols-4 md:gap-6 md:min-w-0">
                {ingredientsImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-64 md:w-auto bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 md:h-72 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use */}
          {activeTab === 'how-to-use' && (
            <div className="flex justify-center">
              <div className="w-full max-w-2xl bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl overflow-hidden shadow-lg">
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

      {/* Hide scrollbar but keep functionality */}
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
