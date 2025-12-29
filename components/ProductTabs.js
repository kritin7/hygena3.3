'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ZoomIn } from 'lucide-react'

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('why-it-works')
  const [zoomedImage, setZoomedImage] = useState(null)

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
    <>
      <div className="w-full bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
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
                      onClick={() => setZoomedImage(image)}
                      className="w-64 md:w-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
                    >
                      {/* Zoom Icon Overlay */}
                      <div className="absolute top-3 right-3 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      
                      {/* Image Container with Fixed Aspect Ratio */}
                      <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
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
                      onClick={() => setZoomedImage(image)}
                      className="w-64 md:w-auto bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
                    >
                      {/* Zoom Icon Overlay */}
                      <div className="absolute top-3 right-3 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      
                      {/* Image Container with Fixed Aspect Ratio */}
                      <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use */}
            {activeTab === 'how-to-use' && (
              <div className="flex justify-center">
                <div 
                  onClick={() => setZoomedImage(howToUseImages[0])}
                  className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
                >
                  {/* Zoom Icon Overlay */}
                  <div className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  
                  <img
                    src={howToUseImages[0].src}
                    alt={howToUseImages[0].alt}
                    className="w-full h-auto object-contain p-6 transition-transform duration-300 group-hover:scale-105"
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
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="w-full h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            Click anywhere to close
          </div>
        </div>
      )}

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
    </>
  )
}
