import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const paymentRepository = {
  findByOrderId: (orderId: string, tx?: Prisma.TransactionClient) =>
    db(tx).payment.findUnique({
      where: { orderId }
    }),
  updateByOrderId: (orderId: string, data: Prisma.PaymentUncheckedUpdateInput, tx?: Prisma.TransactionClient) =>
    db(tx).payment.update({
      where: { orderId },
      data
    }),
  markPaid: (orderId: string, provider: string, providerPaymentId: string, tx?: Prisma.TransactionClient) =>
    db(tx).payment.update({
      where: { orderId },
      data: {
        provider,
        providerPaymentId,
        paymentStatus: PaymentStatus.PAID,
        paidAt: new Date()
      }
    })
};
