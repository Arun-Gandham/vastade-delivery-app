import { z } from "zod";

export const addCartItemSchema = z.object({
  shopId: z.string().min(1, "Shop is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
