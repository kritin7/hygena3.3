import { getDB } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();

  if (body.event !== "payment.captured") {
    return Response.json({ ignored: true });
  }

  const orderId = body.payload.payment.entity.order_id;

  const db = await getDB();

  const order = await db.collection("orders").findOne({ orderId });

  if (!order) return Response.json({ error: "Order not found" });

  await db.collection("orders").updateOne(
    { orderId },
    { $set: { paymentStatus: "paid" } }
  );

  const res = await fetch(`${process.env.BASE_URL}/api/delhivery/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const { awb } = await res.json();

  await db.collection("orders").updateOne(
    { orderId },
    { $set: { awb, shipmentStatus: "created" } }
  );

  return Response.json({ success: true });
}
