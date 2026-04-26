import { z } from "zod";
import { paymentModes } from "@/constants/enums";

export const placeOrderSchema = z.object({
  shopId: z.string().min(1, "Shop is required"),
  addressId: z.string().min(1, "Address is required"),
  paymentMode: z.enum(paymentModes),
  couponCode: z.string().optional().nullable(),
  customerNotes: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, "Reason is required"),
});

export const assignCaptainSchema = z.object({
  captainId: z.string().min(1, "Captain is required"),
});

export const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
