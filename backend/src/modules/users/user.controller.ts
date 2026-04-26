import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { userService } from "./user.service";

export const userController = {
  async getMe(req: Request, res: Response) {
    const data = await userService.getMe(req.authUser!.userId);
    return sendSuccess(res, "Profile fetched successfully", data);
  },

  async updateMe(req: Request, res: Response) {
    const data = await userService.updateMe(req.authUser!.userId, req.body);
    return sendSuccess(res, "Profile updated successfully", data);
  }
};
