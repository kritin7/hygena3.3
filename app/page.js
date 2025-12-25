'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Truck, CreditCard, Lock } from 'lucide-react'
import Link from 'next/link'
import ImageComparison from '@/components/ImageComparison' // <--- IMPORT HERE

export default function HomePage() {
  const { data: session } = useSession()

  const addToCart = (product) => {
    // ... existing cart logic ...
    const savedCart = localStorage.getItem('hygena_cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      cartItems = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      cartItems = [...cartItems, { ...product, quantity: 1 }]
    }
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))
    alert('Added to cart!')
  }

  const starterPack = {
    id: 1,
    name: "Starter Pack",
    image: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
    size: "100ml",
    duration: "2-3 months",
    price: 399,
    originalPrice: 999,
    features: ["Perfect for trying", "Free shipping", "Money-back guarantee"],
    badge: "Most Popular",
    discount: "60% OFF"
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-12 md:py-20">
         {/* ... existing hero code ... */}
         <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {session && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-lg">
                    👋 Welcome back, <span className="font-semibold text-[#D2691E]">{session.user.name}</span>!
                  </p>
                  <p className="text-gray-600">Continue your journey to fresher rides</p>
                </div>
              )}
              
              <Badge className="bg-[#FF8C00] text-white px-4 py-2 rounded-full">
                India's First Helmet Deodorant
              </Badge>
              
              <div className="space-y-4">
                <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-tight">
                  Tired of Helmet Odor? We Get It.
                </h1>
                <h2 className="font-semibold text-xl md:text-2xl text-[#D2691E]">
                  Pause the germs. Keep the freshness.
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[#666666] max-w-xl">
                  Revolutionary bacteriostatic formula that doesn't just mask odor - it prevents bacteria from multiplying inside your helmet.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => addToCart(starterPack)}
                  className="bg-gradient-to-r from-[#FF8C00] to-[#D2691E] text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all"
                >
                  Shop Now - ₹399
                  <span className="ml-2 line-through text-white/80">₹999</span>
                </Button>
                <Link href="/why-hygena">
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#D2691E] text-[#D2691E] px-8 py-4 rounded-full hover:bg-[#D2691E] hover:text-white transition-all"
                  >
                    Learn How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="border-green-500 text-green-700 px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Dermatologically Tested
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-700 px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  100% Safe on Scalp
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-700 px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Clinically Proven
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/images/hero-banner1.png"
                  alt="Hygena Helmet Deodorant"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/20 to-[#D2691E]/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW COMPARISON SECTION --- */}
      <section className="py-20 bg-white">
        <ImageComparison 
          beforeImage="/images/helmet-dirty.jpg" 
          afterImage="/images/helmet-clean.jpg" 
        />
      </section>
      {/* ------------------------------ */}

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* ... stats code ... */}
            <div>
              <div className="text-4xl font-bold text-[#D2691E] mb-2">10,000+</div>
              <div className="text-gray-600">Happy Riders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D2691E] mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D2691E] mb-2">30 Days</div>
              <div className="text-gray-600">Protection Per Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white">
        {/* ... CTA code ... */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            Ready for Fresh Rides?
          </h2>
          <p className="text-xl mb-8">Join thousands who've already made the switch</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8">
            <p className="text-lg font-semibold mb-2">Limited Time: Get 10% OFF on your first order</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">Use code:</span>
              <Badge className="bg-white text-[#D2691E] font-bold">FRESH10</Badge>
            </div>
          </div>

          <Link href="/shop">
            <Button className="bg-white text-[#D2691E] text-xl px-8 py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 mb-8">
              Get Your Hygena Now
            </Button>
          </Link>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center">
              <Truck className="w-4 h-4 mr-2" />
              Free Shipping
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              COD Available
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Secure Payment
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
