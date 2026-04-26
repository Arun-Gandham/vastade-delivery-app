import { Queue } from "bullmq";
import { redis } from "../database/redis";

export const orderNotificationQueue = redis
  ? new Queue("order-notifications", {
      connection: redis
    })
  : null;

export const deliveryAssignmentNotificationQueue = redis
  ? new Queue("delivery-assignment-notifications", {
      connection: redis
    })
  : null;

export const orderDeliveredNotificationQueue = redis
  ? new Queue("order-delivered-notifications", {
      connection: redis
    })
  : null;

export const cancelUnpaidOrderQueue = redis
  ? new Queue("cancel-unpaid-orders", {
      connection: redis
    })
  : null;

export const lowStockAlertQueue = redis
  ? new Queue("low-stock-alerts", {
      connection: redis
    })
  : null;
