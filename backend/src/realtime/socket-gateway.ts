import type { Server as HttpServer } from "node:http";
import { UserRole } from "@prisma/client";
import { Server, type Socket } from "socket.io";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { verifyAccessToken } from "../core/utils/jwt";
import { prisma } from "../database/prisma";

export type RealtimeEventName =
  | "captain:connect"
  | "captain:go_online"
  | "captain:go_offline"
  | "captain:location_update"
  | "captain:task_offer_received"
  | "captain:task_offer_expired"
  | "captain:task_accepted"
  | "captain:task_removed"
  | "captain:task_cancelled"
  | "captain:task_status_updated"
  | "captain:earnings_updated"
  | "order:available-for-captains"
  | "order:assigned"
  | "order:remove-from-available"
  | "order:ready-for-pickup"
  | "order:picked-up"
  | "order:delivered"
  | "delivery_task_created"
  | "delivery_task_assigned"
  | "captain_location_updated"
  | "delivery_status_updated"
  | "order_out_for_delivery"
  | "order_delivered";

type SocketAuthUser = {
  userId: string;
  role: UserRole;
  captainId?: string | null;
};

const parseOrigins = () => (env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()));

const extractToken = (socket: Socket) => {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken;
  }

  const authorization = socket.handshake.headers.authorization;
  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const asString = (value: unknown) => (typeof value === "string" && value.trim() ? value : undefined);

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];

class SocketGateway {
  private io: Server | null = null;

  attach(httpServer: HttpServer) {
    if (!env.SOCKET_ENABLED || this.io) {
      return;
    }

    this.io = new Server(httpServer, {
      cors: {
        origin: parseOrigins(),
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = extractToken(socket);
        if (!token) {
          return next(new Error("Unauthorized"));
        }

        const payload = verifyAccessToken(token);
        let captainId: string | null = null;

        if (payload.role === UserRole.CAPTAIN) {
          const captain = await prisma.captain.findUnique({
            where: { userId: payload.userId },
            select: { id: true }
          });
          captainId = captain?.id ?? null;
        }

        socket.data.authUser = {
          userId: payload.userId,
          role: payload.role,
          captainId
        } satisfies SocketAuthUser;

        return next();
      } catch (error) {
        logger.warn({ err: error }, "Socket authentication failed");
        return next(new Error("Unauthorized"));
      }
    });

    this.io.on("connection", (socket) => {
      void this.handleConnection(socket);
    });
  }

  private async handleConnection(socket: Socket) {
    const authUser = socket.data.authUser as SocketAuthUser | undefined;
    if (!authUser) {
      socket.disconnect();
      return;
    }

    socket.join(`user:${authUser.userId}`);

    if (authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN) {
      socket.join("admin");
      socket.join(`admin:${authUser.userId}`);
    }

    if (authUser.role === UserRole.SHOP_OWNER || authUser.role === UserRole.STORE_MANAGER) {
      const [ownedShops, managedShops] = await Promise.all([
        prisma.shop.findMany({
          where: { ownerId: authUser.userId },
          select: { id: true }
        }),
        prisma.shopStaff.findMany({
          where: { userId: authUser.userId, isActive: true },
          select: { shopId: true }
        })
      ]);

      for (const shopId of new Set([
        ...ownedShops.map((shop) => shop.id),
        ...managedShops.map((shop) => shop.shopId)
      ])) {
        socket.join(`shop:${shopId}`);
      }
    }

    if (authUser.role === UserRole.CAPTAIN && authUser.captainId) {
      socket.join(`captain:${authUser.captainId}`);
      const captain = await prisma.captain.findUnique({
        where: { id: authUser.captainId },
        select: { isOnline: true, availabilityStatus: true }
      });
      if (captain?.isOnline && captain.availabilityStatus === "ONLINE") {
        socket.join("captains:online");
      }
      socket.emit("captain:connect", {
        captainId: authUser.captainId,
        userId: authUser.userId
      });
    }

    socket.on("subscribe:delivery-task", (taskId: unknown) => {
      const normalizedTaskId = asString(taskId);
      if (normalizedTaskId) {
        socket.join(`delivery-task:${normalizedTaskId}`);
      }
    });

    socket.on("unsubscribe:delivery-task", (taskId: unknown) => {
      const normalizedTaskId = asString(taskId);
      if (normalizedTaskId) {
        socket.leave(`delivery-task:${normalizedTaskId}`);
      }
    });

    socket.on("subscribe:order", (orderId: unknown) => {
      const normalizedOrderId = asString(orderId);
      if (normalizedOrderId) {
        socket.join(`order:${normalizedOrderId}`);
      }
    });

    socket.on("unsubscribe:order", (orderId: unknown) => {
      const normalizedOrderId = asString(orderId);
      if (normalizedOrderId) {
        socket.leave(`order:${normalizedOrderId}`);
      }
    });
  }

