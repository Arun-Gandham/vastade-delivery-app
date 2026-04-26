import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { slugify } from "../../core/utils/common";
import { buildMeta, getPagination } from "../../core/utils/pagination";
import { getResolvedS3ObjectUrl, normalizeS3ObjectKey } from "../../core/utils/s3-assets";
import { productRepository } from "./product.repository";
import { ProductCreateInput, ProductUpdateInput } from "./product.types";

const mapCategorySummary = async (category?: { imageUrl?: string | null } | null) => {
  if (!category) {
    return category;
  }

  const imageKey = normalizeS3ObjectKey(category.imageUrl);
  return {
    ...category,
    imageKey,
    imageUrl: await getResolvedS3ObjectUrl(imageKey)
  };
};

const mapProductResponse = async <T extends { imageUrl?: string | null; category?: { imageUrl?: string | null } | null }>(
  product: T
) => {
  const imageKey = normalizeS3ObjectKey(product.imageUrl);
  return {
    ...product,
    imageKey,
    imageUrl: await getResolvedS3ObjectUrl(imageKey),
    category: await mapCategorySummary(product.category)
  };
};

export const productService = {
  async create(input: ProductCreateInput) {
    const product = await productRepository.create({
      data: {
        ...input,
        imageUrl: normalizeS3ObjectKey(input.imageUrl),
        slug: slugify(String(input.name))
      }
    });
    return mapProductResponse(product);
  },
  async list(query: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    categoryId?: string;
    shopId?: string;
  }) {
    const { page, limit, skip } = getPagination(query.page, query.limit);
    const [items, total] = await productRepository.list({
      ...query,
      skip,
      take: limit
    });

    return {
      items: await Promise.all(items.map(async (item) => {
        const inventory = Array.isArray(item.inventory) ? item.inventory[0] : undefined;
        const imageKey = normalizeS3ObjectKey(item.imageUrl);
        return {
          id: item.id,
          name: item.name,
          categoryId: item.categoryId,
          brand: item.brand,
          unit: item.unitValue ? `${item.unitValue} ${item.unit}` : item.unit,
          mrp: Number(item.mrp),
          sellingPrice: Number(item.sellingPrice),
          imageKey,
          imageUrl: await getResolvedS3ObjectUrl(imageKey),
          availableStock: inventory?.availableStock ?? null,
          isAvailable: inventory?.isAvailable ?? item.isActive
        };
      })),
      meta: buildMeta(page, limit, total)
    };
  },
  async details(productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError("Product not found", StatusCodes.NOT_FOUND, ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    return mapProductResponse(product);
  },
  async shopDetails(productId: string, shopId: string) {
    const product = await productRepository.findByIdForShop(productId, shopId);
    if (!product) {
      throw new AppError("Product not found", StatusCodes.NOT_FOUND, ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    const inventory = product.inventory[0];
    return mapProductResponse({
      ...product,
      availableStock: inventory?.availableStock ?? 0,
      isAvailable: inventory?.isAvailable ?? false
    });
  },
  async update(productId: string, input: ProductUpdateInput) {
    await this.details(productId);
    const updated = await productRepository.update(productId, {
      ...input,
      ...(Object.prototype.hasOwnProperty.call(input, "imageUrl")
        ? { imageUrl: normalizeS3ObjectKey(input.imageUrl) }
        : {}),
      ...(input.name ? { slug: slugify(String(input.name)) } : {})
    });
    return mapProductResponse(updated);
  },
  async remove(productId: string) {
    return this.update(productId, { isActive: false });
  }
};
