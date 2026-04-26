import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
