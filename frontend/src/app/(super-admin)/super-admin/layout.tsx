"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const resolveSuperAdminTitle = (pathname: string) => {
  if (pathname === "/super-admin/dashboard") return "Super Admin Dashboard";
  if (pathname === "/super-admin/admins") return "Admins";
  if (pathname === "/super-admin/audit-logs") return "Audit Logs";
  if (pathname === "/super-admin/shops") return "Shops";
  if (pathname === "/super-admin/shops/new") return "Create Shop";
  if (/^\/super-admin\/shops\/[^/]+$/.test(pathname)) return "Shop Detail";
  if (/^\/super-admin\/shops\/[^/]+\/edit$/.test(pathname)) return "Edit Shop";
  if (pathname === "/super-admin/categories") return "Categories";
  if (pathname === "/super-admin/categories/new") return "Create Category";
  if (/^\/super-admin\/categories\/[^/]+$/.test(pathname)) return "Category Detail";
  if (/^\/super-admin\/categories\/[^/]+\/edit$/.test(pathname)) return "Edit Category";
  if (pathname === "/super-admin/products") return "Products";
  if (pathname === "/super-admin/products/new") return "Create Product";
  if (/^\/super-admin\/products\/[^/]+$/.test(pathname)) return "Product Detail";
  if (/^\/super-admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (pathname === "/super-admin/orders") return "Admin Orders";
  if (/^\/super-admin\/orders\/[^/]+$/.test(pathname)) return "Admin Order Detail";
  if (pathname === "/super-admin/inventory") return "Inventory";
  if (pathname === "/super-admin/customers") return "Customers";
  if (pathname === "/super-admin/captains") return "Captains";
  if (pathname === "/super-admin/coupons") return "Coupons";
  if (pathname === "/super-admin/coupons/new") return "Create Coupon";
  if (pathname === "/super-admin/reports/sales") return "Sales Report";
  if (pathname === "/super-admin/reports/product-sales") return "Product Sales Report";
  if (pathname === "/super-admin/notifications") return "Notifications";
  if (pathname === "/super-admin/settings") return "Settings";
  return "Super Admin";
};

export default function SuperAdminSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <DashboardShell title={resolveSuperAdminTitle(pathname)}>{children}</DashboardShell>;
}
