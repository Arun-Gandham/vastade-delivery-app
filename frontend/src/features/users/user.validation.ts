import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  profileImage: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
