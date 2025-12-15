'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Leaf, Wind, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function ProductDetailPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const PRODUCT = {
    id: 1,
    name: "Helmet Deodorant | 100ml",
    subtitle: "India's first helmet deodorant built for sweat, bacteria, and daily rides.",
    image: "/images/1st.jpg",
    images: ["/images/1st.jpg"],
    price: 399,
    originalPrice: 999,
    discount: "60% OFF",
    rating: 4.8,
    reviews: 124,
    features: [
      "Kills 99.9% Bacteria",
      "Scalp Safe Formula",
      "Natural Active Ingredients",
      "Long-lasting Freshness",
      "Quick Dry Technology"
    ]
  }

  const addToCart = () => {
    const savedCart = localStorage.getItem('hygena_cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existing = cartItems.find(item => item.id === PRODUCT.id)
    if (existing) {
      cartItems = cartItems.map(item => 
        item.id === PRODUCT.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    } else {
      cartItems = [...cartItems, { ...PRODUCT, quantity }]
    }
    
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))
    alert(`Added ${quantity} item(s) to cart!`)
  }

  const buyNow = () => {
    addToCart()
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              <Badge className="absolute top-4 left-4 z-10 bg-[#D2691E] hover:bg-[#b85c1a] text-white border-none px-3 py-1.5 text-xs font-bold tracking-wider uppercase shadow-md">
                BEST SELLER
              </Badge>
              <img 
                src={PRODUCT.images[currentImageIndex]} 
                alt={PRODUCT.name}
                className="w-full h-full object-cover"
              />
              {PRODUCT.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? PRODUCT.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === PRODUCT.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {PRODUCT.images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-montserrat">
                {PRODUCT.name}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                {PRODUCT.subtitle}
              </p>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D2691E] text-[#D2691E]" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">{PRODUCT.rating}</span>
              <span className="text-sm text-gray-500">|</span>
              <a href="#reviews" className="text-sm text-[#D2691E] hover:underline font-medium">
                {PRODUCT.reviews} Verified Reviews
              </a>
            </div>

            {/* Functional Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> BACTERIOSTATIC FORMULA
              </Badge>
              <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                <Leaf className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> NATURAL ACTIVES
              </Badge>
              <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 py-1.5 px-3">
                <Wind className="w-3.5 h-3.5 mr-1.5 text-[#D2691E]" /> ODOR BLOCK
              </Badge>
            </div>

            {/* Price Section - FIXED ALIGNMENT */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-gray-900 font-montserrat">
                ₹{PRODUCT.price}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{PRODUCT.originalPrice}
              </span>
              <span className="text-xs text-gray-500">
                (Incl. of all taxes)
              </span>
              <span className="text-white bg-red-500 font-bold text-xs px-2 py-1 rounded shadow-sm">
                {PRODUCT.discount}
              </span>
            </div>

            {/* Review Highlight */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D2691E] text-[#D2691E]" />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "I've tried every hack for smelly helmets but they all felt temporary. This one actually controls oil, keeps acne away, and works after long metro rides."
              </p>
              <p className="text-xs text-[#D2691E] font-semibold mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-[#D2691E] rounded-full"></span>
                RAHUL, VERIFIED BUYER
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold border-x border-gray-300">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={addToCart}
                className="w-full bg-black text-white hover:bg-gray-800 h-14 text-lg font-bold uppercase tracking-wide rounded-lg"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={buyNow}
                className="w-full bg-gradient-to-r from-[#FF8C00] to-[#D2691E] text-white hover:opacity-90 h-14 text-lg font-bold uppercase tracking-wide rounded-lg"
              >
                BUY IT NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
