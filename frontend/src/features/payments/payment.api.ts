import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";

export const paymentApi = {
  createRazorpayOrder: (payload: Record<string, unknown>) =>
    unwrapResponse<Record<string, unknown>>(api.post("/payments/razorpay/create-order", payload)),
  verifyRazorpay: (payload: Record<string, unknown>) =>
    unwrapResponse<Record<string, unknown>>(api.post("/payments/razorpay/verify", payload)),
  markManualUpiPaid: (payload: { orderId: string; transactionReference: string }) =>
    unwrapResponse<Record<string, unknown>>(api.post("/payments/manual-upi/mark-paid", payload)),
};
