import { prisma } from "../../database/prisma";

export const addressRepository = {
  create: prisma.customerAddress.create.bind(prisma.customerAddress),
  listByCustomer: (customerId: string) =>
    prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    }),
  findById: (id: string) =>
    prisma.customerAddress.findUnique({
      where: { id }
    }),
  update: (id: string, data: Record<string, unknown>) =>
    prisma.customerAddress.update({
      where: { id },
      data
    }),
  delete: (id: string) =>
    prisma.customerAddress.delete({
      where: { id }
    }),
  unsetDefault: (customerId: string) =>
    prisma.customerAddress.updateMany({
      where: { customerId, isDefault: true },
      data: { isDefault: false }
    })
};
