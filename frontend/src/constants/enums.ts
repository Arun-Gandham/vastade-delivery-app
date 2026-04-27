export const addressTypes = ["HOME", "WORK", "OTHER"] as const;
export const orderStatuses = [
  "PENDING",
  "ACCEPTED",
  "CAPTAIN_ASSIGNED",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
] as const;
export const paymentModes = ["COD", "UPI_MANUAL", "RAZORPAY"] as const;
export const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "COD_PENDING",
  "COD_COLLECTED",
] as const;
export const vehicleTypes = ["BIKE", "CYCLE", "AUTO", "WALKING"] as const;
export const discountTypes = ["PERCENTAGE", "FLAT"] as const;
export const stockAdjustmentTypes = ["ADD", "REMOVE", "SET", "DAMAGED"] as const;
export const notificationChannels = ["PUSH", "SMS", "WHATSAPP", "EMAIL", "IN_APP"] as const;
