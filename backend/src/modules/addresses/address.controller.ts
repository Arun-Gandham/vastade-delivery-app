import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { addressService } from "./address.service";

export const addressController = {
  async create(req: Request, res: Response) {
    const data = await addressService.create(req.authUser!.userId, req.body);
    return sendSuccess(res, "Address created successfully", data);
  },
  async list(req: Request, res: Response) {
    const data = await addressService.list(req.authUser!.userId);
    return sendSuccess(res, "Addresses fetched successfully", data);
  },
  async update(req: Request, res: Response) {
    const data = await addressService.update(req.authUser!.userId, getParam(req.params.addressId), req.body);
    return sendSuccess(res, "Address updated successfully", data);
  },
  async remove(req: Request, res: Response) {
    await addressService.remove(req.authUser!.userId, getParam(req.params.addressId));
    return sendSuccess(res, "Address deleted successfully");
  },
  async setDefault(req: Request, res: Response) {
    const data = await addressService.setDefault(req.authUser!.userId, getParam(req.params.addressId));
    return sendSuccess(res, "Default address updated successfully", data);
  }
};
