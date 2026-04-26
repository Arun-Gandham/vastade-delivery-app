import { z } from "zod";

const passwordRule = z
  .string()
  .min(8)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

export const registerCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    mobile: z.string().min(10).max(20),
    email: z.string().email().optional(),
    password: passwordRule
  })
});

export const loginSchema = z.object({
  body: z.object({
    mobile: z.string().min(10).max(20),
    password: z.string().min(8),
    deviceType: z.string().optional(),
    deviceId: z.string().optional(),
    fcmToken: z.string().optional()
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10)
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(8),
    newPassword: passwordRule
  })
});
