import { z } from "zod";

export const createImageUploadSchema = z.object({
  body: z.object({
    filename: z.string().min(1).max(255),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    fileSize: z.coerce.number().int().positive(),
    folder: z.string().min(1).max(100).optional()
  })
});
