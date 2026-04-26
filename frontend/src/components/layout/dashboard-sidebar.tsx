"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardNavItems } from "@/config/dashboard-nav.config";
import { themeConfig } from "@/config/theme.config";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/providers/auth-provider";

export const DashboardSidebar = ({
  title,
  items,
}: {
  title: string;
  items?: Array<{ href: string; label: string }>;
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const resolvedItems = getDashboardNavItems(user?.role, pathname);
  const sidebarItems = resolvedItems.length ? resolvedItems : items || [];

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)] lg:flex">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--color-secondary)] text-sm font-bold text-white shadow-[var(--shadow-soft)]">
          {themeConfig.brand.shortName}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Workspace</p>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
      </div>
      {sidebarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-text)]",
            pathname === item.href || pathname.startsWith(`${item.href}/`)
              ? "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)] hover:text-white"
              : ""
          )}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
};
