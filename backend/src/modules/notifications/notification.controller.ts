import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { notificationService } from "./notification.service";

export const notificationController = {
  async list(req: Request, res: Response) {
    const data = await notificationService.list(req.authUser!.userId);
    return sendSuccess(res, "Notifications fetched successfully", data);
  },
  async markRead(req: Request, res: Response) {
    const data = await notificationService.markRead(
      req.authUser!.userId,
      getParam(req.params.notificationId)
    );
    return sendSuccess(res, "Notification marked as read", data);
  },
  async registerDevice(req: Request, res: Response) {
    const data = await notificationService.registerDevice(
      req.authUser!.userId,
      req.body.fcmToken,
      req.body.deviceType
    );
    return sendSuccess(res, "Device registered successfully", data);
  }
};
