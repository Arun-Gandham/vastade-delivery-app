import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { addressController } from "./address.controller";
import { addressIdSchema, createAddressSchema, updateAddressSchema } from "./address.validation";

export const addressRouter = Router();

addressRouter.use(authMiddleware, roleMiddleware(UserRole.CUSTOMER));
addressRouter.post("/", validateRequest(createAddressSchema), addressController.create);
addressRouter.get("/", addressController.list);
addressRouter.patch("/:addressId", validateRequest(updateAddressSchema), addressController.update);
addressRouter.delete("/:addressId", validateRequest(addressIdSchema), addressController.remove);
addressRouter.patch("/:addressId/default", validateRequest(addressIdSchema), addressController.setDefault);
