import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Coupon } from "@/types/domain";

export const couponApi = {
  validate: (payload: { shopId: string; couponCode: string; cartAmount: number }) =>
    unwrapResponse<{ discount: number; coupon?: Coupon }>(api.post("/coupons/validate", payload)),
  create: (payload: Record<string, unknown>) => unwrapResponse<Coupon>(api.post("/admin/coupons", payload)),
  update: (couponId: string, payload: Record<string, unknown>) =>
    unwrapResponse<Coupon>(api.patch(`/admin/coupons/${couponId}`, payload)),
  remove: (couponId: string) => unwrapResponse<null>(api.delete(`/admin/coupons/${couponId}`)),
};
