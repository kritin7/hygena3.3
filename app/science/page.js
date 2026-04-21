'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SciencePage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Science</h1>
          <p className="text-xl opacity-90">Science meets nature in every spray</p>
        </div>
      </div>

      {/* Ingredients - UPDATED DESIGN */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              Key Ingredients
            </h2>
            <p className="text-xl text-gray-600">Hover over the cards to see the benefits</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Neem */}
            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              {/* Background Image */}
              <img 
                src="/images/neem.jpg" 
                alt="Neem Extract" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay & Text - Visible on Hover */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Neem Extract</h3>
                <Badge className="bg-[#D2691E] text-white border-none mb-3 hover:bg-[#D2691E]">
                  Natural Antibacterial
                </Badge>
                <p className="text-gray-200 font-medium">
                  Prevents microbial growth naturally
                </p>
              </div>
            </div>

            {/* Tea Tree */}
            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              {/* Background Image */}
              <img 
                src="/images/tea-tree.jpg" 
                alt="Tea Tree" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay & Text */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Tea Tree</h3>
                <Badge className="bg-[#D2691E] text-white border-none mb-3 hover:bg-[#D2691E]">
                  Anti-Dandruff
                </Badge>
                <p className="text-gray-200 font-medium">
                  Controls scalp irritation and flakes
                </p>
              </div>
            </div>

            {/* Aloe Vera */}
            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              {/* Background Image */}
              <img 
                src="/images/aloe-vera.jpg" 
                alt="Aloe Vera" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay & Text */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Aloe Vera</h3>
                <Badge className="bg-[#D2691E] text-white border-none mb-3 hover:bg-[#D2691E]">
                  Cooling & Soothing
                </Badge>
                <p className="text-gray-200 font-medium">
                  Calms skin and reduces inflammation
                </p>
              </div>
            </div>

            {/* Chamomile */}
            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              {/* Background Image */}
              <img 
                src="/images/chamomile.jpg" 
                alt="Chamomile" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay & Text */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Chamomile</h3>
                <Badge className="bg-[#D2691E] text-white border-none mb-3 hover:bg-[#D2691E]">
                  Sensitive Skin Safe
                </Badge>
                <p className="text-gray-200 font-medium">
                  Gentle protection for all scalp types
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              No Harsh Chemicals
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              pH Balanced
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              Alcohol-Free Base
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              No Artificial Colors
            </Badge>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Spray</h3>
              <p className="text-gray-600 mb-2">1-2 sprays inside helmet padding</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">5 seconds</Badge>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Wait</h3>
              <p className="text-gray-600 mb-2">Let it settle and dry</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">30 seconds</Badge>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Wear</h3>
              <p className="text-gray-600 mb-2">Enjoy fresh, clean rides</p>
              <Badge variant="outline" className="text-[#D2691E] border-[#D2691E]">All day protection</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Experience the Science</h2>
          <p className="text-xl mb-8 opacity-90">Try Hygena risk-free with our 30-day guarantee</p>
          <Link href="/shop">
            <Button className="bg-white text-[#D2691E] hover:bg-gray-100 text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
