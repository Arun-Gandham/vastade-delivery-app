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
    <nav className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-5 rounded-[22px] border border-[#e7ecf2] bg-white/96 p-1 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[18px] px-2 py-3 text-center text-xs font-semibold transition",
              pathname === item.href ? "bg-[#111827] text-white" : "text-[#667085]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
