import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import type { CaptainOrder } from "@/types/domain";

export const CaptainTaskCard = ({
  task,
  basePath = "/captain/orders",
}: {
  task: CaptainOrder;
  basePath?: string;
}) => (
  <Link href={`${basePath}/${task.orderId}`}>
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{task.orderNumber}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{formatDateTime(task.createdAt)}</p>
        </div>
        <StatusBadge value={task.status} />
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <p className="font-medium text-[#111827]">Pickup</p>
          <p className="text-[var(--color-text-muted)]">{task.pickupAddress}</p>
        </div>
        <div>
          <p className="font-medium text-[#111827]">Drop</p>
          <p className="text-[var(--color-text-muted)]">{task.dropAddress}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">Order amount</span>
        <PriceText value={task.amount} className="font-semibold" />
      </div>
    </Card>
  </Link>
);
