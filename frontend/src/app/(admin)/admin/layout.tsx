"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const resolveAdminTitle = (pathname: string) => {
  if (pathname === "/admin/dashboard") return "Admin Panel";
  if (pathname === "/admin/shops") return "Shops";
  if (pathname === "/admin/shops/new") return "Create Shop";
  if (/^\/admin\/shops\/[^/]+$/.test(pathname)) return "Shop Detail";
  if (/^\/admin\/shops\/[^/]+\/edit$/.test(pathname)) return "Edit Shop";
  if (pathname === "/admin/categories") return "Categories";
  if (pathname === "/admin/categories/new") return "Create Category";
  if (/^\/admin\/categories\/[^/]+\/edit$/.test(pathname)) return "Edit Category";
  if (/^\/admin\/categories\/[^/]+$/.test(pathname)) return "Category Detail";
  if (pathname === "/admin/products") return "Products";
  if (pathname === "/admin/products/new") return "Create Product";
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (/^\/admin\/products\/[^/]+$/.test(pathname)) return "Product Detail";
  if (pathname === "/admin/orders") return "Admin Orders";
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return "Admin Order Detail";
  if (pathname === "/admin/inventory") return "Inventory";
  if (pathname === "/admin/customers") return "Customers";
  if (pathname === "/admin/captains") return "Captains";
  if (pathname === "/admin/coupons") return "Coupons";
  if (pathname === "/admin/coupons/new") return "Create Coupon";
  if (pathname === "/admin/reports/sales") return "Sales Report";
  if (pathname === "/admin/reports/product-sales") return "Product Sales Report";
  if (pathname === "/admin/notifications") return "Notifications";
  if (pathname === "/admin/settings") return "Settings";
  return "Admin";
};

export default function AdminSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return <DashboardShell title={resolveAdminTitle(pathname)}>{children}</DashboardShell>;
}
