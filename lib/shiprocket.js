import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;

export async function getShiprocketToken() {
  // Reuse token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  cachedToken = response.data.token;
  // Shiprocket tokens usually last hours; keep buffer
  tokenExpiry = Date.now() + 1000 * 60 * 60 * 8; // 8 hours

  return cachedToken;
}
