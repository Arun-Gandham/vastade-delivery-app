import { UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { shopRepository } from "./shop.repository";
import { ShopCreateInput, ShopUpdateInput } from "./shop.types";

export const shopService = {
  async create(input: ShopCreateInput) {
    return shopRepository.create({ data: input });
  },
  async nearby(village?: string, pincode?: string) {
    return shopRepository.listNearby(village, pincode);
  },
  async details(shopId: string) {
    const shop = await shopRepository.findById(shopId);
    if (!shop) {
      throw new AppError("Shop not found", StatusCodes.NOT_FOUND, ERROR_CODES.SHOP_NOT_FOUND);
    }
    return shop;
  },
  async update(shopId: string, input: ShopUpdateInput) {
    await this.details(shopId);
    return shopRepository.update(shopId, input);
  },
  async assertShopAccess(userId: string, role: UserRole, shopId: string) {
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      await this.details(shopId);
      return;
    }

    const [owned, managed] = await Promise.all([
      shopRepository.listOwnedShopIds(userId),
      role === UserRole.STORE_MANAGER ? shopRepository.listManagedShopIds(userId) : Promise.resolve([])
    ]);

    const shopIds = new Set([
      ...owned.map((shop) => shop.id),
      ...managed.map((shop) => shop.shopId)
    ]);

    if (!shopIds.has(shopId)) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }
  },
  async updateOpenStatus(userId: string, shopId: string, isOpen: boolean) {
    await this.assertShopAccess(userId, UserRole.SHOP_OWNER, shopId);
    return shopRepository.update(shopId, { isOpen });
  }
};
