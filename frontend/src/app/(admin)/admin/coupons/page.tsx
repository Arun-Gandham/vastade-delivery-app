"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminCouponsPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-[-0.03em] text-[#111827]">Coupons</h2>
            <p className="text-sm leading-7 text-[#667085]">
              The backend currently supports coupon create, update, delete, and validate, but does not expose a coupon list endpoint.
              This management screen stays list-only and routes creation into a dedicated page.
            </p>
          </div>
          <Link href={`${basePath}/coupons/new`}>
            <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
              <Plus className="h-4 w-4" />
              New coupon
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
