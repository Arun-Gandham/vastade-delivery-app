import { z } from "zod";

export const registerDeviceSchema = z.object({
  fcmToken: z.string().min(3, "Device token is required"),
  deviceType: z.string().min(2, "Device type is required"),
});
