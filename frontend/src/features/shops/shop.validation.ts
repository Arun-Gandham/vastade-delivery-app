import { z } from "zod";

export const shopSchema = z.object({
  ownerId: z.string().uuid("Enter a valid owner ID"),
  name: z.string().min(2, "Shop name is required"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().min(2, "Address is required"),
  village: z.string().min(2, "Village is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  openingTime: z.string().min(1, "Opening time is required"),
  closingTime: z.string().min(1, "Closing time is required"),
});

export const shopOpenStatusSchema = z.object({
  isOpen: z.boolean(),
});

export type ShopInput = z.infer<typeof shopSchema>;
