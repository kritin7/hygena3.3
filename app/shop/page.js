'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ShopPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([])

  const products = [
    {
      id: 1,
      name: "Starter Pack",
      image: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
      size: "100ml",
      duration: "2-3 months",
      price: 549,
      originalPrice: 799,
      features: ["Perfect for trying", "Free shipping", "Money-back guarantee"],
      badge: "Most Popular",
      discount: "31% OFF"
    },
    {
      id: 2,
      name: "Family Pack",
      image: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
      size: "3 x 100ml",
      duration: "6-9 months",
      price: 1399,
      originalPrice: 2397,
      savings: "Save ₹998",
      features: ["Best value", "Free premium cloth", "Priority support"],
      badge: "Best Value"
    },
    {
      id: 3,
      name: "Rider's Bundle",
      image: "https://images.unsplash.com/photo-1613737673578-8af01fe0e05b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
      includes: "2 bottles + Travel size",
      duration: "4-6 months",
      price: 999,
      originalPrice: 1597,
      features: ["Home + Travel", "Free helmet cloth", "Exclusive sticker pack"]
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

  const addToCart = (product) => {
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
    alert('Added to cart!')
  }

  const addToWishlist = async (product) => {
    if (!session) {
      alert('Please sign in to add items to wishlist')
      return
    }

    try {
      const response = await fetch(`/api/wishlist/${session.user.id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setWishlistItems(prev => [...prev, data.item])
        alert('Added to wishlist!')
      } else {
        alert(data.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId.toString())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Hygena</h1>
          <p className="text-xl opacity-90">Choose the perfect pack for fresh, odor-free rides</p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="relative overflow-hidden hover:shadow-xl transition-shadow">
              {product.badge && (
                <Badge className="absolute top-4 left-4 z-10 bg-[#FF8C00] text-white">
                  {product.badge}
                </Badge>
              )}

              {session && (
                <Button
                  onClick={() => addToWishlist(product)}
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 z-10 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              )}
              
              <CardHeader className="text-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <CardDescription>
                  {product.size && <div>{product.size}</div>}
                  {product.includes && <div>{product.includes}</div>}
                  <div className="text-gray-600">{product.duration}</div>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-[#D2691E]">₹{product.price}</span>
                    <span className="text-lg line-through text-gray-500">₹{product.originalPrice}</span>
                  </div>
                  {product.savings && (
                    <div className="text-green-600 font-semibold">{product.savings}</div>
                  )}
                  {product.discount && (
                    <Badge className="bg-red-500 text-white mt-1">{product.discount}</Badge>
                  )}
                </div>

                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513] transition-colors"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-1" />
              Free Shipping
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-1" />
              30-Day Money Back
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-1" />
              Secure Checkout
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
