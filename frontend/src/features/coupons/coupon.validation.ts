import { z } from "zod";
import { discountTypes } from "@/constants/enums";

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  description: z.string().optional(),
  discountType: z.enum(discountTypes),
  value: z.coerce.number().min(0.01, "Value is required"),
  minOrderAmount: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  validFrom: z.string().min(1, "Start date is required"),
  validTo: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
});

export const validateCouponSchema = z.object({
  shopId: z.string().min(1, "Shop is required"),
  couponCode: z.string().min(1, "Coupon code is required"),
  cartAmount: z.coerce.number().min(0),
});
