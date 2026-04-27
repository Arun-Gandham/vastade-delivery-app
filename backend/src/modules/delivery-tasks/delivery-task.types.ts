import type { DeliveryTaskType } from "@prisma/client";

export type DeliveryTaskCreateInput = {
  taskType: DeliveryTaskType;
  referenceId: string;
  referenceTable: string;
  shopId?: string;
  customerId?: string;
  pickupName?: string;
  pickupPhone?: string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropName?: string;
  dropPhone?: string;
  dropAddress: string;
  dropLatitude?: number;
  dropLongitude?: number;
  deliveryFee?: number;
  distanceKm?: number;
  estimatedPickupAt?: Date;
  estimatedDeliveryAt?: Date;
};

export type CaptainTaskRejectInput = {
  reason?: string;
};

export type CaptainTaskLocationContext = {
  latitude: number;
  longitude: number;
};
