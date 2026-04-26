import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { shopController } from "./shop.controller";
import { createShopSchema, toggleOpenSchema, updateShopSchema } from "./shop.validation";

export const shopRouter = Router();
export const adminShopRouter = Router();
export const shopOwnerShopRouter = Router();

shopRouter.get("/nearby", shopController.nearby);
shopRouter.get("/:shopId", shopController.details);

adminShopRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminShopRouter.post("/", validateRequest(createShopSchema), shopController.create);
adminShopRouter.patch("/:shopId", validateRequest(updateShopSchema), shopController.update);

shopOwnerShopRouter.use(
  authMiddleware,
  roleMiddleware(UserRole.SHOP_OWNER, UserRole.STORE_MANAGER)
);
shopOwnerShopRouter.patch(
  "/:shopId/open-status",
  validateRequest(toggleOpenSchema),
  shopController.updateOpenStatus
);
