import {
  DeliveryAssignmentStatus,
  OrderStatus,
  PaymentMode,
  PaymentStatus,
  Prisma,
  StockMovementType,
  UserRole
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import {
  CUSTOMER_CANCELLABLE_STATUSES,
  ORDER_TRANSITIONS,
  SHOP_CANCELLABLE_STATUSES
} from "../../constants/order";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { generateOrderNumber } from "../../core/utils/order-number";
import { prisma } from "../../database/prisma";
import { orderNotificationQueue } from "../../jobs/queues";
import { auditLogService } from "../audit-logs/audit-log.service";
import { addressRepository } from "../addresses/address.repository";
import { cartRepository } from "../cart/cart.repository";
import { couponService } from "../coupons/coupon.service";
import { inventoryRepository } from "../inventory/inventory.repository";
import { shopService } from "../shops/shop.service";
import { orderRepository } from "./order.repository";

const ensureTransition = (current: OrderStatus, next: OrderStatus) => {
  if (!ORDER_TRANSITIONS[current]?.includes(next)) {
    throw new AppError(
      `Cannot move order from ${current} to ${next}`,
      StatusCodes.BAD_REQUEST,
      ERROR_CODES.INVALID_ORDER_STATUS
    );
  }
};

const setTimestampField = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.CONFIRMED:
      return { confirmedAt: new Date() };
    case OrderStatus.PACKING:
      return { packedAt: new Date() };
    case OrderStatus.OUT_FOR_DELIVERY:
      return { pickedUpAt: new Date() };
    case OrderStatus.DELIVERED:
      return { deliveredAt: new Date() };
    case OrderStatus.CANCELLED:
      return { cancelledAt: new Date() };
    default:
      return {};
  }
};

