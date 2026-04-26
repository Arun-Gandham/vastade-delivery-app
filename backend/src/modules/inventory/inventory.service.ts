import { Prisma, StockMovementType, UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { prisma } from "../../database/prisma";
import { shopService } from "../shops/shop.service";
import { inventoryRepository } from "./inventory.repository";
import { InventoryAdjustmentType } from "./inventory.types";

const computeStock = (
  currentStock: number,
  damagedStock: number,
  type: InventoryAdjustmentType,
  quantity: number
) => {
  switch (type) {
    case "ADD":
      return { availableStock: currentStock + quantity, damagedStock };
    case "REMOVE":
      return { availableStock: currentStock - quantity, damagedStock };
    case "SET":
      return { availableStock: quantity, damagedStock };
    case "DAMAGED":
      return { availableStock: currentStock - quantity, damagedStock: damagedStock + quantity };
  }
};

export const inventoryService = {
  async list(shopId: string) {
    await shopService.details(shopId);
    return inventoryRepository.listByShop(shopId);
  },

  async upsert(shopId: string, productId: string, input: { availableStock?: number; lowStockAlert?: number; isAvailable?: boolean }) {
    await shopService.details(shopId);
    return inventoryRepository.upsert(shopId, productId, input);
  },
  async bulkUpsert(
    shopId: string,
    items: { productId: string; availableStock?: number; lowStockAlert?: number; isAvailable?: boolean }[]
  ) {
    await shopService.details(shopId);
    return prisma.$transaction((tx) => inventoryRepository.bulkUpsert(shopId, items, tx));
  },
  async assertAccess(userId: string, role: UserRole, shopId: string) {
    await shopService.assertShopAccess(userId, role, shopId);
  },

  async adjust(
    shopId: string,
    productId: string,
    input: { quantity: number; adjustmentType: InventoryAdjustmentType; remarks?: string },
    userId: string
  ) {
    await shopService.details(shopId);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const inventory = await inventoryRepository.findByShopProduct(shopId, productId, tx);
      if (!inventory) {
        throw new AppError("Inventory not found", StatusCodes.NOT_FOUND, ERROR_CODES.PRODUCT_NOT_FOUND);
      }

      const next = computeStock(
        inventory.availableStock,
        inventory.damagedStock,
        input.adjustmentType,
        input.quantity
      );

      if (next.availableStock < 0) {
        throw new AppError(
          "Insufficient stock",
          StatusCodes.BAD_REQUEST,
          ERROR_CODES.INSUFFICIENT_STOCK
        );
      }

      const updated = await inventoryRepository.update(
        inventory.id,
        {
          availableStock: next.availableStock,
          damagedStock: next.damagedStock
        },
        tx
      );

      await inventoryRepository.createMovement(
        {
          shopId,
          productId,
          movementType:
            input.adjustmentType === "ADD"
              ? StockMovementType.STOCK_ADDED
              : input.adjustmentType === "DAMAGED"
                ? StockMovementType.STOCK_DAMAGED
                : StockMovementType.STOCK_ADJUSTED,
          quantity: input.quantity,
          beforeStock: inventory.availableStock,
          afterStock: updated.availableStock,
          remarks: input.remarks,
          createdBy: userId
        },
        tx
      );

      return updated;
    });
  }
};
