import { z } from "zod";

const couponBody = z.object({
  code: z.string().min(3).max(50),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FLAT"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string(),
  validTo: z.string(),
  isActive: z.boolean().optional()
});

export const createCouponSchema = z.object({ body: couponBody });
export const updateCouponSchema = z.object({
  params: z.object({ couponId: z.string().uuid() }),
  body: couponBody.partial()
});

export const validateCouponSchema = z.object({
  body: z.object({
    shopId: z.string().uuid(),
    couponCode: z.string().min(3),
    cartAmount: z.number().positive()
  })
});
