import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { deliveryTaskController } from "./delivery-task.controller";
import { captainTaskRejectSchema, parcelCreateSchema } from "./delivery-task.validation";

export const captainTaskRouter = Router();
export const adminDeliveryTaskRouter = Router();
export const shopDeliveryTaskRouter = Router();
export const customerDeliveryTaskRouter = Router();
export const parcelRouter = Router();

captainTaskRouter.use(authMiddleware, roleMiddleware(UserRole.CAPTAIN));
captainTaskRouter.get("/tasks", deliveryTaskController.captainTasks);
captainTaskRouter.post("/tasks/:taskId/accept", deliveryTaskController.accept);
captainTaskRouter.post("/tasks/:taskId/reject", validateRequest(captainTaskRejectSchema), deliveryTaskController.reject);
captainTaskRouter.post("/tasks/:taskId/reached-pickup", deliveryTaskController.reachedPickup);
captainTaskRouter.post("/tasks/:taskId/picked-up", deliveryTaskController.pickedUp);
captainTaskRouter.post("/tasks/:taskId/reached-drop", deliveryTaskController.reachedDrop);
captainTaskRouter.post("/tasks/:taskId/delivered", deliveryTaskController.delivered);
captainTaskRouter.post("/tasks/:taskId/failed", deliveryTaskController.failed);

adminDeliveryTaskRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminDeliveryTaskRouter.get("/delivery-tasks", deliveryTaskController.adminList);
adminDeliveryTaskRouter.get("/delivery-tasks/:id", deliveryTaskController.adminDetails);

shopDeliveryTaskRouter.use(authMiddleware, roleMiddleware(UserRole.SHOP_OWNER, UserRole.STORE_MANAGER));
shopDeliveryTaskRouter.get("/orders/:orderId/delivery", deliveryTaskController.shopOrderDelivery);
shopDeliveryTaskRouter.get("/delivery-tasks/:taskId", deliveryTaskController.shopTaskDetails);
shopDeliveryTaskRouter.get("/delivery-tasks/:taskId/tracking", deliveryTaskController.shopTaskTracking);

customerDeliveryTaskRouter.get(
  "/orders/:orderId/delivery",
  authMiddleware,
  roleMiddleware(UserRole.CUSTOMER),
  deliveryTaskController.customerOrderDelivery
);
customerDeliveryTaskRouter.get(
  "/orders/:orderId/tracking",
  authMiddleware,
  roleMiddleware(UserRole.CUSTOMER),
  deliveryTaskController.customerOrderTracking
);

parcelRouter.use(authMiddleware, roleMiddleware(UserRole.CUSTOMER));
parcelRouter.post("/", validateRequest(parcelCreateSchema), deliveryTaskController.createParcel);
parcelRouter.get("/my", deliveryTaskController.myParcels);
parcelRouter.get("/:id", deliveryTaskController.parcelDetails);
