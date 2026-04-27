import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatOrderStatus } from "@/lib/utils/format";
import type { DeliveryTask } from "@/types/domain";

export const CaptainTaskCard = ({
  task,
  basePath = "/captain/orders",
}: {
  task: DeliveryTask;
  basePath?: string;
}) => (
  <Link href={`${basePath}/${task.id}`}>
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{formatOrderStatus(task.taskType)}</h3>
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
        <span className="text-[var(--color-text-muted)]">Estimated earning</span>
        <PriceText value={task.deliveryFee} className="font-semibold" />
      </div>
    </Card>
  </Link>
);
