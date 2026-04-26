import { z } from "zod";

const productBody = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  brand: z.string().max(150).optional(),
  unit: z.string().min(1).max(50),
  unitValue: z.number().optional(),
  mrp: z.number().positive(),
  sellingPrice: z.number().positive(),
  barcode: z.string().max(100).optional(),
  imageUrl: z.string().min(1).optional()
});

export const createProductSchema = z.object({ body: productBody });
export const updateProductSchema = z.object({
  params: z.object({ productId: z.string().uuid() }),
  body: productBody.partial()
});
