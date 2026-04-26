import { prisma } from "../../database/prisma";

export const couponRepository = {
  create: prisma.coupon.create.bind(prisma.coupon),
  findByCode: (code: string) =>
    prisma.coupon.findUnique({
      where: { code }
    }),
  findById: (id: string) =>
    prisma.coupon.findUnique({
      where: { id }
    }),
  update: (id: string, data: Record<string, unknown>) =>
    prisma.coupon.update({
      where: { id },
      data
    })
};
