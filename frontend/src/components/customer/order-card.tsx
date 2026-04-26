import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import type { Order } from "@/types/domain";

export const OrderCard = ({ order, basePath = "/customer/orders" }: { order: Order; basePath?: string }) => (
  <Link href={`${basePath}/${order.id}`}>
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{order.orderNumber}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{formatDateTime(order.placedAt)}</p>
        </div>
        <StatusBadge value={order.status} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>{order.items.length} items</span>
        <PriceText value={order.totalAmount} className="font-semibold" />
      </div>
    </Card>
  </Link>
);
