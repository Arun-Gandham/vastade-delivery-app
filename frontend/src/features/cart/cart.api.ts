import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Cart } from "@/types/domain";
import type { AddCartItemInput, UpdateCartItemInput } from "@/features/cart/cart.validation";

export const cartApi = {
  get: (shopId: string) => unwrapResponse<Cart>(api.get("/cart", { params: { shopId } })),
  addItem: (payload: AddCartItemInput) => unwrapResponse<Cart>(api.post("/cart/items", payload)),
  updateItem: (cartItemId: string, payload: UpdateCartItemInput) =>
    unwrapResponse<Cart>(api.patch(`/cart/items/${cartItemId}`, payload)),
  removeItem: (cartItemId: string) => unwrapResponse<Cart>(api.delete(`/cart/items/${cartItemId}`)),
  clear: (shopId: string) => unwrapResponse<null>(api.delete("/cart", { params: { shopId } })),
};
