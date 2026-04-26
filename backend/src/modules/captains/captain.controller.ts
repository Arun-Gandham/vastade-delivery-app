import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { captainService } from "./captain.service";

export const captainController = {
  async register(req: Request, res: Response) {
    const data = await captainService.register(req.body);
    return sendSuccess(res, "Captain registered successfully", data);
  },
  async updateStatus(req: Request, res: Response) {
    const data = await captainService.updateStatus(req.authUser!.userId, req.body);
    return sendSuccess(res, "Captain status updated successfully", data);
  },
  async updateLocation(req: Request, res: Response) {
    const data = await captainService.updateLocation(req.authUser!.userId, req.body);
    return sendSuccess(res, "Captain location updated successfully", data);
  },
  async me(req: Request, res: Response) {
    const data = await captainService.me(req.authUser!.userId);
    return sendSuccess(res, "Captain profile fetched successfully", data);
  }
};
