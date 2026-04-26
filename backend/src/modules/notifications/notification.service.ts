import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { notificationRepository } from "./notification.repository";

export const notificationService = {
  list: notificationRepository.listByUser,
  async markRead(userId: string, notificationId: string) {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN, ERROR_CODES.AUTH_FORBIDDEN);
    }
    return notificationRepository.markRead(notificationId);
  },
  async registerDevice(userId: string, fcmToken: string, deviceType: string) {
    await notificationRepository.saveDevice(userId, fcmToken, deviceType);
    return { fcmToken, deviceType };
  }
};
