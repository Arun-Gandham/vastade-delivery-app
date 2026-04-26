import { z } from "zod";

const categoryBody = z.object({
  name: z.string().min(2).max(150),
  imageUrl: z.string().min(1).optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).optional()
});

export const createCategorySchema = z.object({ body: categoryBody });
export const updateCategorySchema = z.object({
  params: z.object({ categoryId: z.string().uuid() }),
  body: categoryBody.partial()
});
