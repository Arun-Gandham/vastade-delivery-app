import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const inventoryRepository = {
  listByShop: (shopId: string) =>
    prisma.shopInventory.findMany({
      where: { shopId },
      include: { product: true },
      orderBy: { updatedAt: "desc" }
    }),
  findByShopProduct: (shopId: string, productId: string, tx?: Prisma.TransactionClient) =>
    db(tx).shopInventory.findUnique({
      where: {
        shopId_productId: {
          shopId,
          productId
        }
      },
      include: {
        product: true
      }
    }),
  upsert: (
    shopId: string,
    productId: string,
    data: { availableStock?: number; lowStockAlert?: number; isAvailable?: boolean },
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).shopInventory.upsert({
      where: { shopId_productId: { shopId, productId } },
      create: {
        shopId,
        productId,
        availableStock: data.availableStock ?? 0,
        lowStockAlert: data.lowStockAlert ?? 5,
        isAvailable: data.isAvailable ?? true
      },
      update: data
    }),
  bulkUpsert: (
    shopId: string,
    items: { productId: string; availableStock?: number; lowStockAlert?: number; isAvailable?: boolean }[],
    tx?: Prisma.TransactionClient
  ) =>
    Promise.all(
      items.map((item) =>
        db(tx).shopInventory.upsert({
          where: { shopId_productId: { shopId, productId: item.productId } },
          create: {
            shopId,
            productId: item.productId,
            availableStock: item.availableStock ?? 0,
            lowStockAlert: item.lowStockAlert ?? 5,
            isAvailable: item.isAvailable ?? true
          },
          update: {
            availableStock: item.availableStock,
            lowStockAlert: item.lowStockAlert,
            isAvailable: item.isAvailable
          }
        })
      )
    ),
  update: (id: string, data: Record<string, unknown>, tx?: Prisma.TransactionClient) =>
    db(tx).shopInventory.update({
      where: { id },
      data
    }),
  createMovement: (data: Prisma.StockMovementUncheckedCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).stockMovement.create({ data })
};
