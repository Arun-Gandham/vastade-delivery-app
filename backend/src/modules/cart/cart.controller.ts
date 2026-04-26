import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getOptionalParam, getParam } from "../../core/utils/request";
import { cartService } from "./cart.service";

export const cartController = {
  async get(req: Request, res: Response) {
    const data = await cartService.get(req.authUser!.userId, getParam(getOptionalParam(req.query.shopId)));
    return sendSuccess(res, "Cart fetched successfully", data);
  },
  async addItem(req: Request, res: Response) {
    const data = await cartService.addItem(req.authUser!.userId, req.body);
    return sendSuccess(res, "Item added to cart", data);
  },
  async updateItem(req: Request, res: Response) {
    const data = await cartService.updateItem(
      req.authUser!.userId,
      getParam(req.params.cartItemId),
      req.body.quantity
    );
    return sendSuccess(res, "Cart item updated successfully", data);
  },
  async deleteItem(req: Request, res: Response) {
    await cartService.deleteItem(req.authUser!.userId, getParam(req.params.cartItemId));
    return sendSuccess(res, "Cart item removed successfully");
  },
  async clear(req: Request, res: Response) {
    await cartService.clear(req.authUser!.userId, getParam(getOptionalParam(req.query.shopId)));
    return sendSuccess(res, "Cart cleared successfully");
  }
};
