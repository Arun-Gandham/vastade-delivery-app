import {
  CaptainAvailabilityStatus,
  DeliveryAssignmentStatus,
  CaptainTaskOfferStatus,
  DeliveryTaskStatus,
  DeliveryTaskType,
  OrderStatus,
  PaymentMode,
  PaymentStatus,
  Prisma
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { haversineDistanceKm } from "../../core/utils/geo";
import { prisma } from "../../database/prisma";
import { socketGateway } from "../../realtime/socket-gateway";
import { deliveryTaskRepository } from "./delivery-task.repository";
import type { CaptainTaskRejectInput, DeliveryTaskCreateInput } from "./delivery-task.types";

const ensureTask = async (taskId: string) => {
  const task = await deliveryTaskRepository.findTaskById(taskId);
  if (!task) {
    throw new AppError("Delivery task not found", StatusCodes.NOT_FOUND, ERROR_CODES.DELIVERY_TASK_NOT_FOUND);
  }
  return task;
};

const ensureCaptain = async (captainUserId: string) => {
  const captain = await prisma.captain.findUnique({
    where: { userId: captainUserId },
    include: { user: true }
  });
  if (!captain) {
    throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
  }
  return captain;
};

const fetchOrdersByIds = async (orderIds: string[]) => {
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          mobile: true
        }
      },
      shop: {
        select: {
          id: true,
          name: true,
          mobile: true
        }
      },
      captain: {
        select: {
          id: true,
          name: true,
          mobile: true
        }
      }
    }
  });

  return new Map(orders.map((order) => [order.id, order]));
};

type CaptainOrderEntity = Prisma.OrderGetPayload<{
  include: {
    customer: {
      select: {
        id: true;
        name: true;
        mobile: true;
      };
    };
    shop: {
      select: {
        id: true;
        name: true;
        mobile: true;
      };
    };
    captain: {
      select: {
        id: true;
        name: true;
        mobile: true;
      };
    };
  };
}>;

type CaptainOrderTaskEntity = {
  id: string;
  referenceId: string;
  pickupAddress: string;
  dropAddress: string;
  deliveryFee: Prisma.Decimal;
  distanceKm: Prisma.Decimal | null;
};

const mapCaptainOrder = ({
  task,
  order,
  offer
}: {
  task: CaptainOrderTaskEntity;
  order: CaptainOrderEntity;
  offer?: { distanceToPickupKm?: Prisma.Decimal | null; pickupToDropKm?: Prisma.Decimal | null } | null;
}) => ({
  id: order.id,
  orderId: order.id,
  deliveryTaskId: task.id,
  orderNumber: order.orderNumber,
  status: order.status,
  pickupAddress: task.pickupAddress,
  dropAddress: task.dropAddress,
  amount: Number(order.totalAmount),
  deliveryFee: Number(task.deliveryFee),
  distanceKm:
    offer?.pickupToDropKm != null
      ? Number(offer.pickupToDropKm)
      : task.distanceKm != null
        ? Number(task.distanceKm)
        : null,
  distanceToPickupKm: offer?.distanceToPickupKm != null ? Number(offer.distanceToPickupKm) : null,
  customer: order.customer,
  shop: order.shop,
  captain: order.captain,
  captainAcceptedAt: order.captainAcceptedAt,
  readyForPickupAt: order.readyForPickupAt,
  pickedUpAt: order.pickedUpAt,
  deliveredAt: order.deliveredAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt
});

