import Razorpay from "razorpay"
import { NextResponse } from "next/server"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(req) {
  try {
    const body = await req.json()

    const order = await razorpay.orders.create({
      amount: Math.round(body.amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
