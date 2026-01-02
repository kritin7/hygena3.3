import axios from "axios";

export async function GET() {
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  return Response.json({
    success: true,
    tokenExists: !!response.data.token,
  });
}
