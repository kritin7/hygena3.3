'use client'
//
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Menu, X, Heart, User, LogOut, ShieldCheck, Tag, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('hygena_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Load saved coupon
    const savedCoupon = localStorage.getItem('hygena_applied_coupon')
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon))
    }

    // Listen for cart updates
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('hygena_cart')
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  // Fetch wishlist when user logs in
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

  const updateQuantity = (productId, change) => {
      const updatedCart = cartItems.map(item => {
        if (item.id === productId) {
          // Allow quantity to go to 0 here
          return { ...item, quantity: item.quantity + change }
        }
        return item
      }).filter(item => item.quantity > 0) // This will now catch and remove the 0 quantity items
      
      setCartItems(updatedCart)
      localStorage.setItem('hygena_cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    setCartItems(updatedCart)
    localStorage.setItem('hygena_cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalMRP = () => {
    return cartItems.reduce((total, item) => total + (999 * item.quantity), 0) // Original price
  }

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => total + (600 * item.quantity), 0) // Discount per item
  }

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0
    const subtotal = getTotalPrice()
    return Math.round((subtotal * appliedCoupon.discount) / 100)
  }

  const getFinalTotal = () => {
    return getTotalPrice() - getCouponDiscount()
  }

  const applyCoupon = (code = null) => {
    setCouponError('')
    const codeToApply = (code || couponCode).trim().toUpperCase()
    
    if (codeToApply === 'FRESH10') {
      const coupon = {
        code: 'FRESH10',
        discount: 10
      }
      setAppliedCoupon(coupon)
      localStorage.setItem('hygena_applied_coupon', JSON.stringify(coupon))
      setCouponCode('')
      setShowCouponInput(false)
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    localStorage.removeItem('hygena_applied_coupon')
    setCouponCode('')
    setCouponError('')
  }

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/why-hygena', label: 'Why Hygena' },
    { href: '/science', label: 'Science' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="font-bold text-2xl text-[#D2691E]">Hygena</div>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-gray-700 hover:text-[#D2691E] transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Wishlist Button (Always shows badge, red) */}
              {session && (
                <Link href="/dashboard?tab=wishlist">
                  <Button variant="ghost" size="icon" className="relative hover:text-[#D2691E]">
                    <Heart className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center p-0">
                      {wishlistItems.length}
                    </Badge>
                  </Button>
                </Link>
              )}

              {/* Cart Button (Always shows badge, red if 0, orange if > 0) */}
              <Button 
                onClick={() => setIsCartOpen(true)}
                variant="ghost" 
                size="icon" 
                className="relative hover:text-[#D2691E]"
              >
                <ShoppingCart className="w-5 h-5" />
                <Badge className={`absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center p-0 ${getTotalItems() === 0 ? 'bg-red-500' : 'bg-[#D2691E]'}`}>
                  {getTotalItems()}
                </Badge>
              </Button>

              {/* Auth Section */}
              {session ? (
                <div className="relative">
                  <Button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:text-[#D2691E]"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block font-medium">{session.user.name}</span>
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <div className="px-3 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{session.user.name}</div>
                        <div className="text-gray-500 text-xs truncate">{session.user.email}</div>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut()
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
                    <Button variant="ghost" size="sm" className="hover:text-[#D2691E]">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup" className="hidden sm:block">
                    <Button size="sm" className="bg-[#D2691E] text-white hover:bg-[#8B4513]">Sign Up</Button>
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
            <div className="md:hidden mt-4 py-4 border-t animate-in slide-in-from-top-5">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="text-gray-700 hover:text-[#D2691E] transition-colors font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping Cart ({getTotalItems()})
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCartOpen(false)
                      router.push('/shop')
                    }}
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <span className="text-sm">-</span>
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <span className="text-sm">+</span>
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#D2691E]">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t bg-white">
                {/* Coupons and Offers Section */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-bold text-base">Coupons and Offers</h3>
                        <p className="text-xs text-gray-600">Save more with coupons and offers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowCouponInput(!showCouponInput)}
                      className="flex items-center gap-1 text-sm font-semibold text-[#D2691E]"
                    >
                      1 offer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Coupon Input Section */}
                  {showCouponInput && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-sm mb-3">Apply Coupon</h4>
                      
                      {!appliedCoupon ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter Promo Code"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
                            />
                            <button
                              onClick={applyCoupon}
                              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
                            >
                              SUBMIT
                            </button>
                          </div>
                          
                          {couponError && (
                            <p className="text-xs text-red-600">{couponError}</p>
                          )}

                          {/* Available Coupon */}
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-green-800">FRESH10</span>
                              <Badge className="bg-green-600 text-white text-xs">10% OFF</Badge>
                            </div>
                            <p className="text-xs text-green-700">Get 10% off on your order</p>
                            <button
                              onClick={() => applyCoupon('FRESH10')}
                              className="mt-2 text-xs text-green-700 font-semibold underline"
                            >
                              APPLY
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-green-800">{appliedCoupon.code}</span>
                                <Badge className="bg-green-600 text-white text-xs">{appliedCoupon.discount}% OFF</Badge>
                              </div>
                              <p className="text-xs text-green-700 mt-1">Coupon applied successfully!</p>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-xs text-red-600 font-semibold hover:underline"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart Summary */}
                <div className="px-6 py-4 space-y-3">
                  <h3 className="font-bold text-lg mb-3">Cart Summary</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="font-medium">₹{getTotalMRP().toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount on MRP</span>
                    <span className="font-medium text-green-600">- ₹{getTotalDiscount().toLocaleString('en-IN')}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount ({appliedCoupon.code})</span>
                      <span className="font-medium text-green-600">- ₹{getCouponDiscount().toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Subtotal</span>
                      <span className="font-bold text-lg">₹{getFinalTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-gray-500">Tax included and shipping calculated at checkout</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-6 pb-6">
                  <Button 
                    onClick={() => {
                      setIsCartOpen(false)
                      router.push('/checkout')
                    }}
                    className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513] py-6 text-lg shadow-lg"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
