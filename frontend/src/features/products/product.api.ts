import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Product } from "@/types/domain";
import type { ProductInput } from "@/features/products/product.validation";
import { optionalTrimmedString } from "@/lib/utils/payload";

const sanitizeProductPayload = (payload: Partial<ProductInput>) => ({
  ...payload,
  categoryId: payload.categoryId?.trim(),
  name: payload.name?.trim(),
  description: optionalTrimmedString(payload.description),
  brand: optionalTrimmedString(payload.brand),
  unit: payload.unit?.trim(),
  barcode: optionalTrimmedString(payload.barcode),
  imageUrl: optionalTrimmedString(payload.imageUrl),
});

export const productApi = {
  list: (params?: {
    shopId?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => unwrapResponse<Product[]>(api.get("/products", { params })),
  details: (productId: string, shopId?: string) =>
    unwrapResponse<Product>(api.get(`/products/${productId}`, { params: shopId ? { shopId } : undefined })),
  create: (payload: ProductInput) =>
    unwrapResponse<Product>(api.post("/admin/products", sanitizeProductPayload(payload))),
  update: (productId: string, payload: Partial<ProductInput>) =>
    unwrapResponse<Product>(api.patch(`/admin/products/${productId}`, sanitizeProductPayload(payload))),
  remove: (productId: string) => unwrapResponse<null>(api.delete(`/admin/products/${productId}`)),
};
