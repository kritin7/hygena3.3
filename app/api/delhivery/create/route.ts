import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const response = await fetch(
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
              payment_mode: order.cod ? "COD" : "Prepaid",
              total_amount: order.amount,
              weight: 0.2,
              pickup_location: process.env.DELHIVERY_PICKUP_LOCATION,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const awb = data?.packages?.[0]?.waybill;

    return NextResponse.json({ success: true, awb });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}
