import { z } from "zod";

export const updateInventorySchema = z.object({
  params: z.object({
    shopId: z.string().uuid(),
    productId: z.string().uuid()
  }),
  body: z.object({
    availableStock: z.number().int().min(0).optional(),
    lowStockAlert: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional()
  })
});

export const adjustInventorySchema = z.object({
  params: z.object({
    shopId: z.string().uuid(),
    productId: z.string().uuid()
  }),
  body: z.object({
    quantity: z.number().int().min(1),
    adjustmentType: z.enum(["ADD", "REMOVE", "SET", "DAMAGED"]),
    remarks: z.string().optional()
  })
});

export const bulkInventorySchema = z.object({
  params: z.object({
    shopId: z.string().uuid()
  }),
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid(),
        availableStock: z.number().int().min(0).optional(),
        lowStockAlert: z.number().int().min(0).optional(),
        isAvailable: z.boolean().optional()
      })
    ).min(1)
  })
});
