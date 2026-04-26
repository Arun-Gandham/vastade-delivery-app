import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { paymentController } from "./payment.controller";
import {
  manualUpiMarkPaidSchema,
  razorpayCreateOrderSchema,
  razorpayVerifySchema
} from "./payment.validation";

export const paymentRouter = Router();

paymentRouter.use(authMiddleware);
paymentRouter.post(
  "/razorpay/create-order",
  roleMiddleware(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(razorpayCreateOrderSchema),
  paymentController.createRazorpayOrder
);
paymentRouter.post(
  "/razorpay/verify",
  roleMiddleware(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(razorpayVerifySchema),
  paymentController.verifyRazorpayPayment
);
paymentRouter.post(
  "/manual-upi/mark-paid",
  roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SHOP_OWNER, UserRole.STORE_MANAGER),
  validateRequest(manualUpiMarkPaidSchema),
  paymentController.markManualUpiPaid
);
