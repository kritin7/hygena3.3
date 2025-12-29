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

  useEffect(() => {
    // Load order data from localStorage
    const savedOrder = localStorage.getItem('last_order')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderData(order)

      // Clear cart and coupon
      localStorage.removeItem('hygena_cart')
      localStorage.removeItem('hygena_applied_coupon')
      window.dispatchEvent(new Event('cartUpdated'))

      // Fire Facebook Purchase event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: order.finalTotal,
          currency: 'INR',
          content_ids: order.items.map(item => item.id.toString()),
          content_type: 'product',
          num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
          contents: order.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      }
    } else {
      // No order data, redirect to home
      router.push('/')
    }
  }, [router])

  // Auto-redirect countdown for logged-in users
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
      {/* Meta Pixel Code - Purchase Completed */}
      <Script id="facebook-pixel-purchase" strategy="afterInteractive">
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
          style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=857758360478605&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-xl text-gray-600">Thank you for your purchase</p>
            {orderData.orderId && (
              <p className="text-sm text-gray-500 mt-2">
                Order ID: <span className="font-mono font-semibold text-[#D2691E]">#{orderData.orderId.slice(-8).toUpperCase()}</span>
              </p>
            )}
          </div>

          {/* Order Details Card */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#D2691E]" />
                <h2 className="text-xl font-bold">Order Details</h2>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-[#D2691E]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{orderData.subtotal}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount ({orderData.couponCode})</span>
                    <span>-₹{orderData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total Paid</span>
                  <span className="text-[#D2691E]">₹{orderData.finalTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {orderData.shippingAddress && (
            <Card className="mb-6 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#D2691E]" />
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">{orderData.customerName}</p>
                  <p className="text-gray-700 mt-1">{orderData.shippingAddress.line1}</p>
                  <p className="text-gray-700">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}
                  </p>
                  {orderData.customerPhone && (
                    <p className="text-gray-600 mt-2">Phone: {orderData.customerPhone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Info */}
          <Card className="mb-6 bg-gradient-to-r from-[#D2691E] to-[#FF8C00] text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Estimated Delivery</h3>
              <p className="text-lg">3-5 Business Days</p>
              <p className="text-sm opacity-90 mt-2">You'll receive tracking details via email</p>
            </CardContent>
          </Card>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {session ? (
              <>
                <Link href="/dashboard?tab=orders" className="flex-1">
                  <Button className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513] h-12">
                    <Package className="w-5 h-5 mr-2" />
                    View in Dashboard
                  </Button>
                </Link>
                <Link href="/shop" className="flex-1">
                  <Button variant="outline" className="w-full h-12 border-2">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/shop" className="flex-1">
                  <Button className="w-full bg-[#D2691E] text-white hover:bg-[#8B4513] h-12">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button variant="outline" className="w-full h-12 border-2">
                    Create Account to Track Order
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Auto-redirect notice for logged-in users */}
          {session && (
            <div className="mt-6 text-center p-4 bg-white rounded-lg shadow">
              <p className="text-gray-600">
                Redirecting to your dashboard in <span className="font-bold text-[#D2691E]">{countdown}</span> seconds...
              </p>
            </div>
          )}

          {/* Email Confirmation */}
          <div className="mt-8 text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-700">
              📧 A confirmation email has been sent to <span className="font-semibold">{orderData.customerEmail}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
