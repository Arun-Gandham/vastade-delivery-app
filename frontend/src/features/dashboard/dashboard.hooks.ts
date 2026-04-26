"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { dashboardApi } from "@/features/dashboard/dashboard.api";

export const useAdminDashboardQuery = () =>
  useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: dashboardApi.adminSummary,
  });

export const useShopSummaryQuery = (shopId: string) =>
  useQuery({
    queryKey: queryKeys.shopSummary(shopId),
    queryFn: () => dashboardApi.shopSummary(shopId),
    enabled: Boolean(shopId),
  });

export const useReportQuery = (kind: "sales" | "product-sales" | "low-stock", shopId?: string) =>
  useQuery({
    queryKey: queryKeys.report(shopId ? `${shopId}-${kind}` : kind),
    queryFn: () => {
      if (shopId) {
        if (kind === "sales") return dashboardApi.shopSales(shopId);
        return dashboardApi.shopLowStock(shopId);
      }

      if (kind === "sales") return dashboardApi.adminSales();
      if (kind === "product-sales") return dashboardApi.adminProductSales();
      return dashboardApi.adminLowStock();
    },
  });
