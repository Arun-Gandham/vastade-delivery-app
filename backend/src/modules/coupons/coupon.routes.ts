import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { couponController } from "./coupon.controller";
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from "./coupon.validation";

export const couponRouter = Router();
export const adminCouponRouter = Router();

couponRouter.post("/validate", authMiddleware, validateRequest(validateCouponSchema), couponController.validate);

adminCouponRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminCouponRouter.post("/", validateRequest(createCouponSchema), couponController.create);
adminCouponRouter.patch("/:couponId", validateRequest(updateCouponSchema), couponController.update);
adminCouponRouter.delete("/:couponId", couponController.remove);
