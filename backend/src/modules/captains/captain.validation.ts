import { z } from "zod";

export const registerCaptainSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    mobile: z.string().min(10).max(20),
    password: z.string().min(8),
    vehicleType: z.enum(["BIKE", "CYCLE", "AUTO", "WALKING"]),
    vehicleNumber: z.string().optional(),
    licenseNumber: z.string().optional()
  })
});

export const captainStatusSchema = z.object({
  body: z.object({
    isOnline: z.boolean(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});

export const captainLocationSchema = z.object({
  body: z.object({
    latitude: z.number(),
    longitude: z.number()
  })
});
