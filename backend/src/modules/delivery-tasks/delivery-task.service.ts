import {
  CaptainAvailabilityStatus,
  CaptainTaskOfferStatus,
  DeliveryTaskStatus,
  DeliveryTaskType,
  OrderStatus,
  PaymentMode,
  PaymentStatus
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

  async offerToNearbyCaptains(taskId: string) {
    const task = await ensureTask(taskId);
    if (!task.pickupLatitude || !task.pickupLongitude) {
      return task;
    }

    const nearby = await deliveryTaskRepository.findNearbyCaptains(env.CAPTAIN_MATCH_RADIUS_KM);
    const sorted = nearby
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
      .slice(0, env.CAPTAIN_MATCH_LIMIT);

    await prisma.$transaction(async (tx) => {
      await deliveryTaskRepository.updateTask(
        taskId,
        { status: DeliveryTaskStatus.OFFERED_TO_CAPTAINS },
        tx
      );

      for (const item of sorted) {
        await deliveryTaskRepository.createOffer(
          {
            deliveryTaskId: taskId,
            captainId: item.captain.id,
            distanceToPickupKm: Number(item.distanceToPickupKm.toFixed(2)),
            pickupToDropKm: task.dropLatitude && task.dropLongitude
              ? Number(
                  haversineDistanceKm(
                    { latitude: Number(task.pickupLatitude), longitude: Number(task.pickupLongitude) },
                    { latitude: Number(task.dropLatitude), longitude: Number(task.dropLongitude) }
                  ).toFixed(2)
                )
              : undefined,
            estimatedEarning: Number(task.deliveryFee),
            expiresAt: new Date(Date.now() + env.CAPTAIN_TASK_OFFER_EXPIRES_IN_SECONDS * 1000)
          },
          tx
        );
      }
    });

    for (const item of sorted) {
      socketGateway.emitEvent("captain:task_offer_received", {
        captainId: item.captain.id,
        taskId,
        taskType: task.taskType,
        pickupAddress: task.pickupAddress,
        dropAddress: task.dropAddress,
        distanceToPickupKm: Number(item.distanceToPickupKm.toFixed(2)),
        pickupToDropKm: task.dropLatitude && task.dropLongitude
          ? Number(
              haversineDistanceKm(
                { latitude: Number(task.pickupLatitude), longitude: Number(task.pickupLongitude) },
                { latitude: Number(task.dropLatitude), longitude: Number(task.dropLongitude) }
              ).toFixed(2)
            )
          : undefined,
        estimatedEarning: Number(task.deliveryFee),
        estimatedTime: env.CAPTAIN_TASK_OFFER_EXPIRES_IN_SECONDS
      });
    }

    return ensureTask(taskId);
  },

  async captainAccept(captainUserId: string, taskId: string) {
    const captain = await prisma.captain.findUnique({
      where: { userId: captainUserId }
    });
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    if (captain.registrationStatus !== "APPROVED") {
      throw new AppError("Captain not approved", StatusCodes.FORBIDDEN, ERROR_CODES.CAPTAIN_NOT_APPROVED);
    }
    if (captain.availabilityStatus !== CaptainAvailabilityStatus.ONLINE) {
      throw new AppError("Captain not available", StatusCodes.BAD_REQUEST, ERROR_CODES.CAPTAIN_NOT_AVAILABLE);
    }

    return prisma.$transaction(async (tx) => {
      const task = await prisma.deliveryTask.findUnique({
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

      await deliveryTaskRepository.updateOffer(taskId, captain.id, {
        status: CaptainTaskOfferStatus.ACCEPTED,
        respondedAt: new Date()
      }, tx);
      await deliveryTaskRepository.expireOtherOffers(taskId, captain.id, tx);

      const updatedTask = await deliveryTaskRepository.updateTask(
        taskId,
        {
          captainId: captain.id,
          status: DeliveryTaskStatus.ACCEPTED,
          assignedAt: new Date()
        },
        tx
      );

      await tx.captain.update({
        where: { id: captain.id },
        data: {
          availabilityStatus: CaptainAvailabilityStatus.BUSY,
          isAvailable: false,
          isOnline: true
        }
      });

      if (task.referenceTable === "orders") {
        await tx.order.update({
          where: { id: task.referenceId },
          data: {
            captainId: captain.userId,
            status: OrderStatus.ASSIGNED_TO_CAPTAIN
          }
        });
      }

      socketGateway.emitEvent("captain:task_accepted", {
        captainId: captain.id,
        taskId
      });
      socketGateway.emitEvent("delivery_task_assigned", {
        taskId,
        captainId: captain.id
      });

      return updatedTask;
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

  async listCaptainTasks(captainUserId: string) {
    const captain = await prisma.captain.findUnique({ where: { userId: captainUserId } });
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
    return prisma.deliveryTask.findMany({
      where: {
        OR: [{ captainId: captain.id }, { offers: { some: { captainId: captain.id } } }]
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
    const captain = await prisma.captain.findUnique({ where: { userId: captainUserId } });
    if (!captain) {
      throw new AppError("Captain not found", StatusCodes.NOT_FOUND, ERROR_CODES.CAPTAIN_NOT_FOUND);
    }
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
        const orderStatus =
          status === DeliveryTaskStatus.PICKED_UP
            ? OrderStatus.OUT_FOR_DELIVERY
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
        }
      }

      return taskUpdate;
    });

    socketGateway.emitEvent("captain:task_status_updated", {
      taskId,
      captainId: captain.id,
      status
    });
    socketGateway.emitEvent("delivery_status_updated", {
      taskId,
      status
    });
    if (status === DeliveryTaskStatus.PICKED_UP) {
      socketGateway.emitEvent("order_out_for_delivery", {
        taskId,
        referenceId: task.referenceId
      });
    }
    if (status === DeliveryTaskStatus.DELIVERED) {
      socketGateway.emitEvent("order_delivered", {
        taskId,
        referenceId: task.referenceId
      });
    }
    return updated;
  }
};
