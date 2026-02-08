import Razorpay from "razorpay";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const rpOrder = await razorpay.orders.create({
    amount: body.amount * 100,
    currency: "INR",
  });

  await Order.create({
    orderId: rpOrder.id,
    name: body.name,
    phone: body.phone,
    address: body.address,
    pincode: body.pincode,
    amount: body.amount,
  });

  return Response.json(rpOrder);
}
