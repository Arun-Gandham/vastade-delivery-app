"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { themeConfig } from "@/config/theme.config";

export const DashboardTopbar = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--color-primary)] text-xs font-bold text-white lg:hidden">
          {themeConfig.brand.shortName}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Signed in</p>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{user?.role}</p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Logout
        </Button>
      </div>
    </div>
  );
};