export const deliveryTaskService = {
  async createTask(input: DeliveryTaskCreateInput) {
    const task = await deliveryTaskRepository.createTask(input);
    await deliveryTaskRepository.updateTask(task.id, {
      status: DeliveryTaskStatus.SEARCHING_CAPTAIN
    });
    socketGateway.emitEvent("delivery_task_created", {
      taskId: task.id,
      taskType: task.taskType,
      referenceId: task.referenceId
    });
    await this.offerToNearbyCaptains(task.id);
    return ensureTask(task.id);
  },

  async createForOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, customer: true, shop: true }
    });
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    const existing = await prisma.deliveryTask.findFirst({
      where: { referenceTable: "orders", referenceId: orderId }
    });
    if (existing) {
      return ensureTask(existing.id);
    }

    return this.createTask({
      taskType: DeliveryTaskType.GROCERY,
      referenceId: orderId,
      referenceTable: "orders",
      shopId: order.shopId,
      customerId: order.customerId,
      pickupName: order.shop.name,
      pickupPhone: order.shop.mobile,
      pickupAddress: order.shop.address,
      pickupLatitude: order.shop.latitude ? Number(order.shop.latitude) : undefined,
      pickupLongitude: order.shop.longitude ? Number(order.shop.longitude) : undefined,
      dropName: order.address.fullName,
      dropPhone: order.address.mobile,
      dropAddress: `${order.address.houseNo}, ${order.address.street}, ${order.address.village}`,
      dropLatitude: order.address.latitude ? Number(order.address.latitude) : undefined,
      dropLongitude: order.address.longitude ? Number(order.address.longitude) : undefined,
      deliveryFee: Number(order.deliveryFee)
    });
  },

  async createParcel(customerId: string, input: Parameters<typeof deliveryTaskRepository.createParcelOrder>[0]) {
    return prisma.$transaction(async (tx) => {
      const parcel = await deliveryTaskRepository.createParcelOrder({ ...input, customerId }, tx);
      const task = await deliveryTaskRepository.createTask(
        {
          taskType: DeliveryTaskType.PARCEL,
          referenceId: parcel.id,
          referenceTable: "parcel_orders",
          customerId,
          pickupName: input.senderName,
          pickupPhone: input.senderPhone,
          pickupAddress: input.pickupAddress,
          pickupLatitude: input.pickupLatitude,
          pickupLongitude: input.pickupLongitude,
          dropName: input.receiverName,
          dropPhone: input.receiverPhone,
          dropAddress: input.dropAddress,
          dropLatitude: input.dropLatitude,
          dropLongitude: input.dropLongitude,
          deliveryFee: input.deliveryFee
        },
        tx
      );

      return { parcel, task };
    }).then(async ({ parcel, task }) => {
      await deliveryTaskRepository.updateTask(task.id, { status: DeliveryTaskStatus.SEARCHING_CAPTAIN });
      await this.offerToNearbyCaptains(task.id);
      return { parcel, task: await ensureTask(task.id) };
    });
  },

  async markOrderReadyForPickup(orderId: string) {
    const task = await deliveryTaskRepository.findOrderTaskByOrderId(orderId);
    if (!task) {
      throw new AppError("Delivery task not found", StatusCodes.NOT_FOUND, ERROR_CODES.DELIVERY_TASK_NOT_FOUND);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        shopId: true,
        customerId: true,
        captainId: true,
        status: true
      }
    });
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    const captain = task.captainId
      ? await prisma.captain.findUnique({
          where: { id: task.captainId },
          include: { user: { select: { id: true, name: true, mobile: true } } }
        })
      : null;

    socketGateway.emitEvent("order:ready-for-pickup", {
      orderId,
      taskId: task.id,
      shopId: order.shopId,
      customerId: order.customerId,
      captainId: captain?.userId ?? order.captainId,
      captainProfileId: captain?.id,
      status: order.status
    });

    return task;
  },

  async offerToNearbyCaptains(taskId: string) {
    const task = await ensureTask(taskId);
    const nearby = await deliveryTaskRepository.findNearbyCaptains(env.CAPTAIN_MATCH_RADIUS_KM);
    const hasPickupCoordinates = task.pickupLatitude != null && task.pickupLongitude != null;
    const pickupToDropKm =
      task.pickupLatitude && task.pickupLongitude && task.dropLatitude && task.dropLongitude
        ? Number(
            haversineDistanceKm(
              { latitude: Number(task.pickupLatitude), longitude: Number(task.pickupLongitude) },
              { latitude: Number(task.dropLatitude), longitude: Number(task.dropLongitude) }
            ).toFixed(2)
          )
        : undefined;

    const sorted = hasPickupCoordinates
      ? nearby
          .map((captain) => {
            const distanceToPickupKm = haversineDistanceKm(
              {
                latitude: Number(captain.currentLatitude),
                longitude: Number(captain.currentLongitude)
              },
              {
                latitude: Number(task.pickupLatitude),
                longitude: Number(task.pickupLongitude)
              }
            );
            return { captain, distanceToPickupKm };
          })
          .filter((item) => item.distanceToPickupKm <= env.CAPTAIN_MATCH_RADIUS_KM)
          .sort((a, b) => a.distanceToPickupKm - b.distanceToPickupKm)
      : nearby.map((captain) => ({
          captain,
          distanceToPickupKm: undefined
        }));

    if (sorted.length === 0) {
      return task;
    }

    const offerPayloads = sorted.map((item) => ({
      captainId: item.captain.id,
      taskId,
      taskType: task.taskType,
      pickupAddress: task.pickupAddress,
      pickupLatitude: task.pickupLatitude ? Number(task.pickupLatitude) : null,
      pickupLongitude: task.pickupLongitude ? Number(task.pickupLongitude) : null,
      dropAddress: task.dropAddress,
      dropLatitude: task.dropLatitude ? Number(task.dropLatitude) : null,
      dropLongitude: task.dropLongitude ? Number(task.dropLongitude) : null,
      distanceToPickupKm:
        typeof item.distanceToPickupKm === "number"
          ? Number(item.distanceToPickupKm.toFixed(2))
          : undefined,
      pickupToDropKm,
      estimatedEarning: Number(task.deliveryFee),
      offerExpiresAt: new Date(Date.now() + env.CAPTAIN_TASK_OFFER_EXPIRES_IN_SECONDS * 1000)
    }));

    await prisma.$transaction(async (tx) => {
      await deliveryTaskRepository.updateTask(
        taskId,
        { status: DeliveryTaskStatus.OFFERED_TO_CAPTAINS },
        tx
      );

      for (const item of offerPayloads) {
        await deliveryTaskRepository.createOffer(
          {
            deliveryTaskId: taskId,
            captainId: item.captainId,
            distanceToPickupKm: item.distanceToPickupKm,
            pickupToDropKm: item.pickupToDropKm,
            estimatedEarning: item.estimatedEarning,
            expiresAt: item.offerExpiresAt
          },
          tx
        );
      }
    });

    const refreshedTask = await ensureTask(taskId);
    const order =
      refreshedTask.referenceTable === "orders"
        ? await prisma.order.findUnique({
            where: { id: refreshedTask.referenceId },
            select: { id: true, orderNumber: true, totalAmount: true, status: true }
          })
        : null;

    for (const item of offerPayloads) {
      socketGateway.emitEvent("captain:task_offer_received", {
        ...item,
        estimatedTimeSeconds: env.CAPTAIN_TASK_OFFER_EXPIRES_IN_SECONDS,
        task: refreshedTask
      });

      if (order) {
        socketGateway.emitEvent("order:available-for-captains", {
          captainId: item.captainId,
          captainIds: [item.captainId],
          orderId: order.id,
          orderNumber: order.orderNumber,
          pickupAddress: refreshedTask.pickupAddress,
          dropAddress: refreshedTask.dropAddress,
          amount: Number(order.totalAmount),
          distanceKm: item.pickupToDropKm,
          status: "ACCEPTED"
        });
      }
    }

    return refreshedTask;
  },

  async captainAccept(captainUserId: string, taskId: string) {
    const captain = await ensureCaptain(captainUserId);
    if (captain.registrationStatus !== "APPROVED") {
      throw new AppError("Captain not approved", StatusCodes.FORBIDDEN, ERROR_CODES.CAPTAIN_NOT_APPROVED);
    }
    if (captain.availabilityStatus !== CaptainAvailabilityStatus.ONLINE) {
      throw new AppError("Captain not available", StatusCodes.BAD_REQUEST, ERROR_CODES.CAPTAIN_NOT_AVAILABLE);
    }

    return prisma.$transaction(async (tx) => {
      const task = await tx.deliveryTask.findUnique({
        where: { id: taskId }
      });
      if (!task) {
        throw new AppError("Delivery task not found", StatusCodes.NOT_FOUND, ERROR_CODES.DELIVERY_TASK_NOT_FOUND);
      }
      if (
        task.status !== DeliveryTaskStatus.SEARCHING_CAPTAIN &&
        task.status !== DeliveryTaskStatus.OFFERED_TO_CAPTAINS
      ) {
        throw new AppError(
          "Delivery task not assignable",
          StatusCodes.BAD_REQUEST,
          ERROR_CODES.DELIVERY_TASK_NOT_ASSIGNABLE
        );
      }

      const activeOffer = await deliveryTaskRepository.findOffer(taskId, captain.id, tx);
      if (!activeOffer || activeOffer.status !== CaptainTaskOfferStatus.SENT) {
        throw new AppError(
          "Delivery task offer no longer available",
          StatusCodes.BAD_REQUEST,
          ERROR_CODES.DELIVERY_TASK_NOT_ASSIGNABLE
        );
      }

      const competingOffers = await deliveryTaskRepository.listOffersByTask(taskId, tx);
      const claimedAt = new Date();
      const claimed = await tx.deliveryTask.updateMany({
        where: {
          id: taskId,
          captainId: null,
          status: {
            in: [DeliveryTaskStatus.SEARCHING_CAPTAIN, DeliveryTaskStatus.OFFERED_TO_CAPTAINS]
          }
        },
        data: {
          captainId: captain.id,
          status: DeliveryTaskStatus.ACCEPTED,
          assignedAt: claimedAt
        }
      });

      if (claimed.count === 0) {
        const currentTask = await tx.deliveryTask.findUnique({
          where: { id: taskId },
          select: { captainId: true, status: true }
        });
        if (currentTask?.captainId) {
          throw new AppError(
            task.referenceTable === "orders"
              ? "Order already accepted by another captain."
              : "Delivery task already accepted by another captain",
            StatusCodes.CONFLICT,
            task.referenceTable === "orders"
              ? ERROR_CODES.ORDER_ALREADY_ACCEPTED
              : ERROR_CODES.DELIVERY_TASK_NOT_ASSIGNABLE
          );
        }

        throw new AppError(
          "Delivery task not assignable",
          StatusCodes.BAD_REQUEST,
          ERROR_CODES.DELIVERY_TASK_NOT_ASSIGNABLE
        );
      }

      await deliveryTaskRepository.updateOffer(taskId, captain.id, {
        status: CaptainTaskOfferStatus.ACCEPTED,
        respondedAt: claimedAt
      }, tx);
      await deliveryTaskRepository.expireOtherOffers(taskId, captain.id, tx);

      await tx.captain.update({
        where: { id: captain.id },
        data: {
          availabilityStatus: CaptainAvailabilityStatus.BUSY,
          isAvailable: false,
          isOnline: true
        }
      });

      if (task.referenceTable === "orders") {
        const currentOrder = await tx.order.findUnique({
          where: { id: task.referenceId },
          select: { status: true, shopId: true, customerId: true }
        });
        if (!currentOrder) {
          throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
        }

        await tx.order.update({
          where: { id: task.referenceId },
          data: {
            captainId: captain.userId,
            status: OrderStatus.CAPTAIN_ASSIGNED,
            captainAcceptedAt: claimedAt
          }
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: task.referenceId,
            oldStatus: currentOrder.status,
            newStatus: OrderStatus.CAPTAIN_ASSIGNED,
            changedBy: captain.userId,
            remarks: "Captain accepted order"
          }
        });
        await tx.deliveryAssignment.upsert({
          where: {
            orderId_captainId: {
              orderId: task.referenceId,
              captainId: captain.userId
            }
          },
          update: {
            status: DeliveryAssignmentStatus.ACCEPTED,
            acceptedAt: claimedAt
          },
          create: {
            orderId: task.referenceId,
            captainId: captain.userId,
            status: DeliveryAssignmentStatus.ACCEPTED,
            assignedAt: claimedAt,
            acceptedAt: claimedAt
          }
        });

        socketGateway.emitEvent("order:assigned", {
          orderId: task.referenceId,
          taskId,
          shopId: currentOrder.shopId,
          customerId: currentOrder.customerId,
          captainId: captain.userId,
          captainProfileId: captain.id,
          captainName: captain.user.name,
          status: "CAPTAIN_ASSIGNED"
        });
        socketGateway.emitEvent("order:remove-from-available", {
          orderId: task.referenceId,
          taskId,
          reason: "ASSIGNED_TO_ANOTHER_CAPTAIN"
        });
      }

      const otherCaptainIds = competingOffers
        .filter((offer) => offer.captainId !== captain.id && offer.status === CaptainTaskOfferStatus.SENT)
        .map((offer) => offer.captainId);

      socketGateway.emitEvent("captain:task_accepted", {
        captainId: captain.id,
        taskId,
        referenceId: task.referenceId
      });
      if (otherCaptainIds.length) {
        socketGateway.emitEvent("captain:task_removed", {
          captainIds: otherCaptainIds,
          taskId,
          reason: "accepted_by_other_captain"
        });
        socketGateway.emitEvent("captain:task_offer_expired", {
          captainIds: otherCaptainIds,
          taskId,
          reason: "accepted_by_other_captain"
        });
      }
      socketGateway.emitEvent("delivery_task_assigned", {
        taskId,
        captainId: captain.id,
        referenceId: task.referenceId
      });

      return ensureTask(taskId);
    });
  },

  async captainReject(captainUserId: string, taskId: string, input: CaptainTaskRejectInput) {
    const captain = await prisma.captain.findUnique({
      where: { userId: captainUserId }
    });
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }

    await deliveryTaskRepository.updateOffer(taskId, captain.id, {
      status: CaptainTaskOfferStatus.REJECTED,
      respondedAt: new Date(),
      rejectionReason: input.reason
    });

    return ensureTask(taskId);
  },

  async captainReachedPickup(captainUserId: string, taskId: string) {
    return this.updateCaptainTaskStatus(captainUserId, taskId, DeliveryTaskStatus.CAPTAIN_REACHED_PICKUP);
  },

  async captainPickedUp(captainUserId: string, taskId: string) {
    return this.updateCaptainTaskStatus(captainUserId, taskId, DeliveryTaskStatus.PICKED_UP);
  },

  async captainReachedDrop(captainUserId: string, taskId: string) {
    return this.updateCaptainTaskStatus(captainUserId, taskId, DeliveryTaskStatus.CAPTAIN_REACHED_DROP);
  },

  async captainDelivered(captainUserId: string, taskId: string) {
    const task = await this.updateCaptainTaskStatus(captainUserId, taskId, DeliveryTaskStatus.DELIVERED);
    if (task.captainId) {
      await prisma.$transaction(async (tx) => {
        await tx.captain.update({
          where: { id: task.captainId! },
          data: {
            availabilityStatus: CaptainAvailabilityStatus.ONLINE,
            isAvailable: true,
            totalDeliveries: { increment: 1 }
          }
        });
        await deliveryTaskRepository.createEarning(
          {
            captainId: task.captainId!,
            deliveryTaskId: task.id,
            amount: Number(task.deliveryFee),
            status: "CREATED"
          },
          tx
        );
      });
      socketGateway.emitEvent("captain:earnings_updated", {
        captainId: task.captainId,
        taskId: task.id,
        amount: Number(task.deliveryFee)
      });
    }
    return ensureTask(taskId);
  },

  async captainFailed(captainUserId: string, taskId: string) {
    return this.updateCaptainTaskStatus(captainUserId, taskId, DeliveryTaskStatus.FAILED);
  },

  async captainAcceptOrder(captainUserId: string, orderId: string) {
    const task = await deliveryTaskRepository.findOrderTaskByOrderId(orderId);
    if (!task) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return this.captainAccept(captainUserId, task.id);
  },

  async captainPickedUpOrder(captainUserId: string, orderId: string) {
    const task = await deliveryTaskRepository.findOrderTaskByOrderId(orderId);
    if (!task) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return this.captainPickedUp(captainUserId, task.id);
  },

  async captainDeliveredOrder(captainUserId: string, orderId: string) {
    const task = await deliveryTaskRepository.findOrderTaskByOrderId(orderId);
    if (!task) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND, ERROR_CODES.ORDER_NOT_FOUND);
    }

    return this.captainDelivered(captainUserId, task.id);
  },

  async listCaptainAvailableOrders(captainUserId: string) {
    const captain = await ensureCaptain(captainUserId);
    const tasks = await prisma.deliveryTask.findMany({
      where: {
        referenceTable: "orders",
        captainId: null,
        status: {
          in: [DeliveryTaskStatus.SEARCHING_CAPTAIN, DeliveryTaskStatus.OFFERED_TO_CAPTAINS]
        },
        offers: {
          some: {
            captainId: captain.id,
            status: CaptainTaskOfferStatus.SENT
          }
        }
      },
      include: {
        offers: {
          where: {
            captainId: captain.id
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const ordersById = await fetchOrdersByIds(tasks.map((task) => task.referenceId));
    return tasks
      .map((task) => {
        const order = ordersById.get(task.referenceId);
        if (!order || order.status !== OrderStatus.ACCEPTED || order.captainId) {
          return null;
        }
        return mapCaptainOrder({
          task,
          order,
          offer: task.offers[0] ?? null
        });
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  },

  async listCaptainActiveOrders(captainUserId: string) {
    const captain = await ensureCaptain(captainUserId);
    const tasks = await prisma.deliveryTask.findMany({
      where: {
        referenceTable: "orders",
        captainId: captain.id,
        status: {
          in: [
            DeliveryTaskStatus.ACCEPTED,
            DeliveryTaskStatus.CAPTAIN_REACHED_PICKUP,
            DeliveryTaskStatus.PICKED_UP,
            DeliveryTaskStatus.CAPTAIN_REACHED_DROP
          ]
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const ordersById = await fetchOrdersByIds(tasks.map((task) => task.referenceId));
    return tasks
      .map((task) => {
        const order = ordersById.get(task.referenceId);
        return order ? mapCaptainOrder({ task, order }) : null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  },

  async listCaptainTasks(captainUserId: string) {
    const captain = await prisma.captain.findUnique({ where: { userId: captainUserId } });
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    return prisma.deliveryTask.findMany({
      where: {
        OR: [
          { captainId: captain.id },
          {
            offers: {
              some: {
                captainId: captain.id,
                status: CaptainTaskOfferStatus.SENT
              }
            }
          }
        ]
      },
      include: { offers: true, earnings: true },
      orderBy: { createdAt: "desc" }
    });
  },

  async adminListTasks() {
    return prisma.deliveryTask.findMany({
      include: { captain: { include: { user: true } }, offers: true, earnings: true },
      orderBy: { createdAt: "desc" }
    });
  },

  async adminTaskDetails(taskId: string) {
    return ensureTask(taskId);
  },

  async shopOrderDelivery(orderId: string) {
    const task = await prisma.deliveryTask.findFirst({
      where: { referenceTable: "orders", referenceId: orderId },
      include: { captain: { include: { user: true } }, offers: true }
    });
    if (!task) {
      throw new AppError("Delivery task not found", StatusCodes.NOT_FOUND, ERROR_CODES.DELIVERY_TASK_NOT_FOUND);
    }
    return task;
  },

  async customerOrderDelivery(orderId: string) {
    return this.shopOrderDelivery(orderId);
  },

  async customerOrderTracking(orderId: string) {
    return this.shopOrderDelivery(orderId);
  },

  async shopTaskTracking(taskId: string) {
    return ensureTask(taskId);
  },

  async updateCaptainTaskStatus(captainUserId: string, taskId: string, status: DeliveryTaskStatus) {
    const captain = await ensureCaptain(captainUserId);
    const task = await ensureTask(taskId);
    if (task.captainId !== captain.id) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const taskUpdate = await deliveryTaskRepository.updateTask(
        taskId,
        {
          status,
          pickedUpAt: status === DeliveryTaskStatus.PICKED_UP ? new Date() : undefined,
          deliveredAt: status === DeliveryTaskStatus.DELIVERED ? new Date() : undefined
        },
        tx
      );

      if (task.referenceTable === "orders") {
        const currentOrder = await tx.order.findUnique({
          where: { id: task.referenceId },
          select: {
            status: true
          }
        });
        const orderStatus =
          status === DeliveryTaskStatus.PICKED_UP
            ? OrderStatus.PICKED_UP
            : status === DeliveryTaskStatus.DELIVERED
              ? OrderStatus.DELIVERED
              : undefined;

        if (orderStatus) {
          await tx.order.update({
            where: { id: task.referenceId },
            data: {
              status: orderStatus,
              pickedUpAt: status === DeliveryTaskStatus.PICKED_UP ? new Date() : undefined,
              deliveredAt: status === DeliveryTaskStatus.DELIVERED ? new Date() : undefined,
              paymentStatus:
                status === DeliveryTaskStatus.DELIVERED
                  ? PaymentStatus.COD_COLLECTED
                  : undefined
            }
          });
          await tx.orderStatusHistory.create({
            data: {
              orderId: task.referenceId,
              oldStatus: currentOrder?.status,
              newStatus: orderStatus,
              changedBy: captain.userId,
              remarks:
                status === DeliveryTaskStatus.PICKED_UP
                  ? "Captain picked up order"
                  : "Captain delivered order"
            }
          });
          await tx.deliveryAssignment.updateMany({
            where: {
              orderId: task.referenceId,
              captainId: captain.userId
            },
            data: {
              status:
                status === DeliveryTaskStatus.PICKED_UP
                  ? DeliveryAssignmentStatus.PICKED_UP
                  : DeliveryAssignmentStatus.DELIVERED,
              pickedUpAt: status === DeliveryTaskStatus.PICKED_UP ? new Date() : undefined,
              deliveredAt: status === DeliveryTaskStatus.DELIVERED ? new Date() : undefined
            }
          });
        }
      }

      return taskUpdate;
    });

    socketGateway.emitEvent("captain:task_status_updated", {
      taskId,
      captainId: captain.id,
      status,
      referenceId: task.referenceId
    });
    socketGateway.emitEvent("delivery_status_updated", {
      taskId,
      status,
      referenceId: task.referenceId
    });
    if (status === DeliveryTaskStatus.PICKED_UP) {
      const order = await prisma.order.findUnique({
        where: { id: task.referenceId },
        select: { shopId: true, customerId: true, captainId: true }
      });
      socketGateway.emitEvent("order:picked-up", {
        orderId: task.referenceId,
        taskId,
        shopId: order?.shopId,
        customerId: order?.customerId,
        captainId: order?.captainId,
        status: "PICKED_UP"
      });
    }
    if (status === DeliveryTaskStatus.DELIVERED) {
      const order = await prisma.order.findUnique({
        where: { id: task.referenceId },
        select: { shopId: true, customerId: true, captainId: true }
      });
      socketGateway.emitEvent("order:delivered", {
        orderId: task.referenceId,
        taskId,
        shopId: order?.shopId,
        customerId: order?.customerId,
        captainId: order?.captainId,
        status: "DELIVERED"
      });
    }
    return updated;
  }
};
