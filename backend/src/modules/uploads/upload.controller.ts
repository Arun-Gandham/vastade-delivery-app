import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { uploadService } from "./upload.service";

export const uploadController = {
  async uploadImage(req: Request, res: Response) {
    const data = await uploadService.createImageUpload(req.body);
    return sendSuccess(res, "Direct image upload URL created successfully", data);
  }
};
