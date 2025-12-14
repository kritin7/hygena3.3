'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation' // Import useRouter
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, CheckCircle } from 'lucide-react'

export default function ShopPage() {
  const { data: session } = useSession()
  const router = useRouter() // Initialize router
  const [wishlistItems, setWishlistItems] = useState([])

  // SINGLE PRODUCT DATA
  const products = [
    {
      id: 1,
      name: "Hygena Helmet Deodorant",
      image: "https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85",
      size: "100ml",
      duration: "30 Days Protection",
      price: 549,
      originalPrice: 799,
      features: ["Kills 99.9% Bacteria", "Scalp Safe", "Natural Ingredients"],
      badge: "Best Seller",
      discount: "31% OFF"
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
    e.stopPropagation() // Prevent clicking the card when clicking "Add to Cart"
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

  const addToWishlist = async (e, product) => {
    e.stopPropagation() // Prevent card click
    if (!session) {
      alert('Please sign in to add items to wishlist')
      return
    }
    // ... existing wishlist logic ...
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId.toString())
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-[#1A3C34] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">Shop Hygena</h1>
          <p className="text-xl opacity-90">Essential care for your riding gear</p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-16">
        {/* Centered Single Product Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 w-full max-w-sm">
            {products.map((product) => (
              <Card 
                key={product.id} 
                // CLICK HANDLER: Redirects to the Product Page
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white border-gray-100"
              >
                {product.badge && (
                  <Badge className="absolute top-4 left-4 z-10 bg-[#D2691E] text-white border-none px-3 py-1">
                    {product.badge}
                  </Badge>
                )}

                {session && (
                  <Button
                    onClick={(e) => addToWishlist(e, product)}
                    variant="ghost"
                    size="sm"
                    className={`absolute top-4 right-4 z-10 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                )}
                
                <CardHeader className="text-center p-0">
                  <div className="overflow-hidden h-64 w-full bg-gray-100 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 pb-2">
                    <CardTitle className="text-xl font-bold font-montserrat mb-1">{product.name}</CardTitle>
                    <CardDescription className="text-gray-500">
                      {product.size} • {product.duration}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6 pt-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-bold text-[#1A1A1A]">₹{product.price}</span>
                      <span className="text-lg line-through text-gray-400">₹{product.originalPrice}</span>
                    </div>
                    {product.discount && (
                      <Badge variant="secondary" className="bg-red-50 text-red-600 mt-2 font-medium border-red-100">
                        {product.discount}
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#D2691E] mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={(e) => addToCart(e, product)}
                    className="w-full bg-[#1A3C34] text-white hover:bg-[#132e28] h-12 text-lg font-medium"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 text-center border-t border-gray-200 pt-16">
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-700" />
              </div>
              <span className="font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-medium">30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-700" />
              </div>
              <span className="font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
