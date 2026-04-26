"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardNavItems } from "@/config/dashboard-nav.config";
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
    <aside className="hidden w-72 shrink-0 flex-col rounded-[30px] border border-[#e8edf3] bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,0.06)] lg:flex">
      <div className="border-b border-[#eef2f6] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f9d55] text-base font-black text-white shadow-[0_14px_30px_rgba(31,157,85,0.28)]">
            Z
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Workspace</p>
            <h2 className="truncate text-lg font-bold tracking-[-0.03em] text-[#111827]">{title}</h2>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#f7faf8] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">{user?.role || "Role"}</p>
          <p className="mt-1 text-sm text-[#6b7280]">Enterprise workspace with shared navigation and consistent role framing.</p>
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1.5">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#111827] text-white shadow-[0_14px_30px_rgba(17,24,39,0.14)]"
                  : "text-[#667085] hover:bg-[#f7f9fc] hover:text-[#111827]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
