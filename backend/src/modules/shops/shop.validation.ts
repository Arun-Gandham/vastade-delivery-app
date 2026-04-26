import { z } from "zod";

export const createShopSchema = z.object({
  body: z.object({
    ownerId: z.string().uuid(),
    name: z.string().min(2).max(200),
    mobile: z.string().min(10).max(20),
    email: z.string().email().optional(),
    address: z.string().min(2),
    village: z.string().min(2).max(150),
    pincode: z.string().min(4).max(10),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    openingTime: z.string().optional(),
    closingTime: z.string().optional()
  })
});

export const updateShopSchema = z.object({
  params: z.object({ shopId: z.string().uuid() }),
  body: createShopSchema.shape.body.partial()
});

export const toggleOpenSchema = z.object({
  params: z.object({ shopId: z.string().uuid() }),
  body: z.object({ isOpen: z.boolean() })
});
