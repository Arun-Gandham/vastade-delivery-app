import { Router } from "express";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { notificationController } from "./notification.controller";
import { notificationIdSchema, registerDeviceSchema } from "./notification.validation";

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);
notificationRouter.get("/", notificationController.list);
notificationRouter.patch("/:notificationId/read", validateRequest(notificationIdSchema), notificationController.markRead);
notificationRouter.post("/register-device", validateRequest(registerDeviceSchema), notificationController.registerDevice);
