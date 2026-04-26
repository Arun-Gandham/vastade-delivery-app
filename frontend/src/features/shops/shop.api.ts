import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Shop } from "@/types/domain";
import type { ShopInput } from "@/features/shops/shop.validation";
import { optionalTrimmedString } from "@/lib/utils/payload";

const sanitizeShopPayload = (payload: Partial<ShopInput>) => ({
  ...payload,
  ownerId: payload.ownerId?.trim(),
  name: payload.name?.trim(),
  mobile: payload.mobile?.trim(),
  email: optionalTrimmedString(payload.email),
  address: payload.address?.trim(),
  village: payload.village?.trim(),
  pincode: payload.pincode?.trim(),
  openingTime: optionalTrimmedString(payload.openingTime),
  closingTime: optionalTrimmedString(payload.closingTime),
});

export const shopApi = {
  nearby: (params?: { village?: string; pincode?: string }) =>
    unwrapResponse<Shop[]>(api.get("/shops/nearby", { params })),
  details: (shopId: string) => unwrapResponse<Shop>(api.get(`/shops/${shopId}`)),
  create: (payload: ShopInput) => unwrapResponse<Shop>(api.post("/admin/shops", sanitizeShopPayload(payload))),
  update: (shopId: string, payload: Partial<ShopInput>) =>
    unwrapResponse<Shop>(api.patch(`/admin/shops/${shopId}`, sanitizeShopPayload(payload))),
  updateOpenStatus: (shopId: string, isOpen: boolean) =>
    unwrapResponse<Shop>(api.patch(`/shop-owner/shops/${shopId}/open-status`, { isOpen })),
};
