import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Razorpay event type
    const event = body.event;

    // Only create shipment on success
    if (event !== "payment.captured") {
      return NextResponse.json({ ignored: true });
    }

    const payment = body.payload.payment.entity;

    const orderData = {
      orderId: payment.order_id,
      name: payment.notes?.name,
      address: payment.notes?.address,
      pincode: payment.notes?.pincode,
      phone: payment.contact,
      amount: payment.amount / 100,
      cod: false,
    };

    // Call your existing Delhivery route
    await fetch(`${process.env.BASE_URL}/api/delhivery/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
