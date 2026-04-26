import { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import { getParam } from "../../core/utils/request";
import { dashboardService } from "./dashboard.service";
import { shopService } from "../shops/shop.service";

export const dashboardController = {
  async adminSummary(_req: Request, res: Response) {
    const data = await dashboardService.adminSummary();
    return sendSuccess(res, "Dashboard summary fetched successfully", data);
  },
  async shopSummary(req: Request, res: Response) {
    const shopId = getParam(req.params.shopId);
    await shopService.assertShopAccess(req.authUser!.userId, req.authUser!.role, shopId);
    const data = await dashboardService.shopSummary(shopId);
    return sendSuccess(res, "Shop dashboard summary fetched successfully", data);
  },
  async adminSalesReport(_req: Request, res: Response) {
    const data = await dashboardService.adminSalesReport();
    return sendSuccess(res, "Admin sales report fetched successfully", data);
  },
  async adminProductSalesReport(_req: Request, res: Response) {
    const data = await dashboardService.adminProductSalesReport();
    return sendSuccess(res, "Admin product sales report fetched successfully", data);
  },
  async adminLowStockReport(_req: Request, res: Response) {
    const data = await dashboardService.adminLowStockReport();
    return sendSuccess(res, "Admin low stock report fetched successfully", data);
  },
  async shopSalesReport(req: Request, res: Response) {
    const shopId = getParam(req.params.shopId);
    await shopService.assertShopAccess(req.authUser!.userId, req.authUser!.role, shopId);
    const data = await dashboardService.shopSalesReport(shopId);
    return sendSuccess(res, "Shop sales report fetched successfully", data);
  },
  async shopLowStockReport(req: Request, res: Response) {
    const shopId = getParam(req.params.shopId);
    await shopService.assertShopAccess(req.authUser!.userId, req.authUser!.role, shopId);
    const data = await dashboardService.shopLowStockReport(shopId);
    return sendSuccess(res, "Shop low stock report fetched successfully", data);
  }
};
