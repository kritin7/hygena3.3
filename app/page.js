'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Menu, X, ChevronDown, Shield, Calendar, Leaf, Clock, CheckCircle, Users, MessageCircle, Award, Truck, CreditCard, Lock, Heart, User, LogOut } from 'lucide-react'
import Link from 'next/link'
//gemini
import { useRouter } from 'next/navigation'

export default function HygenaLanding() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter() // Initialize router

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

  const testimonials = [
    {
      name: "Raj Kumar",
      designation: "Daily Commuter, Mumbai",
      rating: 5,
      review: "Game changer! My helmet smells fresh even after 8-hour delivery shifts.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      verified: true
    },
    {
      name: "Priya Sharma",
      designation: "IT Professional, Bangalore",
      rating: 5,
      review: "Finally, no more embarrassing helmet odor. The cooling effect is amazing!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8af?w=50&h=50&fit=crop&crop=face",
      verified: true
    },
    {
      name: "Amit Patel",
      designation: "Food Delivery Partner",
      rating: 5,
      review: "Worth every rupee. My scalp itching completely stopped.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      verified: true
    }
  ]

  const faqs = [
    {
      question: "Is it safe for daily use?",
      answer: "Absolutely! Hygena is dermatologically tested and uses natural, scalp-friendly ingredients. It's gentler than your regular shampoo."
    },
    {
      question: "How long does one bottle last?",
      answer: "One 100ml bottle lasts 2-3 months with daily use (6-8 sprays per application)."
    },
    {
      question: "Will it damage my helmet padding?",
      answer: "No. Our formula is specifically designed to be safe on all helmet materials including foam, fabric, and synthetic padding."
    },
    {
      question: "Can I use it on other gear?",
      answer: "Yes! While optimized for helmets, Hygena works great on gloves, shoes, and gym bags too."
    },
    {
      question: "What's the refund policy?",
      answer: "30-day money-back guarantee. If you're not satisfied, we'll refund you fully, no questions asked."
    }
  ]

  // Load wishlist when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    }
  }, [session])

  // ================= PASTE THIS CODE BLOCK HERE =================
  // Load Cart on Mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hygena_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save Cart on Change
  useEffect(() => {
    localStorage.setItem('hygena_cart', JSON.stringify(cartItems))
  }, [cartItems])

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

  const addToWishlist = async (product) => {
    if (!session) {
      alert('Please sign in to add items to wishlist')
      return
    }

    try {
      const response = await fetch(`/api/wishlist/${session.user.id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      alert('Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId) => {
    if (!session) return

    try {
      const response = await fetch(`/api/wishlist/${session.user.id}/remove/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId.toString())
  }

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    try {
      // Create order on backend
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          currency: 'INR',
          customer_name: session?.user?.name || 'Guest Customer',
          customer_email: session?.user?.email || 'guest@example.com',
          items: cartItems
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hygena',
        description: 'India\'s First Helmet Deodorant',
        order_id: orderData.orderId,
        image: '/favicon.ico',
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              // Payment successful
              alert('Payment successful! Thank you for your order.')
              setCartItems([]) // Clear cart
              setIsCartOpen(false)
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: session?.user?.name || 'Customer',
          email: session?.user?.email || 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#D2691E'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment initialization failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="font-bold text-2xl text-[#D2691E]">Hygena</div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#shop" className="text-gray-700 hover:text-[#D2691E] transition-colors">Shop</a>
              <a href="#problem-section" className="text-gray-700 hover:text-[#D2691E] transition-colors">Why Hygena</a>
              <a href="#ingredients" className="text-gray-700 hover:text-[#D2691E] transition-colors">Science</a>
              <a href="#about" className="text-gray-700 hover:text-[#D2691E] transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-[#D2691E] transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Wishlist Button (only for logged-in users) */}
              {session && (
                <Button 
                  onClick={() => setIsWishlistOpen(true)}
                  variant="outline" 
                  size="sm" 
                  className="relative"
                >
                  <Heart className="w-4 h-4" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Cart Button */}
              <Button 
                onClick={() => setIsCartOpen(true)}
                variant="outline" 
                size="sm" 
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#FF8C00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* Auth Section */}
              {session ? (
                <div className="relative">
                  <Button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:block">{session.user.name}</span>
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <div className="px-3 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{session.user.name}</div>
                        <div className="text-gray-500">{session.user.email}</div>
                      </div>
                      <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-[#FF8C00] text-white hover:bg-[#D2691E]">Sign Up</Button>
                  </Link>
                </div>
              )}

              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#shop" className="text-gray-700 hover:text-[#D2691E] transition-colors">Shop</a>
                <a href="#problem-section" className="text-gray-700 hover:text-[#D2691E] transition-colors">Why Hygena</a>
                <a href="#ingredients" className="text-gray-700 hover:text-[#D2691E] transition-colors">Science</a>
                <a href="#about" className="text-gray-700 hover:text-[#D2691E] transition-colors">About</a>
                <a href="#contact" className="text-gray-700 hover:text-[#D2691E] transition-colors">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Personalized Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-12 md:py-20">
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
                <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl font-montserrat text-[#1A1A1A] leading-tight">
                  Tired of Helmet Odor? We Get It.
                </h1>
                <h2 className="font-semibold text-xl md:text-2xl text-[#D2691E] font-inter">
                  Pause the germs. Keep the freshness.
                </h2>
                <p className="text-base md:text-lg font-inter leading-relaxed text-[#666666] max-w-xl">
                  Revolutionary bacteriostatic formula that doesn't just mask odor - it prevents bacteria from multiplying inside your helmet.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => addToCart(products[0])}
                  className="bg-gradient-to-r from-[#FF8C00] to-[#D2691E] text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all"
                >
                  Shop Now - ₹549
                  <span className="ml-2 line-through text-white/80">₹799</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-[#D2691E] text-[#D2691E] px-8 py-4 rounded-full hover:bg-[#D2691E] hover:text-white transition-all"
                >
                  Learn How It Works
                </Button>
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
                  src="https://images.unsplash.com/photo-1649176154020-c695980078e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkZW9kb3JhbnQlMjBzcHJheXxlbnwwfHx8b3JhbmdlfDE3NTczMTY5NzR8MA&ixlib=rb-4.1.0&q=85"
                  alt="Hygena Helmet Deodorant"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/20 to-[#D2691E]/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              The Hidden Problem in Your Helmet
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Bacteria Buildup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Sweat + Heat + Darkness = Perfect breeding ground for bacteria</p>
                <Badge className="bg-red-500 text-white">10x more bacteria than a toilet seat</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Persistent Odor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Regular deodorants just mask the smell temporarily</p>
                <Badge className="bg-yellow-500 text-white">87% riders report helmet odor issues</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                </div>
                <CardTitle className="text-xl font-semibold">Scalp Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Itching, dandruff, and hair fall from bacterial growth</p>
                <Badge className="bg-orange-500 text-white">3 in 5 riders face scalp issues</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              Traditional sprays mask the problem. Hygena solves it.
            </p>
            <ChevronDown className="w-8 h-8 text-[#D2691E] mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              Bacteriostatic Technology That Works
            </h2>
            <p className="text-xl text-gray-600">Not just fragrance - real helmet hygiene</p>
          </div>

          <div className="space-y-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Pauses Bacterial Growth</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Our bacteriostatic formula prevents bacteria from multiplying without harsh chemicals
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-full h-40 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-16 h-16 text-green-600" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">30-Day Protection</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  One application keeps your helmet fresh for up to 30 days of regular use
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg lg:order-1">
                <div className="w-full h-40 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Leaf className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Scalp-Safe Formula</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Plant-based extracts like Neem, Aloe, and Tea Tree protect your scalp
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="w-full h-40 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-green-600" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-[#D2691E] mr-3" />
                  <h3 className="text-2xl font-semibold">Instant Application</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Spray, wait 30 seconds, wear. That simple.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg lg:order-1">
                <div className="w-full h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-16 h-16 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="shop" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              Choose Your Pack
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                {product.badge && (
                  <Badge className="absolute top-4 left-4 z-10 bg-[#FF8C00] text-white">
                    {product.badge}
                  </Badge>
                )}

                {/* Wishlist Button */}
                {session && (
                  <Button
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id.toString()) : addToWishlist(product)}
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
        </div>
      </section>

      {/* Ingredients Section */}
      <section id="ingredients" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              Science Meets Nature
            </h2>
            <p className="text-xl text-gray-600">Every ingredient has a purpose</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Neem Extract</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Natural Antibacterial</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Prevents microbial growth naturally</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Tea Tree</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Anti-Dandruff</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Controls scalp irritation and flakes</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Aloe Vera</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Cooling & Soothing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Calms skin and reduces inflammation</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Chamomile</CardTitle>
                <CardDescription className="text-[#D2691E] font-medium">Sensitive Skin Safe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Gentle protection for all scalp types</p>
              </CardContent>
            </Card>
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
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D2691E] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Spray</h3>
              <p className="text-gray-600 mb-2">6-8 sprays inside helmet padding</p>
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

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              Join 10,000+ Fresh Riders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="flex flex-row items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.designation}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.review}"</p>
                  {testimonial.verified && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">2,847</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#D2691E]">97%</div>
              <div className="text-gray-600">Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl font-montserrat text-[#1A1A1A] mb-4">
              Got Questions?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardHeader>
                  <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-3xl md:text-4xl font-montserrat mb-4">
            Ready for Fresh Rides?
          </h2>
          <p className="text-xl mb-8">Join thousands who've already made the switch</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8">
            <p className="text-lg font-semibold mb-2">Limited Time: Get 20% OFF on your first order</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">Use code:</span>
              <Badge className="bg-white text-[#D2691E] font-bold">FRESH20</Badge>
            </div>
          </div>

          <Button 
            onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#D2691E] text-xl px-8 py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 mb-8"
          >
            Get Your Hygena Now
          </Button>

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

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Starter Pack</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bundle Offers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Learn</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Why Helmet Hygiene</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ingredients</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Usage Guide</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Hygena</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Get 10% OFF</h4>
                <div className="flex flex-col gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-3 py-2 bg-gray-700 rounded text-sm"
                  />
                  <Button size="sm" className="bg-[#D2691E] text-white hover:bg-[#8B4513]">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Hygena. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Dermatologically Tested
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Clinically Proven
              </Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                Made in India
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Rest of the sections remain the same as before... */}
      {/* I'll continue with the remaining sections in the next part due to length limit */}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart ({getTotalItems()})</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex items-center justify-between mb-4 text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>

                {/* === REPLACE THE OLD BUTTON WITH THIS === */}
                <Button 
                  onClick={() => {
                    setIsCartOpen(false) // Optional: close sidebar
                    router.push('/checkout')
                  }}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513]"
                >
                  Proceed to Checkout - ₹{getTotalPrice()}
                </Button>
                {/* ======================================== */}

              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Sidebar */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsWishlistOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">My Wishlist ({wishlistItems.length})</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsWishlistOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {wishlistItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Your wishlist is empty</p>
                  <p className="text-sm">Add products you love!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          className="text-xs bg-[#D2691E] text-white"
                          onClick={() => {
                            const product = products.find(p => p.id.toString() === item.productId)
                            if (product) addToCart(product)
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={() => removeFromWishlist(item.productId)}
                        >
                          <Heart className="w-3 h-3 fill-current" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
