import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Category } from "@/types/domain";
import type { CategoryInput } from "@/features/categories/category.validation";
import { nullableTrimmedString, optionalTrimmedString } from "@/lib/utils/payload";

const sanitizeCategoryPayload = (payload: Partial<CategoryInput>) => ({
  ...payload,
  name: payload.name?.trim(),
  imageUrl: optionalTrimmedString(payload.imageUrl),
  parentId: "parentId" in payload ? nullableTrimmedString(payload.parentId) : payload.parentId,
});

export const categoryApi = {
  list: () => unwrapResponse<Category[]>(api.get("/categories")),
  create: (payload: CategoryInput) =>
    unwrapResponse<Category>(api.post("/admin/categories", sanitizeCategoryPayload(payload))),
  update: (categoryId: string, payload: Partial<CategoryInput>) =>
    unwrapResponse<Category>(api.patch(`/admin/categories/${categoryId}`, sanitizeCategoryPayload(payload))),
  remove: (categoryId: string) => unwrapResponse<null>(api.delete(`/admin/categories/${categoryId}`)),
};
