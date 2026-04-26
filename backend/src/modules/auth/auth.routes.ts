import { Router } from "express";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import { authRateLimiter } from "../../core/middleware/rate-limit";
import { validateRequest } from "../../core/middleware/validate-request";
import { authController } from "./auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerCustomerSchema
} from "./auth.validation";

export const authRouter = Router();

authRouter.post("/customer/register", validateRequest(registerCustomerSchema), authController.registerCustomer);
authRouter.post("/login", authRateLimiter, validateRequest(loginSchema), authController.login);
authRouter.post("/refresh-token", validateRequest(refreshTokenSchema), authController.refreshToken);
authRouter.post("/logout", authMiddleware, validateRequest(refreshTokenSchema), authController.logout);
authRouter.post(
  "/change-password",
  authMiddleware,
  validateRequest(changePasswordSchema),
  authController.changePassword
);
