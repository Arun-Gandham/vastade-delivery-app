"use client";

import { Bell, LogOut, PanelLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export const DashboardTopbar = ({
  title,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-4 border-b border-[#e8edf3] bg-white/95 px-4 py-4 backdrop-blur sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#e8edf3] text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#111827] lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3fbf6] text-[#1f9d55]">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Dashboard</p>
          <h2 className="truncate text-lg font-bold tracking-[-0.03em] text-[#111827]">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-xl bg-[#f7f9fc] px-3 py-2 text-sm text-[#667085] md:flex">
          <Bell className="h-4 w-4 text-[#1f9d55]" />
          <span>Role-based workspace</span>
        </div>
        <div className="min-w-0 rounded-xl border border-[#edf1f5] px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-[#111827]">{user?.name}</p>
          <p className="truncate text-xs uppercase tracking-[0.14em] text-[#8a94a6]">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-[#e5e7eb] px-3 text-xs font-semibold text-[#111827] hover:bg-[#f7f9fc]"
          onClick={() => void logout()}
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
