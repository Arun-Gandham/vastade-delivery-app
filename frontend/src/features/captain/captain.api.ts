import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { CaptainProfile, Order } from "@/types/domain";

export const captainApi = {
  getMe: () => unwrapResponse<CaptainProfile>(api.get("/captains/me")),
  updateOnlineStatus: (payload: { isOnline: boolean; latitude?: number; longitude?: number }) =>
    unwrapResponse<CaptainProfile>(api.patch("/captains/me/online-status", payload)),
  updateLocation: (payload: { latitude: number; longitude: number }) =>
    unwrapResponse<CaptainProfile>(api.patch("/captains/me/location", payload)),
  orders: () => unwrapResponse<Order[]>(api.get("/captains/me/orders")),
  acceptOrder: (orderId: string) => unwrapResponse<Order>(api.post(`/captains/orders/${orderId}/accept`)),
  rejectOrder: (orderId: string, reason: string) =>
    unwrapResponse<Order>(api.post(`/captains/orders/${orderId}/reject`, { reason })),
  markPickedUp: (orderId: string) =>
    unwrapResponse<Order>(api.post(`/captains/orders/${orderId}/picked-up`, {})),
  markDelivered: (
    orderId: string,
    payload: { paymentCollected: boolean; collectedAmount?: number; deliveryProofImage?: string }
  ) => unwrapResponse<Order>(api.post(`/captains/orders/${orderId}/delivered`, payload)),
};
