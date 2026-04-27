import {
  CaptainAvailabilityStatus,
  CaptainRegistrationStatus,
  CaptainTaskOfferStatus,
  DeliveryTaskStatus,
  Prisma
} from "@prisma/client";
import { prisma } from "../../database/prisma";
import type { DeliveryTaskCreateInput } from "./delivery-task.types";

const db = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export const deliveryTaskRepository = {
  createTask: (input: DeliveryTaskCreateInput, tx?: Prisma.TransactionClient) =>
    db(tx).deliveryTask.create({
      data: {
        ...input,
        status: DeliveryTaskStatus.CREATED
      }
    }),

  findTaskById: (taskId: string, tx?: Prisma.TransactionClient) =>
    db(tx).deliveryTask.findUnique({
      where: { id: taskId },
      include: { offers: true, captain: { include: { user: true } }, earnings: true }
    }),

  findOrderTaskByOrderId: (orderId: string, tx?: Prisma.TransactionClient) =>
    db(tx).deliveryTask.findFirst({
      where: {
        referenceTable: "orders",
        referenceId: orderId
      },
      include: { offers: true, captain: { include: { user: true } }, earnings: true }
    }),

  updateTask: (taskId: string, data: Prisma.DeliveryTaskUncheckedUpdateInput, tx?: Prisma.TransactionClient) =>
    db(tx).deliveryTask.update({
      where: { id: taskId },
      data
    }),

  findNearbyCaptains: async (
    radiusKm: number
  ) =>
    prisma.captain.findMany({
      where: {
        registrationStatus: CaptainRegistrationStatus.APPROVED,
        availabilityStatus: CaptainAvailabilityStatus.ONLINE,
        isOnline: true,
        isAvailable: true,
        currentLatitude: { not: null },
        currentLongitude: { not: null }
      },
      include: { user: true, vehicles: true, bankDetails: true },
      orderBy: { updatedAt: "desc" }
    }),

  createOffer: (
    input: {
      deliveryTaskId: string;
      captainId: string;
      distanceToPickupKm?: number;
      pickupToDropKm?: number;
      estimatedEarning?: number;
      expiresAt?: Date;
    },
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).captainTaskOffer.create({
      data: {
        ...input,
        status: CaptainTaskOfferStatus.SENT
      }
    }),

  expireOtherOffers: (taskId: string, acceptedCaptainId: string, tx?: Prisma.TransactionClient) =>
    db(tx).captainTaskOffer.updateMany({
      where: {
        deliveryTaskId: taskId,
        captainId: { not: acceptedCaptainId },
        status: CaptainTaskOfferStatus.SENT
      },
      data: {
        status: CaptainTaskOfferStatus.EXPIRED,
        respondedAt: new Date()
      }
    }),

  updateOffer: (
    taskId: string,
    captainId: string,
    data: Prisma.CaptainTaskOfferUncheckedUpdateInput,
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).captainTaskOffer.updateMany({
      where: { deliveryTaskId: taskId, captainId },
      data
    }),

  findOffer: (taskId: string, captainId: string, tx?: Prisma.TransactionClient) =>
    db(tx).captainTaskOffer.findFirst({
      where: { deliveryTaskId: taskId, captainId }
    }),

  listOffersByTask: (taskId: string, tx?: Prisma.TransactionClient) =>
    db(tx).captainTaskOffer.findMany({
      where: { deliveryTaskId: taskId }
    }),

  createParcelOrder: (
    input: {
      customerId: string;
      senderName: string;
      senderPhone: string;
      pickupAddress: string;
      pickupLatitude?: number;
      pickupLongitude?: number;
      receiverName: string;
      receiverPhone: string;
      dropAddress: string;
      dropLatitude?: number;
      dropLongitude?: number;
      packageDetails?: string;
      deliveryFee?: number;
    },
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).parcelOrder.create({
      data: {
        ...input,
        status: "CREATED",
        deliveryFee: input.deliveryFee ?? 0
      }
    }),

  listParcelOrdersByCustomer: (customerId: string) =>
    prisma.parcelOrder.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" }
    }),

  findParcelById: (parcelId: string) =>
    prisma.parcelOrder.findUnique({
      where: { id: parcelId }
    }),

  createEarning: (
    input: { captainId: string; deliveryTaskId: string; amount: number; status: string },
    tx?: Prisma.TransactionClient
  ) =>
    db(tx).captainEarning.create({
      data: input
    })
};
