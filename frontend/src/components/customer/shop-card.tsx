import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Shop } from "@/types/domain";

export const ShopCard = ({ shop }: { shop: Shop }) => (
  <Link href={`/customer/shops/${shop.id}`}>
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{shop.name}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{shop.address}</p>
        </div>
        <StatusBadge value={shop.isOpen ? "DELIVERED" : "CANCELLED"} />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
        <span>{shop.village}</span>
        <span>{shop.pincode}</span>
        <span>
          {shop.openingTime || "07:00"} - {shop.closingTime || "22:00"}
        </span>
      </div>
    </Card>
  </Link>
);
