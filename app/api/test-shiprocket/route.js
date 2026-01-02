import axios from "axios";

export async function GET() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        tokenExists: Boolean(response.data.token),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Shiprocket auth failed",
      }),
      { status: 500 }
    );
  }
}
