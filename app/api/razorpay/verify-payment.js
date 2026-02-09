// Verify Razorpay Payment + Create Delhivery Shipment
if (route === '/razorpay/verify-payment' && method === 'POST') {
  const body = await request.json()

  const text = body.razorpay_order_id + "|" + body.razorpay_payment_id

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex")

  // ❌ Invalid signature
  if (expected !== body.razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    // =========================
    // 🚚 CREATE DELHIVERY SHIPMENT
    // =========================

    const shipmentPayload = {
      shipments: [
        {
          name: body.customer_name || "Customer",
          phone: body.customer_phone,
          add: body.shipping_address?.line1,
          city: body.shipping_address?.city,
          state: body.shipping_address?.state,
          pin: body.shipping_address?.pincode,
          country: "India",

          order: body.razorpay_order_id,
          payment_mode: "Prepaid",

          total_amount: body.amount,

          quantity: body.items?.length || 1,

          weight: 0.5
        }
      ],
      pickup_location: {
        name: "Primary"
      }
    }

    const delhiveryRes = await fetch(
      `${process.env.DELHIVERY_BASE_URL}/api/cmu/create.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`
        },
        body: JSON.stringify(shipmentPayload)
      }
    )

    const delhiveryData = await delhiveryRes.json()

    const awb =
      delhiveryData?.packages?.[0]?.waybill ||
      delhiveryData?.packages?.[0]?.awb ||
      null

    console.log("Delhivery Response:", delhiveryData)

    return NextResponse.json({
      success: true,
      awb
    })
  } catch (err) {
    console.error("Shipment creation failed:", err)

    return NextResponse.json({
      success: true, // payment still success
      shipment_error: "Shipment failed but payment captured"
    })
  }
}
