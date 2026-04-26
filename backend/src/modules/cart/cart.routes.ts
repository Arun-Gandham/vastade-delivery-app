import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { cartController } from "./cart.controller";
import { addCartItemSchema, deleteCartItemSchema, updateCartItemSchema } from "./cart.validation";

export const cartRouter = Router();

cartRouter.use(authMiddleware, roleMiddleware(UserRole.CUSTOMER));
cartRouter.get("/", cartController.get);
cartRouter.post("/items", validateRequest(addCartItemSchema), cartController.addItem);
cartRouter.patch("/items/:cartItemId", validateRequest(updateCartItemSchema), cartController.updateItem);
cartRouter.delete("/items/:cartItemId", validateRequest(deleteCartItemSchema), cartController.deleteItem);
cartRouter.delete("/", cartController.clear);
