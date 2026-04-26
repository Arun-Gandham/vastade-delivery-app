import { z } from "zod";
import { addressTypes } from "@/constants/enums";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  houseNo: z.string().min(1, "House number is required"),
  street: z.string().min(2, "Street is required"),
  landmark: z.string().optional(),
  village: z.string().min(2, "Village is required"),
  mandal: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  addressType: z.enum(addressTypes),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
