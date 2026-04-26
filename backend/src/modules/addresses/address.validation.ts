import { z } from "zod";

const addressBody = z.object({
  fullName: z.string().min(2).max(150),
  mobile: z.string().min(10).max(20),
  houseNo: z.string().min(1),
  street: z.string().min(1),
  landmark: z.string().optional(),
  village: z.string().min(2).max(150),
  mandal: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().min(4).max(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  addressType: z.enum(["HOME", "WORK", "OTHER"]),
  isDefault: z.boolean().optional()
});

export const createAddressSchema = z.object({ body: addressBody });
export const updateAddressSchema = z.object({
  params: z.object({ addressId: z.string().uuid() }),
  body: addressBody.partial()
});
export const addressIdSchema = z.object({
  params: z.object({ addressId: z.string().uuid() })
});
