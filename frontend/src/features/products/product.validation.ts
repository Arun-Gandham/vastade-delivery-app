import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().uuid("Select a valid category"),
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  unitValue: z.coerce.number().min(0).optional(),
  mrp: z.coerce.number().min(0.01, "MRP is required"),
  sellingPrice: z.coerce.number().min(0.01, "Selling price is required"),
  barcode: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;
