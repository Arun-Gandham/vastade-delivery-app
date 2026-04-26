import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { ShopInventoryItem } from "@/types/domain";

export const inventoryApi = {
  list: (shopId: string) =>
    unwrapResponse<ShopInventoryItem[]>(api.get(`/shop-owner/shops/${shopId}/inventory`)),
  update: (
    shopId: string,
    productId: string,
    payload: { availableStock: number; lowStockAlert: number; isAvailable: boolean }
  ) => unwrapResponse<ShopInventoryItem>(api.put(`/shop-owner/shops/${shopId}/inventory/${productId}`, payload)),
  adjust: (
    shopId: string,
    productId: string,
    payload: { quantity: number; adjustmentType: string; remarks: string }
  ) =>
    unwrapResponse<ShopInventoryItem>(api.post(`/shop-owner/shops/${shopId}/inventory/${productId}/adjust`, payload)),
  bulkCreate: (shopId: string, payload: Array<{ productId: string; availableStock: number; lowStockAlert?: number }>) =>
    unwrapResponse<ShopInventoryItem[]>(api.post(`/shop-owner/shops/${shopId}/inventory/bulk`, payload)),
};
