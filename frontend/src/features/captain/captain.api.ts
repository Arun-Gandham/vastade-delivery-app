import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { CaptainProfile, DeliveryTask } from "@/types/domain";

export const captainApi = {
  getMe: () => unwrapResponse<CaptainProfile>(api.get("/captain/me")),
  updateOnlineStatus: (payload: { isOnline: boolean; latitude?: number; longitude?: number }) =>
    payload.isOnline
      ? unwrapResponse<CaptainProfile>(
          api.post("/captain/go-online", {
            latitude: payload.latitude,
            longitude: payload.longitude,
          })
        )
      : unwrapResponse<CaptainProfile>(api.post("/captain/go-offline", {})),
  updateLocation: (payload: { latitude: number; longitude: number }) =>
    unwrapResponse<CaptainProfile>(api.post("/captain/location/update", payload)),
  tasks: () => unwrapResponse<DeliveryTask[]>(api.get("/captain/tasks")),
  acceptTask: (taskId: string) => unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/accept`)),
  rejectTask: (taskId: string, reason: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/reject`, { reason })),
  markReachedPickup: (taskId: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/reached-pickup`)),
  markPickedUp: (taskId: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/picked-up`)),
  markReachedDrop: (taskId: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/reached-drop`)),
  markDelivered: (taskId: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/delivered`)),
  markFailed: (taskId: string) =>
    unwrapResponse<DeliveryTask>(api.post(`/captain/tasks/${taskId}/failed`)),
};
