import { z } from "zod";
import { stockAdjustmentTypes } from "@/constants/enums";

export const inventoryUpdateSchema = z.object({
  availableStock: z.coerce.number().min(0, "Stock cannot be negative"),
  lowStockAlert: z.coerce.number().min(0, "Low stock alert cannot be negative"),
  isAvailable: z.boolean(),
});

export const stockAdjustSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  adjustmentType: z.enum(stockAdjustmentTypes),
  remarks: z.string().min(2, "Remarks are required"),
});