export const orderService = {
  async place(
    customerId: string,
    input: {
      shopId: string;
      addressId: string;
      paymentMode: PaymentMode;
      couponCode?: string | null;
      customerNotes?: string;
    }
  ) {
    const address = await addressRepository.findById(input.addressId);
    if (!address || address.customerId !== customerId) {
      throw new AppError("Address not found", StatusCodes.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND);
    }

    const shop = await shopService.details(input.shopId);
    if (!shop.isActive || !shop.isOpen) {
      throw new AppError("Shop is unavailable", StatusCodes.BAD_REQUEST, ERROR_CODES.SHOP_NOT_FOUND);
    }

    const cart = await cartRepository.findCart(customerId, input.shopId);
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", StatusCodes.BAD_REQUEST, ERROR_CODES.CART_EMPTY);
    }

    return prisma
      .$transaction(async (tx: Prisma.TransactionClient) => {
        for (const item of cart.items) {
          const inventory = await inventoryRepository.findByShopProduct(
            input.shopId,
            item.productId,
            tx
          );
          if (!inventory || inventory.availableStock < item.quantity) {
            throw new AppError(
              "Insufficient stock",
              StatusCodes.BAD_REQUEST,
              ERROR_CODES.INSUFFICIENT_STOCK
            );
          }
        }

        const subtotal = cart.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
        const coupon = input.couponCode
          ? await couponService.validate({
              shopId: input.shopId,
              couponCode: input.couponCode,
              cartAmount: subtotal
            })
          : null;
        const deliveryFee = env.DELIVERY_FEE;
        const platformFee = env.PLATFORM_FEE;
        const discount = coupon?.discount ?? 0;
        const totalAmount = subtotal + deliveryFee + platformFee - discount;
        const orderNumber = await generateOrderNumber(tx);

        const order = await orderRepository.createOrder(
          {
            orderNumber,
            customerId,
            shopId: input.shopId,
            addressId: input.addressId,
            status: OrderStatus.PLACED,
            paymentMode: input.paymentMode,
            paymentStatus:
              input.paymentMode === PaymentMode.COD
                ? PaymentStatus.COD_PENDING
                : PaymentStatus.PENDING,
            subtotal,
            deliveryFee,
            platformFee,
            discount,
            totalAmount,
            codAmount: input.paymentMode === PaymentMode.COD ? totalAmount : 0,
            customerNotes: input.customerNotes,
            placedAt: new Date()
          },
          tx
        );

        await orderRepository.createOrderItems(
          cart.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          })),
          tx
        );

        for (const item of cart.items) {
          const inventory = await inventoryRepository.findByShopProduct(
            input.shopId,
            item.productId,
            tx
          );
          if (!inventory) continue;

          await inventoryRepository.update(
            inventory.id,
            {
              availableStock: inventory.availableStock - item.quantity,
              reservedStock: inventory.reservedStock + item.quantity
            },
            tx
          );

          await inventoryRepository.createMovement(
            {
              shopId: input.shopId,
              productId: item.productId,
              movementType: StockMovementType.STOCK_RESERVED,
              quantity: item.quantity,
              beforeStock: inventory.availableStock,
              afterStock: inventory.availableStock - item.quantity,
              referenceType: "ORDER",
              referenceId: order.id,
              createdBy: customerId
            },
            tx
          );
        }

        await cartRepository.clearCart(cart.id, tx);
        await orderRepository.createPayment(
          {
            orderId: order.id,
            paymentMode: input.paymentMode,
            paymentStatus:
              input.paymentMode === PaymentMode.COD
                ? PaymentStatus.COD_PENDING
                : PaymentStatus.PENDING,
            amount: totalAmount
          },
          tx
        );
        await orderRepository.createStatusHistory(
          {
            orderId: order.id,
            newStatus: OrderStatus.PLACED,
            changedBy: customerId,
            remarks: "Order placed by customer"
          },
          tx
        );

        return order;
      })
      .then(async (order) => {
        if (orderNotificationQueue) {
          await orderNotificationQueue.add("sendOrderNotification", { orderId: order.id });
        }
        return this.details(order.id);
      });
  },

  async details(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }
    return order;
  },

  async customerDetails(customerId: string, orderId: string) {
    const order = await this.details(orderId);
    if (order.customerId !== customerId) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }
    return order;
  },

  async shopDetails(userId: string, role: UserRole, orderId: string) {
    const order = await this.details(orderId);
    await shopService.assertShopAccess(userId, role, order.shopId);
    return order;
  },

  async adminDetails(orderId: string) {
    const order = await orderRepository.findByIdForAdmin(orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }
    return order;
  },

  async myOrders(customerId: string, status?: OrderStatus) {
    return orderRepository.listByCustomer(customerId, status);
  },

  async cancelByCustomer(customerId: string, orderId: string, reason: string) {
    const order = await this.customerDetails(customerId, orderId);
    if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new AppError(
        "Invalid order status",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.INVALID_ORDER_STATUS
      );
    }
    return this.cancelOrder(order, reason, customerId);
  },

  async listShopOrders(userId: string, role: UserRole, shopId: string) {
    await shopService.assertShopAccess(userId, role, shopId);
    return orderRepository.listByShop(shopId);
  },

  async shopUpdateStatus(
    userId: string,
    role: UserRole,
    orderId: string,
    nextStatus: OrderStatus,
    remarks?: string
  ) {
    const order = await this.details(orderId);
    await shopService.assertShopAccess(userId, role, order.shopId);
    ensureTransition(order.status, nextStatus);

    return prisma.$transaction(async (tx) => {
      const updated = await orderRepository.updateOrder(
        orderId,
        {
          status: nextStatus,
          ...setTimestampField(nextStatus)
        },
        tx
      );

      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: nextStatus,
          changedBy: userId,
          remarks
        },
        tx
      );

      await auditLogService.create({
        userId,
        action: "ORDER_STATUS_UPDATED",
        entityName: "Order",
        entityId: orderId,
        oldValue: { status: order.status },
        newValue: { status: nextStatus, remarks }
      });

      return updated;
    });
  },

  async cancelByShop(userId: string, role: UserRole, orderId: string, reason: string) {
    const order = await this.details(orderId);
    await shopService.assertShopAccess(userId, role, order.shopId);
    if (!SHOP_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new AppError(
        "Invalid order status",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.INVALID_ORDER_STATUS
      );
    }
    return this.cancelOrder(order, reason, userId);
  },

  async assignCaptain(assignerId: string, role: UserRole, orderId: string, captainId: string) {
    const order = await this.details(orderId);
    await shopService.assertShopAccess(assignerId, role, order.shopId);
    if (order.status !== OrderStatus.READY_FOR_PICKUP) {
      throw new AppError(
        "Invalid order status",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.INVALID_ORDER_STATUS
      );
    }

    const captain = await orderRepository.findCaptainProfile(captainId);
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    if (!captain.isAvailable) {
      throw new AppError(
        "Captain not available",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.CAPTAIN_NOT_AVAILABLE
      );
    }

    return prisma.$transaction(async (tx) => {
      await orderRepository.createAssignment(
        {
          orderId,
          captainId,
          assignedBy: assignerId,
          status: DeliveryAssignmentStatus.ASSIGNED,
          assignedAt: new Date()
        },
        tx
      );
      await orderRepository.updateOrder(
        orderId,
        { status: OrderStatus.ASSIGNED_TO_CAPTAIN, captainId },
        tx
      );
      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: OrderStatus.ASSIGNED_TO_CAPTAIN,
          changedBy: assignerId,
          remarks: "Captain assigned"
        },
        tx
      );

      await auditLogService.create({
        userId: assignerId,
        action: "CAPTAIN_ASSIGNED",
        entityName: "Order",
        entityId: orderId,
        newValue: { captainId }
      });

      return this.details(orderId);
    });
  },

  async adminUpdateStatus(adminId: string, orderId: string, status: OrderStatus, remarks?: string) {
    const order = await this.details(orderId);

    if (status === OrderStatus.CANCELLED) {
      return this.cancelOrder(order, remarks ?? "Cancelled by admin", adminId);
    }

    ensureTransition(order.status, status);
    return prisma.$transaction(async (tx) => {
      const updated = await orderRepository.updateOrder(
        orderId,
        {
          status,
          ...setTimestampField(status)
        },
        tx
      );
      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: status,
          changedBy: adminId,
          remarks
        },
        tx
      );
      await auditLogService.create({
        userId: adminId,
        action: "ADMIN_ORDER_STATUS_UPDATED",
        entityName: "Order",
        entityId: orderId,
        oldValue: { status: order.status },
        newValue: { status, remarks }
      });
      return updated;
    });
  },

  async captainOrders(captainId: string) {
    return prisma.order.findMany({
      where: { captainId },
      include: { items: true, address: true, shop: true, payment: true },
      orderBy: { createdAt: "desc" }
    });
  },

  async captainAccept(captainId: string, orderId: string) {
    const order = await this.details(orderId);
    if (order.captainId !== captainId || order.status !== OrderStatus.ASSIGNED_TO_CAPTAIN) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }

    await prisma.deliveryAssignment.updateMany({
      where: { orderId, captainId },
      data: {
        status: DeliveryAssignmentStatus.ACCEPTED,
        acceptedAt: new Date()
      }
    });
    return this.details(orderId);
  },

  async captainReject(captainId: string, orderId: string, reason: string) {
    const order = await this.details(orderId);
    if (order.captainId !== captainId || order.status !== OrderStatus.ASSIGNED_TO_CAPTAIN) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }

    return prisma.$transaction(async (tx) => {
      await orderRepository.updateAssignment(
        orderId,
        captainId,
        {
          status: DeliveryAssignmentStatus.REJECTED
        },
        tx
      );
      await orderRepository.updateOrder(
        orderId,
        {
          status: OrderStatus.READY_FOR_PICKUP,
          captainId: null
        },
        tx
      );
      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: OrderStatus.READY_FOR_PICKUP,
          changedBy: captainId,
          remarks: reason
        },
        tx
      );
      return this.details(orderId);
    });
  },

  async captainPickedUp(captainId: string, orderId: string) {
    const order = await this.details(orderId);
    if (order.captainId !== captainId || order.status !== OrderStatus.ASSIGNED_TO_CAPTAIN) {
      throw new AppError(
        "Invalid order status",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.INVALID_ORDER_STATUS
      );
    }

    return prisma.$transaction(async (tx) => {
      await orderRepository.updateAssignment(
        orderId,
        captainId,
        {
          status: DeliveryAssignmentStatus.PICKED_UP,
          pickedUpAt: new Date()
        },
        tx
      );
      await orderRepository.updateOrder(
        orderId,
        {
          status: OrderStatus.OUT_FOR_DELIVERY,
          pickedUpAt: new Date()
        },
        tx
      );
      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: OrderStatus.OUT_FOR_DELIVERY,
          changedBy: captainId,
          remarks: "Order picked up by captain"
        },
        tx
      );
      return this.details(orderId);
    });
  },

  async captainDeliver(
    captainId: string,
    orderId: string,
    input: { paymentCollected?: boolean; collectedAmount?: number; deliveryProofImage?: string }
  ) {
    const order = await this.details(orderId);
    if (order.captainId !== captainId || order.status !== OrderStatus.OUT_FOR_DELIVERY) {
      throw new AppError(
        "Invalid order status",
        StatusCodes.BAD_REQUEST,
        ERROR_CODES.INVALID_ORDER_STATUS
      );
    }

    return prisma.$transaction(async (tx) => {
      const updatedOrder = await orderRepository.updateOrder(
        orderId,
        {
          status: OrderStatus.DELIVERED,
          deliveredAt: new Date(),
          paymentStatus:
            order.paymentMode === PaymentMode.COD
              ? PaymentStatus.COD_COLLECTED
              : order.paymentStatus
        },
        tx
      );

      for (const item of order.items) {
        const inventory = await inventoryRepository.findByShopProduct(order.shopId, item.productId, tx);
        if (!inventory) continue;

        await inventoryRepository.update(
          inventory.id,
          {
            reservedStock: inventory.reservedStock - item.quantity,
            soldStock: inventory.soldStock + item.quantity
          },
          tx
        );
        await inventoryRepository.createMovement(
          {
            shopId: order.shopId,
            productId: item.productId,
            movementType: StockMovementType.STOCK_SOLD,
            quantity: item.quantity,
            beforeStock: inventory.reservedStock,
            afterStock: inventory.reservedStock - item.quantity,
            referenceType: "ORDER",
            referenceId: order.id,
            createdBy: captainId
          },
          tx
        );
      }

      if (order.paymentMode === PaymentMode.COD && input.paymentCollected) {
        await tx.payment.update({
          where: { orderId },
          data: {
            paymentStatus: PaymentStatus.COD_COLLECTED,
            paidAt: new Date()
          }
        });
        await orderRepository.updateCaptainProfile(
          captainId,
          {
            cashInHand: {
              increment: input.collectedAmount ?? Number(order.totalAmount)
            }
          },
          tx
        );
      }

      await tx.deliveryAssignment.updateMany({
        where: { orderId, captainId },
        data: {
          status: DeliveryAssignmentStatus.DELIVERED,
          deliveredAt: new Date()
        }
      });
      await orderRepository.createStatusHistory(
        {
          orderId,
          oldStatus: order.status,
          newStatus: OrderStatus.DELIVERED,
          changedBy: captainId,
          remarks: "Order delivered by captain"
        },
        tx
      );

      await auditLogService.create({
        userId: captainId,
        action: "ORDER_DELIVERED",
        entityName: "Order",
        entityId: orderId,
        newValue: {
          paymentCollected: input.paymentCollected,
          collectedAmount: input.collectedAmount,
          deliveryProofImage: input.deliveryProofImage
        }
      });

      return updatedOrder;
    });
  },

  async adminOrders() {
    return prisma.order.findMany({
      include: { items: true, customer: true, shop: true, payment: true, captain: true },
      orderBy: { createdAt: "desc" }
    });
  },

  async availableCaptains() {
    return prisma.captain.findMany({
      where: { isOnline: true, isAvailable: true },
      include: { user: true }
    });
  },

  async cancelOrder(
    order: Awaited<ReturnType<typeof orderRepository.findById>>,
    reason: string,
    changedBy: string
  ) {
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const inventory = await inventoryRepository.findByShopProduct(order.shopId, item.productId, tx);
        if (!inventory) continue;

        await inventoryRepository.update(
          inventory.id,
          {
            reservedStock: inventory.reservedStock - item.quantity,
            availableStock: inventory.availableStock + item.quantity
          },
          tx
        );

        await inventoryRepository.createMovement(
          {
            shopId: order.shopId,
            productId: item.productId,
            movementType: StockMovementType.STOCK_RELEASED,
            quantity: item.quantity,
            beforeStock: inventory.availableStock,
            afterStock: inventory.availableStock + item.quantity,
            referenceType: "ORDER_CANCEL",
            referenceId: order.id,
            createdBy: changedBy
          },
          tx
        );
      }

      await orderRepository.updateOrder(
        order.id,
        {
          status: OrderStatus.CANCELLED,
          cancelReason: reason,
          cancelledAt: new Date(),
          paymentStatus:
            order.paymentMode === PaymentMode.COD ? PaymentStatus.FAILED : order.paymentStatus
        },
        tx
      );
      await orderRepository.createStatusHistory(
        {
          orderId: order.id,
          oldStatus: order.status,
          newStatus: OrderStatus.CANCELLED,
          changedBy,
          remarks: reason
        },
        tx
      );
      return this.details(order.id);
    });
  }
};
