import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { inventoryService } from "./inventory.service";

export const inventoryController = {
  async list(req: Request, res: Response) {
    await inventoryService.assertAccess(req.authUser!.userId, req.authUser!.role, getParam(req.params.shopId));
    const data = await inventoryService.list(getParam(req.params.shopId));
    return sendSuccess(res, "Inventory fetched successfully", data);
  },
  async upsert(req: Request, res: Response) {
    await inventoryService.assertAccess(req.authUser!.userId, req.authUser!.role, getParam(req.params.shopId));
    const data = await inventoryService.upsert(
      getParam(req.params.shopId),
      getParam(req.params.productId),
      req.body
    );
    return sendSuccess(res, "Inventory updated successfully", data);
  },
  async bulkUpsert(req: Request, res: Response) {
    const shopId = getParam(req.params.shopId);
    await inventoryService.assertAccess(req.authUser!.userId, req.authUser!.role, shopId);
    const data = await inventoryService.bulkUpsert(shopId, req.body.items);
    return sendSuccess(res, "Inventory bulk updated successfully", data);
  },
  async adjust(req: Request, res: Response) {
    await inventoryService.assertAccess(req.authUser!.userId, req.authUser!.role, getParam(req.params.shopId));
    const data = await inventoryService.adjust(
      getParam(req.params.shopId),
      getParam(req.params.productId),
      req.body,
      req.authUser!.userId
    );
    return sendSuccess(res, "Inventory adjusted successfully", data);
  }
};
