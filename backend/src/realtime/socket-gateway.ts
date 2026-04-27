import { EventEmitter } from "node:events";

export type RealtimeEventName =
  | "captain:connect"
  | "captain:go_online"
  | "captain:go_offline"
  | "captain:location_update"
  | "captain:task_offer_received"
  | "captain:task_offer_expired"
  | "captain:task_accepted"
  | "captain:task_cancelled"
  | "captain:task_status_updated"
  | "captain:earnings_updated"
  | "delivery_task_created"
  | "delivery_task_assigned"
  | "captain_location_updated"
  | "delivery_status_updated"
  | "order_out_for_delivery"
  | "order_delivered";

class SocketGateway extends EventEmitter {
  emitEvent(event: RealtimeEventName, payload: Record<string, unknown>) {
    this.emit(event, payload);
  }
}

export const socketGateway = new SocketGateway();
