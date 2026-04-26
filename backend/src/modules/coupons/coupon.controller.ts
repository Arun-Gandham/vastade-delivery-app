import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { couponService } from "./coupon.service";

export const couponController = {
  async validate(req: Request, res: Response) {
    const data = await couponService.validate(req.body);
    return sendSuccess(res, "Coupon validated successfully", data);
  },
  async create(req: Request, res: Response) {
    const data = await couponService.create(req.body);
    return sendSuccess(res, "Coupon created successfully", data);
  },
  async update(req: Request, res: Response) {
    const data = await couponService.update(getParam(req.params.couponId), req.body);
    return sendSuccess(res, "Coupon updated successfully", data);
  },
  async remove(req: Request, res: Response) {
    await couponService.remove(getParam(req.params.couponId));
    return sendSuccess(res, "Coupon deleted successfully");
  }
};
