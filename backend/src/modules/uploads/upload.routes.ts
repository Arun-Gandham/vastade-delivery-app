import { Router } from "express";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import { validateRequest } from "../../core/middleware/validate-request";
import { uploadController } from "./upload.controller";
import { createImageUploadSchema } from "./upload.validation";

export const uploadRouter = Router();

uploadRouter.post("/image", authMiddleware, validateRequest(createImageUploadSchema), uploadController.uploadImage);
