import { prisma } from "../../database/prisma";

export const categoryRepository = {
  create: prisma.category.create.bind(prisma.category),
  listActive: () =>
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
  findById: (id: string) =>
    prisma.category.findUnique({
      where: { id }
    }),
  update: (id: string, data: Record<string, unknown>) =>
    prisma.category.update({
      where: { id },
      data
    })
};
