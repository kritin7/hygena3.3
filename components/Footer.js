'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Starter Pack</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Bundle Offers</Link></li>
              <li><Link href="/dashboard?tab=orders" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Learn</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/why-hygena" className="hover:text-white transition-colors">Why Helmet Hygiene</Link></li>
              <li><Link href="/science" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/science" className="hover:text-white transition-colors">Ingredients</Link></li>
              <li><Link href="/science" className="hover:text-white transition-colors">Usage Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About Hygena</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-300 mb-4">
              <li>
                <a 
                  href="https://www.instagram.com/the.hygena/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Get 10% OFF</h4>
              {subscribed ? (
                <p className="text-green-400 text-sm">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 bg-gray-700 rounded text-sm"
                    required
                  />
                  <Button type="submit" size="sm" className="bg-[#D2691E] text-white hover:bg-[#8B4513]">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 Hygena. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center">
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
  )
}
