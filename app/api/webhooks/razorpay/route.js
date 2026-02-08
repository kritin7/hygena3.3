import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  if (body.event !== "payment.captured") {
    return Response.json({ ignored: true });
  }

  const payment = body.payload.payment.entity;
  const orderId = payment.order_id;

  const order = await Order.findOne({ orderId });

  if (!order) {
    return Response.json({ error: "Order not found" });
  }

  order.paymentStatus = "paid";
  await order.save();

  const res = await fetch(`${process.env.BASE_URL}/api/delhivery/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const data = await res.json();

  order.awb = data.awb;
  order.shipmentStatus = "created";
  await order.save();

  return Response.json({ success: true });
}
