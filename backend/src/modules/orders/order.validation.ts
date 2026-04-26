import { z } from "zod";

export const placeOrderSchema = z.object({
  body: z.object({
    shopId: z.string().uuid(),
    addressId: z.string().uuid(),
    paymentMode: z.enum(["COD", "UPI_MANUAL", "RAZORPAY"]),
    couponCode: z.string().optional().nullable(),
    customerNotes: z.string().optional()
  })
});

export const cancelOrderSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({ reason: z.string().min(3) })
});

export const assignCaptainSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({ captainId: z.string().uuid() })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({
    status: z.enum([
      "CONFIRMED",
      "PACKING",
      "READY_FOR_PICKUP",
      "ASSIGNED_TO_CAPTAIN",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "FAILED",
      "REFUNDED"
    ]),
    remarks: z.string().optional()
  })
});

export const captainRejectSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({
    reason: z.string().min(3)
  })
});

export const captainPickedUpSchema = z.object({
  params: z.object({ orderId: z.string().uuid() })
});

export const captainDeliveredSchema = z.object({
  params: z.object({ orderId: z.string().uuid() }),
  body: z.object({
    paymentCollected: z.boolean().optional(),
    collectedAmount: z.number().positive().optional(),
    deliveryProofImage: z.string().optional()
  })
});
