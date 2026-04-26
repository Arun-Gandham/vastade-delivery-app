"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/captain", label: "Home" },
  { href: "/captain/orders", label: "Orders" },
  { href: "/captain/earnings", label: "Earnings" },
  { href: "/captain/notifications", label: "Alerts" },
  { href: "/captain/profile", label: "Profile" },
];

export const CaptainBottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-white md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-2 py-3 text-center text-xs font-medium text-[var(--color-text-muted)]",
              pathname === item.href ? "text-[var(--color-primary)]" : ""
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
