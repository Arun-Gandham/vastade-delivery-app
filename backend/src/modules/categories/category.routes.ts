import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { categoryController } from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.validation";

export const categoryRouter = Router();
export const adminCategoryRouter = Router();

categoryRouter.get("/", categoryController.list);

adminCategoryRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminCategoryRouter.post("/", validateRequest(createCategorySchema), categoryController.create);
adminCategoryRouter.patch("/:categoryId", validateRequest(updateCategorySchema), categoryController.update);
adminCategoryRouter.delete("/:categoryId", categoryController.remove);
