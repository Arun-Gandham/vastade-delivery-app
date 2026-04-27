import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const orderRepository = {
  createOrder: (data: Prisma.OrderUncheckedCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).order.create({ data }),
  createOrderItems: (data: Prisma.OrderItemUncheckedCreateInput[], tx?: Prisma.TransactionClient) =>
    db(tx).orderItem.createMany({ data }),
  createStatusHistory: (data: Prisma.OrderStatusHistoryUncheckedCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).orderStatusHistory.create({ data }),
  createPayment: (data: Prisma.PaymentUncheckedCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).payment.create({ data }),
  findById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        shop: true,
        payment: true,
        assignments: true,
        captain: {
          select: {
            id: true,
            name: true,
            mobile: true
          }
        }
      }
    }),
  findByIdForAdmin: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        shop: true,
        payment: true,
        assignments: true,
        customer: true,
        captain: true
      }
    }),
  listByCustomer: (customerId: string, status?: OrderStatus) =>
    prisma.order.findMany({
      where: { customerId, ...(status ? { status } : {}) },
      include: {
        items: true,
        payment: true,
        shop: true,
        captain: {
          select: {
            id: true,
            name: true,
            mobile: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
  listByShop: (shopId: string) =>
    prisma.order.findMany({
      where: { shopId },
      include: { items: true, customer: true, payment: true, captain: true, address: true },
      orderBy: { createdAt: "desc" }
    }),
  updateOrder: (id: string, data: Prisma.OrderUncheckedUpdateInput, tx?: Prisma.TransactionClient) =>
    db(tx).order.update({ where: { id }, data }),
  createAssignment: (data: Prisma.DeliveryAssignmentUncheckedCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).deliveryAssignment.create({ data }),
  updateAssignment: (
    orderId: string,
    captainId: string,
    data: Prisma.DeliveryAssignmentUncheckedUpdateInput,
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).deliveryAssignment.updateMany({
      where: { orderId, captainId },
      data
    }),
  findCaptainProfile: (userId: string, tx?: Prisma.TransactionClient) =>
    db(tx).captain.findUnique({
      where: { userId }
    }),
  updateCaptainProfile: (userId: string, data: Prisma.CaptainUncheckedUpdateInput, tx?: Prisma.TransactionClient) =>
    db(tx).captain.update({
      where: { userId },
      data
    })
};
