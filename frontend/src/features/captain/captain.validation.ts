import { z } from "zod";

export const captainStatusSchema = z.object({
  isOnline: z.boolean(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const captainLocationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const captainDeliveredSchema = z.object({
  paymentCollected: z.boolean().default(false),
  collectedAmount: z.coerce.number().optional(),
  deliveryProofImage: z.string().optional().or(z.literal("")),
});
