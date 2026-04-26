import { z } from "zod";

export const manualUpiSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  transactionReference: z.string().min(3, "Reference is required"),
});
