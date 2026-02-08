import Razorpay from "razorpay";
import { getDB } from "@/lib/db";

let razorpay;

function initializeRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  return razorpay;
}

export async function POST(req) {
  const body = await req.json();

  const razorpayInstance = initializeRazorpay();

  // 1️⃣ Create Razorpay order
  const rpOrder = await razorpayInstance.orders.create({
    amount: body.amount * 100,
    currency: "INR",
  });

  // 2️⃣ Save order to Mongo
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

  // 3️⃣ Return Razorpay order
  return Response.json(rpOrder);
}
