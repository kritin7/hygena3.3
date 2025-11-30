'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge' // Import Badge
import { ArrowLeft, CheckCircle, Lock, Truck, MapPin, User, Tag } from 'lucide-react' // Added Tag icon

// Define available coupons here (In a real app, fetch these from an API)
const AVAILABLE_COUPONS = [
  { code: 'FRESH20', type: 'percentage', value: 20, minOrder: 0 }, // 20% OFF
  { code: 'WELCOME50', type: 'flat', value: 50, minOrder: 500 },     // ₹50 Flat OFF
  { code: 'FESTIVE10', type: 'percentage', value: 10, minOrder: 0 }  // 10% OFF
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Coupon State
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  })

  // Load Cart & Session Data
  useEffect(() => {
    const savedCart = localStorage.getItem('hygena_cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCartItems(items)
      // Trigger coupon calculation after setting items
      calculateBestCoupon(items)
    } else {
      router.push('/') // Redirect if cart empty
    }

    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [session, router])

  // Helper to calculate total before discount
  const getSubtotal = (items = cartItems) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Logic to find and apply the best coupon
  const calculateBestCoupon = (items) => {
    const subtotal = getSubtotal(items)
    let maxDiscount = 0
    let bestCoupon = null

    AVAILABLE_COUPONS.forEach(coupon => {
      // Check minimum order requirement
      if (subtotal < coupon.minOrder) return

      let currentDiscount = 0
      if (coupon.type === 'percentage') {
        currentDiscount = (subtotal * coupon.value) / 100
      } else if (coupon.type === 'flat') {
        currentDiscount = coupon.value
      }

      // Keep track of the best one
      if (currentDiscount > maxDiscount) {
        maxDiscount = currentDiscount
        bestCoupon = coupon
      }
    })

    // Ensure discount doesn't exceed subtotal
    if (maxDiscount > subtotal) maxDiscount = subtotal

    setDiscount(Math.round(maxDiscount))
    setAppliedCoupon(bestCoupon)
  }

  const getFinalPrice = () => {
    return getSubtotal() - discount
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      // 1. Create Order with FINAL discounted price
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getFinalPrice(), // <--- Changed to getFinalPrice
          currency: 'INR',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          user_id: session?.user?.id || null,
          items: cartItems,
          // Save discount info in the order too if needed in backend
          discount_code: appliedCoupon?.code,
          discount_amount: discount,
          shipping_address: {
            line1: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            state: formData.state
          }
        }),
      })

      const orderData = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(orderData.error)

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hygena',
        description: 'Order Payment',
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#D2691E' },
        handler: async function (response) {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
        
          if (verifyRes.ok) {
            localStorage.removeItem('hygena_cart')
            alert('Payment successful! Thank you for your order.')
            
            if (session) {
              router.push('/dashboard?tab=orders')
            } else {
              router.push('/')
            }
          } else {
            alert('Payment Verification Failed')
          }
        }
      }
      
      const razorpay = new window.Razorpay(options)
      razorpay.open()
      } catch (error) {
        console.error(error)
        alert('Payment failed to initialize')
      } finally {
        setLoading(false)
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Steps */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-[#D2691E]">Checkout</h1>
          </div>

          {/* Step 1: Contact */}
          <Card className={step === 1 ? 'border-[#D2691E] border-2' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                1. Contact Details
              </CardTitle>
            </CardHeader>
            {step === 1 && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9999999999" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <Button 
                  className="w-full bg-[#D2691E] hover:bg-[#8B4513]"
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.phone || !formData.email}
                >
                  Continue to Address
                </Button>
              </CardContent>
            )}
            {step > 1 && (
              <CardContent>
                <p className="text-sm text-gray-600">{formData.name} | {formData.phone}</p>
                <Button variant="link" onClick={() => setStep(1)} className="p-0 h-auto text-[#D2691E]">Change</Button>
              </CardContent>
            )}
          </Card>

          {/* Step 2: Address */}
          <Card className={step === 2 ? 'border-[#D2691E] border-2' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                2. Delivery Address
              </CardTitle>
            </CardHeader>
            {step === 2 && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="Flat No, Building, Street" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001" />
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#D2691E] hover:bg-[#8B4513]"
                  onClick={() => setStep(3)}
                  disabled={!formData.address || !formData.pincode}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            )}
            {step > 2 && (
              <CardContent>
                <p className="text-sm text-gray-600">{formData.address}, {formData.city} - {formData.pincode}</p>
                <Button variant="link" onClick={() => setStep(2)} className="p-0 h-auto text-[#D2691E]">Change</Button>
              </CardContent>
            )}
          </Card>

          {/* Step 3: Payment */}
          <Card className={step === 3 ? 'border-[#D2691E] border-2' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lock className="w-5 h-5 mr-2 text-gray-500" />
                3. Payment
              </CardTitle>
            </CardHeader>
            {step === 3 && (
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700 text-sm">Secure Payment by Razorpay</span>
                </div>
                <Button 
                  className="w-full bg-[#D2691E] hover:bg-[#8B4513] h-12 text-lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₹${getFinalPrice()}`}
                </Button>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>
              
              {/* Auto-applied Coupon Section */}
              {appliedCoupon && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="flex justify-between items-center text-green-700 text-sm font-medium mb-1">
                    <span className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {appliedCoupon.code} applied
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Best coupon auto-selected for you!
                  </p>
                </div>
              )}

              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center"><Truck className="w-3 h-3 mr-1" /> Shipping</span>
                <span>FREE</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#D2691E]">₹{getFinalPrice()}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <p className="text-xs text-gray-500 text-center w-full">
                Secure Checkout • 30-Day Returns
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}
