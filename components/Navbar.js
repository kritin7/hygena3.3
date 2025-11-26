'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Menu, X, Heart, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('hygena_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
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

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/why-hygena', label: 'Why Hygena' },
    { href: '/science', label: 'Science' },
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
                  className="text-gray-700 hover:text-[#D2691E] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Wishlist Button (only for logged-in users) */}
              {session && (
                <Link href="/dashboard?tab=wishlist">
                  <Button variant="outline" size="sm" className="relative">
                    <Heart className="w-4 h-4" />
                    {wishlistItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
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
                  <Link href="/auth/signup" className="hidden sm:block">
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
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="text-gray-700 hover:text-[#D2691E] transition-colors"
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart ({getTotalItems()})</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                <Button 
                  onClick={() => {
                    setIsCartOpen(false)
                    router.push('/checkout')
                  }}
                  className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513]"
                >
                  Proceed to Checkout - ₹{getTotalPrice()}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
