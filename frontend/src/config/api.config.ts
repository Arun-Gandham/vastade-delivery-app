export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 30000,
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Quick Commerce",
  defaultLatitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || 0),
  defaultLongitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || 0),
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91-00000-00000",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
};
