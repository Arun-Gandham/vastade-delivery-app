import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    shopId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int().min(1)
  })
});

export const updateCartItemSchema = z.object({
  params: z.object({ cartItemId: z.string().uuid() }),
  body: z.object({
    quantity: z.number().int().min(1)
  })
});

export const deleteCartItemSchema = z.object({
  params: z.object({ cartItemId: z.string().uuid() })
});
