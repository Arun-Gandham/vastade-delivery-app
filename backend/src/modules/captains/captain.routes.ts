import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { captainController } from "./captain.controller";
import { captainLocationSchema, captainStatusSchema, registerCaptainSchema } from "./captain.validation";

export const captainRouter = Router();

captainRouter.post("/register", validateRequest(registerCaptainSchema), captainController.register);
captainRouter.get("/me", authMiddleware, roleMiddleware(UserRole.CAPTAIN), captainController.me);
captainRouter.patch(
  "/me/online-status",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainStatusSchema),
  captainController.updateStatus
);
captainRouter.patch(
  "/me/location",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainLocationSchema),
  captainController.updateLocation
);
