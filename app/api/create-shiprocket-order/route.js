import axios from "axios";
import { getShiprocketToken } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    const token = await getShiprocketToken();
    const order = await req.json();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: order.orderId,
        order_date: new Date().toISOString().slice(0, 10),

        pickup_location: "Primary",

        billing_customer_name: order.name,
        billing_address: order.address,
        billing_city: order.city,
        billing_pincode: order.pincode,
        billing_state: order.state,
        billing_country: "India",
        billing_email: order.email,
        billing_phone: order.phone,

        shipping_is_billing: true,

        payment_method: order.paymentMethod, // PREPAID or COD
        sub_total: order.amount,

        order_items: [
          {
            name: "Hygena Helmet Deodorant",
            sku: "HYGENA-HELMET-100ML",
            units: order.quantity,
            selling_price: order.amount,
          },
        ],

        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return Response.json({
      success: true,
      shiprocketOrder: response.data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
