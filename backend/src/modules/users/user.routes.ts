import { Router } from "express";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { userController } from "./user.controller";
import { updateProfileSchema } from "./user.validation";

export const userRouter = Router();

userRouter.get("/me", authMiddleware, userController.getMe);
userRouter.patch("/me", authMiddleware, validateRequest(updateProfileSchema), userController.updateMe);
