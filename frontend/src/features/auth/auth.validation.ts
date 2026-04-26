import { z } from "zod";
import { vehicleTypes } from "@/constants/enums";

export const loginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  deviceType: z.string().default("WEB"),
  fcmToken: z.string().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[a-z]/, "Include one lowercase letter")
      .regex(/\d/, "Include one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const captainRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  vehicleType: z.enum(vehicleTypes),
  vehicleNumber: z.string().min(4, "Vehicle number is required"),
  licenseNumber: z.string().min(4, "License number is required"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CaptainRegisterInput = z.infer<typeof captainRegisterSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
