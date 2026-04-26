import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { DashboardSummary, ReportRow } from "@/types/domain";

export const dashboardApi = {
  adminSummary: () => unwrapResponse<DashboardSummary>(api.get("/admin/dashboard/summary")),
  adminSales: () => unwrapResponse<ReportRow[]>(api.get("/admin/reports/sales")),
  adminProductSales: () => unwrapResponse<ReportRow[]>(api.get("/admin/reports/product-sales")),
  adminLowStock: () => unwrapResponse<ReportRow[]>(api.get("/admin/reports/low-stock")),
  shopSummary: (shopId: string) =>
    unwrapResponse<DashboardSummary>(api.get(`/shop-owner/shops/${shopId}/dashboard/summary`)),
  shopSales: (shopId: string) =>
    unwrapResponse<ReportRow[]>(api.get(`/shop-owner/shops/${shopId}/reports/sales`)),
  shopLowStock: (shopId: string) =>
    unwrapResponse<ReportRow[]>(api.get(`/shop-owner/shops/${shopId}/reports/low-stock`)),
};