  private emitToCaptainRooms(event: RealtimeEventName, payload: Record<string, unknown>) {
    if (!this.io) {
      return;
    }

    const captainIds = [
      ...asStringArray(payload.captainIds),
      ...[asString(payload.captainId)].filter((item): item is string => Boolean(item))
    ];

    for (const captainId of new Set(captainIds)) {
      this.io.to(`captain:${captainId}`).emit(event, payload);
    }
  }

  private emitToOnlineCaptains(event: RealtimeEventName, payload: Record<string, unknown>) {
    if (!this.io) {
      return;
    }

    this.io.to("captains:online").emit(event, payload);
  }

  private emitToAdminRooms(payload: Record<string, unknown>, event: RealtimeEventName) {
    if (!this.io) {
      return;
    }

    this.io.to("admin").emit(event, payload);

    const adminIds = asStringArray(payload.adminIds);
    for (const adminId of adminIds) {
      this.io.to(`admin:${adminId}`).emit(event, payload);
    }
  }

  private emitToShopRooms(payload: Record<string, unknown>, event: RealtimeEventName) {
    if (!this.io) {
      return;
    }

    const shopIds = [
      ...asStringArray(payload.shopIds),
      ...[asString(payload.shopId)].filter((item): item is string => Boolean(item))
    ];

    for (const shopId of new Set(shopIds)) {
      this.io.to(`shop:${shopId}`).emit(event, payload);
    }
  }

  private emitToUserRooms(payload: Record<string, unknown>, event: RealtimeEventName) {
    if (!this.io) {
      return;
    }

    const userIds = [
      ...asStringArray(payload.userIds),
      ...[asString(payload.userId), asString(payload.customerId)].filter((item): item is string => Boolean(item))
    ];

    for (const userId of new Set(userIds)) {
      this.io.to(`user:${userId}`).emit(event, payload);
    }
  }

  private emitOperational(event: RealtimeEventName, payload: Record<string, unknown>) {
    if (!this.io) {
      return;
    }

    this.emitToAdminRooms(payload, event);
    this.emitToShopRooms(payload, event);
    this.emitToUserRooms(payload, event);

    const taskId = asString(payload.taskId);
    if (taskId) {
      this.io.to(`delivery-task:${taskId}`).emit(event, payload);
    }

    const orderId = asString(payload.orderId) ?? asString(payload.referenceId);
    if (orderId) {
      this.io.to(`order:${orderId}`).emit(event, payload);
    }
  }

  syncCaptainOnlineRoom(userId: string, shouldJoin: boolean) {
    if (!this.io) {
      return;
    }

    if (shouldJoin) {
      this.io.in(`user:${userId}`).socketsJoin("captains:online");
      return;
    }

    this.io.in(`user:${userId}`).socketsLeave("captains:online");
  }

  emitEvent(event: RealtimeEventName, payload: Record<string, unknown>) {
    if (!env.SOCKET_ENABLED || !this.io) {
      return;
    }

    switch (event) {
      case "captain:go_online":
      case "captain:go_offline":
      case "captain:location_update":
      case "captain:task_offer_received":
      case "captain:task_offer_expired":
      case "captain:task_accepted":
      case "captain:task_removed":
      case "captain:task_cancelled":
      case "captain:task_status_updated":
      case "captain:earnings_updated":
        this.emitToCaptainRooms(event, payload);
        break;
      case "order:available-for-captains":
        if (asStringArray(payload.captainIds).length || asString(payload.captainId)) {
          this.emitToCaptainRooms(event, payload);
        } else {
          this.emitToOnlineCaptains(event, payload);
        }
        break;
      case "order:remove-from-available":
        this.emitToOnlineCaptains(event, payload);
        this.emitToCaptainRooms(event, payload);
        break;
      default:
        this.emitOperational(event, payload);
        break;
    }
  }
}

export const socketGateway = new SocketGateway();
