'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Gift } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function DiscountWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // To handle the 'X' on the button
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ email: '', phone: '' })

  // Check if user already dismissed or claimed
  useEffect(() => {
    const isClaimed = localStorage.getItem('hygena_discount_claimed')
    const isDismissed = localStorage.getItem('hygena_discount_dismissed')
    if (isClaimed || isDismissed) {
      setIsVisible(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log('Discount Signup:', formData)
    
    // Simulate success
    setIsSubmitted(true)
    localStorage.setItem('hygena_discount_claimed', 'true')
    setTimeout(() => {
        setIsVisible(false)
        setIsOpen(false)
    }, 5000) // Hide after 5 seconds of showing code
  }

  const handleDismiss = (e) => {
    e.stopPropagation() // Prevent opening the modal
    setIsVisible(false)
    localStorage.setItem('hygena_discount_dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <>
      {/* Floating Trigger Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-700">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
        >
          <Gift className="w-5 h-5 text-[#D2691E] animate-pulse" />
          <span className="font-bold tracking-wide">GET 10% OFF</span>
          
          {/* Close 'X' - clicking this hides the widget */}
          <div 
            role="button"
            onClick={handleDismiss}
            className="ml-2 p-1 hover:bg-gray-700 rounded-full transition-colors border-l border-gray-700 pl-3"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </div>
        </button>
      </div>

      {/* The "Window" (Dialog) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#D2691E]">
              {isSubmitted ? "Here is your code!" : "Unlock 10% OFF"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isSubmitted 
                ? "Use this code at checkout to save on your first order."
                : "Join the Hygena community for exclusive deals and fresh updates."
              }
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="bg-orange-100 text-[#D2691E] text-3xl font-mono font-bold py-3 px-8 rounded-lg border-2 border-dashed border-[#D2691E]">
                FRESH10
              </div>
              <Button 
                onClick={() => {
                    navigator.clipboard.writeText('FRESH10')
                    alert('Code copied!')
                }}
                variant="outline" 
                className="text-sm"
              >
                Copy Code
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  required
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="border-gray-300 focus:ring-[#D2691E]"
                />
              </div>
              <div className="space-y-2">
                <Input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-gray-300 focus:ring-[#D2691E]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#D2691E] hover:bg-[#8B4513] text-white font-bold py-6 text-lg"
              >
                UNLOCK DISCOUNT
              </Button>
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to receive marketing updates. View our Privacy Policy.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
