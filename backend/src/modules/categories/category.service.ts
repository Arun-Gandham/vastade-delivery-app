import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { slugify } from "../../core/utils/common";
import { getResolvedS3ObjectUrl, normalizeS3ObjectKey } from "../../core/utils/s3-assets";
import { categoryRepository } from "./category.repository";
import { CategoryCreateInput, CategoryUpdateInput } from "./category.types";

const mapCategoryResponse = async <T extends { imageUrl?: string | null }>(category: T) => {
  const imageKey = normalizeS3ObjectKey(category.imageUrl);
  return {
    ...category,
    imageKey,
    imageUrl: await getResolvedS3ObjectUrl(imageKey)
  };
};

export const categoryService = {
  async create(input: CategoryCreateInput) {
    const category = await categoryRepository.create({
      data: {
        ...input,
        imageUrl: normalizeS3ObjectKey(input.imageUrl),
        slug: slugify(String(input.name))
      }
    });
    return mapCategoryResponse(category);
  },
  async list() {
    const items = await categoryRepository.listActive();
    return Promise.all(items.map((item) => mapCategoryResponse(item)));
  },
  async update(categoryId: string, input: CategoryUpdateInput) {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND, ERROR_CODES.CATEGORY_NOT_FOUND);
    }

    const updated = await categoryRepository.update(categoryId, {
      ...input,
      ...(Object.prototype.hasOwnProperty.call(input, "imageUrl")
        ? { imageUrl: normalizeS3ObjectKey(input.imageUrl) }
        : {}),
      ...(input.name ? { slug: slugify(String(input.name)) } : {})
    });
    return mapCategoryResponse(updated);
  },
  async remove(categoryId: string) {
    return this.update(categoryId, { isActive: false });
  }
};
