// components/Navbar.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, User, Heart, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { cartItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const NavLinks = () => (
    <>
      <Link href="/shop" className="text-sm font-medium hover:text-[#D2691E] transition-colors">
        Shop
      </Link>
      <Link href="/science" className="text-sm font-medium hover:text-[#D2691E] transition-colors">
        Science
      </Link>
      <Link href="/about" className="text-sm font-medium hover:text-[#D2691E] transition-colors">
        About
      </Link>
      <Link href="/contact" className="text-sm font-medium hover:text-[#D2691E] transition-colors">
        Contact
      </Link>
    </>
  )

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <ShieldCheck className="h-6 w-6 text-[#D2691E]" strokeWidth={2.5} />
            <span className="text-xl font-bold text-[#D2691E]">
              HYGENA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard?tab=wishlist">
              <Button variant="ghost" size="icon" className="hover:text-[#D2691E]">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:text-[#D2691E]">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="relative hover:text-[#D2691E]">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E]">
                    {getTotalItems()}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:text-[#D2691E]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px] pt-10">
                <div className="flex flex-col gap-6">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
