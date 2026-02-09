if (route === '/razorpay/verify-payment' && method === 'POST') {
  const body = await request.json()

  const text = body.razorpay_order_id + "|" + body.razorpay_payment_id

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex")

  if (expected !== body.razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
