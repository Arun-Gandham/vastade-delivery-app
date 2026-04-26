import { Badge } from "@/components/ui/badge";
import { formatOrderStatus } from "@/lib/utils/format";

const toneMap: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  PLACED: "info",
  CONFIRMED: "info",
  PACKING: "warning",
  READY_FOR_PICKUP: "warning",
  ASSIGNED_TO_CAPTAIN: "info",
  OUT_FOR_DELIVERY: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  FAILED: "danger",
  REFUNDED: "neutral",
  COD_PENDING: "warning",
  COD_COLLECTED: "success",
  PENDING: "warning",
  PAID: "success",
};

export const StatusBadge = ({ value }: { value: string }) => (
  <Badge tone={toneMap[value] || "neutral"}>{formatOrderStatus(value)}</Badge>
);
