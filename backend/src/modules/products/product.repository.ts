import { prisma } from "../../database/prisma";

export const productRepository = {
  create: prisma.product.create.bind(prisma.product),
  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: { category: true }
    }),
  findByIdForShop: (id: string, shopId: string) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: {
          where: { shopId }
        }
      }
    }),
  update: (id: string, data: Record<string, unknown>) =>
    prisma.product.update({
      where: { id },
      data
    }),
  list: async (params: {
    search?: string;
    categoryId?: string;
    shopId?: string;
    skip: number;
    take: number;
  }) => {
    const where = {
      isActive: true,
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" as const } },
              { brand: { contains: params.search, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    return Promise.all([
      prisma.product.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          inventory: params.shopId
            ? {
                where: { shopId: params.shopId }
              }
            : false
        }
      }),
      prisma.product.count({ where })
    ]);
  }
};
