import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  adminSummary: dashboardRepository.adminSummary,
  shopSummary: dashboardRepository.shopSummary,
  adminSalesReport: dashboardRepository.adminSalesReport,
  adminProductSalesReport: dashboardRepository.adminProductSalesReport,
  adminLowStockReport: dashboardRepository.adminLowStockReport,
  shopSalesReport: dashboardRepository.shopSalesReport,
  shopLowStockReport: dashboardRepository.shopLowStockReport
};
