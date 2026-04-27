import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { orderController } from "./order.controller";
import {
  assignCaptainSchema,
  cancelOrderSchema,
  captainDeliveredSchema,
  captainPickedUpSchema,
  captainRejectSchema,
  orderActionSchema,
  placeOrderSchema,
  updateOrderStatusSchema
} from "./order.validation";

export const orderRouter = Router();
export const shopOrderRouter = Router();
export const adminOrderRouter = Router();
export const captainOrderRouter = Router();

orderRouter.use(authMiddleware, roleMiddleware(UserRole.CUSTOMER));
orderRouter.post("/", validateRequest(placeOrderSchema), orderController.place);
orderRouter.get("/my", orderController.myOrders);
orderRouter.get("/:orderId", orderController.details);
orderRouter.post("/:orderId/cancel", validateRequest(cancelOrderSchema), orderController.cancelByCustomer);

shopOrderRouter.use(authMiddleware, roleMiddleware(UserRole.SHOP_OWNER, UserRole.STORE_MANAGER));
shopOrderRouter.get("/shops/:shopId/orders", orderController.listShopOrders);
shopOrderRouter.get("/shops/:shopId/orders/:orderId", orderController.shopDetails);
shopOrderRouter.patch("/orders/:orderId/accept", validateRequest(orderActionSchema), orderController.confirm);
shopOrderRouter.patch("/orders/:orderId/ready-for-pickup", validateRequest(orderActionSchema), orderController.readyForPickup);
shopOrderRouter.post("/orders/:orderId/cancel", validateRequest(cancelOrderSchema), orderController.cancelByShop);
shopOrderRouter.post("/orders/:orderId/assign-captain", validateRequest(assignCaptainSchema), orderController.assignCaptain);

adminOrderRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminOrderRouter.get("/orders", orderController.adminOrders);
adminOrderRouter.get("/orders/:orderId", orderController.adminDetails);
adminOrderRouter.patch("/orders/:orderId/accept", validateRequest(orderActionSchema), orderController.adminAccept);
adminOrderRouter.patch("/orders/:orderId/ready-for-pickup", validateRequest(orderActionSchema), orderController.adminReadyForPickup);
adminOrderRouter.patch("/orders/:orderId/status", validateRequest(updateOrderStatusSchema), orderController.adminUpdateStatus);
adminOrderRouter.get("/captains/available", orderController.availableCaptains);
adminOrderRouter.post("/orders/:orderId/assign-captain", validateRequest(assignCaptainSchema), orderController.assignCaptain);

captainOrderRouter.use(authMiddleware, roleMiddleware(UserRole.CAPTAIN));
captainOrderRouter.get("/orders/available", orderController.captainAvailableOrders);
captainOrderRouter.get("/orders/active", orderController.captainActiveOrders);
captainOrderRouter.patch("/orders/:orderId/accept", validateRequest(orderActionSchema), orderController.captainAccept);
captainOrderRouter.post("/orders/:orderId/reject", validateRequest(captainRejectSchema), orderController.captainReject);
captainOrderRouter.patch("/orders/:orderId/picked-up", validateRequest(captainPickedUpSchema), orderController.captainPickedUp);
captainOrderRouter.patch("/orders/:orderId/delivered", validateRequest(captainDeliveredSchema), orderController.captainDeliver);
