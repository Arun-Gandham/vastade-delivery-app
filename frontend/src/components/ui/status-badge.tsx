import { Badge } from "@/components/ui/badge";
import { formatOrderStatus } from "@/lib/utils/format";

const toneMap: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  ACCEPTED: "info",
  CAPTAIN_ASSIGNED: "info",
  READY_FOR_PICKUP: "warning",
  PICKED_UP: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
  REJECTED: "danger",
  COD_PENDING: "warning",
  COD_COLLECTED: "success",
  PAID: "success",
  SEARCHING_CAPTAIN: "warning",
  OFFERED_TO_CAPTAINS: "info",
  CAPTAIN_REACHED_PICKUP: "warning",
  CAPTAIN_REACHED_DROP: "warning",
  FAILED: "danger",
  REFUNDED: "neutral",
};

export const StatusBadge = ({ value }: { value: string }) => (
  <Badge tone={toneMap[value] || "neutral"}>{formatOrderStatus(value)}</Badge>
);
