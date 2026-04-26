import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { productController } from "./product.controller";
import { createProductSchema, updateProductSchema } from "./product.validation";

export const productRouter = Router();
export const adminProductRouter = Router();

productRouter.get("/", productController.list);
productRouter.get("/:productId", productController.details);

adminProductRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminProductRouter.post("/", validateRequest(createProductSchema), productController.create);
adminProductRouter.patch("/:productId", validateRequest(updateProductSchema), productController.update);
adminProductRouter.delete("/:productId", productController.remove);
