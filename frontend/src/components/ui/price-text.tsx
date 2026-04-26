import { formatCurrency } from "@/lib/utils/format";

export const PriceText = ({ value, className = "" }: { value: number | string; className?: string }) => (
  <span className={className}>{formatCurrency(value)}</span>
);
