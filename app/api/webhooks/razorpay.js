if (route === '/webhooks/razorpay' && method === 'POST') {
  const payload = await request.json()

  const event = payload.event

  if (event === 'payment.captured') {

    const payment = payload.payload.payment.entity

    const customerName = payment.notes.customer_name
    const phone = payment.notes.customer_phone
    const email = payment.notes.customer_email
    const amount = payment.amount / 100

    // 🔥 CREATE DELHIVERY SHIPMENT HERE
    await fetch('https://track.delhivery.com/api/cmu/create.json', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shipments: [{
          name: customerName,
          phone: phone,
          add: payment.notes.address || '',
          city: payment.notes.city || '',
          state: payment.notes.state || '',
          pin: payment.notes.pincode || '',
          country: 'India',
          order: payment.order_id,
          payment_mode: 'Prepaid',
          total_amount: amount,
          weight: 0.2,
          quantity: 1
        }]
      })
    })
  }

  return NextResponse.json({ ok: true })
}
