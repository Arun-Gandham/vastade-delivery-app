import { ShopUpdateInput } from "./shop.types";
import { prisma } from "../../database/prisma";

export const shopRepository = {
  create: prisma.shop.create.bind(prisma.shop),
  listNearby: (village?: string, pincode?: string) =>
    prisma.shop.findMany({
      where: {
        isActive: true,
        ...(village ? { village } : {}),
        ...(pincode ? { pincode } : {})
      },
      orderBy: { createdAt: "desc" }
    }),
  findById: (id: string) =>
    prisma.shop.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true, mobile: true } } }
    }),
  update: (id: string, data: ShopUpdateInput) =>
    prisma.shop.update({
      where: { id },
      data
    }),
  listOwnedShopIds: (userId: string) =>
    prisma.shop.findMany({
      where: { ownerId: userId },
      select: { id: true }
    }),
  listManagedShopIds: (userId: string) =>
    prisma.shopStaff.findMany({
      where: { userId, isActive: true },
      select: { shopId: true }
    })
};
