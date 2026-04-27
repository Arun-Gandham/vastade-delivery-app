"use client";

import { usePathname, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ShopFormCard } from "@/components/dashboard/shop-form-card";

export default function AdminShopCreatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";

  return (
    <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
      <ShopFormCard mode="create" onSuccess={(savedShopId) => router.push(savedShopId ? `${basePath}/shops/${savedShopId}` : `${basePath}/shops`)} />

      <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Create flow</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">Dedicated page for cleaner management</h2>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[#667085]">
          <p>The shops list stays focused on scanning location, schedule, and availability.</p>
          <p>Create and edit actions open separately so management forms do not crowd the listing surface.</p>
        </div>
      </Card>
    </div>
  );
}
