import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getOptionalParam, getParam } from "../../core/utils/request";
import { productService } from "./product.service";

export const productController = {
  async list(req: Request, res: Response) {
    const { items, meta } = await productService.list(req.query);
    return sendSuccess(res, "Products fetched successfully", items, meta);
  },
  async details(req: Request, res: Response) {
    const shopId = getOptionalParam(req.query.shopId);
    const data = shopId
      ? await productService.shopDetails(getParam(req.params.productId), shopId)
      : await productService.details(getParam(req.params.productId));
    return sendSuccess(res, "Product fetched successfully", data);
  },
  async create(req: Request, res: Response) {
    const data = await productService.create(req.body);
    return sendSuccess(res, "Product created successfully", data);
  },
  async update(req: Request, res: Response) {
    const data = await productService.update(getParam(req.params.productId), req.body);
    return sendSuccess(res, "Product updated successfully", data);
  },
  async remove(req: Request, res: Response) {
    await productService.remove(getParam(req.params.productId));
    return sendSuccess(res, "Product deleted successfully");
  }
};
