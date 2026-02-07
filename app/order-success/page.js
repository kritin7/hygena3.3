'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, MapPin, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'

export default function OrderSuccessPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [orderData, setOrderData] = useState(null)
  const [countdown, setCountdown] = useState(5)

  // 🔥 pixel ready flag
  const [pixelLoaded, setPixelLoaded] = useState(false)


  /* ---------------- LOAD ORDER ---------------- */
  useEffect(() => {
    const savedOrder = localStorage.getItem('last_order')

    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderData(order)

      localStorage.removeItem('hygena_cart')
      localStorage.removeItem('hygena_applied_coupon')
      window.dispatchEvent(new Event('cartUpdated'))
    } else {
      router.push('/')
    }
  }, [router])


  /* ---------------- PURCHASE EVENT (FIXED + RELIABLE) ---------------- */
  useEffect(() => {
    if (
      !orderData ||
      !pixelLoaded || // 🔥 wait for pixel
      typeof window === 'undefined' ||
      !window.fbq
    ) return

    const txnId = orderData.orderId || orderData.paymentId
    const key = `purchase_${txnId}`

    // prevent duplicates
    if (sessionStorage.getItem(key)) return

    const items = Array.isArray(orderData.items) ? orderData.items : []

    window.fbq('track', 'Purchase', {
      value: Number(orderData.finalTotal),
      currency: 'INR',
      transaction_id: txnId,

      content_ids: items.map(i => String(i.id)),
      content_type: 'product',

      num_items: items.reduce((s, i) => s + i.quantity, 0),

      contents: items.map(i => ({
        id: String(i.id),
        quantity: i.quantity,
        price: Number(i.price)
      }))
    })

    sessionStorage.setItem(key, 'true')

  }, [orderData, pixelLoaded]) // 🔥 dependency added


  /* ---------------- AUTO REDIRECT ---------------- */
  useEffect(() => {
    if (session && orderData && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (session && countdown === 0) {
      router.push('/dashboard?tab=orders')
    }
  }, [session, countdown, orderData, router])


  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E]"></div>
      </div>
    )
  }


  return (
    <>
      {/* ---------------- META PIXEL ---------------- */}
      <Script
        id="meta-pixel-purchase"
        strategy="afterInteractive"
        onLoad={() => setPixelLoaded(true)} // 🔥 critical
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '885932527303026');
          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=885932527303026&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>


      {/* ---------------- YOUR UI (UNCHANGED) ---------------- */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-xl text-gray-600">Thank you for your purchase</p>
          </div>

          {/* keep rest of your JSX exactly same */}
        </div>
      </div>
    </>
  )
}
