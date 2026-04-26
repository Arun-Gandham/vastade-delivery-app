import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Order } from "@/types/domain";
import type { PlaceOrderInput } from "@/features/orders/order.validation";

export const orderApi = {
  placeOrder: (payload: PlaceOrderInput) => unwrapResponse<Order>(api.post("/orders", payload)),
  myOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    unwrapResponse<Order[]>(api.get("/orders/my", { params })),
  details: (orderId: string) => unwrapResponse<Order>(api.get(`/orders/${orderId}`)),
  cancelByCustomer: (orderId: string, reason: string) =>
    unwrapResponse<Order>(api.post(`/orders/${orderId}/cancel`, { reason })),
  shopOrders: (shopId: string) => unwrapResponse<Order[]>(api.get(`/shop-owner/shops/${shopId}/orders`)),
  shopOrderDetails: (shopId: string, orderId: string) =>
    unwrapResponse<Order>(api.get(`/shop-owner/shops/${shopId}/orders/${orderId}`)),
  confirmOrder: (orderId: string) => unwrapResponse<Order>(api.post(`/shop-owner/orders/${orderId}/confirm`)),
  markPacking: (orderId: string) =>
    unwrapResponse<Order>(api.post(`/shop-owner/orders/${orderId}/mark-packing`)),
  readyForPickup: (orderId: string) =>
    unwrapResponse<Order>(api.post(`/shop-owner/orders/${orderId}/ready-for-pickup`)),
  cancelByShop: (orderId: string, reason: string) =>
    unwrapResponse<Order>(api.post(`/shop-owner/orders/${orderId}/cancel`, { reason })),
  assignCaptainByShop: (orderId: string, captainId: string) =>
    unwrapResponse<Order>(api.post(`/shop-owner/orders/${orderId}/assign-captain`, { captainId })),
  adminOrders: () => unwrapResponse<Order[]>(api.get("/admin/orders")),
  adminOrderDetails: (orderId: string) => unwrapResponse<Order>(api.get(`/admin/orders/${orderId}`)),
  adminUpdateStatus: (orderId: string, status: string, remarks?: string) =>
    unwrapResponse<Order>(api.patch(`/admin/orders/${orderId}/status`, { status, remarks })),
  adminAssignCaptain: (orderId: string, captainId: string) =>
    unwrapResponse<Order>(api.post(`/admin/orders/${orderId}/assign-captain`, { captainId })),
  availableCaptains: () => unwrapResponse<Array<{ id: string; user: { name: string; mobile: string } }>>(api.get("/admin/captains/available")),
};
