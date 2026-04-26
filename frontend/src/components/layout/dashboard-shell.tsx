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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,157,85,0.08),_transparent_28%),linear-gradient(180deg,#f7fafc_0%,#f5f7fb_100%)]">
      <div className="app-shell flex gap-6 py-6">
      <DashboardSidebar title={title} items={navItems} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <DashboardTopbar title={title} />
        {children}
      </div>
      </div>
    </div>
  </ProtectedRoute>
);
