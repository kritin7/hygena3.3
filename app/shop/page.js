'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, CheckCircle, Truck, ShieldCheck, Lock, Star } from 'lucide-react'

export default function ShopPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([])

  const products = [
    {
      id: 1,
      name: "Hygena Helmet Deodorant",
      image: "/images/1st.jpg",
      size: "100ml",
      duration: "30 Days Protection",
      price: 399,
      originalPrice: 999,
      features: ["Kills 99.9% Bacteria", "Scalp Safe", "Natural Ingredients"],
      badge: "Best Seller",
      discount: "60% OFF",
      rating: 4.8,
      reviews: 124
    }
  ]

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    }
  }, [session])

  const fetchWishlist = async () => {
    if (!session?.user?.id) return
    try {
      const response = await fetch(`/api/wishlist/${session.user.id}`)
      const data = await response.json()
      if (data.status === 'success') {
        setWishlistItems(data.wishlist.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const addToCart = (e, product) => {
    e.stopPropagation() 
    const savedCart = localStorage.getItem('hygena_cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      cartItems = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      cartItems = [...cartItems, { ...product, quantity: 1 }]
    }
    
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('cartUpdated'))
    alert('Added to cart!')
  }

  const addToWishlist = async (e, product) => {
    e.stopPropagation()
    if (!session) {
      alert('Please sign in to add items to wishlist')
      return
    }
    // ... wishlist logic ...
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId.toString())
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Hygena
          </h1>
          <p className="text-xl opacity-90">
            Essential care for your riding gear
          </p>
        </div>
      </div>


      {/* Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 w-full max-w-sm">
            {products.map((product) => (
              <Card 
                key={product.id} 
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white border-gray-100 rounded-2xl"
              >
                {/* Badge - Earth Orange */}
                {product.badge && (
                  <Badge className="absolute top-4 left-4 z-10 bg-[#D2691E] hover:bg-[#b85c1a] text-white border-none px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-md">
                    {product.badge}
                  </Badge>
                )}

                {session && (
                  <Button
                    onClick={(e) => addToWishlist(e, product)}
                    variant="ghost"
                    size="sm"
                    className={`absolute top-4 right-4 z-10 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full h-8 w-8 p-0`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                )}
                
                <CardHeader className="text-center p-0">
                  <div className="overflow-hidden h-72 w-full bg-gray-100 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 pb-0">
                    <CardTitle className="text-2xl font-bold font-montserrat mb-1 text-gray-900">{product.name}</CardTitle>
                    <CardDescription className="text-gray-500 font-medium">
                      {product.size} • {product.duration}
                    </CardDescription>
                    
                    {/* Stars - Earth Orange */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D2691E] text-[#D2691E]" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6 pt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Price - Black */}
                      <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-lg line-through text-gray-400">₹{product.originalPrice}</span>
                    </div>
                    {/* Discount - Solid Red */}
                    {product.discount && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white mt-2 font-bold px-2 py-0.5">
                        {product.discount}
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-2 bg-orange-50/30 p-4 rounded-xl border border-orange-100/50">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        {/* Check Icon - Earth Orange */}
                        <CheckCircle className="w-4 h-4 text-[#D2691E] mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button - BLACK (No Green) */}
                  <Button 
                    onClick={(e) => addToCart(e, product)}
                    className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-bold uppercase tracking-wide shadow-lg rounded-xl"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges - Orange & Gray */}
        <div className="mt-20 text-center border-t border-gray-200 pt-16">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3 text-gray-600 group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <span className="font-semibold text-sm">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-gray-600 group">
              <div className="w-12 h-12 rounded-full bg-[#D2691E]/5 group-hover:bg-[#D2691E]/10 transition-colors flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#D2691E]" />
              </div>
              <span className="font-semibold text-sm">30-Day Money Back</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-gray-600 group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
              <span className="font-semibold text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
