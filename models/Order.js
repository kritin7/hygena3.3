import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: String,

  name: String,
  phone: String,
  address: String,
  pincode: String,
  amount: Number,

  paymentStatus: {
    type: String,
    default: "pending",
  },

  shipmentStatus: {
    type: String,
    default: "not_created",
  },

  awb: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
