import { z } from "zod";

export const captainTaskRejectSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  })
});

export const parcelCreateSchema = z.object({
  body: z.object({
    senderName: z.string().min(2).max(150),
    senderPhone: z.string().min(10).max(20),
    pickupAddress: z.string().min(5),
    pickupLatitude: z.number().optional(),
    pickupLongitude: z.number().optional(),
    receiverName: z.string().min(2).max(150),
    receiverPhone: z.string().min(10).max(20),
    dropAddress: z.string().min(5),
    dropLatitude: z.number().optional(),
    dropLongitude: z.number().optional(),
    packageDetails: z.string().optional(),
    deliveryFee: z.number().min(0).optional()
  })
});
