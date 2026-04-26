import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { inventoryController } from "./inventory.controller";
import { adjustInventorySchema, bulkInventorySchema, updateInventorySchema } from "./inventory.validation";

export const inventoryRouter = Router();

inventoryRouter.use(
  authMiddleware,
  roleMiddleware(UserRole.SHOP_OWNER, UserRole.STORE_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
);
inventoryRouter.get("/:shopId/inventory", inventoryController.list);
inventoryRouter.post("/:shopId/inventory/bulk", validateRequest(bulkInventorySchema), inventoryController.bulkUpsert);
inventoryRouter.put("/:shopId/inventory/:productId", validateRequest(updateInventorySchema), inventoryController.upsert);
inventoryRouter.post(
  "/:shopId/inventory/:productId/adjust",
  validateRequest(adjustInventorySchema),
  inventoryController.adjust
);
