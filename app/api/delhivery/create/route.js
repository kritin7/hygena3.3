export async function POST(req) {
  const order = await req.json();

  const res = await fetch(
    `${process.env.DELHIVERY_BASE_URL}/api/cmu/create.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.DELHIVERY_API_KEY}`,
      },
      body: JSON.stringify({
        shipments: [
          {
            name: order.name,
            add: order.address,
            pin: order.pincode,
            phone: order.phone,
            order: order.orderId,
            payment_mode: "Prepaid",
            total_amount: order.amount,
            weight: 0.2,
            pickup_location: process.env.DELHIVERY_PICKUP_LOCATION,
          },
        ],
      }),
    }
  );

  const data = await res.json();

  const awb = data?.packages?.[0]?.waybill;

  return Response.json({ awb });
}
