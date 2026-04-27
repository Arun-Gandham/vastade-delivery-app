"use client";

import { useState, type ReactNode } from "react";
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
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,157,85,0.08),_transparent_28%),linear-gradient(180deg,#f7fafc_0%,#f5f7fb_100%)]">
        <div className="flex min-h-screen">
          <DashboardSidebar
            collapsed={collapsed}
            items={navItems}
            onToggle={() => setCollapsed((current) => !current)}
            title={title}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardTopbar
              collapsed={collapsed}
              onToggle={() => setCollapsed((current) => !current)}
              title={title}
            />
            <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
