import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    email: z.string().email().optional(),
    profileImage: z.string().min(1).optional()
  })
});
