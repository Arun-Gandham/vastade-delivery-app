"use client";

import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export const DashboardTopbar = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-[#e8edf3] bg-white px-5 py-4 shadow-[0_18px_44px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3fbf6] text-[#1f9d55]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Dashboard</p>
          <h2 className="truncate text-xl font-bold tracking-[-0.03em] text-[#111827]">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-2xl bg-[#f7f9fc] px-4 py-3 text-sm text-[#667085] md:flex">
          <Bell className="h-4 w-4 text-[#1f9d55]" />
          <span>Role-based workspace</span>
        </div>
        <div className="min-w-0 rounded-2xl border border-[#edf1f5] px-4 py-3">
          <p className="truncate text-sm font-semibold text-[#111827]">{user?.name}</p>
          <p className="truncate text-xs uppercase tracking-[0.14em] text-[#8a94a6]">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-2xl border-[#e5e7eb] px-4 text-sm font-semibold text-[#111827] hover:bg-[#f7f9fc]"
          onClick={() => void logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
