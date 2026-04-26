import { UserRole } from "@prisma/client";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../core/middleware/auth-middleware";
import { dashboardController } from "./dashboard.controller";

export const adminDashboardRouter = Router();
export const shopDashboardRouter = Router();

adminDashboardRouter.use(authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
adminDashboardRouter.get("/dashboard/summary", dashboardController.adminSummary);
adminDashboardRouter.get("/reports/sales", dashboardController.adminSalesReport);
adminDashboardRouter.get("/reports/product-sales", dashboardController.adminProductSalesReport);
adminDashboardRouter.get("/reports/low-stock", dashboardController.adminLowStockReport);

shopDashboardRouter.use(
  authMiddleware,
  roleMiddleware(UserRole.SHOP_OWNER, UserRole.STORE_MANAGER)
);
shopDashboardRouter.get("/shops/:shopId/dashboard/summary", dashboardController.shopSummary);
shopDashboardRouter.get("/shops/:shopId/reports/sales", dashboardController.shopSalesReport);
shopDashboardRouter.get("/shops/:shopId/reports/low-stock", dashboardController.shopLowStockReport);
