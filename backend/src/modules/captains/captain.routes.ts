import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { authRateLimiter } from "../../core/middleware/rate-limit";
import { validateRequest } from "../../core/middleware/validate-request";
import { captainController } from "./captain.controller";
import {
  captainDecisionSchema,
  captainDocumentUploadSchema,
  captainGoOfflineSchema,
  captainGoOnlineSchema,
  captainLocationSchema,
  captainProfileUpdateSchema,
  captainStatusSchema,
  registerCaptainSchema
} from "./captain.validation";

export const captainRouter = Router();
export const captainAdminRouter = Router();

captainRouter.post("/register", validateRequest(registerCaptainSchema), captainController.register);
captainRouter.post("/login", authRateLimiter, captainController.login);
captainRouter.get("/me", authMiddleware, roleMiddleware(UserRole.CAPTAIN), captainController.me);
captainRouter.put(
  "/profile",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainProfileUpdateSchema),
  captainController.updateProfile
);
captainRouter.post(
  "/go-online",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainGoOnlineSchema),
  (req, _res, next) => {
    req.body.availabilityStatus = "ONLINE";
    next();
  },
  captainController.updateStatus
);
captainRouter.post(
  "/go-offline",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainGoOfflineSchema),
  (req, _res, next) => {
    req.body.availabilityStatus = "OFFLINE";
    next();
  },
  captainController.updateStatus
);
captainRouter.post(
  "/location/update",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainLocationSchema),
  captainController.updateLocation
);
captainRouter.patch(
  "/me/status",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainStatusSchema),
  captainController.updateStatus
);
captainRouter.post(
  "/documents/upload",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  validateRequest(captainDocumentUploadSchema),
  captainController.uploadDocument
);
captainRouter.get(
  "/documents",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  captainController.listDocuments
);
captainRouter.delete(
  "/documents/:id",
  authMiddleware,
  roleMiddleware(UserRole.CAPTAIN),
  captainController.deleteDocument
);

captainAdminRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
captainAdminRouter.get("/captains", captainController.adminList);
captainAdminRouter.get("/captains/:id", captainController.adminDetails);
captainAdminRouter.post(
  "/captains/:id/approve",
  validateRequest(captainDecisionSchema),
  captainController.approve
);
captainAdminRouter.post(
  "/captains/:id/reject",
  validateRequest(captainDecisionSchema),
  captainController.reject
);
captainAdminRouter.post(
  "/captains/:id/block",
  validateRequest(captainDecisionSchema),
  captainController.block
);
captainAdminRouter.post(
  "/captains/:id/unblock",
  validateRequest(captainDecisionSchema),
  captainController.unblock
);
captainAdminRouter.get("/captains/:id/documents", captainController.adminDocuments);
captainAdminRouter.get("/captains/:id/deliveries", captainController.adminDeliveries);
captainAdminRouter.get("/captains/:id/earnings", captainController.adminEarnings);
