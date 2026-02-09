import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const order = await razorpay.orders.create({
      amount: Math.round(body.amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    console.error('CREATE ORDER ERROR:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
