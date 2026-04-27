"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const resolveSuperAdminTitle = (pathname: string) => {
  if (pathname === "/super-admin/dashboard") return "Super Admin Dashboard";
  if (pathname === "/super-admin/admins") return "Admins";
  if (pathname === "/super-admin/audit-logs") return "Audit Logs";
  if (pathname === "/super-admin/settings") return "Settings";
  return "Super Admin";
};

export default function SuperAdminSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <DashboardShell title={resolveSuperAdminTitle(pathname)}>{children}</DashboardShell>;
}
