import { OrderStatus, UserRole } from "@prisma/client";
import { prisma } from "../../database/prisma";

export const dashboardRepository = {
  adminSummary: async () => {
    const [totalOrders, todayOrders, deliveredToday, activeCustomers, activeShops, activeCaptains, pendingOrders, cancelledOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        }),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            status: OrderStatus.DELIVERED,
            deliveredAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        }),
        prisma.user.count({ where: { role: UserRole.CUSTOMER, isActive: true } }),
        prisma.shop.count({ where: { isActive: true } }),
        prisma.captain.count({ where: { isOnline: true, isAvailable: true } }),
        prisma.order.count({
          where: {
            status: {
              in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.CAPTAIN_ASSIGNED, OrderStatus.READY_FOR_PICKUP]
            }
          }
        }),
        prisma.order.count({ where: { status: OrderStatus.CANCELLED } })
      ]);

    return {
      totalOrders,
      todayOrders,
      todayRevenue: Number(deliveredToday._sum.totalAmount ?? 0),
      activeCustomers,
      activeShops,
      activeCaptains,
      pendingOrders,
      cancelledOrders
    };
  },
  shopSummary: async (shopId: string) => {
    const [todayOrders, todayRevenue, pendingOrders, deliveredOrders, cancelledOrders, lowStockProducts] =
      await Promise.all([
        prisma.order.count({
          where: {
            shopId,
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        }),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            shopId,
            status: OrderStatus.DELIVERED,
            deliveredAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        }),
        prisma.order.count({
          where: {
            shopId,
            status: {
              in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.CAPTAIN_ASSIGNED, OrderStatus.READY_FOR_PICKUP]
            }
          }
        }),
        prisma.order.count({ where: { shopId, status: OrderStatus.DELIVERED } }),
        prisma.order.count({ where: { shopId, status: OrderStatus.CANCELLED } }),
        prisma.shopInventory.count({
          where: {
            shopId,
            isAvailable: true,
            availableStock: { lte: 5 }
          }
        })
      ]);

    return {
      todayOrders,
      todayRevenue: Number(todayRevenue._sum.totalAmount ?? 0),
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts
    };
  },
  adminSalesReport: async () =>
    prisma.order.findMany({
      where: { status: OrderStatus.DELIVERED },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        deliveredAt: true,
        shopId: true,
        customerId: true
      },
      orderBy: { deliveredAt: "desc" }
    }),
  adminProductSalesReport: async () =>
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, totalPrice: true }
    }),
  adminLowStockReport: async () =>
    prisma.shopInventory.findMany({
      where: {
        isAvailable: true,
        availableStock: { lte: 5 }
      },
      include: { product: true, shop: true },
      orderBy: { availableStock: "asc" }
    }),
  shopSalesReport: async (shopId: string) =>
    prisma.order.findMany({
      where: { shopId, status: OrderStatus.DELIVERED },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        deliveredAt: true,
        customerId: true
      },
      orderBy: { deliveredAt: "desc" }
    }),
  shopLowStockReport: async (shopId: string) =>
    prisma.shopInventory.findMany({
      where: {
        shopId,
        isAvailable: true,
        availableStock: { lte: 5 }
      },
      include: { product: true },
      orderBy: { availableStock: "asc" }
    })
};
