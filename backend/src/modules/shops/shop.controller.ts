import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getOptionalParam, getParam } from "../../core/utils/request";
import { shopService } from "./shop.service";

export const shopController = {
  async create(req: Request, res: Response) {
    const data = await shopService.create(req.body);
    return sendSuccess(res, "Shop created successfully", data);
  },
  async nearby(req: Request, res: Response) {
    const data = await shopService.nearby(
      getOptionalParam(req.query.village),
      getOptionalParam(req.query.pincode)
    );
    return sendSuccess(res, "Shops fetched successfully", data);
  },
  async details(req: Request, res: Response) {
    const data = await shopService.details(getParam(req.params.shopId));
    return sendSuccess(res, "Shop fetched successfully", data);
  },
  async update(req: Request, res: Response) {
    const data = await shopService.update(getParam(req.params.shopId), req.body);
    return sendSuccess(res, "Shop updated successfully", data);
  },
  async updateOpenStatus(req: Request, res: Response) {
    const data = await shopService.updateOpenStatus(
      req.authUser!.userId,
      getParam(req.params.shopId),
      req.body.isOpen
    );
    return sendSuccess(res, "Shop open status updated successfully", data);
  }
};
