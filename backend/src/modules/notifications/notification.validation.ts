import { z } from "zod";

export const registerDeviceSchema = z.object({
  body: z.object({
    fcmToken: z.string().min(3),
    deviceType: z.string().min(2)
  })
});

export const notificationIdSchema = z.object({
  params: z.object({
    notificationId: z.string().uuid()
  })
});
