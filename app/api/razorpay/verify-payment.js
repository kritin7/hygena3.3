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

  try {
    // 🔥 CALL DELHIVERY HERE
    const shipmentRes = await fetch(process.env.DELHIVERY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`
      },
      body: JSON.stringify({
        order_id: body.razorpay_order_id,
        name: body.customer_name,
        phone: body.customer_phone,
        address: body.address,
        payment_mode: "Prepaid"
      })
    })

    const shipmentData = await shipmentRes.json()

    console.log("Delhivery Response:", shipmentData)

    return NextResponse.json({
      success: true,
      shipment: shipmentData
    })

  } catch (err) {
    console.error("Shipment creation failed:", err)

    return NextResponse.json({
      success: true, // payment succeeded
      shipment_error: true
    })
  }
}
