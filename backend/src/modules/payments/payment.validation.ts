import { z } from "zod";

export const manualUpiMarkPaidSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    transactionReference: z.string().min(3)
  })
});

export const razorpayCreateOrderSchema = z.object({
  body: z.object({
    orderId: z.string().uuid()
  })
});

export const razorpayVerifySchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    providerOrderId: z.string().min(3),
    providerPaymentId: z.string().min(3),
    providerSignature: z.string().optional()
  })
});
