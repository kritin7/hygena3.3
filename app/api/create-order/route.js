import Razorpay from "razorpay";
import { getDB } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const rpOrder = await razorpay.orders.create({
    amount: body.amount * 100,
    currency: "INR",
  });

  const db = await getDB();

  await db.collection("orders").insertOne({
    orderId: rpOrder.id,
    name: body.name,
    phone: body.phone,
    address: body.address,
    pincode: body.pincode,
    amount: body.amount,
    paymentStatus: "pending",
    shipmentStatus: "not_created",
    createdAt: new Date(),
  });

  return Response.json(rpOrder);
}
