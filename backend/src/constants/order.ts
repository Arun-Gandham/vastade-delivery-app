import { OrderStatus } from "@prisma/client";

export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED
];

export const SHOP_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
  OrderStatus.CAPTAIN_ASSIGNED,
  OrderStatus.READY_FOR_PICKUP
];

export const ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PENDING]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED, OrderStatus.REJECTED],
  [OrderStatus.ACCEPTED]: [OrderStatus.CAPTAIN_ASSIGNED, OrderStatus.CANCELLED, OrderStatus.REJECTED],
  [OrderStatus.CAPTAIN_ASSIGNED]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
  [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
  [OrderStatus.PICKED_UP]: [OrderStatus.DELIVERED]
};
