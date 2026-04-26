import { prisma } from "../../database/prisma";

export const notificationRepository = {
  listByUser: (userId: string) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),
  findById: (id: string) =>
    prisma.notification.findUnique({
      where: { id }
    }),
  markRead: (id: string) =>
    prisma.notification.update({
      where: { id },
      data: { isRead: true }
    }),
  saveDevice: (userId: string, fcmToken: string, deviceType: string) =>
    prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { fcmToken, deviceType }
    })
};
