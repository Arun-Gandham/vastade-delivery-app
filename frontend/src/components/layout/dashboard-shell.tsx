import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ProtectedRoute } from "@/components/layout/protected-route";

export const DashboardShell = ({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems?: Array<{ href: string; label: string }>;
  children: ReactNode;
}) => (
  <ProtectedRoute>
    <div className="app-shell flex gap-6">
      <DashboardSidebar title={title} items={navItems} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <DashboardTopbar title={title} />
        {children}
      </div>
    </div>
  </ProtectedRoute>
);
