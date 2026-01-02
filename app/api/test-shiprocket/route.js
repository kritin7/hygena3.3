import axios from "axios";

export async function GET() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
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
        shiprocketError:
          error?.response?.data || error.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}
