if (route === '/razorpay/create-order' && method === 'POST') {
  const body = await request.json()

  const razorpayInstance = initializeRazorpay()

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.round(body.amount * 100),
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  })

  return handleCORS(NextResponse.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID
  }))
}
