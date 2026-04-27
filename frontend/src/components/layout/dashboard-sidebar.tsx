"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Users
} from "lucide-react";
import { getDashboardNavItems } from "@/config/dashboard-nav.config";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/providers/auth-provider";

const iconMap: Record<string, typeof LayoutDashboard> = {
  Dashboard: LayoutDashboard,
  Shops: ShoppingBag,
  Categories: Boxes,
  Products: Package,
  Orders: ShoppingCart,
  Inventory: Package,
  Customers: Users,
  Captains: Truck,
  Coupons: Tag,
  "Sales Report": BarChart3,
  "Product Report": BarChart3,
  Notifications: Bell,
  Settings: Settings,
  Profile: Users,
  Reports: BarChart3,
  Admins: Users,
  "Audit Logs": Bell,
};

export const DashboardSidebar = ({
  title,
  items,
  collapsed,
  onToggle,
}: {
  title: string;
  items?: Array<{ href: string; label: string }>;
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const resolvedItems = getDashboardNavItems(user?.role, pathname);
  const sidebarItems = resolvedItems.length ? resolvedItems : items || [];

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#e8edf3] bg-white px-4 py-5 lg:flex",
        collapsed ? "w-[92px]" : "w-[280px]"
      )}
    >
      <div className="border-b border-[#eef2f6] pb-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f9d55] text-sm font-black text-white shadow-[0_14px_30px_rgba(31,157,85,0.28)]">
              Z
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Workspace</p>
                <h2 className="truncate text-lg font-bold tracking-[-0.03em] text-[#111827]">{title}</h2>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8edf3] text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#111827]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed ? (
          <div className="mt-4 rounded-2xl bg-[#f7faf8] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">{user?.role || "Role"}</p>
            <p className="mt-1 text-sm text-[#6b7280]">Compact enterprise shell with cleaner navigation and denser workspace content.</p>
          </div>
        ) : null}
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = iconMap[item.label] || LayoutDashboard;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-2xl text-sm font-medium transition",
                collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
                isActive
                  ? "bg-[#111827] text-white shadow-[0_14px_30px_rgba(17,24,39,0.14)]"
                  : "text-[#667085] hover:bg-[#f7f9fc] hover:text-[#111827]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
