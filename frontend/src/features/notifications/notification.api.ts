import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Notification } from "@/types/domain";

export const notificationApi = {
  list: () => unwrapResponse<Notification[]>(api.get("/notifications")),
  markRead: (notificationId: string) =>
    unwrapResponse<Notification>(api.patch(`/notifications/${notificationId}/read`)),
  registerDevice: (payload: { fcmToken: string; deviceType: string }) =>
    unwrapResponse<null>(api.post("/notifications/register-device", payload)),
};
