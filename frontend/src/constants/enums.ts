export const addressTypes = ["HOME", "WORK", "OTHER"] as const;
export const orderStatuses = [
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "READY_FOR_PICKUP",
  "ASSIGNED_TO_CAPTAIN",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
  "REFUNDED",
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
